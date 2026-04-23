const Sidebar = ({ onNavigate = () => {}, currentPage = 'dashboard' }) => {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'audit', name: 'AI Audit', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'services', name: 'Service Tracking', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'offline-sync', name: 'Offline Sync', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
    { id: 'voting', name: 'Voting', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'admin', name: 'Admin Reports', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { id: 'settings', name: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }
  ];

  return (
    <aside className="w-64 glass-panel h-[calc(100vh-6rem)] hidden lg:flex flex-col p-4 animate-[float-slow_8s_ease-in-out_infinite]">
      <div className="text-xs uppercase tracking-widest text-cyan-500 font-semibold mb-6 px-4">Navigation</div>
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = item.id === currentPage;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border border-neon-blue/30 text-white shadow-[0_0_10px_rgba(56,189,248,0.2)]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5 hover:border hover:border-white/10'
              }`}
            >
              <svg className={`w-5 h-5 ${isActive ? 'text-neon-blue' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
              </svg>
              <span className="font-medium tracking-wide">{item.name}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="mt-auto glass-card p-4 text-center">
        <div className="text-xs text-gray-400 mb-2">System Status</div>
        <div className="w-full bg-gray-800 rounded-full h-1.5 mb-1 overflow-hidden">
          <div className="bg-gradient-to-r from-neon-blue to-neon-purple h-1.5 rounded-full w-[95%]"></div>
        </div>
        <div className="text-xs text-white">95% Optimal</div>
      </div>
    </aside>
  );
};

export default Sidebar;
