import { useState } from 'react';

const AuthLayout = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    
    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-space-dark px-4 pb-10">
      <div className="w-full max-w-md glass-panel p-8 transform transition-all duration-300">
        <h2 className="text-3xl font-bold mb-6 text-center tracking-wide">
          <span className="text-white">Citizen</span>
          <span className="neon-text ml-2">Portal</span>
          <div className="text-sm font-normal text-gray-400 mt-2">{isLogin ? 'Login to your account' : 'Register a new account'}</div>
        </h2>

        {error && <div className="bg-red-500/20 border border-red-500 text-red-500 px-4 py-2 rounded mb-6 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-gray-400 mb-1 text-sm">Full Name</label>
              <input required type="text" className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:outline-none focus:ring-1 focus:ring-neon-blue transition-colors" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
          )}
          <div>
            <label className="block text-gray-400 mb-1 text-sm">Email Address</label>
            <input required type="email" className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:outline-none focus:ring-1 focus:ring-neon-blue transition-colors" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-gray-400 mb-1 text-sm">Password</label>
            <input required type="password" className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:outline-none focus:ring-1 focus:ring-neon-blue transition-colors" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>
          
          <button disabled={loading} type="submit" className="w-full py-3 rounded-lg font-semibold tracking-wide bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-90 shadow-[0_0_15px_rgba(56,189,248,0.4)] text-white mt-4 disabled:opacity-50 transition-opacity flex justify-center">
            {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-neon-blue hover:text-neon-purple transition-colors font-medium">
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
