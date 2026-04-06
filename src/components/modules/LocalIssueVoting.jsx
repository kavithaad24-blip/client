import { useState } from 'react';

const LocalIssueVoting = () => {
  const [issues, setIssues] = useState([
    { id: 1, title: 'Fix Potholes on Main St', votes: 342, hasVoted: false },
    { id: 2, title: 'Upgrade Street Lights in Zone 4', votes: 215, hasVoted: false },
    { id: 3, title: 'Park Maintenance Required', votes: 189, hasVoted: true },
  ]);

  const handleVote = (id) => {
    setIssues(issues.map(issue => {
      if (issue.id === id) {
        if (issue.hasVoted) {
          return { ...issue, votes: issue.votes - 1, hasVoted: false };
        } else {
          return { ...issue, votes: issue.votes + 1, hasVoted: true };
        }
      }
      return issue;
    }).sort((a, b) => b.votes - a.votes));
  };

  return (
    <div className="glass-panel p-6 transform hover:-translate-y-2 transition-all duration-300 relative h-full">
      <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-neon-purple/10 rounded-full blur-3xl"></div>
      
      <h2 className="text-xl font-bold tracking-wide mb-6 flex items-center gap-2 relative z-10">
        <svg className="w-6 h-6 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Community Prioritization
      </h2>
      
      <div className="space-y-4 relative z-10">
        {issues.map((issue, index) => (
          <div key={issue.id} className="glass-card p-4 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="text-xl font-bold text-gray-500 font-mono w-6">0{index + 1}</div>
              <div>
                <h3 className="font-semibold text-gray-200 group-hover:text-white transition-colors">{issue.title}</h3>
                <div className="text-xs text-gray-500 font-mono mt-1 flex items-center gap-2">
                   <svg className="w-3 h-3 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                   {issue.votes} Verified Citizens
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => handleVote(issue.id)}
              className={`flex flex-col items-center justify-center w-10 h-10 rounded-lg transition-all ${
                issue.hasVoted 
                  ? 'bg-neon-purple/20 border border-neon-purple text-neon-purple shadow-[0_0_10px_rgba(192,132,252,0.5)]' 
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:border-neon-blue/50 hover:text-neon-blue hover:shadow-[0_0_10px_rgba(56,189,248,0.3)]'
              }`}
            >
              <svg className={`w-5 h-5 ${issue.hasVoted ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocalIssueVoting;
