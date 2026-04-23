import { useState, useEffect } from 'react';

const OfflineSync = ({ language = 'en' }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingComplaints, setPendingComplaints] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [complaintData, setComplaintData] = useState({
    description: '',
    location: '',
    address: '',
    category: 'General'
  });
  const [submitting, setSubmitting] = useState(false);

  const t = {
    en: {
      title: 'Offline Sync', submitBtn: '📝 Submit Offline Complaint', cancelBtn: 'Cancel',
      descLabel: 'Description *', descPh: 'Describe your complaint...',
      locLabel: 'Location', locPh: 'Select Location (optional)',
      addrLabel: '📍 Location Address', addrPh: 'E.g., Main Street near Municipal Building, Ward 45, etc.',
      catLabel: 'Category', saveBtn: '💾 Save Offline', syncNow: '🔄 Sync Now'
    },
    ta: {
      title: 'ஆஃப்லைன் ஒத்திசைவு', submitBtn: '📝 ஆஃப்லைன் புகாரை பதிவு செய்க', cancelBtn: 'ரத்து செய்',
      descLabel: 'விளக்கம் *', descPh: 'உங்கள் புகாரை விவரிக்கவும்...',
      locLabel: 'இடம்', locPh: 'இடத்தைத் தேர்ந்தெடுக்கவும்',
      addrLabel: '📍 இருப்பிட முகவரி', addrPh: 'உதா: முனிசிபல் கட்டிடம் அருகே உள்ள மெயின் ரோடு...',
      catLabel: 'வகை', saveBtn: '💾 சேமி', syncNow: '🔄 ஒத்திசைவு செய்'
    },
    ml: {
      title: 'ഓഫ്‌ലൈൻ സിങ്ക്', submitBtn: '📝 പരാതി നൽകുക', cancelBtn: 'റദ്ദാക്കുക',
      descLabel: 'വിവരണം *', descPh: 'വിശദമാക്കുക...', locLabel: 'സ്ഥലം', locPh: 'സ്ഥലം തിരഞ്ഞെടുക്കുക',
      addrLabel: '📍 വിലാസം', addrPh: 'വിലാസം നൽകുക...', catLabel: 'വിഭാഗം', saveBtn: '💾 സംരക്ഷിക്കുക', syncNow: '🔄 സിങ്ക് ചെയ്യുക'
    },
    te: {
      title: 'ఆఫ్‌లైన్ సింక్', submitBtn: '📝 ఫిర్యాదు సమర్పించండి', cancelBtn: 'రద్దు చేయి',
      descLabel: 'వివరణ *', descPh: 'వివరించండి...', locLabel: 'స్థలం', locPh: 'స్థలాన్ని ఎంచుకోండి',
      addrLabel: '📍 చిరునామా', addrPh: 'చిరునామా నమోదు చేయండి...', catLabel: 'వర్గం', saveBtn: '💾 సేవ్ చేయండి', syncNow: '🔄 సింక్ చేయండి'
    },
    kn: {
      title: 'ಆಫ್‌ಲೈನ್ ಸಿಂಕ್', submitBtn: '📝 ದೂರು ಸಲ್ಲಿಸಿ', cancelBtn: 'ರದ್ದುಮಾಡಿ',
      descLabel: 'ವಿವರಣೆ *', descPh: 'ವಿವರಿಸಿ...', locLabel: 'ಸ್ಥಳ', locPh: 'ಸ್ಥಳ ಆಯ್ಕೆಮಾಡಿ',
      addrLabel: '📍 ವಿಳಾಸ', addrPh: 'ವಿಳಾಸ ನಮೂದಿಸಿ...', catLabel: 'ವರ್ಗ', saveBtn: '💾 ಉಳಿಸಿ', syncNow: '🔄 ಸಿಂಕ್ ಮಾಡಿ'
    },
    hi: {
      title: 'ऑफ़लाइन सिंक', submitBtn: '📝 शिकायत दर्ज करें', cancelBtn: 'रद्द करें',
      descLabel: 'विवरण *', descPh: 'विवरण दें...', locLabel: 'स्थान', locPh: 'स्थान चुनें',
      addrLabel: '📍 पता', addrPh: 'पता दर्ज करें...', catLabel: 'श्रेणी', saveBtn: '💾 सहेजें', syncNow: '🔄 सिंक करें'
    }
  }[language] || {
      title: 'Offline Sync', submitBtn: '📝 Submit Offline Complaint', cancelBtn: 'Cancel',
      descLabel: 'Description *', descPh: 'Describe your complaint...',
      locLabel: 'Location', locPh: 'Select Location (optional)',
      addrLabel: '📍 Location Address', addrPh: 'E.g., Main Street near Municipal Building, Ward 45, etc.',
      catLabel: 'Category', saveBtn: '💾 Save Offline', syncNow: '🔄 Sync Now'
  };

  // Load pending complaints from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('pendingComplaints');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setPendingComplaints(parsed);
      } catch (e) {
        console.error('Error parsing stored complaints:', e);
      }
    }

    const lastSync = localStorage.getItem('lastSyncTime');
    if (lastSync) {
      setLastSyncTime(new Date(lastSync));
    }
  }, []);

  // Save pending complaints to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pendingComplaints', JSON.stringify(pendingComplaints));
  }, [pendingComplaints]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Auto-sync when coming online
      if (pendingComplaints.length > 0 && !syncing) {
        syncPendingComplaints();
      }
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [pendingComplaints, syncing]);

  // Auto-sync when online and there are pending complaints
  useEffect(() => {
    if (isOnline && pendingComplaints.length > 0 && !syncing) {
      const timer = setTimeout(() => {
        syncPendingComplaints();
      }, 2000); // Wait 2 seconds after coming online
      return () => clearTimeout(timer);
    }
  }, [isOnline, pendingComplaints, syncing]);

  const syncPendingComplaints = async () => {
    if (syncing || pendingComplaints.length === 0) return;

    setSyncing(true);
    let syncedCount = 0;

    for (const complaint of pendingComplaints) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/complaints', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            description: complaint.description,
            location: complaint.location,
            address: complaint.address,
            category: complaint.category
          })
        });

        if (response.ok) {
          syncedCount++;
        } else {
          console.error('Failed to sync complaint:', await response.text());
        }
      } catch (error) {
        console.error('Sync error:', error);
      }
    }

    // Remove synced complaints
    setPendingComplaints(prev => prev.slice(syncedCount));
    setLastSyncTime(new Date());
    localStorage.setItem('lastSyncTime', new Date().toISOString());
    setSyncing(false);
  };

  const handleOfflineSubmit = (e) => {
    e.preventDefault();
    if (!complaintData.description.trim()) return;

    const newComplaint = {
      ...complaintData,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      status: 'offline'
    };

    setPendingComplaints(prev => [...prev, newComplaint]);
    setComplaintData({ description: '', location: '', address: '', category: 'General' });
    setShowForm(false);
  };

  const formatTime = (date) => {
    return date ? date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }) : 'Never';
  };

  return (
    <div className="glass-panel p-6 transform hover:-translate-y-2 transition-all duration-300 relative overflow-hidden h-full">
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-neon-blue/10 rounded-full blur-3xl"></div>

      <div className="flex justify-between items-start mb-6 relative z-10">
        <h2 className="text-xl font-bold tracking-wide flex items-center gap-2">
          <svg className="w-6 h-6 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          {t.title}
        </h2>
        <div className={`px-3 py-1 rounded-full border text-xs font-mono tracking-widest flex items-center gap-2 ${
          isOnline
            ? 'bg-green-500/10 border-green-500/40 text-green-400'
            : 'bg-red-500/10 border-red-500/40 text-red-400'
        }`}>
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,1)]' : 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,1)] animate-pulse'}`}></div>
          {isOnline ? 'ONLINE' : 'OFFLINE'}
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        {/* Status Overview */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Pending Sync</p>
            <p className="text-lg font-bold text-neon-purple">{pendingComplaints.length}</p>
          </div>
          <div className="bg-white/5 p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Last Sync</p>
            <p className="text-xs font-mono text-gray-400">{formatTime(lastSyncTime)}</p>
          </div>
        </div>

        {/* Submit Offline Complaint */}
        <div className="space-y-3">
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white rounded-lg font-semibold shadow-lg shadow-purple-500/20 hover:brightness-110 transition-all"
          >
            {showForm ? t.cancelBtn : t.submitBtn}
          </button>

          {showForm && (
            <form onSubmit={handleOfflineSubmit} className="space-y-3 p-4 bg-white/5 border border-white/10 rounded-lg">
              <div>
                <label className="block text-sm text-gray-300 mb-2">{t.descLabel}</label>
                <textarea
                  value={complaintData.description}
                  onChange={(e) => setComplaintData({...complaintData, description: e.target.value})}
                  placeholder={t.descPh}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-neon-blue focus:outline-none transition-colors resize-none"
                  rows="3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">{t.locLabel}</label>
                <select
                  value={complaintData.location}
                  onChange={(e) => setComplaintData({...complaintData, location: e.target.value})}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-neon-blue focus:outline-none transition-colors"
                  style={{ backgroundColor: '#0f172a' }}
                >
                  <option value="" style={{ backgroundColor: '#0f172a', color: '#94a3b8' }}>{t.locPh}</option>
                  <option value="Downtown" style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}>🏙️ Downtown</option>
                  <option value="North District" style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}>⬆️ North District</option>
                  <option value="South District" style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}>⬇️ South District</option>
                  <option value="East District" style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}>➡️ East District</option>
                  <option value="West District" style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}>⬅️ West District</option>
                  <option value="Central Park" style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}>🌳 Central Park</option>
                  <option value="Market Area" style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}>🛒 Market Area</option>
                  <option value="Residential Zone" style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}>🏠 Residential Zone</option>
                  <option value="Industrial Area" style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}>🏭 Industrial Area</option>
                  <option value="School Zone" style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}>🎓 School Zone</option>
                  <option value="Hospital Area" style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}>🏥 Hospital Area</option>
                  <option value="Transport Hub" style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}>🚇 Transport Hub</option>
                  <option value="Commercial Complex" style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}>🏢 Commercial Complex</option>
                  <option value="Rural Area" style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}>🌾 Rural Area</option>
                  <option value="Other" style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}>📍 Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">{t.addrLabel}</label>
                <input
                  type="text"
                  value={complaintData.address}
                  onChange={(e) => setComplaintData({...complaintData, address: e.target.value})}
                  placeholder={t.addrPh}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-neon-blue focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">{t.catLabel}</label>
                <select
                  value={complaintData.category}
                  onChange={(e) => setComplaintData({...complaintData, category: e.target.value})}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-neon-blue focus:outline-none transition-colors"
                  style={{ backgroundColor: '#0f172a' }}
                >
                  <option value="General" style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}>General</option>
                  <option value="Infrastructure" style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}>Infrastructure</option>
                  <option value="Services" style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}>Services</option>
                  <option value="Environment" style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}>Environment</option>
                  <option value="Other" style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}>Other</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold shadow-lg shadow-emerald-500/20 hover:brightness-110 transition-all disabled:opacity-50"
              >
                {submitting ? '⏳...' : t.saveBtn}
              </button>
            </form>
          )}
        </div>

        {/* Sync Status */}
        {pendingComplaints.length > 0 && (
          <div className="bg-white/5 p-3 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-gray-500">Sync Status</p>
              {syncing && <div className="text-xs text-neon-blue animate-pulse">SYNCING...</div>}
            </div>

            {syncing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs text-gray-400">Uploading to server...</span>
              </div>
            ) : (
              <div className="text-xs text-gray-400">
                {isOnline ? 'Will sync automatically when online' : 'Waiting for internet connection'}
              </div>
            )}
          </div>
        )}

        {/* Recent Offline Submissions */}
        {pendingComplaints.length > 0 && (
          <div className="bg-white/5 p-3 rounded-lg max-h-32 overflow-y-auto">
            <p className="text-xs text-gray-500 mb-2">Recent Offline Submissions</p>
            <div className="space-y-1">
              {pendingComplaints.slice(-3).map((complaint, index) => (
                <div key={complaint.id} className="text-xs text-gray-400 flex justify-between">
                  <span className="truncate">{complaint.description.substring(0, 30)}...</span>
                  <span>{new Date(complaint.timestamp).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Manual Sync Button */}
        {isOnline && pendingComplaints.length > 0 && (
          <button
            onClick={syncPendingComplaints}
            disabled={syncing}
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold shadow-lg shadow-blue-500/20 hover:brightness-110 transition-all disabled:opacity-50"
          >
            {syncing ? '⏳ Syncing...' : t.syncNow}
          </button>
        )}
      </div>
    </div>
  );
};

export default OfflineSync;

