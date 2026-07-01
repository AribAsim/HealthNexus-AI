interface Props {
  language: string;
  onExecuteAIResponse: () => void;
  transferApproved: boolean;
}

export default function ExecutiveIntelligence({ language, onExecuteAIResponse, transferApproved }: Props) {
  const isHi = language === 'hi';

  return (
    <section className="space-y-6">
      <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        {/* Top Row */}
        <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-outline-variant">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-container/10 rounded-full flex items-center justify-center text-primary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
            </div>
            <div>
              <h1 className="text-[24px] leading-[32px] tracking-[-0.01em] font-semibold text-on-surface">
                {isHi ? 'मुख्य कार्यकारी स्वास्थ्य खुफिया' : 'Executive Health Intelligence'}
              </h1>
              <p className="text-[13px] leading-[18px] text-on-surface-variant">
                {isHi ? 'जिला स्तरीय स्वास्थ्य स्कोर और परिचालन प्राथमिकताएं' : 'District-level health score & operational priorities'}
              </p>
            </div>
          </div>
          <div className="flex items-center bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant">
            <span className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase mr-2">
              {isHi ? 'जिला स्वास्थ्य स्कोर:' : 'District Health Score:'}
            </span>
            <span className="text-[36px] leading-[44px] tracking-[-0.02em] font-bold text-primary mr-4">
              {transferApproved ? '91' : '86'}/100
            </span>
            <span className="flex items-center text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-lg">
              <span className="material-symbols-outlined text-[16px] mr-1">trending_up</span>
              {transferApproved ? '↑ 5 pts' : '↑ 4 pts'}
            </span>
          </div>
        </div>

        {/* 3 Column Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-x divide-outline-variant">
          {/* Column 1: Subscores */}
          <div className="p-6 space-y-6">
            <h3 className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase">
              {isHi ? 'प्रदर्शन उप-स्कोर' : 'Subscores'}
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[14px] leading-[20px] text-on-surface">{isHi ? 'दवा उपलब्धता' : 'Medicine Availability'}</span>
                  <span className="text-[13px] leading-[18px] font-medium text-primary font-mono">92%</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[14px] leading-[20px] text-on-surface">{isHi ? 'कर्मचारी उपलब्धता' : 'Staff Availability'}</span>
                  <span className="text-[13px] leading-[18px] font-medium text-primary font-mono">88%</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: '88%' }}></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[14px] leading-[20px] text-on-surface">{isHi ? 'बिस्तर क्षमता' : 'Bed Capacity'}</span>
                  <span className="text-[13px] leading-[18px] font-medium text-primary font-mono">81%</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: '81%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: AI Top Priorities */}
          <div className="p-6 space-y-6 bg-surface-bright">
            <h3 className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase">
              {isHi ? 'एआई सर्वोच्च प्राथमिकताएं' : 'AI Top Priorities'}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-4 p-2 bg-white rounded-lg border border-red-100 shadow-sm transition-transform hover:-translate-y-1">
                <span className="material-symbols-outlined text-error mt-0.5">priority_high</span>
                <span className="text-[14px] leading-[20px] font-medium text-on-surface">
                  {isHi ? 'PHC Alpha को एमोक्सिसिलिन ट्रांसफर करें' : 'Transfer 50 Amoxicillin boxes to PHC Alpha'}
                </span>
              </li>
              <li className="flex items-start gap-4 p-2 bg-white rounded-lg border border-amber-100 shadow-sm transition-transform hover:-translate-y-1">
                <span className="material-symbols-outlined text-amber-600 mt-0.5">warning</span>
                <span className="text-[14px] leading-[20px] font-medium text-on-surface">
                  {isHi ? 'मुंडावर में अतिरिक्त डॉक्टर तैनात करें' : 'Deploy staff to Mundawar block'}
                </span>
              </li>
              <li className="flex items-start gap-4 p-2 bg-white rounded-lg border border-emerald-100 shadow-sm transition-transform hover:-translate-y-1">
                <span className="material-symbols-outlined text-emerald-600 mt-0.5">check_circle</span>
                <span className="text-[14px] leading-[20px] font-medium text-on-surface">
                  {isHi ? 'तिजारा में डेंगू क्लस्टर की जांच करें' : 'Monitor Dengue vectors in Tijara'}
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3: Estimated Operational Impact */}
          <div className="p-6 space-y-6">
            <h3 className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase">
              {isHi ? 'अनुमानित परिचालन प्रभाव' : 'Estimated Operational Impact'}
            </h3>
            <div className="bg-secondary-container/30 p-6 rounded-xl border border-secondary-container space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-outline-variant">
                  <p className="text-[13px] leading-[18px] text-secondary mb-1">{isHi ? 'सहेजे गए जीवन' : 'Lives Impacted'}</p>
                  <p className="text-[28px] leading-tight font-bold text-primary">120+</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-outline-variant">
                  <p className="text-[13px] leading-[18px] text-secondary mb-1">{isHi ? 'लागत बचत' : 'Cost Saved'}</p>
                  <p className="text-[28px] leading-tight font-bold text-primary">₹45k</p>
                </div>
              </div>
              <button
                onClick={onExecuteAIResponse}
                disabled={transferApproved}
                className={`w-full py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-4 transition-all ${
                  transferApproved
                    ? 'bg-emerald-600 text-white cursor-not-allowed'
                    : 'bg-primary text-white hover:shadow-lg active:scale-[0.98]'
                }`}
              >
                <span className="material-symbols-outlined">{transferApproved ? 'check_circle' : 'bolt'}</span>
                {transferApproved
                  ? (isHi ? 'प्रतिक्रिया निष्पादित' : 'Actions Executed')
                  : (isHi ? 'एआई प्रतिक्रिया निष्पादित करें' : 'Execute AI Response')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
