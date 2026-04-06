import { useState, useEffect } from 'react';

const Navbar = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
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
        <div className="hidden md:flex items-center gap-2 glass-card px-4 py-2 bg-black/20">
          <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,1)]"></div>
          <span className="text-sm text-gray-300">System Online</span>
        </div>
        <div className="text-sm font-mono text-cyan-300 bg-cyan-950/40 px-3 py-1.5 rounded-md border border-cyan-500/20">
          {time.toLocaleTimeString()}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
