import { useState, useEffect } from 'react';

const AICorruptionAudit = ({ language = 'en' }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [contractorInput, setContractorInput] = useState('');
  const [reportStatus, setReportStatus] = useState('Pending');
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');
  const [status, setStatus] = useState('idle'); // idle, ready, analyzing, complete, error
  const [detectedIssues, setDetectedIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gpsStatus, setGpsStatus] = useState('Getting GPS location...');
  const [department, setDepartment] = useState('');
  const [contractor, setContractor] = useState('');
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [locationSearchInput, setLocationSearchInput] = useState('');

  // All Indian States & Major Cities with coordinates
  const indianLocations = [
    { name: '📍 Andhra Pradesh - Hyderabad', lat: '17.360589', lng: '78.474845' },
    { name: '📍 Arunachal Pradesh - Itanagar', lat: '28.2180', lng: '93.6053' },
    { name: '📍 Assam - Guwahati', lat: '26.1445', lng: '91.7362' },
    { name: '📍 Bihar - Patna', lat: '25.5941', lng: '85.1376' },
    { name: '📍 Chhattisgarh - Raipur', lat: '21.2514', lng: '81.6296' },
    { name: '📍 Goa - Panaji', lat: '15.2993', lng: '73.8243' },
    { name: '📍 Gujarat - Ahmedabad', lat: '23.0225', lng: '72.5714' },
    { name: '📍 Haryana - Chandigarh', lat: '30.7333', lng: '76.7794' },
    { name: '📍 Himachal Pradesh - Shimla', lat: '31.7975', lng: '77.1025' },
    { name: '🏔️ Jammu & Kashmir - Srinagar', lat: '34.0837', lng: '74.7973' },
    { name: '📍 Jharkhand - Ranchi', lat: '23.3441', lng: '85.3096' },
    { name: '🧡 Karnataka - Bangalore', lat: '12.9716', lng: '77.5946' },
    { name: '📍 Kerala - Kochi', lat: '9.9312', lng: '76.2673' },
    { name: '🌴 Madhya Pradesh - Bhopal', lat: '23.1815', lng: '79.9864' },
    { name: '🏝️ Maharashtra - Mumbai', lat: '19.0760', lng: '72.8777' },
    { name: '📍 Manipur - Imphal', lat: '24.8170', lng: '94.9062' },
    { name: '📍 Meghalaya - Shillong', lat: '25.5788', lng: '91.8933' },
    { name: '📍 Mizoram - Aizawl', lat: '23.1815', lng: '92.9789' },
    { name: '📍 Nagaland - Kohima', lat: '25.6150', lng: '94.1086' },
    { name: '📍 Odisha - Bhubaneswar', lat: '20.2961', lng: '85.8245' },
    { name: '📍 Punjab - Chandigarh', lat: '30.7333', lng: '76.7794' },
    { name: '📍 Rajasthan - Jaipur', lat: '26.9124', lng: '75.7873' },
    { name: '🌴 Tamil Nadu - Chennai', lat: '13.0827', lng: '80.2707' },
    { name: '📍 Telangana - Hyderabad', lat: '17.3850', lng: '78.4867' },
    { name: '📍 Tripura - Agartala', lat: '23.8103', lng: '91.2787' },
    { name: '⭐ Uttar Pradesh - Lucknow', lat: '26.8467', lng: '80.9462' },
    { name: '📍 Uttarakhand - Dehradun', lat: '30.3165', lng: '78.0322' },
    { name: '📍 West Bengal - Kolkata', lat: '22.5726', lng: '88.3639' },
    { name: '📍 Delhi - New Delhi', lat: '28.7041', lng: '77.1025' }
  ];

  const filteredLocations = indianLocations.filter(loc =>
    loc.name.toLowerCase().includes(locationSearchInput.toLowerCase())
  );

  const setSelectedLocation = (lat, lng) => {
    setManualLat(lat);
    setManualLng(lng);
    setGpsStatus('📍 Manual Location Set');
    setShowLocationSearch(false);
    setLocationSearchInput('');
  };

  // Get GPS location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      const timeout = setTimeout(() => {
        setGpsStatus('⏱️ GPS Request Timeout - Try Manual Entry');
      }, 10000);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeout);
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setGpsStatus('✓ GPS Location Acquired Successfully');
        },
        (error) => {
          clearTimeout(timeout);
          console.warn('Geolocation error:', error.message);
          
          let errorMsg = '❌ GPS Not Available - ';
          if (error.code === error.PERMISSION_DENIED) {
            errorMsg += 'Permission Denied (Check browser settings)';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMsg += 'Position Unavailable';
          } else {
            errorMsg += 'Enter Manually';
          }
          setGpsStatus(errorMsg);
        },
        { timeout: 8000, enableHighAccuracy: false }
      );
    } else {
      setGpsStatus('❌ Geolocation Not Supported - Enter Manually');
    }
  }, []);

  const retryGPS = () => {
    setGpsStatus('🔄 Retrying GPS...');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setGpsStatus('✓ GPS Location Acquired');
          setError('');
        },
        (error) => {
          console.warn('Geolocation error:', error);
          setGpsStatus('❌ GPS Not Available - Enter Manually');
        }
      );
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setupFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setupFile(e.target.files[0]);
    }
  };

  const setupFile = (file) => {
    setFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      setStatus('ready');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (status === 'complete') {
      resetForm();
      return;
    }
    
    // Get effective coordinates (GPS or manual)
    const finalLat = location.latitude || (manualLat ? parseFloat(manualLat) : null);
    const finalLng = location.longitude || (manualLng ? parseFloat(manualLng) : null);
    
    // Validate required fields
    if (!file) {
      setError('❌ Image is required');
      return;
    }
    
    if (!description.trim()) {
      setError('❌ Problem description is required');
      return;
    }

    if (!address.trim()) {
      setError('❌ Location address is required');
      return;
    }
    
    if (!finalLat || !finalLng) {
      setError('❌ GPS coordinates are required - Use GPS or enter manually');
      return;
    }

    setLoading(true);
    setStatus('analyzing');
    setError('');

    try {
      // Simulate API call and AI analysis delay
      setTimeout(() => {
        setDetectedIssues([
          { issue: 'pothole', category: 'Infrastructure', severity: 'high', confidence: 92 },
          { issue: 'road_damage', category: 'Infrastructure', severity: 'medium', confidence: 85 }
        ]);
        setDepartment('Public Works Department');
        setContractor('City Municipal Corp');
        setStatus('complete');
        setLoading(false);
      }, 2500);

    } catch (err) {
      setError(err.message || 'Error submitting report');
      setStatus('error');
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPreview(null);
    setAddress('');
    setDescription('');
    setContractorInput('');
    setReportStatus('Pending');
    setManualLat('');
    setManualLng('');
    setDetectedIssues([]);
    setStatus('idle');
    setError('');
    setDepartment('');
    setContractor('');
  };

  const t = {
    en: {
      title: 'AI Corruption Audit',
      reqFields: '✓ Required Fields:',
      imgUpload: 'Image uploaded',
      descLabel: 'Problem Description *',
      descSub: "Describe the issue you've observed in detail",
      descPh: 'E.g., Potholes on main street, damaged footbridge...',
      addrLabel: '📍 Location Address *',
      addrSub: 'Enter the specific address or location details',
      addrPh: 'E.g., Main Street near Municipal Building, Ward 45, etc.',
      contractorLabel: 'Contractor Name (if known)',
      contractorSub: 'Enter the name of the contractor responsible',
      contractorPh: 'E.g., ABC Construction Company Ltd...',
      statusLabel: 'Report Status',
      statusSub: 'Select the current status of the issue',
      uploadLabel: '📸 Upload Image Evidence *',
      uploadSub: 'Drag & drop or click to upload a clear photo of the issue',
      uploadDrag: 'Drag & drop image here or click to browse',
      submitBtn: '🚀 Initiate AI Scan - Submit Report',
      missingBtn: '⚡ Complete Missing Fields',
      successMsg: 'Report Submitted Successfully!'
    },
    ta: {
      title: 'AI ஊழல் தணிக்கை',
      reqFields: '✓ தேவையான விவரங்கள்:',
      imgUpload: 'புகைப்படம்',
      descLabel: 'பிரச்சினையின் விளக்கம் *',
      descSub: 'நீங்கள் பார்த்த பிரச்சினையை விரிவாக விவரிக்கவும்',
      descPh: 'உதா: பிரதான சாலையில் பள்ளங்கள், சேதமடைந்த பாலம்...',
      addrLabel: '📍 இருப்பிட முகவரி *',
      addrSub: 'குறிப்பிட்ட முகவரி அல்லது இடத்தின் விவரங்களை உள்ளிடவும்',
      addrPh: 'உதா: முனிசிபல் கட்டிடம் அருகே உள்ள மெயின் ரோடு...',
      contractorLabel: 'ஒப்பந்ததாரர் பெயர் (தெரிந்தால்)',
      contractorSub: 'பொறுப்பான ஒப்பந்ததாரரின் பெயரை உள்ளிடவும்',
      contractorPh: 'உதா: ஏபிசி கன்ஸ்ட்ரக்ஷன் கம்பெனி...',
      statusLabel: 'அறிக்கையின் நிலை',
      statusSub: 'பிரச்சினையின் தற்போதைய நிலையை தேர்ந்தெடுக்கவும்',
      uploadLabel: '📸 ஆதார புகைப்படத்தை பதிவேற்றவும் *',
      uploadSub: 'புகைப்படத்தை இங்கு இழுத்து விடவும் அல்லது பதிவேற்ற கிளிக் செய்யவும்',
      uploadDrag: 'படத்தை இங்கு இழுத்து விடவும் அல்லது உலாவ கிளிக் செய்யவும்',
      submitBtn: '🚀 AI ஆய்வை தொடங்கு - சமர்ப்பிக்கவும்',
      missingBtn: '⚡ விடுபட்ட விவரங்களை பூர்த்தி செய்யவும்',
      successMsg: 'அறிக்கை வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!'
    },
    ml: {
      title: 'AI അഴിമതി ഓഡിറ്റ്', reqFields: '✓ ആവശ്യമായവ:', imgUpload: 'ചിത്രം',
      descLabel: 'പ്രശ്ന വിവരണം *', descSub: 'വിശദമാക്കുക', descPh: 'ഉദാ: കുഴികൾ...', addrLabel: '📍 വിലാസം *', addrSub: 'വിലാസം നൽകുക', addrPh: 'ഉദാ: മെയിൻ സ്ട്രീറ്റ്...', contractorLabel: 'കരാറുകാരൻ', contractorSub: 'പേര്', contractorPh: 'ഉദാ: എബിസി നിർമ്മാണം...', statusLabel: 'സ്റ്റാറ്റസ്', statusSub: 'നിലവിലെ അവസ്ഥ', uploadLabel: '📸 ചിത്രം അപ്‌ലോഡ് ചെയ്യുക *', uploadSub: 'ചിത്രം നൽകുക', uploadDrag: 'ക്ലിക്ക് ചെയ്യുക', submitBtn: '🚀 സമർപ്പിക്കുക', missingBtn: '⚡ പൂർത്തിയാക്കുക', successMsg: 'വിജയകരം!'
    },
    te: {
      title: 'AI అవినీతి ఆడిట్', reqFields: '✓ అవసరమైనవి:', imgUpload: 'చిత్రం',
      descLabel: 'సమస్య వివరణ *', descSub: 'వివరించండి', descPh: 'ఉదా: గుంతలు...', addrLabel: '📍 చిరునామా *', addrSub: 'చిరునామా నమోదు చేయండి', addrPh: 'ఉదా: మెయిన్ స్ట్రీట్...', contractorLabel: 'కాంట్రాక్టర్', contractorSub: 'పేరు', contractorPh: 'ఉదా: ఏబీసీ కన్స్ట్రక్షన్...', statusLabel: 'స్థితి', statusSub: 'ప్రస్తుత స్థితి', uploadLabel: '📸 చిత్రం అప్‌లోడ్ చేయండి *', uploadSub: 'చిత్రం ఇవ్వండి', uploadDrag: 'క్లిక్ చేయండి', submitBtn: '🚀 సమర్పించండి', missingBtn: '⚡ పూర్తి చేయండి', successMsg: 'విజయవంతం!'
    },
    kn: {
      title: 'AI ಭ್ರಷ್ಟಾಚಾರ ಲೆಕ್ಕಪರಿಶೋಧನೆ', reqFields: '✓ ಅಗತ್ಯವಿದೆ:', imgUpload: 'ಚಿತ್ರ',
      descLabel: 'ಸಮಸ್ಯೆ ವಿವರಣೆ *', descSub: 'ವಿವರಿಸಿ', descPh: 'ಉದಾ: ಗುಂಡಿಗಳು...', addrLabel: '📍 ವಿಳಾಸ *', addrSub: 'ವಿಳಾಸ ನಮೂದಿಸಿ', addrPh: 'ಉದಾ: ಮುಖ್ಯ ರಸ್ತೆ...', contractorLabel: 'ಗುತ್ತಿಗೆದಾರ', contractorSub: 'ಹೆಸರು', contractorPh: 'ಉದಾ: ಎಬಿಸಿ ನಿರ್ಮಾಣ...', statusLabel: 'ಸ್ಥಿತಿ', statusSub: 'ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ', uploadLabel: '📸 ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ *', uploadSub: 'ಚಿತ್ರ ನೀಡಿ', uploadDrag: 'ಕ್ಲಿಕ್ ಮಾಡಿ', submitBtn: '🚀 ಸಲ್ಲಿಸಿ', missingBtn: '⚡ ಪೂರ್ಣಗೊಳಿಸಿ', successMsg: 'ಯಶಸ್ವಿಯಾಗಿದೆ!'
    },
    hi: {
      title: 'एआई भ्रष्टाचार ऑडिट', reqFields: '✓ आवश्यक:', imgUpload: 'छवि',
      descLabel: 'समस्या का विवरण *', descSub: 'विवरण दें', descPh: 'उदा: गड्ढे...', addrLabel: '📍 पता *', addrSub: 'पता दर्ज करें', addrPh: 'उदा: मुख्य सड़क...', contractorLabel: 'ठेकेदार', contractorSub: 'नाम', contractorPh: 'उदा: एबीसी निर्माण...', statusLabel: 'स्थिति', statusSub: 'वर्तमान स्थिति', uploadLabel: '📸 छवि अपलोड करें *', uploadSub: 'छवि दें', uploadDrag: 'क्लिक करें', submitBtn: '🚀 सबमिट करें', missingBtn: '⚡ पूरा करें', successMsg: 'सफल!'
    }
  }[language] || {
    title: 'AI Corruption Audit', reqFields: '✓ Required Fields:', imgUpload: 'Image uploaded',
    descLabel: 'Problem Description *', descSub: "Describe the issue you've observed in detail", descPh: 'E.g., Potholes on main street, damaged footbridge...', addrLabel: '📍 Location Address *', addrSub: 'Enter the specific address or location details', addrPh: 'E.g., Main Street near Municipal Building, Ward 45, etc.', contractorLabel: 'Contractor Name (if known)', contractorSub: 'Enter the name of the contractor responsible', contractorPh: 'E.g., ABC Construction Company Ltd...', statusLabel: 'Report Status', statusSub: 'Select the current status of the issue', uploadLabel: '📸 Upload Image Evidence *', uploadSub: 'Drag & drop or click to upload a clear photo of the issue', uploadDrag: 'Drag & drop image here or click to browse', submitBtn: '🚀 Initiate AI Scan - Submit Report', missingBtn: '⚡ Complete Missing Fields', successMsg: 'Report Submitted Successfully!'
  };

  return (
    <div className="glass-panel p-6 transform hover:-translate-y-2 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold tracking-wide flex items-center gap-2">
          <svg className="w-6 h-6 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          {t.title}
        </h2>
        <div className="flex gap-2">
          {status === 'analyzing' && <span className="animate-pulse text-neon-blue text-sm font-mono border border-neon-blue/40 px-2 py-0.5 rounded bg-neon-blue/10">ANALYZING</span>}
          {status === 'complete' && <span className="text-green-400 text-sm font-mono border border-green-500/40 px-2 py-0.5 rounded bg-green-500/10">VERIFIED</span>}
          {status === 'error' && <span className="text-red-400 text-sm font-mono border border-red-500/40 px-2 py-0.5 rounded bg-red-500/10">ERROR</span>}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/40 rounded-lg text-red-300 text-sm font-mono">
          {error}
        </div>
      )}

      {!preview ? (
        <div className="space-y-4">
          {/* Field Requirements Summary */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <div className="text-xs text-blue-300 mb-2 font-mono">{t.reqFields}</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className={`${file ? 'text-green-400' : 'text-gray-400'}`}>
                {file ? '✓' : '○'} {t.imgUpload}
              </div>
              <div className={`${description.trim() ? 'text-green-400' : 'text-gray-400'}`}>
                {description.trim() ? '✓' : '○'} {t.descLabel.replace(' *', '')}
              </div>
              <div className={`${address.trim() ? 'text-green-400' : 'text-gray-400'}`}>
                {address.trim() ? '✓' : '○'} {t.addrLabel.replace('📍 ', '').replace(' *', '')}
              </div>
              <div className={`${location.latitude || manualLat ? 'text-green-400' : 'text-gray-400'}`}>
                {location.latitude || manualLat ? '✓' : '○'} Latitude
              </div>
              <div className={`${location.longitude || manualLng ? 'text-green-400' : 'text-gray-400'}`}>
                {location.longitude || manualLng ? '✓' : '○'} Longitude
              </div>
            </div>
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-mono text-gray-300 mb-2">{t.descLabel}</label>
            <p className="text-xs text-gray-400 mb-2">{t.descSub}</p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.descPh}
              className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-500 focus:border-neon-blue focus:outline-none text-sm"
              rows="3"
            />
          </div>

          {/* Address Input */}
          <div>
            <label className="block text-sm font-mono text-gray-300 mb-2">{t.addrLabel}</label>
            <p className="text-xs text-gray-400 mb-2">{t.addrSub}</p>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t.addrPh}
              className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-500 focus:border-neon-blue focus:outline-none text-sm"
            />
          </div>

          {/* Contractor Name Input */}
          <div>
            <label className="block text-sm font-mono text-gray-300 mb-2">{t.contractorLabel}</label>
            <p className="text-xs text-gray-400 mb-2">{t.contractorSub}</p>
            <input
              type="text"
              value={contractorInput}
              onChange={(e) => setContractorInput(e.target.value)}
              placeholder={t.contractorPh}
              className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-500 focus:border-neon-blue focus:outline-none text-sm"
            />
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-sm font-mono text-gray-300 mb-2">{t.statusLabel}</label>
            <p className="text-xs text-gray-400 mb-2">{t.statusSub}</p>
            <select
              value={reportStatus}
              onChange={(e) => setReportStatus(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white focus:border-neon-blue focus:outline-none text-sm"
            >
              <option value="Pending" className="bg-gray-800">⏳ Pending - Newly reported</option>
              <option value="In Progress" className="bg-gray-800">🔄 In Progress - Being investigated</option>
              <option value="Resolved" className="bg-gray-800">✅ Resolved - Issue fixed</option>
              <option value="On Hold" className="bg-gray-800">⏸️ On Hold - Waiting for resources</option>
            </select>
          </div>

          {/* Location Display */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-mono text-gray-300 mb-1">📍 Latitude</label>
              {location.latitude ? (
                <div className="bg-green-500/20 border border-green-500/40 rounded-lg p-3 text-green-300 text-sm font-mono">
                  {location.latitude.toFixed(6)}
                </div>
              ) : (
                <input
                  type="number"
                  step="0.000001"
                  placeholder="Enter latitude"
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-500 focus:border-neon-blue focus:outline-none text-sm"
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-mono text-gray-300 mb-1">📍 Longitude</label>
              {location.longitude ? (
                <div className="bg-green-500/20 border border-green-500/40 rounded-lg p-3 text-green-300 text-sm font-mono">
                  {location.longitude.toFixed(6)}
                </div>
              ) : (
                <input
                  type="number"
                  step="0.000001"
                  placeholder="Enter longitude"
                  value={manualLng}
                  onChange={(e) => setManualLng(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-500 focus:border-neon-blue focus:outline-none text-sm"
                />
              )}
            </div>
          </div>

          {/* GPS Status */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center justify-between">
            <span className="text-xs text-gray-400">{gpsStatus}</span>
            {!location.latitude && (
              <button
                onClick={retryGPS}
                className="text-xs px-2 py-1 bg-neon-blue/20 border border-neon-blue text-neon-blue rounded hover:bg-neon-blue/30 transition-colors"
              >
                🔄 Retry GPS
              </button>
            )}
          </div>

          {/* Quick Location Presets */}
          {!location.latitude && (
            <div>
              <label className="block text-sm font-mono text-gray-300 mb-2">Select Location from States</label>
              
              {/* Search Input */}
              <div className="relative mb-2">
                <input
                  type="text"
                  placeholder="🔍 Type state/city name (e.g., 'Mumbai', 'Delhi', 'Bangalore')..."
                  value={locationSearchInput}
                  onChange={(e) => {
                    setLocationSearchInput(e.target.value);
                    setShowLocationSearch(true);
                  }}
                  onFocus={() => setShowLocationSearch(true)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-500 focus:border-neon-blue focus:outline-none text-sm"
                />
                
                {/* Dropdown Results */}
                {showLocationSearch && locationSearchInput && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-space-dark border border-white/20 rounded-lg shadow-2xl z-50 max-h-64 overflow-y-auto">
                    {filteredLocations.length > 0 ? (
                      filteredLocations.map((loc, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedLocation(loc.lat, loc.lng)}
                          className="w-full text-left px-4 py-2 hover:bg-neon-blue/20 border-b border-white/10 transition-all text-sm text-gray-300 hover:text-white"
                        >
                          {loc.name}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-400 text-sm">No locations found</div>
                    )}
                  </div>
                )}

                {/* Selected Location Info */}
                {(manualLat || manualLng) && (
                  <div className="mt-2 px-3 py-2 bg-green-500/20 border border-green-500/40 rounded-lg text-green-300 text-sm font-mono">
                    ✓ Selected: Lat {manualLat}, Lng {manualLng}
                  </div>
                )}
              </div>

              {/* Close button when showing results */}
              {showLocationSearch && (
                <button
                  onClick={() => setShowLocationSearch(false)}
                  className="text-xs px-2 py-1 bg-white/10 border border-white/20 text-gray-400 rounded hover:bg-white/20 transition-colors"
                >
                  ✕ Close
                </button>
              )}
            </div>
          )}

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-mono text-gray-300 mb-2">{t.uploadLabel}</label>
            <p className="text-xs text-gray-400 mb-2">{t.uploadSub}</p>
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
              <p className="text-gray-400 group-hover:text-gray-200 transition-colors">{t.uploadDrag}</p>
              {file && <p className="text-neon-blue text-xs mt-2 font-mono">✓ {file.name}</p>}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Image Preview */}
          <div className="relative rounded-xl overflow-hidden glass-card">
            <img src={preview} alt="Audit Preview" className="w-full h-48 object-cover opacity-80 mix-blend-screen" />
            
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
                    Analysis Complete
                  </div>
               </div>
            )}
            
            {status !== 'analyzing' && (
              <button 
                onClick={() => { setPreview(null); setFile(null); setStatus('idle'); }}
                className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full hover:bg-black/80 text-white border border-white/10"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>

          {/* Detected Issues */}
          {status === 'complete' && detectedIssues.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <h3 className="text-sm font-mono text-neon-blue mb-3 uppercase tracking-widest">Detected Issues</h3>
              <div className="space-y-2">
                {detectedIssues.map((issue, idx) => (
                  <div key={idx} className="flex items-between justify-between bg-white/5 border border-white/10 rounded p-2">
                    <div className="flex-1">
                      <div className="text-white text-sm font-semibold capitalize">{issue.issue.replace(/_/g, ' ')}</div>
                      <div className="text-xs text-gray-400">{issue.category}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs font-mono px-2 py-1 rounded ${
                        issue.severity === 'critical' ? 'bg-red-500/30 text-red-300' :
                        issue.severity === 'high' ? 'bg-orange-500/30 text-orange-300' :
                        issue.severity === 'medium' ? 'bg-yellow-500/30 text-yellow-300' :
                        'bg-blue-500/30 text-blue-300'
                      }`}>
                        {issue.severity.toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{issue.confidence}% confidence</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Department & Contractor Info */}
          {status === 'complete' && (
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">🏢 Department</div>
                <div className="text-sm text-white font-mono">{department}</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">🔨 Contractor</div>
                <div className="text-sm text-white font-mono">{contractorInput || contractor}</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">📊 Status</div>
                <div className={`text-sm font-mono px-2 py-1 rounded text-center ${
                  reportStatus === 'Pending' ? 'bg-yellow-500/20 text-yellow-300' :
                  reportStatus === 'In Progress' ? 'bg-blue-500/20 text-blue-300' :
                  reportStatus === 'Resolved' ? 'bg-green-500/20 text-green-300' :
                  'bg-orange-500/20 text-orange-300'
                }`}>
                  {reportStatus}
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {status === 'complete' && (
            <div className="p-4 bg-green-500/20 border border-green-500/40 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="text-green-400 font-semibold text-sm">Report Submitted Successfully!</h4>
                  <p className="text-green-300/80 text-xs mt-1">The audit report has been sent to the relevant department for investigation.</p>
                </div>
              </div>
            </div>
          )}
          
          <button 
            onClick={handleSubmit}
            disabled={loading || (status === 'analyzing')}
            className={`w-full py-3 px-4 rounded-lg font-semibold tracking-wide transition-all transform ${
              status === 'ready' 
                ? 'bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-90 hover:scale-105 shadow-[0_0_20px_rgba(56,189,248,0.6)] text-white cursor-pointer' 
                : status === 'complete'
                ? 'bg-gradient-to-r from-green-500/30 to-green-400/30 border border-green-500 hover:from-green-500/40 hover:to-green-400/40 text-green-300 cursor-pointer'
                : status === 'analyzing'
                ? 'bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed opacity-50'
                : 'bg-neon-blue/10 border-2 border-neon-blue text-neon-blue hover:bg-neon-blue/20 cursor-pointer'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-3 h-3 border-2 border-neon-blue border-t-transparent rounded-full animate-spin"></span>
                Processing...
              </span>
            ) : status === 'complete' ? (
              <span className="flex items-center justify-center gap-2">
                ✓ Report Submitted - Submit Another Report
              </span>
            ) : status === 'ready' ? (
              <span className="flex items-center justify-center gap-2">
                {t.submitBtn}
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                {t.missingBtn} ({file && description.trim() && address.trim() && (location.latitude || manualLat) && (location.longitude || manualLng) ? 'All filled' : 'Check above'})
              </span>
            )}
          </button>

          {/* Helpful Tips Below Button */}
          {status !== 'analyzing' && status !== 'complete' && (
            <div className="text-xs text-gray-500 text-center mt-2">
              All fields must be filled before submission. Use GPS or select location manually.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AICorruptionAudit;
