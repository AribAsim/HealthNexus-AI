import { useState } from 'react';

interface Step {
  icon: string;
  label: string;
  tab: string;
  description: string;
}

const DEMO_STEPS: Step[] = [
  {
    icon: 'dashboard',
    label: 'Live District Status',
    tab: 'dashboard',
    description: 'See 42 PHCs/CHCs real-time — health score 71/100, 3 critical alerts active.',
  },
  {
    icon: 'crisis_alert',
    label: 'AI Detects Crisis',
    tab: 'dashboard',
    description: 'Amoxicillin stock-out in 6 days + Dengue cluster emerging in Tijara.',
  },
  {
    icon: 'inventory_2',
    label: 'Computer Vision Scan',
    tab: 'inventory',
    description: 'AI scans shelf image — detects 3 low-stock items, flags 1 empty shelf.',
  },
  {
    icon: 'swap_horiz',
    label: 'Execute AI Response',
    tab: 'dashboard',
    description: 'Click "Execute AI Response" — redistribution dispatched, alerts sent.',
  },
  {
    icon: 'bar_chart',
    label: 'Simulation Results',
    tab: 'analytics',
    description: 'Run Dengue outbreak scenario — Before vs After risk scores update live.',
  },
  {
    icon: 'emoji_events',
    label: 'Impact: Score 88/100',
    tab: 'dashboard',
    description: 'District Health Score rises from 71 → 88. Lives protected. Cost saved: ₹45k.',
  },
];

type TabId = 'dashboard' | 'inventory' | 'patients' | 'beds' | 'staff' | 'tests' | 'analytics';

interface Props {
  language: string;
  activeTab: string;
  onTabChange: (tab: TabId) => void;
  onSimulateCrisis: () => void;
  transferApproved: boolean;
}

export default function DemoStoryMode({
  language,
  activeTab,
  onTabChange,
  onSimulateCrisis,
  transferApproved,
}: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(true);
  const isHi = language === 'hi';

  if (!visible) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-primary text-white text-[11px] font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2 cursor-pointer hover:opacity-90 transition"
      >
        <span className="material-symbols-outlined text-sm">play_circle</span>
        {isHi ? 'डेमो फिर से खोलें' : 'Reopen Demo Mode'}
      </button>
    );
  }

  const step = DEMO_STEPS[currentStep];

  const handleNext = () => {
    if (currentStep === 1) onSimulateCrisis();
    if (step.tab !== activeTab) onTabChange(step.tab as TabId);
    if (currentStep < DEMO_STEPS.length - 1) setCurrentStep(s => s + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(s => s - 1);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-primary via-secondary to-primary text-white shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
        {/* Step indicator */}
        <div className="flex items-center gap-1.5">
          {DEMO_STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                i === currentStep ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        {/* Icon + text */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="p-1.5 bg-white/20 rounded-lg shrink-0">
            <span className="material-symbols-outlined text-lg">{step.icon}</span>
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-70 block">
              {isHi ? `चरण ${currentStep + 1}/${DEMO_STEPS.length}` : `Step ${currentStep + 1}/${DEMO_STEPS.length}`}
              {' — '}{step.label}
            </span>
            <span className="text-xs font-medium leading-tight block truncate">{step.description}</span>
          </div>
        </div>

        {/* District score pulse */}
        <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl shrink-0">
          <span className="material-symbols-outlined text-sm">shield_health</span>
          <span className="text-xs font-extrabold">
            {isHi ? 'जिला स्कोर:' : 'District:'}{' '}
            <span className={transferApproved && currentStep >= 3 ? 'text-green-300' : 'text-white'}>
              {transferApproved && currentStep >= 3 ? '88' : '71'}/100
            </span>
          </span>
          {transferApproved && currentStep >= 3 && (
            <span className="text-green-300 text-[10px] font-bold">↑ +17</span>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition"
          >
            ← {isHi ? 'पिछला' : 'Prev'}
          </button>
          <button
            onClick={handleNext}
            disabled={currentStep === DEMO_STEPS.length - 1}
            className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-white hover:bg-white/90 text-primary disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition shadow"
          >
            {currentStep === DEMO_STEPS.length - 1
              ? (isHi ? '✓ पूर्ण' : '✓ Complete')
              : (isHi ? 'अगला →' : 'Next →')}
          </button>
          <button
            onClick={() => setVisible(false)}
            className="text-white/60 hover:text-white transition cursor-pointer"
            title="Minimize demo"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      </div>
    </div>
  );
}
