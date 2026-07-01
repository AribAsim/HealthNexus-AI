import { useState } from 'react';

interface Props {
  language: string;
}

const steps = [
  { time: '02:00 AM', icon: 'schedule', label: 'Nightly AI Run Initiated', status: 'done' },
  { time: '02:01 AM', icon: 'inventory_2', label: 'Inventory Forecast Complete (42 facilities)', status: 'done' },
  { time: '02:03 AM', icon: 'warning', label: '3 Shortage Risks Detected — Amoxicillin, ORS, IV Fluids', status: 'done' },
  { time: '02:05 AM', icon: 'notifications_active', label: 'Alerts Dispatched to 6 Health Officers', status: 'done' },
  { time: '02:07 AM', icon: 'swap_horiz', label: '2 Optimal Transfer Plans Generated', status: 'done' },
  { time: '02:09 AM', icon: 'picture_as_pdf', label: 'Executive Summary PDF created & queued', status: 'done' },
];

export default function NightlyWorkflow({ language }: Props) {
  const [expanded, setExpanded] = useState(false);
  const isHi = language === 'hi';

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm space-y-4">
      <div
        className="flex items-center justify-between border-b border-outline-variant pb-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-2 text-primary font-headline-sm text-base">
          <span className="material-symbols-outlined text-xl text-secondary">smart_toy</span>
          <h3>{isHi ? 'रात्रि एआई वर्कफ़्लो' : 'Nightly AI Workflow Timeline'}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 bg-green-100 text-green-800 text-[10px] font-bold rounded-full">02:09 AM — All Complete</span>
          <span className="material-symbols-outlined text-sm text-secondary">{expanded ? 'expand_less' : 'expand_more'}</span>
        </div>
      </div>

      {expanded && (
        <div className="relative pl-5">
          <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-primary/20 rounded-full" />
          <div className="space-y-4">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 relative animate-fade-in">
                <div className="absolute -left-5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-white shadow-sm mt-1.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">{step.time}</span>
                  <span className="text-xs font-bold text-primary flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">{step.icon}</span>
                    {step.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!expanded && (
        <p className="text-xs text-on-surface-variant font-medium">
          {isHi ? 'पिछली रात सभी 6 AI कार्य सफलतापूर्वक पूर्ण हुए।' : 'All 6 automated AI tasks completed successfully last night with zero intervention.'}
        </p>
      )}
    </div>
  );
}
