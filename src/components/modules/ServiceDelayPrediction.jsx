import { useState, useEffect } from 'react';

const ServiceDelayPrediction = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState({});
  const [expandedPrediction, setExpandedPrediction] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/complaints/user-complaints', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setComplaints(data);
      }
    } catch (err) {
      console.error('Error fetching complaints:', err);
    }
  };

  const handlePredict = async (complaintId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/complaints/predict-delay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ complaint_id: complaintId })
      });

      if (res.ok) {
        const prediction = await res.json();
        setPredictions({
          ...predictions,
          [complaintId]: prediction
        });
        setExpandedPrediction(complaintId);
      }
    } catch (err) {
      console.error('Error predicting delay:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-blue-500/20 text-blue-300',
      'In Progress': 'bg-yellow-500/20 text-yellow-300',
      'Resolved': 'bg-green-500/20 text-green-300',
      'Closed': 'bg-gray-500/20 text-gray-300'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-300';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'High': 'bg-red-500/20 text-red-300',
      'Medium': 'bg-yellow-500/20 text-yellow-300',
      'Low': 'bg-green-500/20 text-green-300'
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

  return (
    <div className="glass-panel p-6 transform hover:-translate-y-2 transition-all duration-300 relative h-full">
      <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-neon-blue/10 rounded-full blur-3xl"></div>

      <h2 className="text-xl font-bold tracking-wide mb-6 flex items-center gap-2 relative z-10">
        <svg className="w-6 h-6 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Problem Status & AI Prediction
      </h2>

      <div className="space-y-3 relative z-10">
        {complaints.length === 0 ? (
          <div className="p-4 bg-white/5 border border-dashed border-white/20 rounded-lg text-center">
            <p className="text-sm text-gray-400">📝 No problems reported yet</p>
            <p className="text-xs text-gray-500 mt-2">Submit your problems in the Audit form to track predictions</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {complaints.map((complaint) => {
              const prediction = predictions[complaint.id];
              const isPredictionExpanded = expandedPrediction === complaint.id;

              return (
                <div key={complaint.id} className="glass-card p-3 space-y-2 cursor-pointer hover:bg-white/5 transition-all">
                  {/* Header */}
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-200 line-clamp-1">
                        {complaint.description.substring(0, 50)}...
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        📍 {complaint.location || 'Location not specified'}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(complaint.status)}`}>
                        {complaint.status}
                      </span>
                    </div>
                  </div>

                  {/* Date Info */}
                  <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-white/10">
                    <span>📅 {formatDate(complaint.created_at)}</span>
                    <span>ID: {complaint.id}</span>
                  </div>

                  {/* Predict Button */}
                  <button
                    onClick={() => handlePredict(complaint.id)}
                    disabled={loading}
                    className="w-full mt-2 px-3 py-2 bg-neon-blue/20 border border-neon-blue text-neon-blue hover:bg-neon-blue/30 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading && expandedPrediction === complaint.id ? (
                      <>⏳ Analyzing...</>
                    ) : prediction ? (
                      <>✅ View Prediction</>
                    ) : (
                      <>🎯 Predict Completion</>
                    )}
                  </button>

                  {/* Prediction Results */}
                  {prediction && isPredictionExpanded && (
                    <div className="mt-3 p-3 bg-neon-blue/5 border border-neon-blue/20 rounded-lg space-y-2">
                      {/* Completion Time */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white/5 p-2 rounded">
                          <p className="text-xs text-gray-500">⏱️ Days Remaining</p>
                          <p className="text-lg font-bold text-neon-blue mt-1">{prediction.days_remaining}</p>
                        </div>
                        <div className="bg-white/5 p-2 rounded">
                          <p className="text-xs text-gray-500">📅 Est. Completion</p>
                          <p className="text-xs font-semibold text-gray-300 mt-1">
                            {formatDate(prediction.expected_completion_date)}
                          </p>
                        </div>
                      </div>

                      {/* AI Analysis */}
                      <div className="bg-white/5 p-2 rounded">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-xs text-gray-500">🤖 AI Prediction Confidence</p>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                            prediction.confidence >= 90 ? 'bg-green-500/20 text-green-300' : 
                            prediction.confidence >= 75 ? 'bg-yellow-500/20 text-yellow-300' : 
                            'bg-orange-500/20 text-orange-300'
                          }`}>
                            {prediction.confidence}%
                          </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-1.5">
                          <div
                            className="bg-gradient-to-r from-neon-blue to-neon-purple h-1.5 rounded-full transition-all"
                            style={{ width: `${prediction.confidence}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Processing Stage */}
                      <div className="bg-white/5 p-2 rounded">
                        <p className="text-xs text-gray-500 mb-2">📊 Processing Stage</p>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">{prediction.current_stage}</span>
                          <span className="text-neon-blue font-bold">{prediction.stage_percentage}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-1">
                          <div
                            className="bg-gradient-to-r from-neon-purple to-neon-blue h-1 rounded-full transition-all"
                            style={{ width: `${prediction.stage_percentage}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Key Insights */}
                      <div className="bg-white/5 p-2 rounded">
                        <p className="text-xs text-gray-500 mb-1">💡 Key Insights</p>
                        <p className="text-xs text-gray-300">{prediction.insight}</p>
                      </div>

                      {/* Risk Indicator */}
                      {prediction.risk_level && (
                        <div className={`p-2 rounded flex items-start gap-2 ${
                          prediction.risk_level === 'High' ? 'bg-red-500/10 border border-red-500/20' :
                          prediction.risk_level === 'Medium' ? 'bg-yellow-500/10 border border-yellow-500/20' :
                          'bg-green-500/10 border border-green-500/20'
                        }`}>
                          <span className="text-xs">
                            {prediction.risk_level === 'High' ? '⚠️' : 
                             prediction.risk_level === 'Medium' ? '⚡' : '✅'}
                          </span>
                          <span className={`text-xs ${
                            prediction.risk_level === 'High' ? 'text-red-300' :
                            prediction.risk_level === 'Medium' ? 'text-yellow-300' :
                            'text-green-300'
                          }`}>
                            {prediction.risk_message}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDelayPrediction;
            </form>
          </div>
        )}

        {userRequests.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-200">📑 My Service Requests</h3>
              <button
                onClick={() => setShowForm(!showForm)}
                className="text-xs text-neon-blue hover:text-neon-blue/70 transition-colors"
              >
                {showForm ? 'Hide' : 'Add New'}
              </button>
            </div>

            {showForm && (
              <div className="space-y-4 p-3 bg-white/5 border border-neon-blue/20 rounded-lg">
                <select
                  value={selectedService?.id || ''}
                  onChange={(e) => {
                    const service = services.find(s => s.id === parseInt(e.target.value));
                    setSelectedService(service);
                  }}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-neon-blue focus:outline-none transition-colors"
                >
                  <option value="">Select a service...</option>
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>

                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="Reference number"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-neon-blue focus:outline-none transition-colors"
                />

                {error && (
                  <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded p-2">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleTrackRequest}
                  disabled={loading || !selectedService || !referenceNumber}
                  className="w-full px-3 py-2 bg-neon-blue/20 border border-neon-blue text-neon-blue hover:bg-neon-blue/30 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
                >
                  {loading ? '⏳ Tracking...' : '🔍 Track'}
                </button>
              </div>
            )}

            <div className="space-y-2 max-h-[250px] overflow-y-auto">
              {userRequests.map((request) => (
                <div key={request.id} className="glass-card p-3 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-mono text-gray-400">
                        {request.reference_number}
                      </p>
                      <p className="text-sm font-semibold text-gray-200 mt-1">
                        {request.service_name}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(request.current_status)}`}>
                      {request.current_status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">{request.processing_stage}</span>
                      <span className="text-neon-blue font-bold">{getStageProgress(request.processing_stage).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1">
                      <div
                        className="bg-gradient-to-r from-neon-blue to-neon-purple h-1 rounded-full transition-all"
                        style={{ width: `${getStageProgress(request.processing_stage)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between text-xs pt-2 border-t border-white/10">
                    <span className="text-gray-500">
                      ⏱️ {request.days_remaining} days remaining
                    </span>
                    <span className="text-gray-500">
                      🎯 {request.prediction_confidence}% confidence
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDelayPrediction;
