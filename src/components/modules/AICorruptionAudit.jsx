import { useState } from 'react';

const AICorruptionAudit = () => {
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState('idle');

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setupImage(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setupImage(e.target.files[0]);
    }
  };

  const setupImage = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target.result);
      setStatus('ready');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (status === 'complete') {
      setImage(null);
      setStatus('idle');
      return;
    }
    
    setStatus('analyzing');
    // Simulate AI analysis delay
    setTimeout(() => {
      setStatus('complete');
    }, 2500);
  };

  return (
    <div className="glass-panel p-6 transform hover:-translate-y-2 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold tracking-wide flex items-center gap-2">
          <svg className="w-6 h-6 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          AI Corruption Audit
        </h2>
        {status === 'analyzing' && <span className="animate-pulse text-neon-blue text-sm font-mono border border-neon-blue/40 px-2 py-0.5 rounded bg-neon-blue/10">ANALYZING</span>}
        {status === 'complete' && <span className="text-green-400 text-sm font-mono border border-green-500/40 px-2 py-0.5 rounded bg-green-500/10">VERIFIED</span>}
      </div>
      
      {!image ? (
        <div 
          className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-neon-blue/50 transition-all duration-300 glass-card cursor-pointer group"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload').click()}
        >
          <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleChange} />
          <svg className="w-12 h-12 mx-auto text-gray-500 mb-3 group-hover:text-neon-blue transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-400 group-hover:text-gray-200 transition-colors">Drag & drop image here or click to browse</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-xl overflow-hidden glass-card">
            <img src={image} alt="Audit Preview" className="w-full h-48 object-cover opacity-80 mix-blend-screen" />
            
            {status === 'analyzing' && (
              <div className="absolute inset-0 bg-space-dark/80 backdrop-blur-sm flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mb-2 shadow-[0_0_15px_rgba(56,189,248,0.5)]"></div>
                  <span className="text-neon-blue font-mono tracking-widest text-sm">SCANNING AI...</span>
                </div>
              </div>
            )}
            
            {status === 'complete' && (
               <div className="absolute inset-0 bg-space-dark/20 flex flex-col items-center justify-center pointer-events-none">
                  <div className="border border-green-500 bg-green-500/20 px-3 py-1 text-green-400 font-mono text-sm uppercase tracking-widest rounded shadow-[0_0_10px_rgba(74,222,128,0.5)] backdrop-blur-md">
                    Anomaly Detected
                  </div>
               </div>
            )}
            
            {status !== 'analyzing' && (
              <button 
                onClick={() => { setImage(null); setStatus('idle'); }}
                className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full hover:bg-black/80 text-white border border-white/10"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
          
          <button 
            onClick={handleSubmit}
            disabled={status !== 'ready' && status !== 'complete'}
            className={`w-full py-3 rounded-lg font-semibold tracking-wide transition-all ${
              status === 'ready' 
                ? 'bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-90 shadow-[0_0_15px_rgba(56,189,248,0.4)] text-white cursor-pointer' 
                : status === 'complete'
                ? 'bg-white/10 border border-white/20 hover:bg-white/20 text-white cursor-pointer'
                : 'bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed'
            }`}
          >
            {status === 'complete' ? 'Submit Another' : 'Initiate AI Scan'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AICorruptionAudit;
