import { useState } from 'react';

function Settings({ language }) {
  const [activeTab, setActiveTab] = useState('profile');
  
  const currentUser = JSON.parse(localStorage.getItem('user')) || {};
  
  const [profileData, setProfileData] = useState({
    name: currentUser.name || 'Citizen User',
    email: currentUser.email || 'user@example.com',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    app: true
  });

  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: currentUser.id,
          name: profileData.name,
          email: profileData.email,
          password: profileData.password
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setMessage({ type: 'success', text: 'Profile updated successfully! You can use these credentials to login.' });
      setProfileData({ ...profileData, password: '' });
      
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">⚙️ Settings</h1>
        <p className="text-gray-400">Manage your account preferences and configurations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Settings Sidebar */}
        <div className="space-y-2">
          {[
            { id: 'profile', icon: '👤', label: 'Profile' },
            { id: 'notifications', icon: '🔔', label: 'Notifications' },
            { id: 'security', icon: '🔒', label: 'Security' },
            { id: 'preferences', icon: '🎨', label: 'Preferences' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                activeTab === tab.id
                  ? 'bg-neon-blue/20 text-white border border-neon-blue/50 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="md:col-span-3">
          <div className="glass-panel p-6 min-h-[400px]">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Profile Information</h2>
                
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center text-3xl font-bold text-white border-2 border-white/20">
                    {profileData.name.charAt(0)}
                  </div>
                  <button className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm text-white transition-colors">
                    Change Avatar
                  </button>
                </div>

                {message.text && (
                  <div className={`p-3 rounded-lg text-sm mb-4 ${message.type === 'error' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-green-500/20 text-green-300 border border-green-500/30'}`}>
                    {message.type === 'error' ? '❌ ' : '✅ '}{message.text}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Full Name</label>
                    <input 
                      type="text" 
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:outline-none focus:ring-1 focus:ring-neon-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Email Address</label>
                    <input 
                      type="email" 
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:outline-none focus:ring-1 focus:ring-neon-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">New Password (Optional)</label>
                    <input 
                      type="password" 
                      value={profileData.password}
                      onChange={(e) => setProfileData({...profileData, password: e.target.value})}
                      placeholder="Leave blank to keep current"
                      className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:outline-none focus:ring-1 focus:ring-neon-blue"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button 
                    onClick={handleProfileUpdate}
                    disabled={loading}
                    className="px-6 py-2 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-lg font-medium hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(56,189,248,0.4)] disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Notification Preferences</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/5">
                    <div>
                      <h3 className="text-white font-medium">Email Notifications</h3>
                      <p className="text-sm text-gray-400">Receive updates about your complaints via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={notifications.email}
                        onChange={() => setNotifications({...notifications, email: !notifications.email})}
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-blue"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/5">
                    <div>
                      <h3 className="text-white font-medium">SMS Alerts</h3>
                      <p className="text-sm text-gray-400">Get critical tracking updates on your phone</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={notifications.sms}
                        onChange={() => setNotifications({...notifications, sms: !notifications.sms})}
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-blue"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/5">
                    <div>
                      <h3 className="text-white font-medium">In-App Notifications</h3>
                      <p className="text-sm text-gray-400">Show floating alerts while using the portal</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={notifications.app}
                        onChange={() => setNotifications({...notifications, app: !notifications.app})}
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-blue"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Security Settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Current Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      className="w-full max-w-md bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:outline-none focus:ring-1 focus:ring-neon-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">New Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      className="w-full max-w-md bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:outline-none focus:ring-1 focus:ring-neon-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Confirm New Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      className="w-full max-w-md bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:outline-none focus:ring-1 focus:ring-neon-blue"
                    />
                  </div>
                  <button className="px-6 py-2 mt-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg font-medium transition-colors">
                    Update Password
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">App Preferences</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Theme</label>
                    <select className="w-full max-w-md bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:outline-none focus:ring-1 focus:ring-neon-blue">
                      <option value="dark">Neon Dark (Default)</option>
                      <option value="light">Light Mode</option>
                      <option value="system">System Default</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Default View</label>
                    <select className="w-full max-w-md bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:outline-none focus:ring-1 focus:ring-neon-blue">
                      <option value="dashboard">Dashboard</option>
                      <option value="audit">AI Audit</option>
                      <option value="services">Service Tracking</option>
                      <option value="offline-sync">Offline Sync</option>
                      <option value="voting">Voting</option>
                      <option value="admin">Admin Reports</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
