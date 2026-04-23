import { useState, useEffect } from 'react';
import API from '../api/Api';

const ServiceTracking = ({ language = 'en' }) => {
  const [services, setServices] = useState([]);
  const [userRequests, setUserRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [description, setDescription] = useState('');
  const [predictionResult, setPredictionResult] = useState(null);
  const [expandedRequest, setExpandedRequest] = useState(null);

  const t = {
    en: {
      submitReq: 'Submit New Request', cancelBtn: 'Cancel', addBtn: 'Add Request',
      selService: 'Select Service', chooseService: 'Choose a service...',
      serviceDetails: 'Service Details', predictBtn: '🔮 Predict Service Delay',
      descLabel: 'Description', descPh: 'Provide details about your request...',
      submitBtn: '✅ Submit Request'
    },
    ta: {
      submitReq: 'புதிய கோரிக்கையை பதிவு செய்க', cancelBtn: 'ரத்து செய்', addBtn: 'கோரிக்கை சேர்',
      selService: 'சேவையைத் தேர்ந்தெடுக்கவும்', chooseService: 'சேவையைத் தேர்ந்தெடுக்கவும்...',
      serviceDetails: 'சேவை விவரங்கள்', predictBtn: '🔮 சேவையின் தாமதத்தை கணிக்கவும்',
      descLabel: 'விளக்கம்', descPh: 'உங்கள் கோரிக்கையின் விவரங்களை வழங்கவும்...',
      submitBtn: '✅ கோரிக்கையை சமர்ப்பிக்கவும்'
    },
    ml: {
      submitReq: 'പുതിയ അഭ്യർത്ഥന സമർപ്പിക്കുക', cancelBtn: 'റദ്ദാക്കുക', addBtn: 'അഭ്യർത്ഥന ചേർക്കുക',
      selService: 'സേവനം തിരഞ്ഞെടുക്കുക', chooseService: 'സേവനം തിരഞ്ഞെടുക്കുക...',
      serviceDetails: 'സേവന വിവരങ്ങൾ', predictBtn: '🔮 സേവന കാലതാമസം പ്രവചിക്കുക',
      descLabel: 'വിവരണം', descPh: 'വിവരങ്ങൾ നൽകുക...', submitBtn: '✅ സമർപ്പിക്കുക'
    },
    te: {
      submitReq: 'కొత్త అభ్యర్థనను సమర్పించండి', cancelBtn: 'రద్దు చేయి', addBtn: 'అభ్యర్థన జోడించండి',
      selService: 'సేవను ఎంచుకోండి', chooseService: 'సేవను ఎంచుకోండి...',
      serviceDetails: 'సేవ వివరాలు', predictBtn: '🔮 సేవా జాప్యాన్ని అంచనా వేయండి',
      descLabel: 'వివరణ', descPh: 'వివరాలు అందించండి...', submitBtn: '✅ సమర్పించండి'
    },
    kn: {
      submitReq: 'ಹೊಸ ವಿನಂತಿಯನ್ನು ಸಲ್ಲಿಸಿ', cancelBtn: 'ರದ್ದುಮಾಡಿ', addBtn: 'ವಿನಂತಿ ಸೇರಿಸಿ',
      selService: 'ಸೇವೆ ಆಯ್ಕೆಮಾಡಿ', chooseService: 'ಸೇವೆ ಆಯ್ಕೆಮಾಡಿ...',
      serviceDetails: 'ಸೇವಾ ವಿವರಗಳು', predictBtn: '🔮 ಸೇವಾ ವಿಳಂಬವನ್ನು ಊಹಿಸಿ',
      descLabel: 'ವಿವರಣೆ', descPh: 'ವಿವರಗಳನ್ನು ಒದಗಿಸಿ...', submitBtn: '✅ ಸಲ್ಲಿಸಿ'
    },
    hi: {
      submitReq: 'नया अनुरोध सबमिट करें', cancelBtn: 'रद्द करें', addBtn: 'अनुरोध जोड़ें',
      selService: 'सेवा चुनें', chooseService: 'सेवा चुनें...',
      serviceDetails: 'सेवा विवरण', predictBtn: '🔮 सेवा में देरी की भविष्यवाणी करें',
      descLabel: 'विवरण', descPh: 'विवरण प्रदान करें...', submitBtn: '✅ सबमिट करें'
    }
  }[language] || {
      submitReq: 'Submit New Request', cancelBtn: 'Cancel', addBtn: 'Add Request',
      selService: 'Select Service', chooseService: 'Choose a service...',
      serviceDetails: 'Service Details', predictBtn: '🔮 Predict Service Delay',
      descLabel: 'Description', descPh: 'Provide details about your request...',
      submitBtn: '✅ Submit Request'
  };

  useEffect(() => {
    fetchServices();
    fetchUserRequests();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await API.get('/api/services');
      setServices(res.data);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services');
    }
  };

  const fetchUserRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await API.get('/api/service-requests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUserRequests(res.data);
    } catch (err) {
      console.error('Error fetching user requests:', err);
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (!selectedService || !description.trim()) {
      setError('Please select a service and enter description');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await API.post(
        '/api/service-requests/submit',
        {
          service_id: selectedService.id,
          description
        },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      setUserRequests([res.data, ...userRequests]);
      setSelectedService(null);
      setDescription('');
      setPredictionResult(null);
      setShowForm(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  const handlePredictServiceDelay = async () => {
    if (!selectedService) {
      setError('Please select a service before predicting delay');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await API.get(`/api/services/${selectedService.id}/predict`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setPredictionResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to predict service delay');
      setPredictionResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackRequest = async (request) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await API.post(
        '/api/service-requests/track',
        {
          reference_number: request.reference_number,
          service_id: request.service_id
        },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      // Update the request in the list
      setUserRequests(
        userRequests.map(r => r.id === request.id ? res.data : r)
      );
      setExpandedRequest(request.id);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to track request');
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (request) => {
    const avgDays = services.find(s => s.id === request.service_id)?.average_processing_days || 1;
    const daysElapsed = Math.floor(
      (new Date() - new Date(request.submission_date)) / (1000 * 60 * 60 * 24)
    );
    return Math.min(100, Math.round((daysElapsed / avgDays) * 100));
  };

  const getStatusColor = (status) => {
    const colors = {
      'Submitted': 'bg-blue-500/20 text-blue-300',
      'In Progress': 'bg-yellow-500/20 text-yellow-300',
      'Completed': 'bg-green-500/20 text-green-300',
      'Pending': 'bg-gray-500/20 text-gray-300'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-300';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'High': 'bg-red-500/20 text-red-300',
      'Medium': 'bg-yellow-500/20 text-yellow-300',
      'Low': 'bg-green-500/20 text-green-300',
      'Normal': 'bg-blue-500/20 text-blue-300'
    };
    return colors[priority] || 'bg-blue-500/20 text-blue-300';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'from-green-400 to-green-600';
    if (confidence >= 75) return 'from-yellow-400 to-yellow-600';
    return 'from-orange-400 to-orange-600';
  };

  return (
    <div className="min-h-screen bg-space-dark p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 tracking-wide">
          <span className="text-white">Service Tracking</span>
          <span className="neon-text ml-3">& Predictions</span>
        </h1>
        <p className="text-gray-400">
          Track your government service requests and get AI-powered completion time predictions
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Submit New Request */}
          <div className="glass-panel p-6 border border-purple-500/30 bg-gradient-to-br from-slate-900 via-[#0f172a] to-[#111827] shadow-[0_25px_60px_rgba(99,102,241,0.18)]">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {t.submitReq}
                </h2>
                <p className="text-xs uppercase tracking-[0.24em] text-purple-300/70 mt-1">வலிமையான ஓர் கோரிக்கை பதிவு செய்யவும்</p>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="text-sm font-semibold bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white px-4 py-2 rounded-full shadow-lg shadow-purple-500/20 hover:brightness-110 transition-all"
              >
                {showForm ? t.cancelBtn : t.addBtn}
              </button>
            </div>

            {showForm && (
              <form onSubmit={handleSubmitRequest} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">{t.selService}</label>
                  <select
                    value={selectedService?.id || ''}
                    onChange={(e) => {
                      const service = services.find(s => s.id === parseInt(e.target.value));
                      setSelectedService(service);
                      setPredictionResult(null);
                    }}
                    className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-sm text-white focus:border-neon-blue focus:outline-none transition-colors max-h-48 overflow-y-auto"
                    style={{ color: selectedService ? '#f8fafc' : '#94a3b8', backgroundColor: '#0f172a' }}
                  >
                    <option value="" style={{ backgroundColor: '#0f172a', color: '#94a3b8' }}>
                      {t.chooseService}
                    </option>
                    {services.map(s => (
                      <option
                        key={s.id}
                        value={s.id}
                        style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}
                      >
                        {s.name} ({s.average_processing_days} days)
                      </option>
                    ))}
                  </select>
                </div>

                {selectedService && (
                  <div className="space-y-3">
                    <div className="p-3 bg-neon-blue/5 border border-neon-blue/20 rounded-lg">
                      <p className="text-xs text-gray-400 mb-2">{t.serviceDetails}</p>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-300">{selectedService.description}</p>
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 text-xs text-gray-500 mt-2">
                          <span>📊 Department: {selectedService.department}</span>
                          <span>⏱️ Avg: {selectedService.average_processing_days} days</span>
                          <span className={`px-2 py-1 rounded ${getPriorityColor(selectedService.priority)}`}>
                            {selectedService.priority}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handlePredictServiceDelay}
                      disabled={loading}
                      className="w-full px-4 py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-lg font-semibold shadow-lg shadow-fuchsia-500/20 hover:brightness-110 transition-all disabled:opacity-50"
                    >
                      {loading ? '⏳...' : t.predictBtn}
                    </button>

                    {predictionResult && (
                      <div className="p-4 bg-white/5 border border-neon-blue/20 rounded-lg space-y-3">
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-gray-400">Prediction for {predictionResult.service_name}</p>
                          <span className="text-[10px] uppercase tracking-[0.2em] text-cyan-300">Historical average</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="bg-white/5 p-3 rounded-lg">
                            <p className="text-xs text-gray-400">Average Resolution Time</p>
                            <p className="text-lg font-semibold text-white mt-2">{predictionResult.average_resolution_days} days</p>
                          </div>
                          <div className="bg-white/5 p-3 rounded-lg">
                            <p className="text-xs text-gray-400">Predicted Completion</p>
                            <p className="text-lg font-semibold text-neon-blue mt-2">{formatDate(predictionResult.predicted_completion_date)}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400">{predictionResult.note}</p>
                        <p className="text-xs text-gray-400">Based on {predictionResult.record_count} historical completed record{predictionResult.record_count === 1 ? '' : 's'}.</p>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm text-gray-300 mb-2">{t.descLabel}</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t.descPh}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-neon-blue focus:outline-none transition-colors resize-none"
                    rows="3"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !selectedService}
                  className="w-full px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold shadow-lg shadow-emerald-500/20 hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {loading ? '⏳...' : t.submitBtn}
                </button>
              </form>
            )}
          </div>

          {/* My Service Requests */}
          <div className="glass-panel p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              My Service Requests ({userRequests.length})
            </h2>

            {userRequests.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-400 text-lg">📋 No service requests yet</p>
                <p className="text-gray-500 text-sm mt-2">Submit your first request to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {userRequests.map((request) => {
                  const service = services.find(s => s.id === request.service_id);
                  const progress = calculateProgress(request);
                  const isExpanded = expandedRequest === request.id;

                  return (
                    <div
                      key={request.id}
                      className="glass-card p-4 space-y-3 cursor-pointer hover:bg-white/5 transition-all"
                      onClick={() => setExpandedRequest(isExpanded ? null : request.id)}
                    >
                      {/* Header */}
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-gray-200">{request.service_name}</p>
                            <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(request.current_status)}`}>
                              {request.current_status}
                            </span>
                          </div>
                          <p className="text-xs font-mono text-gray-500">
                            Ref: {request.reference_number}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Submitted</p>
                          <p className="text-sm text-gray-300">{formatDate(request.submission_date)}</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-xs text-gray-500">📊 Processing Progress</p>
                          <span className="text-xs font-semibold text-neon-blue">{progress}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-neon-blue to-neon-purple h-2 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Quick Info */}
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-white/5 p-2 rounded">
                          <p className="text-gray-500">Days Remaining</p>
                          <p className="font-bold text-neon-blue mt-1">
                            {Math.max(0, request.days_remaining || 0)} days
                          </p>
                        </div>
                        <div className="bg-white/5 p-2 rounded">
                          <p className="text-gray-500">Expected</p>
                          <p className="font-semibold text-gray-300 mt-1">
                            {formatDate(request.expected_completion_date)}
                          </p>
                        </div>
                        <div className="bg-white/5 p-2 rounded">
                          <p className="text-gray-500">Confidence</p>
                          <p className={`font-bold mt-1 ${
                            (request.prediction_confidence || 85) >= 90 ? 'text-green-300' :
                            (request.prediction_confidence || 85) >= 75 ? 'text-yellow-300' :
                            'text-orange-300'
                          }`}>
                            {request.prediction_confidence || 85}%
                          </p>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                          <div className="bg-white/5 p-3 rounded">
                            <p className="text-xs text-gray-500 mb-2">📝 Request Description</p>
                            <p className="text-sm text-gray-300">{request.description}</p>
                          </div>

                          {/* AI Prediction Confidence */}
                          <div className="bg-white/5 p-3 rounded">
                            <div className="flex justify-between items-center mb-2">
                              <p className="text-xs text-gray-500">🤖 AI Prediction Confidence</p>
                              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                                (request.prediction_confidence || 85) >= 90 ? 'bg-green-500/20 text-green-300' :
                                (request.prediction_confidence || 85) >= 75 ? 'bg-yellow-500/20 text-yellow-300' :
                                'bg-orange-500/20 text-orange-300'
                              }`}>
                                {request.prediction_confidence || 85}%
                              </span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2">
                              <div
                                className={`bg-gradient-to-r ${getConfidenceColor(request.prediction_confidence || 85)} h-2 rounded-full transition-all`}
                                style={{ width: `${request.prediction_confidence || 85}%` }}
                              />
                            </div>
                          </div>

                          {/* Processing Stage */}
                          {request.processing_stage && (
                            <div className="bg-white/5 p-3 rounded">
                              <p className="text-xs text-gray-500 mb-2">📍 Current Stage</p>
                              <p className="text-sm text-gray-300">{request.processing_stage}</p>
                            </div>
                          )}

                          {/* Update Prediction Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTrackRequest(request);
                            }}
                            disabled={loading}
                            className="w-full px-3 py-2 bg-neon-blue/20 border border-neon-blue text-neon-blue hover:bg-neon-blue/30 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
                          >
                            {loading ? '⏳ Updating...' : '🔄 Update Prediction'}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Services Info */}
        <div className="space-y-6">
          <div className="glass-panel p-6">
            <h3 className="text-lg font-bold mb-4">📋 Available Services</h3>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
                  onClick={() => {
                    setSelectedService(service);
                    setShowForm(true);
                  }}
                >
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <p className="font-semibold text-sm text-gray-200">{service.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded whitespace-nowrap ${getPriorityColor(service.priority)}`}>
                      {service.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{service.description}</p>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">📊 {service.department}</span>
                    <span className="text-neon-blue font-bold">⏱️ {service.average_processing_days}d</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div className="glass-panel p-6">
            <h3 className="text-lg font-bold mb-4">📊 Quick Stats</h3>
            <div className="space-y-3">
              <div className="p-3 bg-neon-blue/10 border border-neon-blue/20 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Total Requests</p>
                <p className="text-2xl font-bold text-neon-blue">{userRequests.length}</p>
              </div>
              <div className="p-3 bg-neon-purple/10 border border-neon-purple/20 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">In Progress</p>
                <p className="text-2xl font-bold text-neon-purple">
                  {userRequests.filter(r => r.current_status === 'Submitted' || r.current_status === 'In Progress').length}
                </p>
              </div>
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Completed</p>
                <p className="text-2xl font-bold text-green-300">
                  {userRequests.filter(r => r.current_status === 'Completed').length}
                </p>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="glass-panel p-6 bg-neon-blue/5 border border-neon-blue/20">
            <h4 className="font-semibold text-sm text-neon-blue mb-3">💡 How It Works</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li className="flex gap-2">
                <span>1️⃣</span>
                <span>Submit a service request</span>
              </li>
              <li className="flex gap-2">
                <span>2️⃣</span>
                <span>Get AI prediction for completion</span>
              </li>
              <li className="flex gap-2">
                <span>3️⃣</span>
                <span>Track progress in real-time</span>
              </li>
              <li className="flex gap-2">
                <span>4️⃣</span>
                <span>View processing stage updates</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceTracking;
