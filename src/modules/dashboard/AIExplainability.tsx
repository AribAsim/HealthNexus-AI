import { useState } from 'react';

interface Explanation {
  action: string;
  actionHi: string;
  prediction: string;
  predictionHi: string;
  confidence: number;
  explanation: string;
  explanationHi: string;
  recommendedAction: string;
  recommendedActionHi: string;
  evidencePoints: string[];
  evidencePointsHi: string[];
}

const EXPLANATIONS: Explanation[] = [
  {
    action: 'Transfer Amoxicillin → PHC Alpha',
    actionHi: 'एमोक्सिसिलिन ट्रांसफर → PHC Alpha',
    prediction: 'Stock-out in 6 days',
    predictionHi: '6 दिनों में स्टॉक-आउट',
    confidence: 94,
    explanation:
      'PHC Alpha\'s current Amoxicillin stock of 48 units, combined with a 7-day average daily usage of 8 units and a 2-day resupply delay, results in a projected stock-out within 6 days. CHC Beta holds 3× its buffer, making it the nearest viable donor.',
    explanationHi: 'PHC Alpha का वर्तमान एमोक्सिसिलिन स्टॉक 48 इकाइयाँ है। 7-दिन के औसत दैनिक उपयोग 8 इकाइयाँ और 2-दिन की आपूर्ति देरी के साथ, 6 दिनों के भीतर स्टॉक खत्म हो जाएगा। CHC Beta के पास 3 गुना बफर है, जो इसे निकटतम व्यवहार्य दाता बनाता है।',
    recommendedAction: 'Inter-facility Transfer: 500 Units Amoxicillin from CHC Beta via V-102.',
    recommendedActionHi: 'अंतर-सुविधा स्थानांतरण: V-102 के माध्यम से CHC Beta से 500 यूनिट एमोक्सिसिलिन।',
    evidencePoints: [
      'PHC Alpha Amoxicillin stock: 48 units',
      'Average daily consumption (Normal): 12 units/day',
      'Current consumption (Observed): 19 units/day',
      'Weather correlation: +15% humidity increase (linked to ARI)',
      'Supply lead time: 14 days (next scheduled delivery)'
    ],
    evidencePointsHi: [
      'PHC Alpha एमोक्सिसिलिन स्टॉक: 48 इकाइयाँ',
      'औसत दैनिक खपत (सामान्य): 12 इकाइयाँ/दिन',
      'वर्तमान खपत (प्रेक्षित): 19 इकाइयाँ/दिन',
      'मौसम सहसंबंध: +15% आर्द्रता वृद्धि (ARI से जुड़ा)',
      'आपूर्ति लीड समय: 14 दिन (अगली निर्धारित डिलीवरी)'
    ],
  },
  {
    action: 'Dengue Alert — Tijara Block',
    actionHi: 'डेंगू अलर्ट — तिजारा ब्लॉक',
    prediction: 'Outbreak probability: 73%',
    predictionHi: 'प्रकोप की संभावना: 73%',
    confidence: 73,
    explanation:
      'Symptom cluster analysis across 3 PHCs in Tijara Block detected a 340% surge in fever + joint pain cases over 5 days. Cross-referenced with monsoon vector data and historical outbreak patterns from 2023, the model identifies an early-stage dengue transmission event.',
    explanationHi: 'तिजारा ब्लॉक में 3 PHC में लक्षण क्लस्टर विश्लेषण ने 5 दिनों में बुखार + जोड़ों के दर्द के मामलों में 340% की वृद्धि का पता लगाया। 2023 के मानसून वेक्टर डेटा और ऐतिहासिक प्रकोप पैटर्न के साथ क्रॉस-रेफरेंस करने पर, मॉडल ने डेंगू संचरण घटना की पहचान की।',
    recommendedAction: 'Deploy vector control team to Tijara. Increase ORS supply.',
    recommendedActionHi: 'तिजारा में वेक्टर नियंत्रण दल तैनात करें। ओआरएस की आपूर्ति बढ़ाएँ।',
    evidencePoints: [
      'Fever + joint pain cases: ↑ 340% over 5 days in Tijara',
      '3 PHCs reporting similar cluster',
      'Monsoon season — peak Aedes density period',
      '2023 outbreak: same cluster pattern 8 days prior',
      'Existing ORS stock at Tijara: critical (12 days remaining)'
    ],
    evidencePointsHi: [
      'बुखार + जोड़ों के दर्द के मामले: तिजारा में 5 दिनों में ↑ 340%',
      '3 PHC समान क्लस्टर की रिपोर्ट कर रहे हैं',
      'मानसून का मौसम — चरम एडीज घनत्व अवधि',
      '2023 का प्रकोप: 8 दिन पहले समान क्लस्टर पैटर्न',
      'तिजारा में मौजूदा ORS स्टॉक: गंभीर (12 दिन शेष)'
    ]
  },
  {
    action: 'Staff Shortage — Mundawar Block',
    actionHi: 'कर्मचारी की कमी — मुंडावर ब्लॉक',
    prediction: '3 PHCs under-staffed by next week',
    predictionHi: 'अगले सप्ताह तक 3 PHC में कम कर्मचारी',
    confidence: 88,
    explanation:
      'Attendance logs show 4 doctors on approved leave simultaneously next week across Mundawar block PHCs. Average daily OPD load of 85 patients per doctor would result in 255+ unserved patients per day if no redistribution occurs.',
    explanationHi: 'उपस्थिति लॉग बताते हैं कि मुंडावर ब्लॉक PHC में अगले सप्ताह एक साथ 4 डॉक्टर स्वीकृत अवकाश पर हैं। प्रति डॉक्टर 85 मरीजों के औसत दैनिक ओपीडी लोड के परिणामस्वरूप प्रति दिन 255+ मरीज बिना सेवा के रह जाएंगे।',
    recommendedAction: 'Request 2 mobile medical units from District HQ. Activate teleconsultation.',
    recommendedActionHi: 'जिला मुख्यालय से 2 मोबाइल मेडिकल यूनिट का अनुरोध करें। टेलीकंसल्टेशन सक्रिय करें।',
    evidencePoints: [
      '4 doctors on leave: 12–19 July',
      'Mundawar block PHCs: PHC-M1, PHC-M2, PHC-M3',
      'Average OPD load: 85 patients/doctor/day',
      'Teleconsultation infrastructure available at PHC-M3',
      'District mobile unit fleet: 2 available'
    ],
    evidencePointsHi: [
      'अवकाश पर 4 डॉक्टर: 12-19 जुलाई',
      'मुंडावर ब्लॉक PHCs: PHC-M1, PHC-M2, PHC-M3',
      'औसत ओपीडी लोड: 85 मरीज/डॉक्टर/दिन',
      'PHC-M3 पर टेलीकंसल्टेशन इंफ्रास्ट्रक्चर उपलब्ध है',
      'जिला मोबाइल यूनिट फ्लीट: 2 उपलब्ध'
    ]
  },
];

interface Props {
  language: string;
  transferApproved: boolean;
}

export default function AIExplainability({ language, transferApproved }: Props) {
  const [selected, setSelected] = useState(0);
  const isHi = language === 'hi';
  const exp = EXPLANATIONS[selected];

  const confidenceColor =
    exp.confidence >= 85 ? 'text-error bg-error' :
    exp.confidence >= 65 ? 'text-amber-600 bg-amber-500' :
    'text-green-600 bg-green-500';

  const textColorOnly = 
    exp.confidence >= 85 ? 'text-error' :
    exp.confidence >= 65 ? 'text-amber-600' :
    'text-green-600';

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
          </div>
          <h1 className="text-[24px] leading-[32px] tracking-[-0.01em] font-semibold text-on-surface">
            {isHi ? 'एआई निर्णय व्याख्या पैनल' : 'AI Decision Explainability Panel'}
          </h1>
        </div>
        <p className="text-[14px] leading-[20px] text-on-surface-variant pl-12">
          {isHi ? '"यह सिफारिश क्यों?" — साक्ष्य-समर्थित एआई तर्क' : '"Why this recommendation?" — evidence-backed AI reasoning'}
        </p>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex flex-wrap gap-4">
        {EXPLANATIONS.map((e, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`px-6 py-2 rounded-full text-[12px] leading-[16px] tracking-[0.05em] font-semibold transition-all ${
              selected === i
                ? 'bg-primary text-white shadow-sm'
                : 'bg-surface-container text-on-surface-variant border border-outline-variant hover:bg-surface-container-high'
            }`}
          >
            {isHi ? e.actionHi : e.action}
          </button>
        ))}
      </div>

      {/* MAIN PANEL (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Prediction */}
        <div className="lg:col-span-5 bg-white border border-outline-variant rounded-xl p-6 flex flex-col gap-6 h-full shadow-sm">
          <div className="flex justify-between items-end">
            <h3 className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase">
              {isHi ? 'पूर्वानुमान' : 'Prediction'}
            </h3>
            <span className={`font-mono text-[13px] leading-[18px] font-bold ${textColorOnly}`}>
              {exp.confidence}% {isHi ? 'विश्वास' : 'confidence'}
            </span>
          </div>
          <div className="space-y-2">
            <div className="w-full h-4 bg-surface-container rounded-full overflow-hidden">
              <div className={`${confidenceColor.split(' ')[1]} h-full rounded-full relative transition-all duration-700`} style={{ width: `${exp.confidence}%` }}>
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
            <p className="text-[36px] leading-[44px] tracking-[-0.02em] font-bold text-on-surface mt-2">
              {isHi ? exp.predictionHi : exp.prediction}
            </p>
          </div>
          <div className="mt-auto pt-6">
            <div className="bg-surface-container-low border border-outline-variant/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-on-surface-variant text-sm">psychology</span>
                <span className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase">
                  {isHi ? 'एआई व्याख्या' : 'AI Explanation'}
                </span>
              </div>
              <p className="text-[14px] leading-[20px] text-on-surface-variant italic">
                "{isHi ? exp.explanationHi : exp.explanation}"
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Evidence Points */}
        <div className="lg:col-span-7 bg-white border border-outline-variant rounded-xl p-6 flex flex-col gap-6 h-full shadow-sm">
          <h3 className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase">
            {isHi ? 'साक्ष्य बिंदु' : 'Evidence Points'}
          </h3>
          <ul className="space-y-4 flex-1">
            {(isHi ? exp.evidencePointsHi : exp.evidencePoints).map((pt, i) => (
              <li key={i} className="flex items-start gap-4">
                <div className="mt-0.5 shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[16px]">data_check</span>
                </div>
                <div className="flex-1 border-b border-surface-container-high pb-4">
                  <span className="text-[14px] leading-[20px] text-on-surface">{pt}</span>
                </div>
              </li>
            ))}
          </ul>
          
          {/* RECOMMENDED ACTION BOX */}
          <div className={`mt-auto border rounded-lg p-6 ${transferApproved && selected === 0 ? 'bg-green-50 border-green-200' : 'bg-secondary-container/30 border-secondary-container'}`}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-secondary-fixed-variant uppercase">
                  {isHi ? 'अनुशंसित कार्रवाई' : 'Recommended Action'}
                </span>
                <p className={`text-[20px] leading-[28px] font-semibold mt-1 ${transferApproved && selected === 0 ? 'text-green-800' : 'text-primary'}`}>
                  {isHi ? exp.recommendedActionHi : exp.recommendedAction}
                </p>
              </div>
              {transferApproved && selected === 0 && (
                <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full shrink-0">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span className="text-[10px] leading-[16px] tracking-[0.05em] font-semibold uppercase">{isHi ? 'निष्पादित' : 'Executed'}</span>
                </div>
              )}
            </div>
            {selected === 0 && (
              <div className="flex items-center gap-4 text-[13px] leading-[18px] text-on-surface-variant mt-2">
                <span>{isHi ? 'स्रोत: CHC मुंडावर' : 'Source: CHC Mundawar'}</span>
                <span className="w-1.5 h-1.5 bg-outline-variant rounded-full"></span>
                <span>{isHi ? 'अनुमानित समय: 4 घंटे' : 'ETA: 4 Hours'}</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
