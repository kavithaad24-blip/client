import { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import AICorruptionAudit from './components/modules/AICorruptionAudit';
import ServiceDelayPrediction from './components/modules/ServiceDelayPrediction';
import OfflineSync from './components/modules/OfflineSync';
import LocalIssueVoting from './components/modules/LocalIssueVoting';
import AuthLayout from './components/auth/AuthLayout';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

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
      <Navbar onLogout={handleLogout} currentUser={currentUser} />
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 flex gap-6">
        <Sidebar />
        
        <main className="flex-1">
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 className="text-2xl font-bold">Command Center</h2>
              <p className="text-gray-400 text-sm mt-1">Real-time civic intelligence and response grid</p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-4">
              <button className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-sm transition-colors shadow-[0_0_10px_rgba(255,255,255,0.05)]">
                Export Logs
              </button>
              <button className="px-4 py-2 bg-neon-blue/20 border border-neon-blue text-neon-blue hover:bg-neon-blue/30 rounded-lg text-sm transition-colors shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                Generate Report
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-full">
            <div className="space-y-6 flex flex-col">
              <div className="flex-1"><AICorruptionAudit /></div>
              <div className="flex-1"><OfflineSync /></div>
            </div>
            
            <div className="space-y-6 flex flex-col">
              <div className="flex-1"><ServiceDelayPrediction /></div>
              <div className="flex-1"><LocalIssueVoting /></div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
