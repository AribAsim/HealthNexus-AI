import { useEffect, useState } from 'react';
import { generateInventoryForecast, type ForecastOutput } from './forecasting';

interface Props {
  itemName: string;
  currentStock: number;
  averageDailyUsage: number;
  facilityType: string;
  language: string;
}

export default function ForecastingChart({ itemName, currentStock, averageDailyUsage, facilityType, language }: Props) {
  const [data, setData] = useState<ForecastOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const isHi = language === 'hi';

  useEffect(() => {
    let mounted = true;
    async function fetchForecast() {
      setLoading(true);
      const res = await generateInventoryForecast(itemName, currentStock, averageDailyUsage, facilityType);
      if (mounted) setData(res);
      setLoading(false);
    }
    fetchForecast();
    return () => { mounted = false; };
  }, [itemName, currentStock, averageDailyUsage, facilityType]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4 animate-pulse">
        <span className="material-symbols-outlined text-4xl text-primary animate-spin">sync</span>
        <p className="text-sm font-bold text-on-surface-variant">
          {isHi ? 'जेमिनी एआई पूर्वानुमान उत्पन्न कर रहा है...' : 'Gemini AI generating forecast...'}
        </p>
      </div>
    );
  }

  if (!data) return null;

  const maxVal = Math.max(...data.prediction.map(p => p.confidenceUpper));
  
  return (
    <div className="space-y-6">
      <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant relative overflow-hidden">
        {data.stockoutDate && (
           <div className="absolute top-0 right-0 bg-error text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl tracking-widest shadow-sm">
             {isHi ? 'स्टॉकआउट जोखिम' : 'STOCKOUT RISK'}
           </div>
        )}
        <div className="flex items-center space-x-2 text-primary font-headline-sm text-base border-b border-outline-variant pb-3 mb-4">
          <span className="material-symbols-outlined text-xl">insights</span>
          <h3>{itemName} {isHi ? 'पूर्वानुमान' : 'Forecast'} (30 {isHi ? 'दिन' : 'Days'})</h3>
        </div>
        
        {/* Animated Bar Chart */}
        <div className="flex items-end space-x-1 h-32 mt-6 relative border-b border-l border-outline-variant pb-1 pl-1">
          {data.prediction.map((point, idx) => {
             const heightPct = (point.predictedUsage / maxVal) * 100;
             const upperPct = (point.confidenceUpper / maxVal) * 100;
             const lowerPct = (point.confidenceLower / maxVal) * 100;
             
             return (
               <div key={idx} className="flex-1 flex flex-col justify-end items-center group relative h-full">
                 {/* Confidence Band (Background) */}
                 <div 
                   className="absolute bottom-0 w-full bg-primary/10 rounded-t-sm"
                   style={{ height: `${upperPct}%`, minHeight: `${lowerPct}%` }}
                 />
                 
                 {/* Actual Prediction Bar */}
                 <div 
                   className={`w-full rounded-t-sm transition-all duration-1000 ${point.isStockoutRisk ? 'bg-error' : 'bg-primary'}`}
                   style={{ height: `${heightPct}%` }}
                 />
                 
                 {/* Tooltip on Hover */}
                 <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-on-surface text-surface text-[10px] px-2 py-1 rounded whitespace-nowrap z-10 transition-opacity">
                   {point.date}<br/>
                   Pred: {point.predictedUsage}<br/>
                   Risk: {point.isStockoutRisk ? 'Yes' : 'No'}
                 </div>
               </div>
             );
          })}
        </div>
        
        <div className="mt-4 flex justify-between items-center text-[10px] text-on-surface-variant uppercase font-bold">
          <span>{data.prediction[0]?.date}</span>
          <span>{data.prediction[data.prediction.length - 1]?.date}</span>
        </div>
      </div>
      
      {/* AI Explanation & Recommendation */}
      <div className="p-4 bg-primary-container/20 rounded-xl border border-primary-container space-y-2 text-xs relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10">
          <span className="material-symbols-outlined text-6xl">psychology</span>
        </div>
        <span className="font-extrabold text-primary flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">robot_2</span> AI Analysis ({data.confidence}% confidence)
        </span>
        <p className="text-on-surface-variant leading-relaxed font-medium">
          {data.explanation}
        </p>
        <p className="text-error font-extrabold mt-2 pt-2 border-t border-primary/10">
          ACTION: {data.recommendedAction}
        </p>
      </div>
    </div>
  );
}
