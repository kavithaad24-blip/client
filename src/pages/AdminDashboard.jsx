import { useState, useEffect } from 'react';

function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/audit/reports');
      
      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }

      const data = await response.json();
      setReports(data.reports || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Error fetching reports');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = filter === 'All' 
    ? reports 
    : reports.filter(report => report.status === filter);

  const statusColors = {
    'Pending': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
    'In Progress': 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    'Resolved': 'bg-green-500/20 text-green-300 border-green-500/40',
    'On Hold': 'bg-orange-500/20 text-orange-300 border-orange-500/40'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-dark via-space-dark to-purple-900/20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">📊 Admin Dashboard</h1>
          <p className="text-gray-400">All Corruption Audit Reports & Complaints</p>
        </div>

        {/* Filter Section */}
        <div className="mb-6 flex gap-3 flex-wrap">
          {['All', 'Pending', 'In Progress', 'Resolved', 'On Hold'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-mono text-sm transition-all ${
                filter === status
                  ? 'bg-neon-blue text-white shadow-[0_0_15px_rgba(56,189,248,0.5)]'
                  : 'bg-white/5 border border-white/20 text-gray-300 hover:bg-white/10'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-lg text-red-300">
            ❌ {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(56,189,248,0.5)]"></div>
              <p className="text-gray-400">Loading reports...</p>
            </div>
          </div>
        )}

        {/* Reports Grid */}
        {!loading && (
          <div>
            {filteredReports.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-400 text-lg">No reports found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredReports.map((report) => (
                  <div
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className="glass-panel p-6 rounded-xl cursor-pointer hover:shadow-[0_0_30px_rgba(56,189,248,0.3)] transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-white">Report #{report.id}</h3>
                      <span className={`px-3 py-1 rounded text-xs font-mono border ${statusColors[report.status] || statusColors['Pending']}`}>
                        {report.status}
                      </span>
                    </div>

                    {/* Image Thumbnail */}
                    {report.image && (
                      <div className="mb-4 rounded-lg overflow-hidden h-40 bg-white/5">
                        <img 
                          src={`http://localhost:5000/uploads/${report.image}`}
                          alt="Report"
                          className="w-full h-full object-cover opacity-80"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{report.description}</p>

                    {/* Address */}
                    {report.address && (
                      <div className="bg-white/5 border border-white/10 rounded-lg p-3 mb-4">
                        <p className="text-xs text-gray-400 mb-1">📌 Address</p>
                        <p className="text-sm text-white">{report.address}</p>
                      </div>
                    )}

                    {/* GPS Location */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3 mb-4">
                      <p className="text-xs text-gray-400 mb-2">📍 GPS Location</p>
                      <div className="font-mono text-sm text-neon-blue">
                        {report.latitude?.toFixed(6)}, {report.longitude?.toFixed(6)}
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">🏢 Department</p>
                        <p className="text-sm text-white font-mono">{report.department || 'N/A'}</p>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">🔨 Contractor</p>
                        <p className="text-sm text-white font-mono">{report.contractor || 'N/A'}</p>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">🗺️ Zone</p>
                        <p className="text-sm text-white font-mono">{report.zone || 'N/A'}</p>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">📅 Date</p>
                        <p className="text-sm text-white font-mono">
                          {new Date(report.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Detected Issues */}
                    {report.issues && report.issues.length > 0 && (
                      <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-2">⚠️ Detected Issues ({report.issues.length})</p>
                        <div className="flex flex-wrap gap-2">
                          {report.issues.slice(0, 3).map((issue, idx) => (
                            <span
                              key={idx}
                              className={`text-xs px-2 py-1 rounded ${
                                issue.severity === 'critical'
                                  ? 'bg-red-500/30 text-red-300'
                                  : issue.severity === 'high'
                                  ? 'bg-orange-500/30 text-orange-300'
                                  : 'bg-yellow-500/30 text-yellow-300'
                              }`}
                            >
                              {issue.issue.replace(/_/g, ' ')}
                            </span>
                          ))}
                          {report.issues.length > 3 && (
                            <span className="text-xs px-2 py-1 rounded bg-white/10 text-gray-300">
                              +{report.issues.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Refresh Button */}
        <div className="mt-8 text-center">
          <button
            onClick={fetchReports}
            disabled={loading}
            className="px-6 py-2 bg-neon-blue/20 border border-neon-blue text-neon-blue hover:bg-neon-blue/30 rounded-lg transition-colors disabled:opacity-50"
          >
            🔄 Refresh Reports
          </button>
        </div>
      </div>

      {/* Modal for Full Details */}
      {selectedReport && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="bg-gradient-to-b from-white/10 to-white/5 border border-white/20 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-white">Report Details #{selectedReport.id}</h2>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Full Image */}
            {selectedReport.image && (
              <div className="mb-6 rounded-lg overflow-hidden bg-white/5 border border-white/10">
                <img
                  src={`http://localhost:5000/uploads/${selectedReport.image}`}
                  alt="Report"
                  className="w-full h-96 object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Full Description */}
            <div className="mb-6 bg-white/5 border border-white/10 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-2">📝 Full Description</p>
              <p className="text-white text-sm leading-relaxed">{selectedReport.description}</p>
            </div>

            {/* Address */}
            {selectedReport.address && (
              <div className="mb-6 bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">📌 Location Address</p>
                <p className="text-white text-sm">{selectedReport.address}</p>
              </div>
            )}

            {/* GPS Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">📍 Latitude</p>
                <p className="text-neon-blue font-mono text-sm">{selectedReport.latitude?.toFixed(8)}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">📍 Longitude</p>
                <p className="text-neon-blue font-mono text-sm">{selectedReport.longitude?.toFixed(8)}</p>
              </div>
            </div>

            {/* Full Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">🏢 Department</p>
                <p className="text-white font-mono">{selectedReport.department || 'N/A'}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">🔨 Contractor</p>
                <p className="text-white font-mono">{selectedReport.contractor || 'N/A'}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">🗺️ Zone</p>
                <p className="text-white font-mono">{selectedReport.zone || 'N/A'}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">📊 Status</p>
                <span className={`px-3 py-1 rounded text-xs font-mono border inline-block ${statusColors[selectedReport.status] || statusColors['Pending']}`}>
                  {selectedReport.status}
                </span>
              </div>
            </div>

            {/* All Detected Issues */}
            {selectedReport.issues && selectedReport.issues.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
                <p className="text-gray-400 text-sm mb-4">⚠️ All Detected Issues</p>
                <div className="space-y-3">
                  {selectedReport.issues.map((issue, idx) => (
                    <div key={idx} className="bg-white/5 rounded p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white text-sm font-semibold capitalize">
                            {issue.issue.replace(/_/g, ' ')}
                          </p>
                          <p className="text-gray-400 text-xs mt-1">{issue.category}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs px-2 py-1 rounded font-mono inline-block ${
                            issue.severity === 'critical'
                              ? 'bg-red-500/30 text-red-300'
                              : issue.severity === 'high'
                              ? 'bg-orange-500/30 text-orange-300'
                              : issue.severity === 'medium'
                              ? 'bg-yellow-500/30 text-yellow-300'
                              : 'bg-blue-500/30 text-blue-300'
                          }`}>
                            {issue.severity.toUpperCase()}
                          </span>
                          <p className="text-gray-400 text-xs mt-1">{issue.confidence}% confidence</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="text-gray-400 text-xs text-center pt-4 border-t border-white/10">
              <p>Submitted: {new Date(selectedReport.created_at).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
