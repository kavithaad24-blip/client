import { useState, useEffect } from 'react';

const Navbar = ({ currentUser, onLogout, currentLanguage, onLanguageChange }) => {
  const [time, setTime] = useState(new Date());
  const [backendStatus, setBackendStatus] = useState("Connecting...");
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    // Fetch data from backend
    fetch('http://localhost:5000/api/test')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBackendStatus("DB & Server Online");
          setIsOnline(true);
        } else {
          setBackendStatus("Backend Error");
          setIsOnline(false);
        }
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setBackendStatus("Backend Offline");
        setIsOnline(false);
      });

    return () => clearInterval(timer);
  }, []);

  return (
    <nav className="glass-panel sticky top-0 z-50 px-6 py-4 mb-6 flex justify-between items-center rounded-none border-t-0 border-x-0 bg-space-card/80">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-neon-blue to-neon-purple animate-pulse-glow flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.5)]">
          <span className="font-bold text-white tracking-wider">CP</span>
        </div>
        <h1 className="text-xl font-bold tracking-wide">
          <span className="text-white">Citizen</span>
          <span className="neon-text ml-2">Portal</span>
        </h1>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 glass-card px-4 py-2 bg-black/20" title={backendStatus}>
          <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(74,222,128,1)] ${isOnline ? 'bg-green-400' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-300">{backendStatus}</span>
        </div>
        
        {/* Language Selector */}
        {onLanguageChange && (
          <select 
            value={currentLanguage || 'en'} 
            onChange={(e) => onLanguageChange(e.target.value)}
            className="bg-space-dark/80 border border-neon-blue/30 text-cyan-300 text-sm rounded-md px-2 py-1.5 focus:outline-none focus:border-neon-blue shadow-[0_0_10px_rgba(56,189,248,0.1)] cursor-pointer"
          >
            <option value="en">English</option>
            <option value="ta">தமிழ் (Tamil)</option>
            <option value="te">తెలుగు (Telugu)</option>
            <option value="ml">മലയാളം (Malayalam)</option>
            <option value="kn">ಕನ್ನಡ (Kannada)</option>
            <option value="hi">हिंदी (Hindi)</option>
          </select>
        )}

        <div className="text-sm font-mono text-cyan-300 bg-cyan-950/40 px-3 py-1.5 rounded-md border border-cyan-500/20">
          {time.toLocaleTimeString()}
        </div>
        {currentUser && (
          <div className="flex items-center gap-4 border-l border-white/10 pl-4">
            <span className="text-gray-300 text-sm hidden sm:block">Welcome, <span className="text-white font-medium">{currentUser.name}</span></span>
            <button onClick={onLogout} className="text-red-400 hover:text-red-300 transition-colors text-sm px-3 py-1.5 border border-red-500/20 rounded-md bg-red-500/10 hover:bg-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]">
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
