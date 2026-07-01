

interface Props {
  language: string;
}

export default function PerformanceAnalytics({ language }: Props) {
  const isHi = language === 'hi';

  const leaders = [
    { rank: 1, name: 'CHC Tijara', score: 96, status: 'Best Managed', trend: '↑ 2' },
    { rank: 2, name: 'PHC Mundawar', score: 91, status: 'Most Improved', trend: '↑ 8' },
    { rank: 3, name: 'PHC Sarita Vihar', score: 88, status: 'Fastest Reporting', trend: '↑ 3' }
  ];

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-outline-variant pb-3">
        <div className="flex items-center space-x-2 text-primary font-headline-sm text-base">
          <span className="material-symbols-outlined text-xl text-primary">leaderboard</span>
          <h3>{isHi ? 'जिला सुविधा लीडरबोर्ड' : 'District Performance Leaderboard'}</h3>
        </div>
      </div>

      <div className="space-y-3">
        {leaders.map((lead, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl border border-outline-variant text-xs">
            <div className="flex items-center space-x-3">
              <span className="font-extrabold text-sm text-primary">#{lead.rank}</span>
              <div>
                <span className="font-bold block text-primary">{lead.name}</span>
                <span className="text-[10px] text-secondary font-bold uppercase">{lead.status}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className="text-[10px] text-on-surface-variant block uppercase tracking-wider">Score</span>
                <span className="font-extrabold text-primary">{lead.score}/100</span>
              </div>
              <div className="text-green-600 font-bold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-xs">trending_up</span>
                <span>{lead.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
