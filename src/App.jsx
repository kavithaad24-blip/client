import { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import AICorruptionAudit from './components/modules/AICorruptionAudit';
import OfflineSync from './components/modules/OfflineSync';
import LocalIssueVoting from './components/modules/LocalIssueVoting';
import AdminDashboard from './pages/AdminDashboard';
import ServiceTracking from './pages/ServiceTracking';
import Settings from './pages/Settings';
import AuthLayout from './components/auth/AuthLayout';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard' or 'admin'
  const [language, setLanguage] = useState('en'); // Default language

  useEffect(() => {
    // Check local storage for user token on load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <AuthLayout onAuthSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="min-h-screen pb-10">
      <Navbar onLogout={handleLogout} currentUser={currentUser} currentLanguage={language} onLanguageChange={setLanguage} />
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 flex gap-6">
        <Sidebar onNavigate={setCurrentPage} currentPage={currentPage} />
        
        <main className="flex-1">
          {currentPage === 'dashboard' ? (
            <>
              <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h2 className="text-2xl font-bold">Command Center</h2>
                  <p className="text-gray-400 text-sm mt-1">Real-time civic intelligence and response grid</p>
                </div>
                <div className="mt-4 md:mt-0 flex gap-4">
                  <button onClick={() => setCurrentPage('admin')} className="px-4 py-2 bg-neon-blue/20 border border-neon-blue text-neon-blue hover:bg-neon-blue/30 rounded-lg text-sm transition-colors shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                    📊 View Reports
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {/* 1. AI Corruption Audit */}
                <button onClick={() => setCurrentPage('audit')} className="glass-card p-6 h-48 flex flex-col justify-center items-center text-center hover:-translate-y-2 transition-all group hover:border-neon-purple/50 shadow-[0_0_15px_rgba(192,132,252,0.1)] hover:shadow-[0_0_20px_rgba(192,132,252,0.3)]">
                   <div className="w-14 h-14 rounded-full bg-neon-purple/20 flex items-center justify-center mb-4 text-neon-purple group-hover:scale-110 transition-transform">
                     <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                   </div>
                   <h3 className="text-lg font-bold text-gray-200 group-hover:text-white transition-colors">
                     {language === 'ta' ? 'AI ஊழல் தணிக்கை' : 
                      language === 'ml' ? 'AI അഴിമതി ഓഡിറ്റ്' : 
                      language === 'te' ? 'AI అవినీతి ఆడిట్' : 
                      language === 'kn' ? 'AI ಭ್ರಷ್ಟಾಚಾರ ಲೆಕ್ಕಪರಿಶೋಧನೆ' : 
                      language === 'hi' ? 'एआई भ्रष्टाचार ऑडिट' : 
                      'AI Corruption Audit'}
                   </h3>
                   <p className="text-gray-500 text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity">AI-Powered Verification</p>
                </button>

                {/* 2. Service Tracking & Predictions */}
                <button onClick={() => setCurrentPage('services')} className="glass-card p-6 h-48 flex flex-col justify-center items-center text-center hover:-translate-y-2 transition-all group hover:border-neon-blue/50 shadow-[0_0_15px_rgba(56,189,248,0.1)] hover:shadow-[0_0_20px_rgba(56,189,248,0.3)]">
                   <div className="w-14 h-14 rounded-full bg-neon-blue/20 flex items-center justify-center mb-4 text-neon-blue group-hover:scale-110 transition-transform">
                     <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   </div>
                   <h3 className="text-lg font-bold text-gray-200 group-hover:text-white transition-colors">
                     {language === 'ta' ? 'சேவை கண்காணிப்பு & கணிப்புகள்' : 
                      language === 'ml' ? 'സേവന ട്രാക്കിംഗ് & പ്രവചനങ്ങൾ' : 
                      language === 'te' ? 'సేవ ట్రాకింగ్ & అంచనాలు' : 
                      language === 'kn' ? 'ಸೇವಾ ಟ್ರ್ಯಾಕಿಂಗ್ ಮತ್ತು ಮುನ್ನೋಟಗಳು' : 
                      language === 'hi' ? 'सेवा ट्रैकिंग और भविष्यवाणियां' : 
                      'Service Tracking & Predictions'}
                   </h3>
                   <p className="text-gray-500 text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Real-time Service Status</p>
                </button>

                {/* 3. Offline Sync */}
                <button onClick={() => setCurrentPage('offline-sync')} className="glass-card p-6 h-48 flex flex-col justify-center items-center text-center hover:-translate-y-2 transition-all group hover:border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                   <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400 group-hover:scale-110 transition-transform">
                     <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                   </div>
                   <h3 className="text-lg font-bold text-gray-200 group-hover:text-white transition-colors">
                     {language === 'ta' ? 'ஆஃப்லைன் ஒத்திசைவு' : 
                      language === 'ml' ? 'ഓഫ്‌ലൈൻ സിങ്ക്' : 
                      language === 'te' ? 'ఆఫ్‌లైన్ సింక్' : 
                      language === 'kn' ? 'ಆಫ್‌ಲೈನ್ ಸಿಂಕ್' : 
                      language === 'hi' ? 'ऑफ़लाइन सिंक' : 
                      'Offline Sync'}
                   </h3>
                   <p className="text-gray-500 text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Work Without Internet</p>
                </button>

                {/* 4. Voting */}
                <button onClick={() => setCurrentPage('voting')} className="glass-card p-6 h-48 flex flex-col justify-center items-center text-center hover:-translate-y-2 transition-all group hover:border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.1)] hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                   <div className="w-14 h-14 rounded-full bg-orange-500/20 flex items-center justify-center mb-4 text-orange-400 group-hover:scale-110 transition-transform">
                     <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                   </div>
                   <h3 className="text-lg font-bold text-gray-200 group-hover:text-white transition-colors">
                     {language === 'ta' ? 'உள்ளூர் பிரச்சினை வாக்குப்பதிவு' : 
                      language === 'ml' ? 'പ്രാദേശിക പ്രശ്ന വോട്ടിംഗ്' : 
                      language === 'te' ? 'స్థానిక సమస్యల ఓటింగ్' : 
                      language === 'kn' ? 'ಸ್ಥಳೀಯ ಸಮಸ್ಯೆಗಳ ಮತದಾನ' : 
                      language === 'hi' ? 'स्थानीय मुद्दा वोटिंग' : 
                      'Local Issue Voting'}
                   </h3>
                   <p className="text-gray-500 text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Community Prioritization</p>
                </button>
              </div>
            </>
          ) : currentPage === 'services' ? (
            <div>
              <button 
                onClick={() => setCurrentPage('dashboard')}
                className="mb-4 px-4 py-2 bg-white/5 border border-white/20 hover:bg-white/10 rounded-lg text-sm transition-colors"
              >
                ← Back to Dashboard
              </button>
              <ServiceTracking language={language} />
            </div>
          ) : currentPage === 'offline-sync' ? (
            <div>
              <button 
                onClick={() => setCurrentPage('dashboard')}
                className="mb-4 px-4 py-2 bg-white/5 border border-white/20 hover:bg-white/10 rounded-lg text-sm transition-colors"
              >
                ← Back to Dashboard
              </button>
              <div className="max-w-4xl mx-auto">
                <OfflineSync language={language} />
              </div>
            </div>
          ) : currentPage === 'audit' ? (
            <div>
              <button 
                onClick={() => setCurrentPage('dashboard')}
                className="mb-4 px-4 py-2 bg-white/5 border border-white/20 hover:bg-white/10 rounded-lg text-sm transition-colors"
              >
                ← Back to Dashboard
              </button>
              <div className="max-w-4xl mx-auto">
                <AICorruptionAudit language={language} />
              </div>
            </div>
          ) : currentPage === 'voting' ? (
            <div className="h-full flex flex-col">
              <button 
                onClick={() => setCurrentPage('dashboard')}
                className="mb-4 self-start px-4 py-2 bg-white/5 border border-white/20 hover:bg-white/10 rounded-lg text-sm transition-colors"
              >
                ← Back to Dashboard
              </button>
              <div className="flex-1">
                <LocalIssueVoting language={language} />
              </div>
            </div>
          ) : currentPage === 'settings' ? (
            <div>
              <button 
                onClick={() => setCurrentPage('dashboard')}
                className="mb-4 px-4 py-2 bg-white/5 border border-white/20 hover:bg-white/10 rounded-lg text-sm transition-colors"
              >
                ← Back to Dashboard
              </button>
              <Settings language={language} />
            </div>
          ) : currentPage === 'admin' ? (
            <div>
              <button 
                onClick={() => setCurrentPage('dashboard')}
                className="mb-4 px-4 py-2 bg-white/5 border border-white/20 hover:bg-white/10 rounded-lg text-sm transition-colors"
              >
                ← Back to Dashboard
              </button>
              <AdminDashboard />
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}

export default App;
