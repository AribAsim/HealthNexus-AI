interface Leader {
  rank: number;
  name: string;
  nameHi: string;
  block: string;
  blockHi: string;
  score: number;
  trend: number;
  status: string;
  statusHi: string;
  statusColor: string;
}

const LEADERS: Leader[] = [
  {
    rank: 1,
    name: 'District Hospital City Centre',
    nameHi: 'जिला अस्पताल शहर केंद्र',
    block: 'Urban-1',
    blockHi: 'शहरी-1',
    score: 94,
    trend: 4,
    status: 'Excellent',
    statusHi: 'उत्कृष्ट',
    statusColor: 'bg-green-100 text-green-800'
  },
  {
    rank: 2,
    name: 'PHC Civil Lines',
    nameHi: 'पीएचसी सिविल लाइंस',
    block: 'North Block',
    blockHi: 'उत्तरी ब्लॉक',
    score: 89,
    trend: 2,
    status: 'Excellent',
    statusHi: 'उत्कृष्ट',
    statusColor: 'bg-green-100 text-green-800'
  },
  {
    rank: 3,
    name: 'CHC Industrial Area',
    nameHi: 'सीएचसी औद्योगिक क्षेत्र',
    block: 'East Block',
    blockHi: 'पूर्वी ब्लॉक',
    score: 82,
    trend: -3,
    status: 'Good',
    statusHi: 'अच्छा',
    statusColor: 'bg-secondary-container text-on-secondary-container'
  },
  {
    rank: 4,
    name: 'PHC Rajgarh',
    nameHi: 'पीएचसी राजगढ़',
    block: 'South Rural',
    blockHi: 'दक्षिण ग्रामीण',
    score: 76,
    trend: 12,
    status: 'Good',
    statusHi: 'अच्छा',
    statusColor: 'bg-secondary-container text-on-secondary-container'
  },
  {
    rank: 5,
    name: 'HWC Kalyanpur',
    nameHi: 'एचडब्ल्यूसी कल्याणपुर',
    block: 'West Block',
    blockHi: 'पश्चिमी ब्लॉक',
    score: 61,
    trend: -5,
    status: 'Needs Attention',
    statusHi: 'ध्यान देने की आवश्यकता है',
    statusColor: 'bg-error-container text-on-error-container'
  },
  {
    rank: 6,
    name: 'PHC Rural Remote',
    nameHi: 'पीएचसी ग्रामीण सुदूर',
    block: 'Hill District',
    blockHi: 'पहाड़ी जिला',
    score: 42,
    trend: 0,
    status: 'Intervention Required',
    statusHi: 'हस्तक्षेप आवश्यक',
    statusColor: 'bg-error text-white'
  }
];

interface Props {
  language: string;
}

export default function PerformanceAnalytics({ language }: Props) {
  const isHi = language === 'hi';

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-[#D4AF37]';
      case 2: return 'text-[#C0C0C0]';
      case 3: return 'text-[#CD7F32]';
      default: return 'text-on-surface-variant';
    }
  };

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-outline-variant pb-4">
        <div className="flex gap-4">
          <div className="w-14 h-14 bg-primary-container rounded-xl flex items-center justify-center text-on-primary shrink-0">
            <span className="material-symbols-outlined text-[32px]">emoji_events</span>
          </div>
          <div>
            <h1 className="text-[24px] leading-[32px] tracking-[-0.01em] font-semibold text-primary">
              {isHi ? 'जिला सुविधा प्रदर्शन लीडरबोर्ड' : 'District Facility Performance Leaderboard'}
            </h1>
            <p className="text-[14px] leading-[20px] text-on-surface-variant">
              {isHi ? 'समग्र परिचालन स्कोर के आधार पर एआई-रैंक वाले स्वास्थ्य केंद्र' : 'AI-ranked health centres based on composite operational scores'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full shrink-0">
          <span className="material-symbols-outlined text-green-700 text-[14px]">trending_up</span>
          <span className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-green-800">
            {isHi ? 'सबसे उन्नत: पीएचसी राजगढ़ ↑12 अंक' : 'Most Improved: PHC Rajgarh ↑12 pts'}
          </span>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 border-b border-outline-variant">
                <th className="px-6 py-4 text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase">{isHi ? 'रैंक' : 'Rank'}</th>
                <th className="px-6 py-4 text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase">{isHi ? 'सुविधा और ब्लॉक' : 'Facility & Block'}</th>
                <th className="px-6 py-4 text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase">{isHi ? 'स्कोर' : 'Score'}</th>
                <th className="px-6 py-4 text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase">{isHi ? 'प्रदर्शन प्रवृत्ति' : 'Performance Trend'}</th>
                <th className="px-6 py-4 text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase">{isHi ? 'स्थिति' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {LEADERS.map((leader) => (
                <tr 
                  key={leader.rank} 
                  className={`transition-colors ${
                    leader.rank === 6 ? 'bg-red-50/10 hover:bg-red-50/30 border-l-4 border-error' : 
                    leader.rank === 1 ? 'hover:bg-slate-50 border-l-4 border-[#D4AF37]' : 
                    'hover:bg-slate-50 border-l-4 border-transparent'
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {leader.rank <= 3 ? (
                        <>
                          <span className={`material-symbols-outlined ${getRankColor(leader.rank)}`} style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                          <span className={`text-[24px] leading-[32px] tracking-[-0.01em] font-bold ${getRankColor(leader.rank)}`}>{leader.rank}</span>
                        </>
                      ) : (
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold ${leader.rank === 6 ? 'bg-error-container text-error' : 'bg-slate-100 text-on-surface-variant'}`}>
                          {leader.rank}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className={`text-[20px] leading-[28px] font-semibold ${leader.rank === 6 ? 'text-error' : 'text-on-surface'}`}>
                      {isHi ? leader.nameHi : leader.name}
                    </p>
                    <p className="text-[13px] leading-[18px] text-on-surface-variant mt-0.5">
                      {isHi ? 'ब्लॉक' : 'Block'}: {isHi ? leader.blockHi : leader.block}
                    </p>
                    {leader.rank === 6 && (
                      <span className="mt-1 inline-block text-[10px] bg-error text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                        {isHi ? 'हस्तक्षेप आवश्यक' : 'Intervention Required'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className={`text-[20px] leading-[32px] font-bold tracking-[-0.01em] ${leader.rank === 6 ? 'text-error' : 'text-primary'}`}>
                        {leader.score}/100
                      </p>
                      <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${leader.rank === 6 ? 'bg-error' : leader.rank === 5 ? 'bg-secondary' : 'bg-primary'}`} 
                          style={{ width: `${leader.score}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {leader.trend !== 0 && (
                      <div className={`flex items-center gap-1 text-[12px] leading-[16px] tracking-[0.05em] font-semibold ${leader.trend > 0 ? 'text-green-700' : 'text-red-700'}`}>
                        <span className="material-symbols-outlined text-[16px]">
                          {leader.trend > 0 ? 'arrow_upward' : 'arrow_downward'}
                        </span>
                        <span>{Math.abs(leader.trend)} {isHi ? 'अंक' : 'pts'}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-tighter ${leader.statusColor}`}>
                      {isHi ? leader.statusHi : leader.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
