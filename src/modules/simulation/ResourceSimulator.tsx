import { useState } from 'react';

interface ScenarioImpact {
  name: string;
  emoji: string;
  before: { demand: string; beds: string; staff: string; risk: number };
  after: { demand: string; demandDelta: string; beds: string; staff: string; risk: number };
  actions: string[];
}

const SCENARIOS: ScenarioImpact[] = [
  {
    name: 'Dengue Outbreak',
    emoji: '🦟',
    before: { demand: '2,400', beds: '76%', staff: '0', risk: 62 },
    after: { demand: '4,200', demandDelta: '+75%', beds: '94%', staff: '18', risk: 88 },
    actions: [
      'Immediate Stock Allocation: Redirect 1,800 units of Paracetamol and Fluid replacement salts from Block B and C central storage to the East District Health Center.',
      'Surge Capacity Protocol: Activate "Tentward-7" modular unit at Civil Hospital to accommodate the projected 18% increase in non-critical bed demand.',
      'Personnel Redistribution: Deploy 12 reserve medical officers from the Metropolitan pool to peripheral rural centers for a 48-hour intensive screening shift.'
    ]
  },
  {
    name: 'Flood Disaster',
    emoji: '🌊',
    before: { demand: '2,400', beds: '76%', staff: '0', risk: 62 },
    after: { demand: '3,100', demandDelta: '+29%', beds: '85%', staff: '5', risk: 75 },
    actions: [
      'Route Optimization: Reroute critical antibiotic logistics via bypass routes due to inundation in Ramgarh block.',
      'Waterborne Disease Prep: Pre-deploy cholera and typhoid kits to 4 high-risk PHCs.',
      'Emergency Transport: Activate 3 high-clearance emergency vehicles for patient transfer.'
    ]
  },
  {
    name: 'Heatwave',
    emoji: '🌡',
    before: { demand: '2,400', beds: '76%', staff: '0', risk: 62 },
    after: { demand: '3,800', demandDelta: '+58%', beds: '90%', staff: '8', risk: 82 },
    actions: [
      'Cooling Centers: Activate mobile heatstroke units in 5 targeted high-temperature zones.',
      'IV Buffer: Double IV fluids buffers at all district CHCs immediately.',
      'Public Alerting: Broadcast heatwave survival guidelines via SMS to 1.2M registered citizens.'
    ]
  },
  {
    name: 'Supply Disruption',
    emoji: '📦',
    before: { demand: '2,400', beds: '76%', staff: '0', risk: 62 },
    after: { demand: '2,400', demandDelta: '+0%', beds: '76%', staff: '0', risk: 78 },
    actions: [
      'Alternative Sourcing: Procure emergency amoxicillin stock from secondary vendor network.',
      'Inventory Rationing: Implement strict triage-based dispensing for top 10 fast-moving drugs.',
      'Inter-district Transfer: Request emergency transfer of 500 units of essential supplies from neighboring district.'
    ]
  },
  {
    name: 'Doctor Strike',
    emoji: '🧑‍⚕️',
    before: { demand: '2,400', beds: '76%', staff: '0', risk: 62 },
    after: { demand: '2,400', demandDelta: '+0%', beds: '76%', staff: '42', risk: 91 },
    actions: [
      'Telemedicine Surge: Route all non-critical OPD patients to AI-assisted telemedicine kiosks.',
      'Reserve Deployment: Mobilize AYUSH practitioners for basic triage and first aid.',
      'Critical Care Focus: Concentrate remaining allopathic staff entirely in ICU and emergency wards.'
    ]
  }
];

interface Props {
  language: string;
}

export default function ResourceSimulator({ language }: Props) {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [isSimulated, setIsSimulated] = useState<boolean>(false);
  const isHi = language === 'hi';

  const handleScenarioChange = (idx: number) => {
    setSelectedIdx(idx);
    setIsSimulated(false);
  };

  const scenario = SCENARIOS[selectedIdx];

  return (
    <div className="bg-surface-container-lowest w-full pb-12">
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div className="flex items-start gap-4">
          <div className="bg-primary-container p-4 rounded-xl text-white shadow-sm shrink-0">
            <span className="material-symbols-outlined text-[32px]">science</span>
          </div>
          <div>
            <h1 className="text-[24px] leading-[32px] tracking-[-0.01em] font-semibold text-on-surface">
              {isHi ? 'संसाधन सिमुलेशन इंजन' : 'Resource Simulation Engine'}
            </h1>
            <p className="text-[14px] leading-[20px] text-on-surface-variant mt-1">
              {isHi ? 'आपातकालीन परिदृश्यों और जिला संसाधनों पर एआई-अनुमानित प्रभाव का मॉडल बनाएं' : 'Model emergency scenarios and AI-projected impact on district resources'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-full border border-outline-variant shrink-0">
          <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
          <span className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-primary uppercase">
            {isHi ? 'एआई कॉन्फिडेंस: 91%' : 'AI Confidence: 91%'}
          </span>
        </div>
      </header>

      {/* SCENARIO SELECTOR */}
      <section className="mb-12">
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {SCENARIOS.map((sc, idx) => (
            <button
              key={idx}
              onClick={() => handleScenarioChange(idx)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[12px] leading-[16px] tracking-[0.05em] font-semibold transition-all whitespace-nowrap ${
                selectedIdx === idx 
                ? 'bg-primary-container text-white shadow-md hover:brightness-110' 
                : 'bg-white border border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              <span>{sc.emoji}</span> {sc.name}
            </button>
          ))}
        </div>
      </section>

      {/* COMPARISON LAYOUT (Bento-style Grid) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {/* BEFORE PANEL */}
        <div className="bg-white border border-outline-variant rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold uppercase text-outline">
              {isHi ? 'वर्तमान स्थिति (बेसलाइन)' : 'Current Status (Baseline)'}
            </h2>
            <span className="px-2 py-1 bg-surface-container-low text-on-surface-variant rounded font-semibold text-[10px]">
              {isHi ? 'रीयल-टाइम' : 'REAL-TIME'}
            </span>
          </div>
          
          <div className="space-y-4">
            {/* Medicine Demand */}
            <div className="group">
              <p className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant mb-1">
                {isHi ? 'दवा की मांग (इकाइयाँ)' : 'Medicine Demand (units)'}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-[36px] leading-[44px] tracking-[-0.02em] font-bold text-on-surface">{scenario.before.demand}</span>
                <span className="text-on-surface-variant text-[13px] leading-[18px] font-medium font-mono">{isHi ? 'सामान्य' : 'Nominal'}</span>
              </div>
            </div>
            
            <hr className="border-outline-variant/30" />
            
            {/* Bed Occupancy */}
            <div className="group">
              <p className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant mb-1">
                {isHi ? 'बिस्तर अधिभोग' : 'Bed Occupancy'}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-[36px] leading-[44px] tracking-[-0.02em] font-bold text-on-surface">{scenario.before.beds}</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">{isHi ? 'स्थिर' : 'STABLE'}</span>
              </div>
            </div>
            
            <hr className="border-outline-variant/30" />
            
            {/* Staff Shortage */}
            <div className="group">
              <p className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant mb-1">
                {isHi ? 'स्टाफ की कमी' : 'Staff Shortage'}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-[36px] leading-[44px] tracking-[-0.02em] font-bold text-on-surface">{scenario.before.staff}</span>
                <span className="text-on-surface-variant text-[13px] leading-[18px] font-medium font-mono">{isHi ? 'पूरी क्षमता' : 'Full Capacity'}</span>
              </div>
            </div>
            
            <hr className="border-outline-variant/30" />
            
            {/* District Risk Score */}
            <div className="group">
              <p className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant mb-1">
                {isHi ? 'जिला जोखिम स्कोर' : 'District Risk Score'}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-[36px] leading-[44px] tracking-[-0.02em] font-bold text-on-surface">{scenario.before.risk}</span>
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded font-semibold text-[10px]">{isHi ? 'मध्यम' : 'MODERATE'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* AFTER AI RESPONSE PANEL */}
        <div className={`bg-white border-2 rounded-xl p-6 relative overflow-hidden transition-all duration-700 ${isSimulated ? 'border-primary/20 ring-4 ring-primary/5' : 'border-outline-variant/30 opacity-60'}`}>
          {isSimulated && (
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 blur-3xl rounded-full"></div>
          )}
          
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-[12px] leading-[16px] tracking-[0.05em] font-semibold uppercase tracking-widest ${isSimulated ? 'text-primary' : 'text-outline'}`}>
              {isHi ? 'अनुकरणीय प्रक्षेपण' : 'Simulated Projection'}
            </h2>
            <span className={`px-2 py-1 rounded font-semibold text-[10px] ${isSimulated ? 'bg-primary-container text-white' : 'bg-surface-container-low text-outline'}`}>
              AI MODEL V2.4
            </span>
          </div>
          
          <div className="space-y-4 relative">
            {!isSimulated && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
                 <span className="text-on-surface-variant text-[14px] font-medium italic">Run simulation to view projection</span>
              </div>
            )}
            
            {/* Medicine Demand */}
            <div className="group">
              <p className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant mb-1">
                {isHi ? 'दवा की मांग (इकाइयाँ)' : 'Medicine Demand (units)'}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-[36px] leading-[44px] tracking-[-0.02em] font-bold text-error">{scenario.after.demand}</span>
                {scenario.after.demandDelta !== '+0%' && (
                  <span className="px-2 py-0.5 bg-error-container text-on-error-container rounded font-semibold text-[10px] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">trending_up</span> {scenario.after.demandDelta}
                  </span>
                )}
              </div>
            </div>
            
            <hr className="border-outline-variant/30" />
            
            {/* Bed Occupancy */}
            <div className="group">
              <p className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant mb-1">
                {isHi ? 'बिस्तर अधिभोग' : 'Bed Occupancy'}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-[36px] leading-[44px] tracking-[-0.02em] font-bold text-error">{scenario.after.beds}</span>
                <span className="px-2 py-0.5 bg-error-container text-on-error-container rounded font-semibold text-[10px]">{isHi ? 'गंभीर' : 'CRITICAL'}</span>
              </div>
            </div>
            
            <hr className="border-outline-variant/30" />
            
            {/* Staff Shortage */}
            <div className="group">
              <p className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant mb-1">
                {isHi ? 'स्टाफ की कमी' : 'Staff Shortage'}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-[36px] leading-[44px] tracking-[-0.02em] font-bold text-amber-600">{scenario.after.staff}</span>
                {scenario.after.staff !== '0' ? (
                  <span className="text-amber-700 font-semibold text-[12px] leading-[16px] tracking-[0.05em] uppercase">{isHi ? 'डॉक्टरों की आवश्यकता' : 'DOCTORS NEEDED'}</span>
                ) : (
                  <span className="text-on-surface-variant text-[13px] leading-[18px] font-medium font-mono">{isHi ? 'पूरी क्षमता' : 'Full Capacity'}</span>
                )}
              </div>
            </div>
            
            <hr className="border-outline-variant/30" />
            
            {/* District Risk Score */}
            <div className="group">
              <p className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant mb-1">
                {isHi ? 'जिला जोखिम स्कोर' : 'District Risk Score'}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-[36px] leading-[44px] tracking-[-0.02em] font-bold text-error">{scenario.after.risk}</span>
                <span className="px-2 py-0.5 bg-error-container text-on-error-container rounded font-semibold text-[10px]">{isHi ? 'गंभीर' : 'CRITICAL'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACTION CTA */}
      <div className="flex flex-col items-center mb-12">
        <button 
          onClick={() => setIsSimulated(true)}
          className="group flex items-center gap-4 px-12 py-4 bg-primary-container text-white rounded-xl text-[20px] leading-[28px] font-semibold shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-1"
        >
          <span className="material-symbols-outlined">play_circle</span>
          {isHi ? 'सिमुलेशन चलाएं' : 'Run Simulation'}
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
        <p className="text-on-surface-variant text-[13px] leading-[18px] font-medium mt-4 italic">
          {isHi ? '14:02 सेकंड में अगली पुन: गणना' : 'Next re-calculation in 14:02s'}
        </p>
      </div>

      {/* RECOMMENDED AI RESPONSE CARD */}
      {isSimulated && (
        <section className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="bg-secondary-container/30 border border-secondary-container rounded-xl p-6 overflow-hidden relative">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              </div>
              <h3 className="text-[20px] leading-[28px] font-semibold text-on-secondary-fixed-variant">
                {isHi ? 'अनुशंसित एआई प्रतिक्रिया' : 'Recommended AI Response'}
              </h3>
            </div>
            
            <ul className="space-y-4 ml-12">
              {scenario.actions.map((action, i) => {
                const [title, ...rest] = action.split(':');
                const description = rest.join(':');
                return (
                  <li key={i} className="flex items-start gap-4">
                    <span className="mt-2 w-2 h-2 rounded-full bg-primary flex-shrink-0"></span>
                    <p className="text-[14px] leading-[20px] text-on-surface-variant">
                      <strong className="text-on-surface block mb-0.5">{title}:</strong> 
                      {description}
                    </p>
                  </li>
                );
              })}
            </ul>
            
            {/* Decorative Graphic Element */}
            <div className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none">
              <span className="material-symbols-outlined text-[200px]">hub</span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
