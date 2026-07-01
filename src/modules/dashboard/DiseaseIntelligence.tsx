

interface Props {
  language: string;
}

export default function DiseaseIntelligence({ language }: Props) {
  const isHi = language === 'hi';

  const hotspots = [
    { zone: 'Mundawar (North Alwar)', disease: 'Dengue Surge', cases: 38, risk: 'HIGH', trend: '↑ 12%' },
    { zone: 'Tijara (East Alwar)', disease: 'Malaria Spikes', cases: 14, risk: 'MODERATE', trend: '↓ 3%' },
    { zone: 'Behror (West Alwar)', disease: 'Acute Respiratory Inf.', cases: 92, risk: 'CRITICAL', trend: '↑ 28%' }
  ];

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-outline-variant pb-3">
        <div className="flex items-center space-x-2 text-primary font-headline-sm text-base">
          <span className="material-symbols-outlined text-xl text-error">coronavirus</span>
          <h3>{isHi ? 'रोग खुफिया एवं हॉटस्पॉट विश्लेषण' : 'Disease Intelligence & Hotspots'}</h3>
        </div>
        <span className="px-2.5 py-0.5 bg-error-container text-on-error-container text-[10px] font-bold rounded-full">
          {isHi ? '3 सक्रिय अलर्ट' : '3 Active Alerts'}
        </span>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {hotspots.map((item, idx) => (
            <div key={idx} className="p-3 bg-surface-container-low rounded-xl border border-outline-variant space-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-1 w-12 bg-error" />
              <div className="flex justify-between items-center text-[10px] font-bold text-secondary uppercase">
                <span>{item.zone}</span>
                <span className={item.risk === 'CRITICAL' ? 'text-error' : 'text-amber-600'}>{item.risk}</span>
              </div>
              <h4 className="font-bold text-sm text-primary">{item.disease}</h4>
              <div className="flex justify-between items-baseline text-xs">
                <span className="text-on-surface-variant">Active Cases: <strong className="text-primary">{item.cases}</strong></span>
                <span className="font-bold text-green-600">{item.trend}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Explainability Block */}
        <div className="p-3.5 bg-primary-container/20 border border-primary-container/40 rounded-xl text-xs space-y-1">
          <span className="font-extrabold text-primary block">AI Outbreak Explanation</span>
          <p className="text-on-surface-variant leading-relaxed font-medium">
            Environmental factors (sudden monsoon precipitation spike) combined with high local population density in Mundawar correlate directly with a <strong>32% rise in vector breeding vectors</strong>. Early stock redistribution prevents local health collapse.
          </p>
        </div>
      </div>
    </div>
  );
}
