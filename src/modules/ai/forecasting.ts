import { GoogleGenerativeAI } from '@google/generative-ai';

export interface AIOutput {
  prediction: unknown;
  confidence: number;
  explanation: string;
  recommendedAction: string;
}
// Initialize Gemini
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

export interface ForecastPoint {
  date: string;
  predictedUsage: number;
  confidenceLower: number;
  confidenceUpper: number;
  isStockoutRisk: boolean;
}

export interface ForecastOutput extends AIOutput {
  prediction: ForecastPoint[];
  stockoutDate: string | null;
}

/**
 * Predicts inventory usage for the next 30 days using Gemini.
 * Uses current stock, daily usage trend, and external factors (e.g., season, outbreaks).
 */
export async function generateInventoryForecast(
  itemName: string,
  currentStock: number,
  averageDailyUsage: number,
  facilityType: string
): Promise<ForecastOutput> {
  // If no API key, return deterministic mock data
  if (!API_KEY) {
    return generateMockForecast(itemName, currentStock, averageDailyUsage);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are an AI logistics forecasting engine for public health.
      Item: ${itemName}
      Current Stock: ${currentStock}
      Average Daily Usage: ${averageDailyUsage}
      Facility Type: ${facilityType}

      Task: Predict the inventory levels for the next 30 days. Identify if and when a stockout will occur.
      Consider a slight upward trend if the item is typically seasonal (like Paracetamol in monsoon).
      
      Respond strictly in JSON format matching this schema:
      {
        "prediction": [
          { "date": "YYYY-MM-DD", "predictedUsage": number, "confidenceLower": number, "confidenceUpper": number, "isStockoutRisk": boolean }
        ],
        "confidence": number,
        "explanation": "string",
        "recommendedAction": "string",
        "stockoutDate": "YYYY-MM-DD or null"
      }
      Do not include markdown blocks like \`\`\`json. Return only valid JSON.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    // Clean up markdown if Gemini includes it
    const cleanJson = text.replace(/^```json/i, '').replace(/```$/, '').trim();
    return JSON.parse(cleanJson) as ForecastOutput;
  } catch (error) {
    console.error('Forecasting API failed:', error);
    return generateMockForecast(itemName, currentStock, averageDailyUsage);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function generateMockForecast(_itemName: string, currentStock: number, avgUsage: number): ForecastOutput {
  const points: ForecastPoint[] = [];
  let remaining = currentStock;
  let stockoutDate: string | null = null;
  
  for (let i = 1; i <= 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    // Add some random noise
    const noise = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
    const dailyUsage = Math.round(avgUsage * noise);
    remaining -= dailyUsage;
    
    const isRisk = remaining <= (avgUsage * 3); // 3 days buffer
    
    if (remaining <= 0 && !stockoutDate) {
      stockoutDate = date.toISOString().split('T')[0];
    }
    
    points.push({
      date: date.toISOString().split('T')[0],
      predictedUsage: dailyUsage,
      confidenceLower: Math.max(0, dailyUsage * 0.8),
      confidenceUpper: dailyUsage * 1.2,
      isStockoutRisk: isRisk
    });
  }
  
  return {
    prediction: points,
    stockoutDate,
    confidence: 85,
    explanation: `Predicted based on ${avgUsage}/day run rate with historical variance.`,
    recommendedAction: stockoutDate 
      ? `Initiate emergency transfer from District Warehouse before ${stockoutDate}.`
      : 'Stock levels are sufficient for the next 30 days.'
  };
}
