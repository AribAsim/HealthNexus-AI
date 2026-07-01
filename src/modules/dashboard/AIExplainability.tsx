import { useState } from 'react';

interface Explanation {
  action: string;
  prediction: string;
  confidence: number;
  explanation: string;
  recommendedAction: string;
  evidencePoints: string[];
}

const EXPLANATIONS: Explanation[] = [
  {
    action: 'Transfer Amoxicillin → PHC Alpha',
    prediction: 'Stock-out in 6 days',
    confidence: 94,
    explanation:
      'PHC Alpha\'s current Amoxicillin stock of 48 units, combined with a 7-day average daily usage of 8 units and a 2-day resupply delay, results in a projected stock-out within 6 days. CHC Beta holds 3× its buffer, making it the nearest viable donor.',
    recommendedAction: 'Transfer 50 units of Amoxicillin from CHC Beta to PHC Alpha via available vehicle V-102 (8:00 AM departure).',
    evidencePoints: [
      'PHC Alpha Amoxicillin stock: 48 units',
      'Average daily usage (7-day): 8 units/day',
      'Resupply lead time: 2 days',
      'CHC Beta surplus: 152 units (154% of buffer)',
      'Vehicle V-102 available, 34 km route',
    ],
  },
  {
    action: 'Dengue Alert — Tijara Block',
    prediction: 'Outbreak probability: 73%',
    confidence: 73,
    explanation:
      'Symptom cluster analysis across 3 PHCs in Tijara Block detected a 340% surge in fever + joint pain cases over 5 days. Cross-referenced with monsoon vector data and historical outbreak patterns from 2023, the model identifies an early-stage dengue transmission event.',
    recommendedAction: 'Deploy vector control team to Tijara. Increase ORS and platelet-boosting IV supply. Alert CHC Tijara nursing staff for dengue triage protocol.',
    evidencePoints: [
      'Fever + joint pain cases: ↑ 340% over 5 days in Tijara',
      '3 PHCs reporting similar cluster',
      'Monsoon season — peak Aedes density period',
      '2023 outbreak: same cluster pattern 8 days prior',
      'Existing ORS stock at Tijara: critical (12 days remaining)',
    ],
  },
  {
    action: 'Staff Shortage — Mundawar Block',
    prediction: '3 PHCs under-staffed by next week',
    confidence: 88,
    explanation:
      'Attendance logs show 4 doctors on approved leave simultaneously next week across Mundawar block PHCs. Average daily OPD load of 85 patients per doctor would result in 255+ unserved patients per day if no redistribution occurs.',
    recommendedAction: 'Request 2 mobile medical units from District HQ. Activate teleconsultation fallback for non-emergency OPD at PHC Mundawar-3.',
    evidencePoints: [
      '4 doctors on leave: 12–19 July',
      'Mundawar block PHCs: PHC-M1, PHC-M2, PHC-M3',
      'Average OPD load: 85 patients/doctor/day',
      'Teleconsultation infrastructure available at PHC-M3',
      'District mobile unit fleet: 2 available',
    ],
  },
];

interface Props {
  language: string;
  transferApproved: boolean;
}

export default function AIExplainability({ language, transferApproved }: Props) {
  const [selected, setSelected] = useState(0);
  const isHi = language === 'hi';
  const exp = EXPLANATIONS[selected];

  const confidenceColor =
    exp.confidence >= 85 ? 'text-red-600' :
    exp.confidence >= 65 ? 'text-amber-600' :
    'text-green-600';

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-outline-variant pb-4">
        <div className="p-2.5 bg-secondary-container text-on-secondary-container rounded-xl">
          <span className="material-symbols-outlined text-2xl">lightbulb</span>
        </div>
        <div>
          <h2 className="text-base font-extrabold text-primary">
            {isHi ? 'एआई निर्णय व्याख्या पैनल' : 'AI Decision Explainability Panel'}
          </h2>
          <p className="text-[11px] text-on-surface-variant">
            {isHi ? 'हर एआई सिफारिश के पीछे का कारण जानें' : '"Why this recommendation?" — evidence-backed AI reasoning'}
          </p>
        </div>
      </div>

      {/* Action Selector */}
      <div className="flex flex-wrap gap-2">
        {EXPLANATIONS.map((e, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`text-[11px] font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
              selected === i
                ? 'bg-primary text-white border-primary shadow'
                : 'bg-surface border-outline-variant text-on-surface-variant hover:border-primary'
            }`}
          >
            {e.action}
          </button>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left: Prediction + Explanation */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">
              {isHi ? 'पूर्वानुमान' : 'Prediction'}
            </span>
            <span className={`text-xs font-extrabold ${confidenceColor}`}>
              {exp.confidence}% {isHi ? 'विश्वास' : 'confidence'}
            </span>
          </div>

          <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                exp.confidence >= 85 ? 'bg-red-500' :
                exp.confidence >= 65 ? 'bg-amber-500' : 'bg-green-500'
              }`}
              style={{ width: `${exp.confidence}%` }}
            />
          </div>

          <p className="text-sm font-bold text-primary">{exp.prediction}</p>

          <div className="bg-surface-container-low border border-outline-variant rounded-xl p-4">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-2">
              {isHi ? 'एआई विश्लेषण' : 'AI Explanation'}
            </span>
            <p className="text-xs text-on-surface leading-relaxed">{exp.explanation}</p>
          </div>
        </div>

        {/* Right: Evidence + Recommended Action */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
            {isHi ? 'साक्ष्य बिंदु' : 'Evidence Points'}
          </span>
          <ul className="space-y-1.5">
            {exp.evidencePoints.map((pt, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-on-surface">
                <span className="material-symbols-outlined text-sm text-primary mt-0.5 shrink-0">
                  data_check
                </span>
                {pt}
              </li>
            ))}
          </ul>

          <div className={`mt-3 p-4 rounded-xl border ${transferApproved ? 'bg-green-50 border-green-300' : 'bg-primary-container/20 border-primary-container'}`}>
            <span className="text-[10px] font-bold uppercase tracking-wider block mb-1 text-primary">
              {isHi ? 'अनुशंसित कार्रवाई' : 'Recommended Action'}
            </span>
            <p className="text-xs text-on-surface leading-relaxed">{exp.recommendedAction}</p>
            {transferApproved && selected === 0 && (
              <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold text-green-700">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                {isHi ? 'निष्पादित' : 'Executed'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
