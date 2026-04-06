import { useState, useEffect } from 'react';

const ServiceDelayPrediction = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev < 68 ? prev + 1 : prev));
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel p-6 transform hover:-translate-y-2 transition-all duration-300 relative overflow-hidden h-full">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-neon-purple/10 rounded-full blur-3xl"></div>
      
      <h2 className="text-xl font-bold tracking-wide mb-6 flex items-center gap-2 relative z-10">
        <svg className="w-6 h-6 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Delay Prediction Model
      </h2>
      
      <div className="space-y-6 relative z-10">
        <div className="glass-card p-4 flex justify-between items-center bg-black/20">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Standard ETA</div>
            <div className="text-2xl font-bold text-white">48<span className="text-sm font-normal text-gray-400 ml-1">hrs</span></div>
          </div>
          <div className="text-right">
            <div className="text-xs text-neon-purple uppercase tracking-widest mb-1">AI Prediction</div>
            <div className="text-2xl font-bold neon-text">56<span className="text-sm font-normal text-gray-400 ml-1">hrs</span></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-2 font-mono">
            <span className="text-gray-400 text-xs">PROCESS COMPETION</span>
            <span className="text-neon-blue">{progress}%</span>
          </div>
          <div className="w-full bg-space-dark rounded-full h-3 border border-white/10 overflow-hidden relative">
            <div 
              className="bg-gradient-to-r from-neon-purple to-neon-blue h-full rounded-full relative shadow-[0_0_10px_rgba(56,189,248,0.8)] transition-all ease-out duration-300"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute top-0 right-0 bottom-0 w-8 bg-white/20 blur-sm mix-blend-overlay"></div>
            </div>
          </div>
        </div>
        
        <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
          <svg className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm text-orange-200">
             High volume detected in Zone B. Neural net estimates <span className="font-bold text-orange-400">+8h</span> contextual latency.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceDelayPrediction;
