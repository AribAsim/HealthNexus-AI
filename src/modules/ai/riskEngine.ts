/**
 * AI Risk Engine — HealthNexus AI
 * 
 * Calculates a composite risk score (0–100) per facility using:
 *  - Inventory depletion rate and critical stock flags
 *  - Bed occupancy pressure
 *  - Staff attendance deficit
 *  - Patient footfall vs capacity
 * 
 * Calls Gemini to generate human-readable explanation + recommended action.
 * 
 * Every output conforms to the AIOutput interface (Rule 3 in AGENTS.md).
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Facility } from '../../store';

export interface RiskOutput {
  facilityId: string;
  facilityName: string;
  score: number;          // 0–100
  level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  confidence: number;     // 0–100
  reasons: string[];      // top 3 contributing factors
  explanation: string;    // plain-language explanation for display
  recommendedAction: string; // concrete next step for admin
  updatedAt: string;
}

// ── Local deterministic scorer (fast, no API needed) ──────────────────────

function scoreInventory(facility: Facility): number {
  const criticalItems = facility.inventory.filter(i => i.status === 'CRITICAL').length;
  const lowItems = facility.inventory.filter(i => i.status === 'LOW').length;
  return Math.min(40, criticalItems * 15 + lowItems * 7);
}

function scoreBeds(facility: Facility): number {
  const rate = facility.beds.total > 0 ? facility.beds.occupied / facility.beds.total : 0;
  if (rate >= 1.0) return 25;
  if (rate >= 0.9) return 20;
  if (rate >= 0.75) return 12;
  return Math.floor(rate * 10);
}

function scoreStaff(facility: Facility): number {
  const rate = facility.staff.attendanceRate;
  if (rate < 60) return 20;
  if (rate < 75) return 14;
  if (rate < 90) return 7;
  return 0;
}

function scoreFootfall(facility: Facility): number {
  const waitMinutes = facility.footfall.estimatedWaitMinutes;
  const urgentPatients = facility.footfall.triageUrgent;
  const waitScore = Math.min(10, Math.floor(waitMinutes / 6));
  const urgentScore = Math.min(5, urgentPatients);
  return waitScore + urgentScore;
}

export function computeLocalRisk(facility: Facility): Omit<RiskOutput, 'explanation' | 'recommendedAction'> {
  const invScore = scoreInventory(facility);
  const bedScore = scoreBeds(facility);
  const staffScore = scoreStaff(facility);
  const footfallScore = scoreFootfall(facility);
  const total = Math.min(100, invScore + bedScore + staffScore + footfallScore);

  const level: RiskOutput['level'] =
    total >= 70 ? 'CRITICAL' :
    total >= 45 ? 'HIGH' :
    total >= 20 ? 'MODERATE' : 'LOW';

  const reasons: string[] = [];
  if (invScore >= 15) reasons.push(`${facility.inventory.filter(i => i.status === 'CRITICAL').length} critical stock-outs detected`);
  if (invScore >= 7 && invScore < 15) reasons.push(`${facility.inventory.filter(i => i.status === 'LOW').length} items at low inventory`);
  if (bedScore >= 20) reasons.push('Beds at 100% occupancy — no capacity buffer');
  else if (bedScore >= 12) reasons.push(`Bed occupancy above 90% (${facility.beds.occupied}/${facility.beds.total})`);
  if (staffScore >= 14) reasons.push(`Staff attendance critically low at ${facility.staff.attendanceRate}%`);
  else if (staffScore >= 7) reasons.push(`Staff attendance below threshold at ${facility.staff.attendanceRate}%`);
  if (footfallScore >= 10) reasons.push(`High patient wait time (${facility.footfall.estimatedWaitMinutes} min) with ${facility.footfall.triageUrgent} urgent cases`);

  if (reasons.length === 0) reasons.push('All indicators within acceptable range');

  return {
    facilityId: facility.id,
    facilityName: facility.name,
    score: total,
    level,
    confidence: 82, // deterministic model baseline confidence
    reasons,
    updatedAt: new Date().toISOString(),
  };
}

// ── Gemini-enhanced scorer (async, adds explanation + action) ─────────────

let geminiClient: GoogleGenerativeAI | null = null;

function getGeminiClient(): GoogleGenerativeAI {
  if (!geminiClient) {
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    if (!key) throw new Error('VITE_GEMINI_API_KEY not set');
    geminiClient = new GoogleGenerativeAI(key);
  }
  return geminiClient;
}

export async function computeRiskWithAI(facility: Facility): Promise<RiskOutput> {
  const local = computeLocalRisk(facility);

  // Prepare a compact prompt — keep tokens low for fast responses
  const prompt = `You are a district health officer AI assistant for a PHC/CHC in Alwar, Rajasthan, India.

Facility: ${facility.name} (${facility.type})
Risk Score: ${local.score}/100 (${local.level})
Key Issues: ${local.reasons.join('; ')}

Data snapshot:
- Beds: ${facility.beds.occupied}/${facility.beds.total} occupied
- Staff attendance: ${facility.staff.attendanceRate}%
- Wait time: ${facility.footfall.estimatedWaitMinutes} min, ${facility.footfall.triageUrgent} urgent patients
- Critical inventory items: ${facility.inventory.filter(i => i.status === 'CRITICAL').map(i => i.name).join(', ') || 'None'}
- Low inventory items: ${facility.inventory.filter(i => i.status === 'LOW').map(i => i.name).join(', ') || 'None'}

Respond ONLY with valid JSON (no markdown, no extra text):
{
  "confidence": <integer 60-95>,
  "explanation": "<2 sentence plain-language explanation a district admin can read>",
  "recommendedAction": "<single most important concrete action to take today>"
}`;

  try {
    const ai = getGeminiClient();
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    
    // Strip markdown code fences if present
    const jsonText = text.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();
    const parsed = JSON.parse(jsonText);
    
    return {
      ...local,
      confidence: parsed.confidence ?? local.confidence,
      explanation: parsed.explanation ?? local.reasons.join('. '),
      recommendedAction: parsed.recommendedAction ?? 'Contact district health officer immediately.',
    };
  } catch {
    // Fallback: generate explanation locally if Gemini fails
    return {
      ...local,
      explanation: `${facility.name} is flagged as ${local.level} risk (score: ${local.score}/100). ${local.reasons[0] ?? 'Multiple indicators are concerning'}.`,
      recommendedAction: local.level === 'CRITICAL'
        ? 'Immediate stock replenishment and staff deployment required. Contact district health office.'
        : local.level === 'HIGH'
        ? 'Schedule urgent review within 24 hours and arrange emergency stock transfer.'
        : 'Monitor closely and plan resupply within the next 7 days.',
    };
  }
}

// ── Batch risk scoring for all facilities ────────────────────────────────

export async function computeDistrictRisk(
  facilities: Facility[],
  useAI = true,
  onProgress?: (completed: number, total: number) => void
): Promise<RiskOutput[]> {
  const results: RiskOutput[] = [];
  
  for (let i = 0; i < facilities.length; i++) {
    const facility = facilities[i];
    try {
      const risk = useAI
        ? await computeRiskWithAI(facility)
        : { ...computeLocalRisk(facility), explanation: '', recommendedAction: '' };
      results.push(risk);
    } catch {
      results.push({ ...computeLocalRisk(facility), explanation: 'Analysis unavailable.', recommendedAction: 'Manual review required.' });
    }
    onProgress?.(i + 1, facilities.length);
    
    // Small delay to avoid Gemini rate-limiting
    if (useAI && i < facilities.length - 1) {
      await new Promise(r => setTimeout(r, 200));
    }
  }
  
  return results.sort((a, b) => b.score - a.score); // highest risk first
}

// ── Risk level colors + labels (UI helpers) ───────────────────────────────

export const riskColors = {
  CRITICAL: { bg: 'bg-error-container', text: 'text-on-error-container', badge: 'bg-error text-white', dot: '#BA1A1A', map: '#DC2626' },
  HIGH:     { bg: 'bg-orange-100', text: 'text-orange-900', badge: 'bg-orange-500 text-white', dot: '#EA580C', map: '#F97316' },
  MODERATE: { bg: 'bg-yellow-50', text: 'text-yellow-900', badge: 'bg-amber-400 text-amber-900', dot: '#D97706', map: '#F59E0B' },
  LOW:      { bg: 'bg-green-50', text: 'text-green-900', badge: 'bg-green-500 text-white', dot: '#15803D', map: '#22C55E' },
} as const;

export const riskLabels = {
  CRITICAL: { en: 'Critical Risk', hi: 'गंभीर जोखिम' },
  HIGH:     { en: 'High Risk', hi: 'उच्च जोखिम' },
  MODERATE: { en: 'Moderate Risk', hi: 'मध्यम जोखिम' },
  LOW:      { en: 'Low Risk', hi: 'कम जोखिम' },
} as const;
