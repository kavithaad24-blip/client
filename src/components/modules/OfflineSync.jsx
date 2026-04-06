import { useState, useEffect } from 'react';

const OfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState(3);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOnline && pendingCount > 0 && !syncing) {
      setSyncing(true);
      const timer = setTimeout(() => {
        setPendingCount(0);
        setSyncing(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, pendingCount, syncing]);

  return (
    <div className="glass-panel p-6 transform hover:-translate-y-2 transition-all duration-300 relative overflow-hidden h-full">
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-neon-blue/10 rounded-full blur-3xl"></div>
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <h2 className="text-xl font-bold tracking-wide flex items-center gap-2">
          <svg className="w-6 h-6 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          Neural Sync
        </h2>
        <div className={`px-3 py-1 rounded-full border text-xs font-mono tracking-widest flex items-center gap-2 ${
          isOnline 
            ? 'bg-green-500/10 border-green-500/40 text-green-400' 
            : 'bg-red-500/10 border-red-500/40 text-red-400'
        }`}>
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,1)]' : 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,1)] animate-pulse'}`}></div>
          {isOnline ? 'LINK ACTIVE' : 'OFFLINE MODE'}
        </div>
      </div>
      
      <div className="space-y-4 relative z-10 flex flex-col items-center justify-center py-2 relative">
        <div className="relative">
          <svg className={`w-20 h-20 ${isOnline && pendingCount === 0 ? 'text-neon-blue drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]' : 'text-gray-600'} transition-all duration-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          
          {syncing && (
             <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-24 h-24 border-2 border-dashed border-neon-blue rounded-full animate-[spin_4s_linear_infinite] opacity-50"></div>
               <div className="absolute w-24 h-24 border-2 border-dashed border-neon-purple rounded-full animate-[spin_3s_linear_infinite_reverse] opacity-50"></div>
             </div>
          )}
        </div>
        
        <div className="text-center h-16 flex items-center justify-center flex-col">
          {pendingCount > 0 ? (
            <>
              <div className="text-3xl font-bold text-white mb-1"><span className="text-neon-purple">{pendingCount}</span></div>
              <div className="text-sm font-mono text-gray-400 tracking-widest">{syncing ? 'SYNCING...' : 'PACKETS PENDING'}</div>
            </>
          ) : (
            <>
              <div className="text-xl font-bold text-green-400 mt-2 tracking-widest uppercase flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                Sync Complete
              </div>
              <div className="text-xs font-mono text-gray-500 mt-2">All data mirrors updated</div>
            </>
          )}
        </div>
        
        <button 
          onClick={() => { setIsOnline(!isOnline); if(isOnline) setPendingCount(3); }}
          className="mt-4 px-4 py-2 border border-white/10 rounded-lg text-xs tracking-wider uppercase text-gray-400 hover:text-white hover:bg-white/5 transition-all w-full"
        >
          Toggle Connection Status
        </button>
      </div>
    </div>
  );
};

export default OfflineSync;
