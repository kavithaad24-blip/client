import { useState, useEffect } from 'react';

const LocalIssueVoting = ({ language = 'en' }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(null);
  const [stats, setStats] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  // New Issue Form State
  const [newIssue, setNewIssue] = useState({ title: '', description: '', category: 'Roads' });

  const headingTranslations = {
    en: 'Community Prioritization',
    ta: 'சமூக முன்னுரிமை (Community Prioritization)',
    ml: 'കമ്മ്യൂണിറ്റി മുൻഗണനകൾ',
    te: 'సంఘం ప్రాధాన్యతలు',
    kn: 'ಸಮುದಾಯದ ಆದ್ಯತೆಗಳು',
    hi: 'सामुदायिक प्राथमिकताएँ'
  };

  // Initialize with some mock data
  const initialIssues = [
    { id: 1, title: 'Fix Dangerous Pothole on Main St.', description: 'Large pothole causing accidents near the junction.', category: 'Roads', vote_count: 145, has_voted: false },
    { id: 2, title: 'Broken Street Lights in Area 4', description: 'Street lights have been non-functional for 2 weeks.', category: 'Lighting', vote_count: 89, has_voted: false },
    { id: 3, title: 'Park Maintenance Required', description: 'Children playground equipment is damaged.', category: 'Public Spaces', vote_count: 42, has_voted: false },
    { id: 4, title: 'Clogged Drainage', description: 'Water stagnation causing mosquito breeding.', category: 'Sanitation', vote_count: 215, has_voted: false }
  ];

  // Fetch issues on component mount
  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = () => {
    setLoading(true);
    setTimeout(() => {
      // Use local storage to persist votes across reloads if desired, or just use initial array
      const storedIssues = localStorage.getItem('mockIssues');
      let currentIssues = initialIssues;
      if (storedIssues) {
        currentIssues = JSON.parse(storedIssues);
      } else {
        localStorage.setItem('mockIssues', JSON.stringify(initialIssues));
      }
      
      // Sort issues by vote count descending (Priority)
      currentIssues.sort((a, b) => b.vote_count - a.vote_count);
      
      setIssues(currentIssues);
      
      // Calculate mock stats
      const totalVotes = currentIssues.reduce((sum, issue) => sum + issue.vote_count, 0);
      setStats({
        total_issues: currentIssues.length,
        total_votes: totalVotes,
        avg_votes_per_issue: totalVotes / currentIssues.length
      });
      
      setLoading(false);
    }, 800);
  };

  const handleVote = (issueId) => {
    if (voting) return;

    setVoting(issueId);
    setTimeout(() => {
      const updatedIssues = issues.map(issue => {
        if (issue.id === issueId) {
          const isVoting = !issue.has_voted;
          return {
            ...issue,
            has_voted: isVoting,
            vote_count: isVoting ? issue.vote_count + 1 : issue.vote_count - 1
          };
        }
        return issue;
      });
      
      // Sort issues by vote count descending (Priority)
      updatedIssues.sort((a, b) => b.vote_count - a.vote_count);
      
      setIssues(updatedIssues);
      localStorage.setItem('mockIssues', JSON.stringify(updatedIssues));
      
      // Recalculate mock stats
      const totalVotes = updatedIssues.reduce((sum, issue) => sum + issue.vote_count, 0);
      setStats({
        total_issues: updatedIssues.length,
        total_votes: totalVotes,
        avg_votes_per_issue: totalVotes / updatedIssues.length
      });
      
      setVoting(null);
    }, 500);
  };

  const handleAddIssue = (e) => {
    e.preventDefault();
    if (!newIssue.title.trim() || !newIssue.description.trim()) return;

    const issueToAdd = {
      id: Date.now(), // Generate unique ID
      title: newIssue.title,
      description: newIssue.description,
      category: newIssue.category,
      vote_count: 1, // Auto upvote by creator
      has_voted: true
    };

    const updatedIssues = [...issues, issueToAdd];
    updatedIssues.sort((a, b) => b.vote_count - a.vote_count);
    
    setIssues(updatedIssues);
    localStorage.setItem('mockIssues', JSON.stringify(updatedIssues));
    
    // Recalculate mock stats
    const totalVotes = updatedIssues.reduce((sum, issue) => sum + issue.vote_count, 0);
    setStats({
      total_issues: updatedIssues.length,
      total_votes: totalVotes,
      avg_votes_per_issue: totalVotes / updatedIssues.length
    });

    setNewIssue({ title: '', description: '', category: 'Roads' });
    setShowForm(false);
  };

  const translations = {
    en: {
      reportBtn: '+ Report Issue',
      cancelBtn: 'Cancel',
      formTitle: 'Register New Local Issue',
      titleLabel: 'Issue Title',
      titlePlaceholder: 'E.g., Large pothole in XYZ street',
      descLabel: 'Description',
      descPlaceholder: 'Briefly describe the issue...',
      categoryLabel: 'Category',
      submitBtn: 'Submit Issue for Voting'
    },
    ta: {
      reportBtn: '+ புதிய பிரச்சினை',
      cancelBtn: 'ரத்து செய்',
      formTitle: 'புதிய உள்ளூர் பிரச்சினையை பதிவு செய்க',
      titleLabel: 'பிரச்சினையின் தலைப்பு',
      titlePlaceholder: 'உதா: XYZ தெருவில் பெரிய பள்ளம்',
      descLabel: 'விளக்கம்',
      descPlaceholder: 'பிரச்சினையை சுருக்கமாக விவரிக்கவும்...',
      categoryLabel: 'வகை',
      submitBtn: 'வாக்கெடுப்பிற்கு சமர்ப்பிக்கவும்'
    },
    ml: {
      reportBtn: '+ പ്രശ്നം റിപ്പോർട്ട് ചെയ്യുക', cancelBtn: 'റദ്ദാക്കുക', formTitle: 'പുതിയ പ്രാദേശിക പ്രശ്നം രജിസ്റ്റർ ചെയ്യുക',
      titleLabel: 'പ്രശ്നത്തിന്റെ തലക്കെട്ട്', titlePlaceholder: 'ഉദാ: XYZ സ്ട്രീറ്റിലെ വലിയ കുഴി', descLabel: 'വിവരണം', descPlaceholder: 'പ്രശ്നം ചുരുക്കത്തിൽ വിവരിക്കുക...', categoryLabel: 'വിഭാഗം', submitBtn: 'വോട്ടിംഗിനായി സമർപ്പിക്കുക'
    },
    te: {
      reportBtn: '+ సమస్యను నివేదించండి', cancelBtn: 'రద్దు చేయి', formTitle: 'కొత్త స్థానిక సమస్యను నమోదు చేయండి',
      titleLabel: 'సమస్య శీర్షిక', titlePlaceholder: 'ఉదా: XYZ వీధిలో పెద్ద గుంత', descLabel: 'వివరణ', descPlaceholder: 'సమస్యను క్లుప్తంగా వివరించండి...', categoryLabel: 'వర్గం', submitBtn: 'ఓటింగ్ కోసం సమర్పించండి'
    },
    kn: {
      reportBtn: '+ ಸಮಸ್ಯೆ ವರದಿ ಮಾಡಿ', cancelBtn: 'ರದ್ದುಮಾಡಿ', formTitle: 'ಹೊಸ ಸ್ಥಳೀಯ ಸಮಸ್ಯೆಯನ್ನು ನೋಂದಾಯಿಸಿ',
      titleLabel: 'ಸಮಸ್ಯೆ ಶೀರ್ಷಿಕೆ', titlePlaceholder: 'ಉದಾ: XYZ ಬೀದಿಯಲ್ಲಿ ದೊಡ್ಡ ಗುಂಡಿ', descLabel: 'ವಿವರಣೆ', descPlaceholder: 'ಸಮಸ್ಯೆಯನ್ನು ಸಂಕ್ಷಿಪ್ತವಾಗಿ ವಿವರಿಸಿ...', categoryLabel: 'ವರ್ಗ', submitBtn: 'ಮತದಾನಕ್ಕಾಗಿ ಸಲ್ಲಿಸಿ'
    },
    hi: {
      reportBtn: '+ मुद्दा दर्ज करें', cancelBtn: 'रद्द करें', formTitle: 'नया स्थानीय मुद्दा दर्ज करें',
      titleLabel: 'मुद्दे का शीर्षक', titlePlaceholder: 'उदा: XYZ गली में बड़ा गड्ढा', descLabel: 'विवरण', descPlaceholder: 'मुद्दे का संक्षेप में वर्णन करें...', categoryLabel: 'श्रेणी', submitBtn: 'वोटिंग के लिए सबमिट करें'
    }
  };

  const t = translations[language] || translations.en;

  return (
    <div className="glass-panel p-6 transform hover:-translate-y-2 transition-all duration-300 relative h-full">
      <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-neon-purple/10 rounded-full blur-3xl"></div>

      <div className="flex justify-between items-center mb-6 relative z-10">
        <h2 className="text-xl font-bold tracking-wide flex items-center gap-2">
          <svg className="w-6 h-6 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          {headingTranslations[language] || headingTranslations.en}
        </h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-neon-purple/20 text-neon-purple border border-neon-purple hover:bg-neon-purple/30 px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
        >
          {showForm ? t.cancelBtn : t.reportBtn}
        </button>
      </div>

      {/* New Issue Form */}
      {showForm && (
        <form onSubmit={handleAddIssue} className="bg-black/30 border border-white/10 rounded-xl p-5 mb-6 relative z-10 space-y-4">
          <h3 className="text-lg font-bold text-gray-200">{t.formTitle}</h3>
          <div>
             <label className="block text-sm text-gray-400 mb-1">{t.titleLabel}</label>
             <input type="text" value={newIssue.title} onChange={e => setNewIssue({...newIssue, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-purple outline-none" placeholder={t.titlePlaceholder} required />
          </div>
          <div>
             <label className="block text-sm text-gray-400 mb-1">{t.descLabel}</label>
             <textarea value={newIssue.description} onChange={e => setNewIssue({...newIssue, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-purple outline-none" rows="2" placeholder={t.descPlaceholder} required></textarea>
          </div>
          <div>
             <label className="block text-sm text-gray-400 mb-1">{t.categoryLabel}</label>
             <select value={newIssue.category} onChange={e => setNewIssue({...newIssue, category: e.target.value})} className="w-full bg-space-dark border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-purple outline-none">
                <option value="Roads">Roads & Infrastructure</option>
                <option value="Lighting">Street Lighting</option>
                <option value="Sanitation">Sanitation & Drainage</option>
                <option value="Public Spaces">Parks & Public Spaces</option>
                <option value="Others">Others</option>
             </select>
          </div>
          <button type="submit" className="w-full bg-neon-purple text-white font-bold py-2 rounded-lg hover:bg-neon-purple/80 transition-colors">
            {t.submitBtn}
          </button>
        </form>
      )}

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-3 gap-3 mb-6 relative z-10">
          <div className="bg-white/5 p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Active Issues</p>
            <p className="text-lg font-bold text-neon-purple">{stats.total_issues}</p>
          </div>
          <div className="bg-white/5 p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Total Votes</p>
            <p className="text-lg font-bold text-neon-blue">{stats.total_votes}</p>
          </div>
          <div className="bg-white/5 p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Avg Votes/Issue</p>
            <p className="text-lg font-bold text-neon-green">{Math.round(stats.avg_votes_per_issue || 0)}</p>
          </div>
        </div>
      )}

      <div className="space-y-4 relative z-10">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-purple"></div>
          </div>
        ) : issues.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p>No issues available for voting</p>
          </div>
        ) : (
          issues.map((issue, index) => (
            <div key={issue.id} className="glass-card p-4 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="text-xl font-bold text-gray-500 font-mono w-6">0{index + 1}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-200 group-hover:text-white transition-colors">{issue.title}</h3>
                  {issue.description && (
                    <p className="text-sm text-gray-400 mt-1">{issue.description}</p>
                  )}
                  <div className="flex items-center gap-4 mt-2">
                    <div className="text-xs text-gray-500 font-mono flex items-center gap-2">
                      <svg className="w-3 h-3 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      {issue.vote_count} Verified Citizens
                    </div>
                    {issue.category && (
                      <span className="px-2 py-1 bg-neon-purple/20 text-neon-purple text-xs rounded-full">
                        {issue.category}
                      </span>
                    )}
                  </div>
                  <div className="mt-3">
                     {index === 0 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                           🔥 Top Priority - Fast-tracked for resolution
                        </span>
                     )}
                     {index === 1 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400 border border-orange-500/30">
                           ⚡ High Priority
                        </span>
                     )}
                     {index > 1 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                           🕒 Standard Priority (Est. 7-14 days)
                        </span>
                     )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center ml-4 border-l border-white/10 pl-4">
                 <div className="text-sm text-gray-400 mb-1 font-semibold uppercase tracking-wider">Votes</div>
                 <div className="text-2xl font-bold text-neon-blue mb-2 font-mono">
                    {issue.vote_count}
                 </div>
                 <button
                   onClick={() => handleVote(issue.id)}
                   disabled={voting === issue.id}
                   className={`flex items-center justify-center px-4 py-2 rounded-lg font-bold transition-all ${
                     issue.has_voted
                       ? 'bg-neon-purple text-white shadow-[0_0_15px_rgba(192,132,252,0.6)]'
                       : 'bg-white/5 border border-white/20 text-gray-300 hover:border-neon-blue hover:text-neon-blue hover:bg-neon-blue/10 hover:shadow-[0_0_10px_rgba(56,189,248,0.3)]'
                   } ${voting === issue.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                 >
                   {voting === issue.id ? (
                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                   ) : (
                     <span className="flex items-center gap-2">
                       <svg className={`w-5 h-5 ${issue.has_voted ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                       </svg>
                       {issue.has_voted ? 'Voted' : 'Vote'}
                     </span>
                   )}
                 </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LocalIssueVoting;
