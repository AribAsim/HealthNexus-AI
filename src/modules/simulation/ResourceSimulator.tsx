import { useState } from 'react';

interface ScenarioImpact {
  name: string;
  desc: string;
  before: { beds: string; stock: string; risk: number; alerts: number };
  after: { beds: string; stock: string; risk: number; alerts: number };
  action: string;
}

const SCENARIOS: ScenarioImpact[] = [
  {
    name: 'Dengue Outbreak Surge',
    desc: 'Sudden mosquito-borne vectors spike across East Block (Tijara).',
    before: { beds: '42% occupied', stock: 'Normal', risk: 38, alerts: 1 },
    after: { beds: '92% occupied', stock: 'ORS & IV Fluids Critical', risk: 85, alerts: 4 },
    action: 'Auto-redistribute 120 ORS sachets from Alwar HQ warehouse.'
  },
  {
    name: 'Monsoon Flash Flooding',
    desc: 'Inundation of roads in Ramgarh block restricts supply chain routes.',
    before: { beds: '22% occupied', stock: 'Stable', risk: 15, alerts: 0 },
    after: { beds: '40% occupied', stock: 'Amoxicillin low (5 days safety)', risk: 62, alerts: 2 },
    action: 'Reroute critical antibiotic logistics via bypass routes.'
  },
  {
    name: 'Heatwave Alert',
    desc: 'Temperatures cross 46°C leading to dehydration surges.',
    before: { beds: '50% occupied', stock: 'Normal', risk: 42, alerts: 0 },
    after: { beds: '85% occupied', stock: 'IV Fluids depleted', risk: 78, alerts: 3 },
    action: 'Activate mobile heatstroke units and double IV fluids buffers.'
  },
  {
    name: 'Medical Staff Deficit',
    desc: 'Strike/absenteeism spike in West zone (Behror).',
    before: { beds: '60% occupied', stock: 'Stable', risk: 28, alerts: 0 },
    after: { beds: '72% occupied', stock: 'Normal', risk: 70, alerts: 3 },
    action: 'Temp redeploy 2 Medical Officers from HQ to Behror CHC.'
  }
];

interface Props {
  language: string;
}

export default function ResourceSimulator({ language }: Props) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const isHi = language === 'hi';

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex items-center space-x-2 text-primary font-headline-sm text-base border-b border-outline-variant pb-3">
        <span className="material-symbols-outlined text-xl">model_training</span>
        <h3>{isHi ? 'परिदृश्य सिम्युलेटर (निर्णय समर्थन)' : 'Operational Scenario Simulator'}</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scenarios List */}
        <div className="space-y-2">
          {SCENARIOS.map((sc, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex flex-col gap-1 cursor-pointer ${
                selectedIdx === idx 
                ? 'bg-primary-container/20 border-primary text-primary font-bold shadow-sm' 
                : 'bg-surface border-outline-variant hover:bg-surface-container-low text-secondary'
              }`}
            >
              <div className="flex justify-between w-full font-extrabold text-primary">
                 <span>{sc.name}</span>
                 <span className="material-symbols-outlined text-sm">play_arrow</span>
              </div>
              <p className="text-[11px] text-on-surface-variant font-medium leading-relaxed">{sc.desc}</p>
            </button>
          ))}
        </div>

        {/* Before vs After Impact Box */}
        <div className="lg:col-span-2 bg-surface-container-low rounded-xl p-4 border border-outline-variant flex flex-col justify-between">
          {selectedIdx !== null ? (
            <div className="space-y-4">
              <div className="text-xs font-bold text-primary border-b border-outline-variant pb-2">
                Impact Analysis: {SCENARIOS[selectedIdx].name}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Before Box */}
                <div className="bg-white p-3 rounded-lg border border-outline-variant space-y-2 text-xs">
                  <span className="font-extrabold text-secondary block uppercase tracking-wider">Before Scenario</span>
                  <div className="flex justify-between">
                    <span>Beds:</span>
                    <span className="font-bold">{SCENARIOS[selectedIdx].before.beds}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stock:</span>
                    <span className="font-bold">{SCENARIOS[selectedIdx].before.stock}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Risk:</span>
                    <span className="font-bold text-green-600">{SCENARIOS[selectedIdx].before.risk}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Alerts:</span>
                    <span className="font-bold">{SCENARIOS[selectedIdx].before.alerts}</span>
                  </div>
                </div>

                {/* After Impact Box */}
                <div className="bg-error-container/20 p-3 rounded-lg border border-error-container/40 space-y-2 text-xs animate-pulse">
                  <span className="font-extrabold text-error block uppercase tracking-wider">After Impact</span>
                  <div className="flex justify-between">
                    <span>Beds:</span>
                    <span className="font-bold text-error">{SCENARIOS[selectedIdx].after.beds}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stock:</span>
                    <span className="font-bold text-error">{SCENARIOS[selectedIdx].after.stock}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Risk:</span>
                    <span className="font-bold text-error">{SCENARIOS[selectedIdx].after.risk}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Alerts:</span>
                    <span className="font-bold text-error">{SCENARIOS[selectedIdx].after.alerts}</span>
                  </div>
                </div>
              </div>

              {/* Redistribution / Recommended action */}
              <div className="p-3 bg-primary-container/20 border border-primary-container/40 rounded-lg text-xs">
                <span className="font-extrabold text-primary block">AI Recommended Response:</span>
                <p className="text-on-surface-variant font-medium mt-1">{SCENARIOS[selectedIdx].action}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center text-xs text-on-surface-variant font-bold">
              <span className="material-symbols-outlined text-4xl text-secondary mb-2 animate-bounce">science</span>
              Select an operational scenario surge on the left to analyze Before → After telemetry impact.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
