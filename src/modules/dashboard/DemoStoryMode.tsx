import { useState } from 'react';

interface Step {
  icon: string;
  label: string;
  labelHi: string;
  tab: string;
  description: string;
  descriptionHi: string;
}

const DEMO_STEPS: Step[] = [
  {
    icon: 'dashboard',
    label: 'Live District Status',
    labelHi: 'लाइव जिला स्थिति',
    tab: 'dashboard',
    description: 'See 42 PHCs/CHCs real-time — health score 71/100, 3 critical alerts active.',
    descriptionHi: 'वास्तविक समय में 42 PHC/CHC देखें - स्वास्थ्य स्कोर 71/100, 3 महत्वपूर्ण अलर्ट सक्रिय हैं।',
  },
  {
    icon: 'psychology',
    label: 'AI Detects Crisis',
    labelHi: 'एआई संकट का पता लगाता है',
    tab: 'dashboard',
    description: 'Amoxicillin stock-out in 6 days + Dengue cluster emerging in Tijara.',
    descriptionHi: '6 दिनों में एमोक्सिसिलिन स्टॉक-आउट + तिजारा में डेंगू क्लस्टर उभर रहा है।',
  },
  {
    icon: 'inventory_2',
    label: 'Computer Vision Scan',
    labelHi: 'कंप्यूटर विजन स्कैन',
    tab: 'inventory',
    description: 'AI scans shelf image — detects 3 low-stock items, flags 1 empty shelf.',
    descriptionHi: 'एआई शेल्फ छवि को स्कैन करता है - 3 कम-स्टॉक आइटम का पता लगाता है, 1 खाली शेल्फ को फ्लैग करता है।',
  },
  {
    icon: 'bolt',
    label: 'Execute AI Response',
    labelHi: 'एआई प्रतिक्रिया निष्पादित करें',
    tab: 'dashboard',
    description: 'Click "Execute AI Response" — redistribution dispatched, alerts sent.',
    descriptionHi: '"एआई प्रतिक्रिया निष्पादित करें" पर क्लिक करें - पुनर्वितरण भेजा गया, अलर्ट भेजे गए।',
  },
  {
    icon: 'bar_chart',
    label: 'Simulation Results',
    labelHi: 'सिमुलेशन परिणाम',
    tab: 'analytics',
    description: 'Run Dengue outbreak scenario — Before vs After risk scores update live.',
    descriptionHi: 'डेंगू प्रकोप परिदृश्य चलाएं - पहले बनाम बाद जोखिम स्कोर लाइव अपडेट होते हैं।',
  },
  {
    icon: 'emoji_events',
    label: 'Impact: Score 88/100',
    labelHi: 'प्रभाव: स्कोर 88/100',
    tab: 'dashboard',
    description: 'District Health Score rises from 71 → 88. Lives protected. Cost saved: ₹45k.',
    descriptionHi: 'जिला स्वास्थ्य स्कोर 71 → 88 तक बढ़ जाता है। जीवन की रक्षा की। बचाई गई लागत: ₹45k।',
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
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-primary text-white text-[12px] leading-[16px] tracking-[0.05em] font-semibold px-6 py-3 rounded-full shadow-lg flex items-center gap-2 cursor-pointer hover:bg-primary/90 transition-all"
      >
        <span className="material-symbols-outlined text-[16px]">play_circle</span>
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
    <div className="fixed bottom-0 left-0 w-full z-[100] h-20 shadow-[0_-8px_24px_rgba(0,0,0,0.15)] flex items-center px-6 border-t border-white/10 bg-gradient-to-r from-[#00478D] to-[#505F76]">
      <div className="flex items-center justify-between w-full max-w-[1600px] mx-auto text-white gap-4">
        
        {/* Left: Step Indicators */}
        <div className="flex items-center gap-2 shrink-0">
          {DEMO_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentStep ? 'w-8 bg-white' : 'w-2 bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Left-Center: Description block */}
        <div className="flex items-center gap-4 flex-1 min-w-0 md:ml-12">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm shrink-0">
            <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              {step.icon}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-white/80 uppercase">
              {isHi ? `चरण ${currentStep + 1}/${DEMO_STEPS.length}` : `STEP ${currentStep + 1}/${DEMO_STEPS.length}`} — {isHi ? step.labelHi : step.label}
            </p>
            <p className="text-[16px] leading-[24px] font-semibold truncate">
              {isHi ? step.descriptionHi : step.description}
            </p>
          </div>
        </div>

        {/* Center-Right: Pill Indicator */}
        <div className="hidden lg:flex items-center gap-4 shrink-0 px-6">
          <div className="flex items-center gap-2 bg-white/10 border border-white/30 rounded-full px-4 py-2">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>shield_health</span>
            <span className="text-[14px] leading-[20px] font-semibold">
              {isHi ? 'जिला:' : 'District:'} <span className={`font-bold ${transferApproved && currentStep >= 3 ? 'text-green-300' : 'text-white'}`}>
                {transferApproved && currentStep >= 3 ? '88' : '71'}/100
              </span>
            </span>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="px-6 py-2 text-white border border-white/40 hover:bg-white/10 rounded-full text-[12px] leading-[16px] tracking-[0.05em] font-semibold transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span> {isHi ? 'पिछला' : 'Prev'}
          </button>
          <button
            onClick={handleNext}
            disabled={currentStep === DEMO_STEPS.length - 1}
            className="px-8 py-2 bg-white text-primary hover:bg-white/90 rounded-full font-bold shadow-lg transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {currentStep === DEMO_STEPS.length - 1 ? (isHi ? 'पूर्ण' : 'Complete') : (isHi ? 'अगला' : 'Next')} <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
          
          <div className="h-10 w-px bg-white/20 mx-2"></div>
          
          <button
            onClick={() => setVisible(false)}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
            title="Minimize demo"
          >
            <span className="material-symbols-outlined text-white">close</span>
          </button>
        </div>

      </div>
    </div>
  );
}
