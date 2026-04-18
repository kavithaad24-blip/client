import { useState } from 'react';

const AuthLayout = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const demoCredentials = {
    email: 'demo@citizen.gov',
    password: 'Demo@12345'
  };

  const handleDemoLogin = async () => {
    setFormData({
      name: '',
      email: demoCredentials.email,
      password: demoCredentials.password
    });
    
    // Simulate form submission
    setTimeout(() => {
      handleSubmitWithCredentials(demoCredentials.email, demoCredentials.password);
    }, 100);
  };

  const handleSubmitWithCredentials = async (email, password) => {
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    const submitData = isLogin 
      ? { email, password }
      : formData;
    
    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Authentication failed');
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onAuthSuccess(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleSubmitWithCredentials(formData.email, formData.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-space-dark px-4 pb-10">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="glass-panel p-8 transform transition-all duration-300">
          <h2 className="text-3xl font-bold mb-2 text-center tracking-wide">
            <span className="text-white">Citizen</span>
            <span className="neon-text ml-2">Portal</span>
          </h2>
          <p className="text-center text-gray-400 text-sm mb-6">
            {isLogin ? '🔐 Log in to your account' : '📝 Create a new account'}
          </p>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm">
              <span className="font-semibold">❌ {error}</span>
            </div>
          )}

          {/* Demo Credentials Alert */}
          {isLogin && !showDemo && (
            <div className="bg-blue-500/10 border border-blue-500/30 text-blue-300 px-4 py-3 rounded-lg mb-6 text-xs">
              <p className="font-semibold mb-2">💡 Don't have an account?</p>
              <p className="mb-3">Try the demo account or create a new one</p>
              <button
                onClick={handleDemoLogin}
                disabled={loading}
                className="w-full py-2 px-3 bg-blue-500/20 border border-blue-400 text-blue-300 hover:bg-blue-500/30 rounded font-mono text-xs transition-colors"
              >
                🎯 Use Demo Account
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-gray-400 mb-2 text-sm font-mono">📝 Full Name *</label>
                <input 
                  required 
                  type="text" 
                  placeholder="John Doe"
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:border-neon-blue focus:outline-none focus:ring-1 focus:ring-neon-blue transition-colors" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                />
              </div>
            )}
            
            <div>
              <label className="block text-gray-400 mb-2 text-sm font-mono">📧 Email Address *</label>
              <input 
                required 
                type="email" 
                placeholder="your@email.com"
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:border-neon-blue focus:outline-none focus:ring-1 focus:ring-neon-blue transition-colors" 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
              />
            </div>
            
            <div>
              <label className="block text-gray-400 mb-2 text-sm font-mono">🔐 Password *</label>
              <input 
                required 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:border-neon-blue focus:outline-none focus:ring-1 focus:ring-neon-blue transition-colors" 
                value={formData.password} 
                onChange={e => setFormData({...formData, password: e.target.value})} 
              />
              {!isLogin && (
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters recommended</p>
              )}
            </div>
            
            <button 
              disabled={loading} 
              type="submit" 
              className="w-full py-3 rounded-lg font-semibold tracking-wide bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-90 shadow-[0_0_15px_rgba(56,189,248,0.4)] text-white mt-6 disabled:opacity-50 transition-opacity flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  {isLogin ? '🔓 Sign In' : '✍️ Create Account'}
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-400 text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => { 
                setIsLogin(!isLogin); 
                setError(''); 
                setFormData({ name: '', email: '', password: '' });
              }} 
              className="text-neon-blue hover:text-neon-purple transition-colors font-semibold"
            >
              {isLogin ? '📝 Sign Up' : '🔓 Sign In'}
            </button>
          </p>
        </div>

        {/* Info Section */}
        <div className="mt-6 text-center text-xs text-gray-500 space-y-2">
          <p>🤝 Welcome to Citizen Service Portal</p>
          <p>Report corruption • Track complaints • Audit infrastructure</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
