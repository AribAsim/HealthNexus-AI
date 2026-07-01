
interface Props {
  language: string;
  onExecuteAIResponse: () => void;
  transferApproved: boolean;
}

export default function ExecutiveIntelligence({ language, onExecuteAIResponse, transferApproved }: Props) {
  const isHi = language === 'hi';

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-primary-container text-on-primary-container rounded-xl">
            <span className="material-symbols-outlined text-3xl">shield_health</span>
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-primary tracking-tight">
              {isHi ? 'मुख्य कार्यकारी स्वास्थ्य खुफिया' : 'Executive Health Intelligence'}
            </h2>
            <p className="text-xs text-on-surface-variant">
              {isHi ? 'जिला स्तरीय स्वास्थ्य स्कोर और परिचालन प्राथमिकताएं' : 'District-level health score & operational priorities'}
            </p>
          </div>
        </div>

        {/* District Health Score Card */}
        <div className="flex items-center space-x-4 bg-surface-container-low px-4 py-2 rounded-xl border border-outline-variant">
          <div className="text-center">
            <div className="text-[10px] font-bold text-secondary uppercase tracking-wider">{isHi ? 'जिला स्वास्थ्य स्कोर' : 'District Health Score'}</div>
            <div className="font-display-lg text-3xl font-black text-primary">
              {transferApproved ? '91' : '86'}/100
            </div>
          </div>
          <div className="text-xs text-green-600 font-bold flex flex-col items-center">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>{transferApproved ? '↑ 5 pts' : '↑ 4 pts'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Subscores */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-secondary uppercase tracking-wider">{isHi ? 'प्रदर्शन उप-स्कोर' : 'Subscores'}</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span>{isHi ? 'दवा उपलब्धता' : 'Medicine Availability'}</span>
              <span className="font-bold">92%</span>
            </div>
            <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full" style={{ width: '92%' }} />
            </div>

            <div className="flex justify-between">
              <span>{isHi ? 'कर्मचारी उपलब्धता' : 'Staff Availability'}</span>
              <span className="font-bold">88%</span>
            </div>
            <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full" style={{ width: '88%' }} />
            </div>

            <div className="flex justify-between">
              <span>{isHi ? 'बिस्तर क्षमता' : 'Bed Capacity'}</span>
              <span className="font-bold">81%</span>
            </div>
            <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full" style={{ width: '81%' }} />
            </div>
          </div>
        </div>

        {/* AI Top Priorities */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-secondary uppercase tracking-wider">{isHi ? 'एआई सर्वोच्च प्राथमिकताएं' : 'AI Top Priorities'}</h3>
          <ul className="space-y-2 text-xs">
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-sm text-error mt-0.5">priority_high</span>
              <span>{isHi ? 'PHC Alpha को एमोक्सिसिलिन ट्रांसफर करें' : 'Transfer 50 Amoxicillin boxes to PHC Alpha'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-sm text-amber-600 mt-0.5">trending_flat</span>
              <span>{isHi ? 'मुंडावर में अतिरिक्त डॉक्टर तैनात करें' : 'Deploy additional staff to Mundawar block'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-sm text-green-600 mt-0.5">check</span>
              <span>{isHi ? 'तिजारा में डेंगू क्लस्टर की जांच करें' : 'Monitor Dengue vectors in Tijara'}</span>
            </li>
          </ul>
        </div>

        {/* Savings & Impact Dashboard */}
        <div className="bg-primary-container/20 border border-primary-container/40 rounded-xl p-4 flex flex-col justify-between">
          <div className="space-y-2 text-xs">
            <span className="font-extrabold text-primary block">{isHi ? 'अनुमानित परिचालन प्रभाव' : 'Estimated Operational Impact'}</span>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-white/80 p-2 rounded border border-outline-variant text-center">
                <span className="text-[10px] text-secondary uppercase font-bold block">{isHi ? 'सहेजे गए जीवन' : 'Lives Impacted'}</span>
                <span className="font-extrabold text-sm text-primary">120+</span>
              </div>
              <div className="bg-white/80 p-2 rounded border border-outline-variant text-center">
                <span className="text-[10px] text-secondary uppercase font-bold block">{isHi ? 'लागत बचत' : 'Cost Saved'}</span>
                <span className="font-extrabold text-sm text-primary">₹45k</span>
              </div>
            </div>
          </div>

          <button
            onClick={onExecuteAIResponse}
            disabled={transferApproved}
            className={`w-full mt-4 py-2.5 rounded-xl font-extrabold text-xs shadow transition-all cursor-pointer text-center ${
              transferApproved 
              ? 'bg-green-100 text-green-800 border border-green-300 cursor-not-allowed' 
              : 'bg-primary text-white hover:opacity-90'
            }`}
          >
            {transferApproved 
             ? (isHi ? 'प्रतिक्रिया निष्पादित' : 'AI Response Executed') 
             : (isHi ? 'एआई प्रतिक्रिया निष्पादित करें' : 'Execute AI Response')}
          </button>
        </div>
      </div>
    </div>
  );
}
