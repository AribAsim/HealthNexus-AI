interface Props {
  language: string;
}

export default function DiseaseIntelligence({ language }: Props) {
  const isHi = language === 'hi';

  const hotspots = [
    { 
      zone: isHi ? 'थानागाज़ी ब्लॉक' : 'Thanagazi Block', 
      disease: isHi ? 'डेंगू रक्तस्रावी' : 'Dengue Hemorrhagic', 
      cases: 24, 
      phcs: 6,
      daysActive: 4,
      risk: 'Critical', 
      prob: 73,
      riskColor: 'error',
      bgRisk: 'bg-error',
      textRisk: 'text-error',
      bgRiskTag: 'bg-error text-white'
    },
    { 
      zone: isHi ? 'बानसूर ब्लॉक' : 'Bansur Block', 
      disease: isHi ? 'मलेरिया (पी. फाल्सीपेरम)' : 'Malaria (P. falciparum)', 
      cases: 12, 
      phcs: 3,
      daysActive: 2,
      risk: 'Warning', 
      prob: 58,
      riskColor: 'amber-600',
      bgRisk: 'bg-amber-500',
      textRisk: 'text-amber-600',
      bgRiskTag: 'bg-amber-100 text-amber-800'
    },
    { 
      zone: isHi ? 'रामगढ़ ब्लॉक' : 'Ramgarh Block', 
      disease: isHi ? 'श्वसन संक्रमण' : 'Respiratory Infection', 
      cases: 8, 
      phcs: 2,
      daysActive: 7,
      risk: 'Monitoring', 
      prob: 32,
      riskColor: 'secondary',
      bgRisk: 'bg-secondary',
      textRisk: 'text-secondary',
      bgRiskTag: 'bg-surface-variant text-on-surface-variant'
    }
  ];

  return (
    <section className="space-y-6">
      {/* Dashboard Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-outline-variant pb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary-container/10 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-[32px]">psychology</span>
          </div>
          <div>
            <h1 className="text-[24px] leading-[32px] tracking-[-0.01em] font-semibold text-primary">
              {isHi ? 'रोग खुफिया — अलवर जिला' : 'Disease Intelligence — Alwar District'}
            </h1>
            <p className="text-[16px] leading-[24px] text-on-surface-variant">
              {isHi ? 'एआई-संचालित प्रकोप का पता लगाना' : 'AI-driven outbreak detection & early warning system'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="px-4 py-2 bg-error-container text-on-error-container text-[12px] leading-[16px] tracking-[0.05em] font-semibold rounded-full flex items-center gap-2 border border-error/20">
            <span className="w-2 h-2 bg-error rounded-full animate-pulse"></span>
            {isHi ? '3 सक्रिय क्लस्टर' : '3 Active Clusters'}
          </div>
          <div className="px-4 py-2 bg-secondary-container text-on-secondary-container text-[12px] leading-[16px] tracking-[0.05em] font-semibold rounded-full flex items-center gap-2 border border-primary/20">
            <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
            {isHi ? 'एआई विश्वास: 87%' : 'AI Confidence: 87%'}
          </div>
        </div>
      </header>

      {/* Hotspot Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotspots.map((item, idx) => (
          <div key={idx} className="bg-white border border-outline-variant p-4 rounded-xl flex flex-col shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">location_on</span>
                <span className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface uppercase">{item.zone}</span>
              </div>
              <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${item.bgRiskTag}`}>{isHi ? item.risk : item.risk}</span>
            </div>
            
            <div className="mb-6">
              <h3 className="text-[20px] leading-[28px] font-semibold text-on-surface mb-2">{item.disease}</h3>
              <div className="flex justify-between border-y border-outline-variant/30 py-2">
                <div className="text-center">
                  <div className={`font-mono ${item.textRisk} flex items-center justify-center font-medium`}>
                    {item.cases} <span className="material-symbols-outlined text-[12px]">arrow_upward</span>
                  </div>
                  <div className="text-[10px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase">{isHi ? 'मामले' : 'Cases'}</div>
                </div>
                <div className="text-center">
                  <div className="font-mono text-on-surface font-medium">{item.phcs < 10 ? `0${item.phcs}` : item.phcs}</div>
                  <div className="text-[10px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase">{isHi ? 'प्रभावित PHC' : 'PHCs Affected'}</div>
                </div>
                <div className="text-center">
                  <div className="font-mono text-on-surface font-medium">{item.daysActive < 10 ? `0${item.daysActive}` : item.daysActive}</div>
                  <div className="text-[10px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase">{isHi ? 'सक्रिय दिन' : 'Days Active'}</div>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-low p-2 rounded-lg mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] leading-[16px] tracking-[0.05em] font-semibold text-primary">{isHi ? 'एआई विश्लेषण' : 'AI Analysis'}</span>
                <span className="font-mono text-[11px] text-on-surface-variant">{item.prob}% {isHi ? 'संभावना' : 'Prob.'}</span>
              </div>
              <div className="w-full bg-outline-variant h-1.5 rounded-full overflow-hidden">
                <div className={`${item.bgRisk} h-full`} style={{ width: `${item.prob}%` }}></div>
              </div>
            </div>

            <button className="mt-auto w-full py-2 bg-primary text-white rounded text-[12px] leading-[16px] tracking-[0.05em] font-semibold hover:opacity-90 transition-all">
              {isHi ? 'प्रतिक्रिया दल तैनात करें' : 'Deploy Response Team'}
            </button>
          </div>
        ))}
      </div>


    </section>
  );
}
