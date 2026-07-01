interface Props {
  language: string;
}

const steps = [
  {
    time: '02:00 AM',
    icon: 'schedule',
    label: 'Nightly AI Run Initiated',
    labelHi: 'रात्रि एआई रन आरंभ',
    desc: 'System cold start and synchronization with facility databases.',
    descHi: 'सुविधा डेटाबेस के साथ सिस्टम कोल्ड स्टार्ट और सिंक्रोनाइज़ेशन।',
    status: 'done'
  },
  {
    time: '02:01 AM',
    icon: 'inventory_2',
    label: 'Inventory Forecast Complete (42 facilities)',
    labelHi: 'इन्वेंटरी पूर्वानुमान पूर्ण (42 सुविधाएँ)',
    desc: 'Aggregated demand sensing metrics processed for all sub-districts.',
    descHi: 'सभी उप-जिलों के लिए एकत्रित मांग संवेदन मेट्रिक्स संसाधित किए गए।',
    status: 'done'
  },
  {
    time: '02:03 AM',
    icon: 'warning',
    label: '3 Shortage Risks Detected — Amoxicillin, ORS, IV Fluids',
    labelHi: '3 कमी के जोखिम पाए गए - एमोक्सिसिलिन, ओआरएस, आईवी तरल पदार्थ',
    desc: 'Anomaly detection flagged critical stock depletion levels in Northern zones.',
    descHi: 'असंगति का पता लगाने से उत्तरी क्षेत्रों में महत्वपूर्ण स्टॉक रिक्तीकरण स्तरों को चिह्नित किया गया।',
    status: 'done'
  },
  {
    time: '02:05 AM',
    icon: 'notifications_active',
    label: 'Alerts Dispatched to 6 Health Officers',
    labelHi: '6 स्वास्थ्य अधिकारियों को अलर्ट भेजे गए',
    desc: 'Automated push notifications and SMS triggered for urgent intervention.',
    descHi: 'तत्काल हस्तक्षेप के लिए स्वचालित पुश सूचनाएं और एसएमएस ट्रिगर किए गए।',
    status: 'done'
  },
  {
    time: '02:07 AM',
    icon: 'swap_horiz',
    label: '2 Optimal Transfer Plans Generated',
    labelHi: '2 इष्टतम स्थानांतरण योजनाएं उत्पन्न',
    desc: 'Logistics engine calculated minimal-cost route for inter-facility stock rebalancing.',
    descHi: 'लॉजिस्टिक्स इंजन ने अंतर-सुविधा स्टॉक पुनर्संतुलन के लिए न्यूनतम-लागत मार्ग की गणना की।',
    status: 'done'
  },
  {
    time: '02:09 AM',
    icon: 'picture_as_pdf',
    label: 'Executive Summary PDF created & queued',
    labelHi: 'कार्यकारी सारांश पीडीएफ बनाया गया और कतारबद्ध किया गया',
    desc: 'Final analytics report compiled for Director review. Workflow status: COMPLETED.',
    descHi: 'निदेशक की समीक्षा के लिए अंतिम एनालिटिक्स रिपोर्ट संकलित की गई। कार्यप्रवाह स्थिति: पूर्ण।',
    status: 'highlighted'
  },
];

export default function NightlyWorkflow({ language }: Props) {
  const isHi = language === 'hi';

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Workflow Panel */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        
        {/* Panel Header */}
        <div className="px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-outline-variant bg-surface-container-low">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[32px]">smart_toy</span>
            </div>
            <div>
              <h1 className="text-[20px] leading-[28px] font-semibold text-on-surface">
                {isHi ? 'रात्रि एआई वर्कफ़्लो टाइमलाइन' : 'Nightly AI Workflow Timeline'}
              </h1>
              <p className="text-[13px] leading-[18px] text-on-surface-variant">
                {isHi ? 'स्वचालित एआई पाइपलाइन जो हर रात 02:00 बजे चलती है' : 'Automated AI pipeline that runs every night at 02:00 AM'}
              </p>
            </div>
          </div>
          <div className="px-4 py-1 bg-green-100 text-green-800 rounded-full flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
            <span className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold">
              {isHi ? '02:09 AM — सभी कार्य पूर्ण' : '02:09 AM — All Tasks Complete'}
            </span>
          </div>
        </div>

        {/* Timeline Body */}
        <div className="p-6">
          <div className="max-w-3xl mx-auto space-y-0">
            {steps.map((step, idx) => {
              const isLast = idx === steps.length - 1;
              const isHighlighted = step.status === 'highlighted';
              
              return (
                <div key={idx} className={`flex gap-6 relative ${isHighlighted ? 'p-4 bg-green-50/50 rounded-lg border border-green-100' : 'pb-6'}`}>
                  {/* Timeline Line & Dot */}
                  <div className="relative flex-shrink-0">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center z-10 relative ${isHighlighted ? 'bg-green-600' : 'bg-primary'}`}>
                      <span className="material-symbols-outlined text-[10px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                    </div>
                    {/* Vertical line connecting dots */}
                    {!isLast && !isHighlighted && (
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-px h-full bg-outline-variant/30"></div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 -mt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-mono text-[11px] uppercase tracking-tighter ${isHighlighted ? 'text-green-700' : 'text-on-surface-variant'}`}>
                        {step.time}
                      </span>
                      <div className={`h-[1px] w-4 ${isHighlighted ? 'bg-green-200' : 'bg-outline-variant'}`}></div>
                      <div className={`flex items-center gap-1 ${isHighlighted ? 'text-green-800' : 'text-primary'}`}>
                        <span className="material-symbols-outlined text-[18px]">{step.icon}</span>
                        <span className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold">
                          {isHi ? step.labelHi : step.label}
                        </span>
                      </div>
                    </div>
                    <p className={`text-[13px] leading-[18px] pl-0 ${isHighlighted ? 'text-green-900/70' : 'text-on-surface-variant'}`}>
                      {isHi ? step.descHi : step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer / Action Area */}
        <div className="px-6 py-4 bg-surface-container-low border-t border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <span className="text-[13px] leading-[18px] text-on-surface-variant">
              {isHi ? 'अंतिम सफल रन:' : 'Last successful run:'} <span className="font-mono text-primary font-bold">24 OCT 2023, 02:09:41</span>
            </span>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-surface-container-lowest border border-outline-variant text-on-surface-variant text-[12px] leading-[16px] tracking-[0.05em] font-semibold rounded-lg hover:bg-surface-variant transition-colors">
              {isHi ? 'रिपोर्ट डाउनलोड करें' : 'DOWNLOAD REPORT'}
            </button>
            <button className="px-4 py-2 bg-primary text-white text-[12px] leading-[16px] tracking-[0.05em] font-semibold rounded-lg hover:bg-primary-container transition-colors shadow-sm">
              {isHi ? 'पाइपलाइन फिर से चलाएं' : 'RERUN PIPELINE'}
            </button>
          </div>
        </div>
      </div>

      {/* Context Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-surface-container border border-outline-variant rounded-xl">
          <p className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant mb-1 uppercase">
            {isHi ? 'कंप्यूट लोड' : 'COMPUTE LOAD'}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-[36px] leading-[44px] tracking-[-0.02em] font-bold text-primary">12.4%</span>
            <span className="text-green-600 text-[12px] leading-[16px] tracking-[0.05em] font-semibold">{isHi ? 'इष्टतम' : 'Optimal'}</span>
          </div>
        </div>
        
        <div className="p-4 bg-surface-container border border-outline-variant rounded-xl">
          <p className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant mb-1 uppercase">
            {isHi ? 'डेटा सिंक लेटेंसी' : 'DATA SYNC LATENCY'}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-[36px] leading-[44px] tracking-[-0.02em] font-bold text-primary">0.8s</span>
            <span className="text-green-600 text-[12px] leading-[16px] tracking-[0.05em] font-semibold">{isHi ? 'उत्कृष्ट' : 'Excellent'}</span>
          </div>
        </div>
        
        <div className="p-4 bg-surface-container border border-outline-variant rounded-xl">
          <p className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant mb-1 uppercase">
            {isHi ? 'एआई एजेंट स्थिति' : 'AI AGENT STATUS'}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-[36px] leading-[44px] tracking-[-0.02em] font-bold text-primary">ACTIVE</span>
            <span className="material-symbols-outlined text-green-600 animate-pulse">cloud_done</span>
          </div>
        </div>
      </div>
    </div>
  );
}
