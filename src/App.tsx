import { useState, useEffect } from 'react';
import { useHealthStore } from './store';
import { askExecutiveAssistant } from './ai';
import DistrictMap from './modules/map/DistrictMap';
import ForecastingChart from './modules/ai/ForecastingChart';
import VoiceReporter from './modules/voice/VoiceReporter';
import { jsPDF } from 'jspdf';
import ExecutiveIntelligence from './modules/dashboard/ExecutiveIntelligence';
import DiseaseIntelligence from './modules/dashboard/DiseaseIntelligence';
import PerformanceAnalytics from './modules/dashboard/PerformanceAnalytics';
import NightlyWorkflow from './modules/dashboard/NightlyWorkflow';
import ResourceSimulator from './modules/simulation/ResourceSimulator';
import StockScanner from './modules/inventory/StockScanner';
import AIExplainability from './modules/dashboard/AIExplainability';
import DemoStoryMode from './modules/dashboard/DemoStoryMode';

const renderMarkdownLine = (line: string) => {
  let displayLine = line;
  let isBullet = false;
  
  if (displayLine.trim().startsWith('*')) {
    displayLine = displayLine.replace(/^\s*\*\s*/, '• ');
    isBullet = true;
  } else if (displayLine.trim().startsWith('-')) {
    displayLine = displayLine.replace(/^\s*-\s*/, '• ');
    isBullet = true;
  }
  
  const parts = displayLine.split('**');
  const renderedText = parts.map((part, index) => {
    if (index % 2 === 1) {
      return <strong key={index} className="font-bold text-white">{part}</strong>;
    }
    return part;
  });

  return (
    <span className={isBullet ? 'pl-1' : ''}>
      {renderedText}
    </span>
  );
};

export default function App() {
  const {
    role,
    language,
    activeTab,
    offlineMode,
    offlineQueue,
    syncNotification,
    crisisMode,
    transferApproved,
    facilities,
    logs,
    diagnosticTests,
    staffMembers,
    setRole,
    setLanguage,
    setActiveTab,
    toggleOfflineMode,
    clearSyncNotification,
    logDailyConsumption,
    logPatientFootfall,
    simulateCrisis,
    approveTransfer,
    allocateBed,
    releaseBed,
    redeployStaff,
    requestMaintenance,
    addLog
  } = useHealthStore();

  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string>(
    language === 'hi' ? 
    '### 🏥 जिला स्वास्थ्य केंद्र कार्यकारी सारांश\n\n**मल्टीलिंग्वल एआई प्लेटफॉर्म** वास्तविक समय में जिले के प्रमुख केंद्रों (PHCs/CHCs) की निगरानी कर रहा है:\n\n1. **स्टॉक और इन्वेंटरी**: इन्वेंटरी स्तर अनुकूल हैं। "Simulate Crisis" बटन दबाकर आप आपातकालीन स्थिति और एआई पुनर्वितरण का परीक्षण कर सकते हैं।\n2. **मरीज फुटफॉल**: आज जिले में कुल **776 मरीजों** का पंजीकरण हुआ है। औसत प्रतीक्षा समय 15 से 34 मिनट के बीच है।\n3. **बिस्तर उपलब्धता**: PHC Gamma में बिस्तर क्षमता (91%) लगभग पूर्ण है।\n4. **कर्मचारी उपस्थिति**: जिले में कुल डॉक्टर उपस्थिति **92%** है।\n\n*नीचे दिए गए त्वरित प्रश्न चुनें या अपना खुद का प्रश्न टाइप करें।*' :
    language === 'reg' ?
    '### 🏥 പ്രാദേശിക ആരോഗ്യ കേന്ദ്രത്തിന്റെ സംഗ്രഹം\n\nജില്ലയിലെ പ്രമുഖ കേന്ദ്രങ്ങളിലെ തത്സമയ വിവരങ്ങൾ പ്ലാറ്റ്‌ഫോം നിരീക്ഷിക്കുന്നു:\n\n1. **മരുന്ന് സ്റ്റോക്ക്**: നിലവിലെ സ്റ്റോക്ക് തൃപ്തികരമാണ്. അടിയന്തര സാഹചര്യങ്ങളും എഐ പുനർവിതരണവും പരിശോധിക്കാൻ "Simulate Crisis" ബട്ടൺ അമർത്തുക.\n2. **രോഗികളുടെ എണ്ണം**: ഇന്ന് ആകെ **776 രോഗികൾ** രജിസ്റ്റർ ചെയ്തിട്ടുണ്ട്.\n3. **കിടക്കകളുടെ ലഭ്യത**: PHC ഗാമയിൽ 91% കിടക്കകളും നിറഞ്ഞിരിക്കുന്നു.\n4. **ജീവനക്കാരുടെ ഹാജർ**: ജില്ലയിലെ ഡോക്ടർമാരുടെ ഹാജർ **92%** ആണ്.' :
    '### 🏥 District Health Network Executive Summary\n\nThe **Multilingual AI Health Platform** is actively monitoring real-time telemetry across district facilities:\n\n1. **Inventory Health**: Baseline inventory levels are currently stable. Click **"Simulate Crisis (Killer Demo)"** above to test the AI Early Stock-out Warning & Smart Redistribution engine.\n2. **Patient Footfall**: A total of **776 patients** have been logged today across the district. Estimated wait times range from 15 mins to 34 mins.\n3. **Bed Capacity**: PHC Gamma is nearing total capacity at **91% bed occupancy**.\n4. **Staff Coverage**: Overall physician attendance is excellent at **92% active coverage**.\n\n*Select a quick prompt below or type your own administrative query.*'
  );
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedFacilityId, setSelectedFacilityId] = useState('phc-alpha');
  const [inventoryFilter, setInventoryFilter] = useState('All');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [demoStep, setDemoStep] = useState<number | null>(null);

  const startDemo = () => {
    setDemoStep(1);
    setActiveTab('dashboard');
  };

  const nextDemoStep = () => {
    if (demoStep === 1) {
      simulateCrisis();
      setDemoStep(2);
    } else if (demoStep === 2) {
      approveTransfer();
      setDemoStep(3);
    } else if (demoStep === 3) {
      exportRedistributionReportPDF();
      setDemoStep(null);
    }
  };

  // Trigger micro-interaction for chart bars when rendered
  useEffect(() => {
    const bars = document.querySelectorAll('.chart-bar') as NodeListOf<HTMLElement>;
    bars.forEach(bar => {
      const height = bar.style.height;
      bar.style.height = '0%';
      setTimeout(() => {
        bar.style.height = height;
      }, 300);
    });
  }, [activeTab]);

  const handleAskAI = async (query: string) => {
    if (!query.trim()) return;
    setAiLoading(true);
    try {
      const resp = await askExecutiveAssistant(query, facilities, language);
      setAiResponse(resp);
    } catch (error) {
      console.error('AI request failed:', error);
      setAiResponse('Error retrieving AI response. Please check network connection.');
    } finally {
      setAiLoading(false);
    }
  };

  const exportRedistributionReportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("HealthNexus AI - Emergency Redistribution Report", 14, 20);
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 28);
    doc.text("Status: EXECUTED (Crisis Averted)", 14, 34);
    doc.setFontSize(14);
    doc.text("1. Event Details:", 14, 46);
    doc.setFontSize(10);
    doc.text("- Source Facility: CHC Beta (Tijara) [Surplus Hub]", 18, 52);
    doc.text("- Destination Facility: PHC Alpha (Mundawar) [Crisis Point]", 18, 58);
    doc.text("- Transferred Stock: Amoxicillin 500mg - 50 Boxes", 18, 64);
    doc.setFontSize(14);
    doc.text("2. Operational Impact:", 14, 76);
    doc.setFontSize(10);
    doc.text("- PHC Alpha stock replenished to 62 Boxes (above safety threshold of 50).", 18, 82);
    doc.text("- Target Stockout Date extended from 5 days to 30+ days.", 18, 88);
    doc.text("- CHC Beta retained 130 Boxes (comfortable buffer level).", 18, 94);
    doc.setFontSize(14);
    doc.text("3. Compliance & Telemetry:", 14, 106);
    doc.setFontSize(10);
    doc.text("- Logged to State NHM Portal ledger.", 18, 112);
    doc.text("- Digital verification completed on-device.", 18, 118);
    doc.text("- Security Hash: 8F5A6C3D2E1B0A9F", 18, 124);
    doc.save("emergency-redistribution-report.pdf");
  };

  const isHi = language === 'hi';
  const isReg = language === 'reg';

  // KPI Calculations
  const totalAlerts = facilities.filter(f => f.status !== 'OPTIMAL').length + (crisisMode && !transferApproved ? 3 : 0);

  return (
    <div className="bg-background text-on-surface font-body-md overflow-x-hidden min-h-screen flex flex-col">
      {/* TopNavBar matching Stitch format */}
      <header className="flex justify-between items-center w-full px-lg h-16 sticky top-0 z-50 bg-surface border-b border-outline-variant shadow-sm">
        <div className="flex items-center gap-md">
          <span 
            onClick={() => setActiveTab('dashboard')}
            className="font-headline-md text-headline-md font-bold text-primary flex items-center gap-2 cursor-pointer"
          >
            HealthNexus AI
            <span className="text-xs font-semibold px-2.5 py-0.5 bg-primary-fixed text-on-primary-fixed border border-primary-fixed-dim rounded-full">
              District Portal
            </span>
          </span>
          {/* Language Dropdown */}
          <div className="relative ml-xl">
            <button 
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-outline-variant bg-surface hover:bg-surface-container transition-all shadow-sm text-secondary cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">translate</span>
              {language === 'en' ? 'English' : language === 'hi' ? 'Hindi' : 'Regional'}
              <span className="material-symbols-outlined text-xs">expand_more</span>
            </button>
            {showLangMenu && (
              <div className="absolute left-0 mt-1 w-32 bg-surface border border-outline-variant rounded-lg shadow-lg py-1 z-50 animate-fade-in">
                <button
                  onClick={() => { setLanguage('en'); setShowLangMenu(false); }}
                  className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-surface-container-high transition-colors ${language === 'en' ? 'text-primary bg-primary-container/20' : 'text-secondary'}`}
                >
                  English
                </button>
                <button
                  onClick={() => { setLanguage('hi'); setShowLangMenu(false); }}
                  className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-surface-container-high transition-colors ${language === 'hi' ? 'text-primary bg-primary-container/20' : 'text-secondary'}`}
                >
                  Hindi (हिन्दी)
                </button>
                <button
                  onClick={() => { setLanguage('reg'); setShowLangMenu(false); }}
                  className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-surface-container-high transition-colors ${language === 'reg' ? 'text-primary bg-primary-container/20' : 'text-secondary'}`}
                >
                  Regional
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Controls & Notifications */}
        <div className="flex items-center gap-md">
          {/* Offline Mode Toggle Button */}
          <button
            onClick={toggleOfflineMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all shadow-sm ${
              offlineMode 
              ? 'bg-amber-100 text-amber-900 border-amber-400 animate-pulse' 
              : 'bg-green-50 text-green-800 border-green-300 hover:bg-green-100'
            }`}
            title="Simulate low-bandwidth offline local cache vs cloud sync"
          >
            <span className="material-symbols-outlined text-base">
              {offlineMode ? 'wifi_off' : 'wifi'}
            </span>
            {offlineMode ? (isHi ? 'ऑफ़लाइन (कैश सक्रिय)' : isReg ? 'ഓഫ്‌ലൈൻ കാഷെ' : 'Offline (Cache Active)') : (isHi ? 'ऑनलाइन (NHM सिंक)' : isReg ? 'ഓൺലൈൻ സിങ്ക്' : 'Online (NHM Synced)')}
            {offlineQueue.length > 0 && (
              <span className="bg-amber-600 text-white font-bold px-1.5 py-0.2 rounded-full text-[10px]">
                {offlineQueue.length}
              </span>
            )}
          </button>

          {/* Role Switcher Pill */}
          <div className="bg-surface-container-high p-1 rounded-lg border border-outline-variant flex items-center space-x-1">
            <button
              onClick={() => { setRole('Admin'); setActiveTab('dashboard'); }}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${role === 'Admin' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              {isHi ? 'जिला व्यवस्थापक' : isReg ? 'ജില്ലാ അഡ്മിൻ' : 'District Admin'}
            </button>
            <button
              onClick={() => { setRole('Pharmacist'); setActiveTab('inventory'); }}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${role === 'Pharmacist' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              {isHi ? 'फार्मासिस्ट' : isReg ? 'ഫാർമസിസ്റ്റ്' : 'Pharmacist'}
            </button>
            <button
              onClick={() => { setRole('Doctor'); setActiveTab('patients'); }}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${role === 'Doctor' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              {isHi ? 'डॉक्टर / MO' : isReg ? 'ഡോക്ടർ / MO' : 'Doctor / MO'}
            </button>
          </div>

          {/* Guided Demo Button */}
          <button
            onClick={startDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-on-secondary hover:opacity-90 text-xs font-bold rounded-lg shadow transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">lightbulb</span>
            {isHi ? 'गाइडेड डेमो' : 'Guided Demo'}
          </button>

          {/* Simulate Crisis Trigger Button (The Killer Demo Initiator) */}
          <button
            onClick={simulateCrisis}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-error text-on-error hover:opacity-90 text-xs font-bold rounded-lg shadow transition-all animate-pulse-glow"
          >
            <span className="material-symbols-outlined text-base">warning</span>
            {isHi ? 'संकट सिमुलेशन (Killer Demo)' : isReg ? 'പ്രതിസന്ധി സിമുലേഷൻ' : 'Simulate Crisis (Killer Demo)'}
          </button>

          {/* Notifications Menu */}
          <div className="relative cursor-pointer hover:bg-surface-container p-sm rounded transition-colors group">
            <span className="material-symbols-outlined text-primary">notifications</span>
            <span className="absolute top-1 right-1 w-4 h-4 bg-error text-[10px] text-white flex items-center justify-center rounded-full font-bold">
              {totalAlerts}
            </span>
            <div className="absolute right-0 top-full mt-2 w-72 bg-surface shadow-lg border border-outline-variant rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-md">
              <div className="text-label-bold text-error border-b border-outline-variant pb-xs mb-sm flex items-center justify-between">
                <span>{totalAlerts} Critical Alerts</span>
                <span className="material-symbols-outlined text-sm">warning</span>
              </div>
              <div className="text-body-sm text-on-surface-variant space-y-2">
                <p><strong>PHC Alpha:</strong> Amoxicillin stock depletion warning.</p>
                <p><strong>PHC Sarita Vihar:</strong> High Footfall, Low Staff.</p>
                <p><strong>PHC Greater Kailash:</strong> Equipment Downtime.</p>
              </div>
            </div>
          </div>

          <span className="material-symbols-outlined text-primary cursor-pointer hover:bg-surface-container p-sm rounded transition-colors">account_circle</span>
        </div>
      </header>

      {/* Guided Demo Steps Banner */}
      {demoStep !== null && (
        <div className="bg-primary text-white py-3 px-6 flex items-center justify-between shadow-md border-b border-outline-variant z-50 transition-all animate-fade-in">
          <div className="flex items-center space-x-3">
            <span className="material-symbols-outlined text-xl text-white animate-bounce">tips_and_updates</span>
            <span className="text-sm font-bold">
              {demoStep === 1 && (isHi ? 'चरण 1: संकट शुरू करें। जारी रखने के लिए अगला क्लिक करें।' : 'Step 1: Outbreak Surge. Click Next to trigger the early warning AI alert.')}
              {demoStep === 2 && (isHi ? 'चरण 2: संकट सक्रिय। स्थानांतरित करने के लिए अगला क्लिक करें।' : 'Step 2: Risk Flagged. AI recommends redistributing 50 boxes of Amoxicillin from surplus. Click Next to authorize.')}
              {demoStep === 3 && (isHi ? 'चरण 3: संकट टल गया! रिपोर्ट पीडीएफ डाउनलोड करने के लिए अगला क्लिक करें।' : 'Step 3: Crisis Averted! Inventory balanced. Click Next to download the generated PDF transport manifest.')}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={nextDemoStep}
              className="bg-white text-primary hover:bg-surface-container-high px-4 py-1.5 rounded-md text-xs font-extrabold shadow-sm transition cursor-pointer"
            >
              {demoStep === 3 ? (isHi ? 'खत्म करें' : 'Finish & Export') : (isHi ? 'अगला' : 'Next Step')}
            </button>
            <button 
              onClick={() => setDemoStep(null)}
              className="text-white/85 hover:text-white text-xs font-bold px-3 py-1.5 rounded-md transition cursor-pointer"
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {/* Offline Sync Success Banner */}
      {syncNotification && (
        <div className="bg-green-700 text-white md:pl-[272px] px-lg py-3 flex items-center justify-between shadow-md animate-fade-in border-b border-green-600 z-40">
          <div className="flex items-center space-x-3">
            <span className="material-symbols-outlined text-xl text-green-200 animate-bounce">check_circle</span>
            <span className="text-sm font-bold">{syncNotification}</span>
          </div>
          <button 
            onClick={clearSyncNotification}
            className="text-green-100 hover:text-white text-xs font-bold bg-green-800 px-3 py-1 rounded-md transition"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Container with SideNavBar and Content */}
      <div className="flex flex-1">
        
        {/* SideNavBar matching Stitch format */}
        <nav className="flex flex-col h-[calc(100vh-64px)] fixed left-0 top-16 w-64 bg-surface-container-low border-r border-outline-variant hidden md:flex z-40">
          <div className="p-lg">
            <div className="flex items-center gap-md mb-sm">
              <div className="w-10 h-10 bg-primary-container rounded flex items-center justify-center text-white shadow-sm">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>health_and_safety</span>
              </div>
              <div>
                <div className="font-headline-sm text-headline-sm font-bold text-primary">Health Services</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">
                  {role === 'Admin' ? 'District Admin' : role === 'Pharmacist' ? 'Pharmacist Portal' : 'Medical Officer'}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 px-md space-y-1 overflow-y-auto">
            <button 
              onClick={() => { setActiveTab('dashboard'); setRole('Admin'); }}
              className={`w-full flex items-center gap-md px-md py-sm font-bold rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
            >
              <span className="material-symbols-outlined">dashboard</span>
              <span className="font-body-md text-body-md">{isHi ? 'जिला डैशबोर्ड' : 'District Dashboard'}</span>
            </button>
            <button 
              onClick={() => { setActiveTab('inventory'); setRole('Pharmacist'); }}
              className={`w-full flex items-center gap-md px-md py-sm font-bold rounded-lg transition-colors ${activeTab === 'inventory' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
            >
              <span className="material-symbols-outlined">inventory_2</span>
              <span className="font-body-md text-body-md">{isHi ? 'इन्वेंटरी प्रबंधन' : 'Inventory Management'}</span>
            </button>
            <button 
              onClick={() => { setActiveTab('patients'); setRole('Doctor'); }}
              className={`w-full flex items-center gap-md px-md py-sm font-bold rounded-lg transition-colors ${activeTab === 'patients' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
            >
              <span className="material-symbols-outlined">groups</span>
              <span className="font-body-md text-body-md">{isHi ? 'मरीज फ्लो एवं ट्रिएज' : 'Patient Flow & Triage'}</span>
            </button>
            <button 
              onClick={() => setActiveTab('beds')}
              className={`w-full flex items-center gap-md px-md py-sm font-bold rounded-lg transition-colors ${activeTab === 'beds' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
            >
              <span className="material-symbols-outlined">bed</span>
              <span className="font-body-md text-body-md">{isHi ? 'बिस्तर प्रबंधन' : 'Bed Management'}</span>
            </button>
            <button 
              onClick={() => setActiveTab('staff')}
              className={`w-full flex items-center gap-md px-md py-sm font-bold rounded-lg transition-colors ${activeTab === 'staff' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
            >
              <span className="material-symbols-outlined">event_available</span>
              <span className="font-body-md text-body-md">{isHi ? 'कर्मचारी उपस्थिति' : 'Staff Attendance'}</span>
            </button>
            <button 
              onClick={() => setActiveTab('tests')}
              className={`w-full flex items-center gap-md px-md py-sm font-bold rounded-lg transition-colors ${activeTab === 'tests' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
            >
              <span className="material-symbols-outlined">biotech</span>
              <span className="font-body-md text-body-md">{isHi ? 'डायग्नोस्टिक टेस्ट ऑडिट' : 'Diagnostic Tests Audit'}</span>
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-md px-md py-sm font-bold rounded-lg transition-colors ${activeTab === 'analytics' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
            >
              <span className="material-symbols-outlined">analytics</span>
              <span className="font-body-md text-body-md">{isHi ? 'एआई एनालिटिक्स' : 'Analytics & AI'}</span>
            </button>
          </div>

          <div className="p-md mt-auto border-t border-outline-variant">
            <button 
              onClick={simulateCrisis}
              className="w-full bg-primary text-white py-sm rounded-lg font-label-bold mb-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow"
            >
              {isHi ? 'एआई रिपोर्ट जनरेट करें' : 'Generate AI Report'}
            </button>
            <div className="space-y-1">
              <a className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-container-high transition-colors rounded-lg" href="#">
                <span className="material-symbols-outlined">settings</span>
                <span className="font-body-md text-body-md">Settings</span>
              </a>
              <a className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-container-high transition-colors rounded-lg" href="#">
                <span className="material-symbols-outlined">help</span>
                <span className="font-body-md text-body-md">Help</span>
              </a>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 md:ml-64 p-lg bg-background min-h-[calc(100vh-64px)]">
          
          {/* TAB 1: DISTRICT ADMIN DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Executive Intelligence Widget */}
              <ExecutiveIntelligence
                language={language}
                onExecuteAIResponse={() => { simulateCrisis(); }}
                transferApproved={transferApproved}
              />

              {/* District Overview Section */}
              <section className="mb-lg">
                <h2 className="font-headline-md text-headline-md text-primary mb-md">
                  {isHi ? 'जिला स्वास्थ्य अवलोकन' : isReg ? 'ജില്ലാ ആരോഗ്യ അവലോകനം' : 'District Overview'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
                  {/* KPI Cards matching Stitch format */}
                  <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded shadow-sm hover:border-primary transition-colors">
                    <div className="text-label-bold text-secondary uppercase mb-xs">Total PHCs/CHCs</div>
                    <div className="font-display-lg text-display-lg text-primary">42</div>
                    <div className="flex items-center gap-xs text-body-sm text-green-600 mt-sm">
                      <span className="material-symbols-outlined text-[16px]">trending_up</span>
                      <span>+2 new in FY24</span>
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded shadow-sm hover:border-primary transition-colors">
                    <div className="text-label-bold text-secondary uppercase mb-xs">Avg. Wait Time</div>
                    <div className="font-display-lg text-display-lg text-primary">18m</div>
                    <div className="flex items-center gap-xs text-body-sm text-green-600 mt-sm">
                      <span className="material-symbols-outlined text-[16px]">trending_down</span>
                      <span>-4m from last month</span>
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded shadow-sm hover:border-primary transition-colors">
                    <div className="text-label-bold text-secondary uppercase mb-xs">Critical Stock-outs</div>
                    <div className="font-display-lg text-display-lg text-error">{totalAlerts}</div>
                    <div className="flex items-center gap-xs text-body-sm text-error mt-sm">
                      <span className="material-symbols-outlined text-[16px]">warning</span>
                      <span>Action Required</span>
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded shadow-sm hover:border-primary transition-colors">
                    <div className="text-label-bold text-secondary uppercase mb-xs">Staff Attendance</div>
                    <div className="font-display-lg text-display-lg text-primary">92%</div>
                    <div className="w-full bg-surface-container h-1 mt-sm rounded-full overflow-hidden">
                      <div className="bg-primary h-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                </div>
              </section>

              {/* District Map Interactive Visualization */}
              <section className="mb-lg">
                <DistrictMap 
                  language={language} 
                  onFacilitySelect={(f) => setSelectedFacilityId(f.id)} 
                />
              </section>

              {/* Disease Intelligence Hotspot Widget */}
              <DiseaseIntelligence language={language} />

              {/* THE UNFORGETTABLE DEMO FLOW SECTION (CRISIS -> RECOMMENDATION -> APPROVAL -> IMPACT) */}
              {crisisMode && (
                <div className="bg-primary-fixed border-2 border-primary rounded-2xl p-6 shadow-lg space-y-6 animate-fade-in relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl tracking-widest shadow-sm">
                    {isHi ? 'एआई क्राइसिस आर्केस्ट्रेशन फ्लो' : 'AI Crisis Orchestration Flow'}
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="bg-white p-3 rounded-xl text-error border border-error-container shadow-sm">
                      <span className="material-symbols-outlined text-3xl animate-pulse">warning</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold text-on-primary-fixed tracking-tight">
                        {isHi ? 'आपातकालीन घटना: एमोक्सिसिलिन स्टॉक-आउट चेतावनी' : 'Crisis Event: Amoxicillin Early Stock-out Warning'}
                      </h2>
                      <p className="text-xs text-on-primary-fixed-variant">
                        {isHi ? 'अचानक श्वसन संक्रमण मामलों के कारण PHC Alpha में स्टॉक भारी गिरावट पर है।' : 'Triggered by a sudden local respiratory infection surge at PHC Alpha.'}
                      </p>
                    </div>
                  </div>

                  {/* Flow Stages Breakdown */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                    
                    {/* Stage 1: Crisis */}
                    <div className="bg-white border border-outline-variant rounded-xl p-5 space-y-3 relative shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-error uppercase tracking-wider">Step 1: The Crisis</span>
                        <span className="px-2 py-0.5 bg-error-container text-on-error-container text-[10px] font-bold rounded-full">Critical Status</span>
                      </div>
                      <h3 className="text-base font-bold text-primary">PHC Alpha (Mundawar)</h3>
                      <div className="p-3 bg-error-container/50 rounded-lg border border-error-container space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-on-surface-variant">Amoxicillin 500mg:</span>
                          <span className="font-extrabold text-error">12 Boxes Remaining</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-on-surface-variant">Minimum Threshold:</span>
                          <span className="font-bold text-secondary">50 Boxes</span>
                        </div>
                        <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                          <div className="bg-error h-full w-[24%]"></div>
                        </div>
                      </div>
                      <p className="text-xs text-on-surface-variant">
                        <strong>Gemini Forecast:</strong> Total stock depletion in <strong>5 days</strong> without administrative intervention.
                      </p>
                    </div>

                    {/* Stage 2: AI Recommendation & Visual Route */}
                    <div className="bg-white border border-outline-variant rounded-xl p-5 space-y-3 relative flex flex-col justify-between shadow-sm">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-primary uppercase tracking-wider">Step 2: AI Smart Redistribution</span>
                          <span className="px-2 py-0.5 bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold rounded-full">Gemini 1.5 Pro</span>
                        </div>
                        <h3 className="text-base font-bold text-primary">CHC Beta (Tijara) Surplus</h3>
                        <p className="text-xs text-on-surface-variant">
                          CHC Beta possesses <strong>220 boxes</strong> of Amoxicillin (140 above buffer). AI recommends transferring 50 boxes to balance district health levels.
                        </p>
                      </div>

                      {/* Route Illustration */}
                      <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant flex items-center justify-between">
                        <div className="text-center">
                          <span className="text-[10px] text-secondary font-bold block">DONOR</span>
                          <span className="text-xs font-bold text-primary">CHC Beta</span>
                        </div>
                        <div className="flex-1 px-4 flex flex-col items-center">
                          <span className="text-[10px] font-extrabold text-primary mb-1">50 BOXES TRANSFER</span>
                          <div className="w-full flex items-center">
                            <div className="h-1 flex-1 bg-outline-variant relative overflow-hidden rounded-full">
                              <div className="absolute top-0 left-0 h-full w-full bg-primary animate-[pulse_1.5s_infinite]"></div>
                            </div>
                            <span className="material-symbols-outlined text-base text-primary ml-1">arrow_forward</span>
                          </div>
                          <span className="text-[10px] text-secondary mt-1 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">schedule</span> Est. Time: 25 Mins
                          </span>
                        </div>
                        <div className="text-center">
                          <span className="text-[10px] text-secondary font-bold block">DEFICIT</span>
                          <span className="text-xs font-bold text-error">PHC Alpha</span>
                        </div>
                      </div>
                    </div>

                    {/* Stage 3 & 4: Approval & Impact */}
                    <div className="bg-white border border-outline-variant rounded-xl p-5 space-y-4 relative flex flex-col justify-between shadow-sm">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-green-700 uppercase tracking-wider">Step 3 & 4: Approval & Impact</span>
                          <span className="px-2 py-0.5 bg-green-100 text-green-800 text-[10px] font-bold rounded-full">One-Click SLA</span>
                        </div>
                        <h3 className="text-base font-bold text-primary">
                          {transferApproved ? 'Redistribution Executed Successfully!' : 'Administrative Authorization Pending'}
                        </h3>
                        <p className="text-xs text-on-surface-variant mt-1">
                          {transferApproved 
                          ? 'Inventory ledgers instantly balanced across facilities. Automated transport manifest dispatched.' 
                          : 'Review AI recommendation and execute digital sign-off to instantly avert the forecast stock-out.'}
                        </p>
                      </div>

                      {transferApproved ? (
                        <div className="p-4 bg-green-50 border border-green-300 rounded-xl flex flex-col gap-2 text-green-900 animate-fade-in">
                          <div className="flex items-center space-x-3">
                            <span className="material-symbols-outlined text-3xl text-green-700 flex-shrink-0">check_circle</span>
                            <div className="text-xs space-y-1">
                              <span className="font-extrabold block text-green-800">IMPACT ACHIEVED</span>
                              <span>PHC Alpha stock restored to <strong>62 Boxes</strong>. Crisis successfully averted!</span>
                            </div>
                          </div>
                          <button
                            onClick={exportRedistributionReportPDF}
                            className="mt-2 w-full py-2 bg-green-700 hover:bg-green-800 text-white font-bold text-xs rounded-lg shadow flex items-center justify-center gap-2 transition-all"
                          >
                            <span className="material-symbols-outlined text-sm">download</span>
                            {isHi ? 'रिपोर्ट पीडीएफ डाउनलोड करें' : 'Download Report (PDF)'}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={approveTransfer}
                          className="w-full py-3 bg-primary hover:opacity-90 text-white font-extrabold text-sm rounded-xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 group"
                        >
                          <span className="material-symbols-outlined text-xl text-white group-hover:scale-110 transition-transform">check</span>
                          {isHi ? 'पुनर्वितरण तुरंत अधिकृत करें' : 'Authorize 50 Boxes Transfer'}
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* Bento Grid matching Stitch format */}
              <div className="bento-grid">
                
                {/* AI Insights & Alerts Panel */}
                <div className="col-span-12 lg:col-span-5 bg-primary-container text-on-primary-container p-lg rounded-xl flex flex-col gap-md relative overflow-hidden shadow-sm h-[680px]">
                  <div className="flex items-center gap-sm z-10">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                    <h3 className="font-headline-sm text-headline-sm text-white">AI Insights & Alerts</h3>
                  </div>

                  {/* Top Static Insights matching code.html */}
                  <div className="space-y-2 z-10">
                    <div className="bg-white/10 p-3 rounded-lg border border-white/20 text-xs">
                      <div className="font-label-bold flex items-center gap-sm text-white mb-xs">
                        <span className="material-symbols-outlined text-sm">inventory</span> INVENTORY PREDICTION
                      </div>
                      <p className="font-body-md text-slate-200">Low amoxicillin stock predicted in <strong>4 PHCs</strong> within 5 days.</p>
                    </div>
                    <div className="bg-white/10 p-3 rounded-lg border border-white/20 text-xs">
                      <div className="font-label-bold flex items-center gap-sm text-white mb-xs">
                        <span className="material-symbols-outlined text-sm">local_shipping</span> REDISTRIBUTION OPTION
                      </div>
                      <p className="font-body-md text-slate-200"><strong>1200 units</strong> available at <strong>CHC West</strong> for immediate redistribution to flagged centers.</p>
                    </div>
                  </div>

                  {/* Interactive AI Chat Console */}
                  <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 overflow-y-auto font-sans space-y-4 text-xs leading-relaxed shadow-inner z-10">
                    {aiLoading ? (
                      <div className="flex flex-col items-center justify-center h-full space-y-3">
                        <span className="material-symbols-outlined text-3xl text-white animate-spin">refresh</span>
                        <span className="text-slate-200 font-medium">
                          {isHi ? 'जेमिनी एआई टेलीमेट्री डेटा का विश्लेषण कर रहा है...' : 'Gemini AI is analyzing real-time telemetry...'}
                        </span>
                      </div>
                    ) : (
                      <div className="text-white space-y-3">
                        {aiResponse.split('\n\n').map((paragraph, i) => {
                          if (paragraph.startsWith('###')) {
                            return (
                              <h3 key={i} className="text-sm font-bold text-white pb-1 border-b border-white/10 mb-2">
                                {paragraph.replace('###', '').trim()}
                              </h3>
                            );
                          }
                          
                          const lines = paragraph.split('\n');
                          const hasList = lines.some(l => l.trim().startsWith('*') || l.trim().startsWith('-') || /^\d+\./.test(l.trim()));
                          
                          if (hasList) {
                            return (
                              <div key={i} className="space-y-1 pl-2 border-l border-white/20">
                                {lines.map((line, j) => (
                                  <p key={j} className="text-xs text-slate-200">
                                    {renderMarkdownLine(line)}
                                  </p>
                                ))}
                              </div>
                            );
                          }
                          
                          return (
                            <p key={i} className="text-xs text-slate-200">
                              {lines.map((line, j) => (
                                <span key={j} className="block">
                                  {renderMarkdownLine(line)}
                                </span>
                              ))}
                            </p>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Pre-set Quick Query Chips */}
                  <div className="z-10 py-1">
                    <span className="text-[11px] font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                      {isHi ? 'त्वरित प्रशासनिक प्रश्न:' : 'Quick Administrative Prompts:'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => handleAskAI(isHi ? 'जिले में डॉक्टर और स्टाफ की उपस्थिति रिपोर्ट दिखाएं' : 'Show district staff attendance report')}
                        className="px-2.5 py-1 bg-white/20 hover:bg-white/30 border border-white/20 rounded-lg text-[11px] font-medium text-white transition"
                      >
                        👥 Staff Attendance
                      </button>
                      <button
                        onClick={() => handleAskAI(isHi ? 'बिस्तर अधिभोग और ICU बेड स्थिति का विश्लेषण करें' : 'Show district bed occupancy analysis')}
                        className="px-2.5 py-1 bg-white/20 hover:bg-white/30 border border-white/20 rounded-lg text-[11px] font-medium text-white transition"
                      >
                        🛏️ Bed Occupancy
                      </button>
                      <button
                        onClick={() => handleAskAI(isHi ? 'दवा इन्वेंटरी और एमोक्सिसिलिन स्टॉक-आउट पूर्वानुमान बताएं' : 'Show drug inventory and amoxicillin stockout forecast')}
                        className="px-2.5 py-1 bg-white/20 hover:bg-white/30 border border-white/20 rounded-lg text-[11px] font-medium text-white transition"
                      >
                        📦 Drug Stock Status
                      </button>
                    </div>
                  </div>

                  {/* Input Chat Bar */}
                  <div className="flex items-center space-x-2 border-t border-white/20 pt-3 z-10">
                    <input
                      type="text"
                      value={aiQuery}
                      onChange={(e) => setAiQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAskAI(aiQuery)}
                      placeholder={isHi ? 'स्वास्थ्य केंद्र डेटा के बारे में कुछ भी पूछें...' : 'Ask Gemini anything about health centre telemetry...'}
                      className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-300 focus:outline-none focus:border-white transition"
                    />
                    <button
                      onClick={() => handleAskAI(aiQuery)}
                      className="bg-white text-primary font-label-bold p-2.5 rounded-xl shadow hover:bg-primary-fixed transition-colors active:scale-95"
                    >
                      <span className="material-symbols-outlined text-base">send</span>
                    </button>
                  </div>
                </div>

                {/* Facility Performance List matching code.html */}
                <div className="col-span-12 lg:col-span-7 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col h-[680px]">
                  <div className="px-lg py-md border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                    <h3 className="font-headline-sm text-headline-sm text-primary">Intervention Flags & Facility Telemetry</h3>
                    <span className="text-label-bold text-on-surface-variant">{facilities.length + 4} Centers Monitored</span>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-slate-50 z-10 border-b border-outline-variant">
                        <tr>
                          <th className="p-md text-label-bold text-secondary uppercase">Facility Name</th>
                          <th className="p-md text-label-bold text-secondary uppercase">Status</th>
                          <th className="p-md text-label-bold text-secondary uppercase">Primary Issue / Stock</th>
                          <th className="p-md text-label-bold text-secondary uppercase">Bed / Queue Trend</th>
                          <th className="p-md text-label-bold text-secondary uppercase">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant">
                        {/* Render dynamic live store facilities */}
                        {facilities.map(facility => (
                          <tr key={facility.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                            <td className="p-md font-body-md font-bold text-primary">
                              {isHi ? facility.nameHi : facility.name}
                              <span className="text-[10px] block text-secondary font-normal">{facility.location}</span>
                            </td>
                            <td className="p-md">
                              <span className={`px-sm py-xs rounded-full text-label-bold ${
                                facility.status === 'CRITICAL' 
                                ? 'bg-error-container text-on-error-container' 
                                : facility.status === 'WARNING' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-green-100 text-green-800'
                              }`}>
                                {facility.status}
                              </span>
                            </td>
                            <td className="p-md text-body-sm text-on-surface-variant space-y-1">
                              {facility.inventory.map(item => (
                                <div key={item.id} className="flex items-center justify-between gap-2 text-[11px]">
                                  <span>{item.name.split(' ')[0]}:</span>
                                  <span className={`font-bold ${item.status === 'CRITICAL' ? 'text-error' : item.status === 'LOW' ? 'text-yellow-700' : 'text-green-700'}`}>
                                    {item.stock} {item.unit}
                                  </span>
                                </div>
                              ))}
                            </td>
                            <td className="p-md text-body-sm text-secondary">
                              <div className="flex items-center gap-xs font-bold">
                                <span className="material-symbols-outlined text-sm">bed</span> 
                                {facility.beds.occupied}/{facility.beds.total} Full
                              </div>
                              <div className="text-[11px] text-on-surface-variant">Queue: {facility.footfall.currentQueue} waiting</div>
                            </td>
                            <td className="p-md">
                              <button 
                                onClick={() => {
                                  if (facility.id === 'phc-alpha' && crisisMode && !transferApproved) {
                                    approveTransfer();
                                  } else {
                                    alert(`Managing resources for ${facility.name}`);
                                  }
                                }}
                                className="text-primary hover:underline font-label-bold"
                              >
                                {facility.id === 'phc-alpha' && crisisMode && !transferApproved ? 'Transfer 50' : 'Manage'}
                              </button>
                            </td>
                          </tr>
                        ))}

                        {/* Static Intervention Flags from code.html */}
                        <tr className="hover:bg-slate-50 transition-colors cursor-pointer">
                          <td className="p-md font-body-md font-bold">PHC Sarita Vihar</td>
                          <td className="p-md">
                            <span className="px-sm py-xs bg-error-container text-on-error-container rounded-full text-label-bold">Critical</span>
                          </td>
                          <td className="p-md text-body-sm">High Footfall, Low Staff</td>
                          <td className="p-md text-error flex items-center gap-xs">
                            <span className="material-symbols-outlined text-sm">trending_up</span> 15%
                          </td>
                          <td className="p-md">
                            <button onClick={() => alert('Deploying staff to PHC Sarita Vihar')} className="text-primary hover:underline font-label-bold">Deploy</button>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50 transition-colors cursor-pointer">
                          <td className="p-md font-body-md font-bold">PHC Okhla Phase 3</td>
                          <td className="p-md">
                            <span className="px-sm py-xs bg-yellow-100 text-yellow-800 rounded-full text-label-bold">Warning</span>
                          </td>
                          <td className="p-md text-body-sm">Supply Chain Delay</td>
                          <td className="p-md text-on-surface-variant flex items-center gap-xs">
                            <span className="material-symbols-outlined text-sm">horizontal_rule</span> 0%
                          </td>
                          <td className="p-md">
                            <button onClick={() => alert('Viewing details for PHC Okhla Phase 3')} className="text-primary hover:underline font-label-bold">Details</button>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50 transition-colors cursor-pointer">
                          <td className="p-md font-body-md font-bold">CHC West Delhi</td>
                          <td className="p-md">
                            <span className="px-sm py-xs bg-green-100 text-green-800 rounded-full text-label-bold">Stable</span>
                          </td>
                          <td className="p-md text-body-sm">Surplus Resources</td>
                          <td className="p-md text-green-600 flex items-center gap-xs">
                            <span className="material-symbols-outlined text-sm">trending_down</span> 8%
                          </td>
                          <td className="p-md">
                            <button onClick={() => alert('Initiating resource transfer from CHC West Delhi')} className="text-primary hover:underline font-label-bold">Transfer</button>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50 transition-colors cursor-pointer">
                          <td className="p-md font-body-md font-bold">PHC Greater Kailash</td>
                          <td className="p-md">
                            <span className="px-sm py-xs bg-error-container text-on-error-container rounded-full text-label-bold">Critical</span>
                          </td>
                          <td className="p-md text-body-sm">Equipment Downtime</td>
                          <td className="p-md text-error flex items-center gap-xs">
                            <span className="material-symbols-outlined text-sm">trending_up</span> 22%
                          </td>
                          <td className="p-md">
                            <button onClick={() => alert('Dispatching repair crew to PHC Greater Kailash')} className="text-primary hover:underline font-label-bold">Repair</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Trend Chart Section & Immutable Logs matching code.html */}
                <div className="col-span-12 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm mb-lg">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-lg">
                    <div>
                      <h3 className="font-headline-sm text-headline-sm text-primary">Patient Footfall vs Staff Availability</h3>
                      <p className="text-body-sm text-on-surface-variant">District-wide metrics over the last 7 days</p>
                    </div>
                    <div className="flex gap-md mt-md md:mt-0">
                      <div className="flex items-center gap-xs">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        <span className="text-label-bold">Footfall</span>
                      </div>
                      <div className="flex items-center gap-xs">
                        <div className="w-3 h-3 bg-secondary-container rounded-full border border-primary"></div>
                        <span className="text-label-bold">Staff Available</span>
                      </div>
                    </div>
                  </div>

                  {/* Simplified Visual Chart from code.html */}
                  <div className="h-64 flex items-end justify-between gap-sm md:gap-lg px-md border-b border-outline-variant relative">
                    {/* Y-Axis labels */}
                    <div className="absolute left-0 bottom-0 h-full flex flex-col justify-between text-[10px] text-secondary font-mono-data pointer-events-none pb-2">
                      <span>2000</span>
                      <span>1500</span>
                      <span>1000</span>
                      <span>500</span>
                      <span>0</span>
                    </div>
                    {/* Chart Bars */}
                    <div className="flex-1 flex items-end justify-center gap-2 group relative">
                      <div className="chart-bar w-8 bg-primary rounded-t" style={{ height: '60%' }}></div>
                      <div className="chart-bar w-8 bg-secondary-container border border-primary border-b-0 rounded-t" style={{ height: '85%' }}></div>
                      <div className="absolute -bottom-8 text-label-bold">Mon</div>
                    </div>
                    <div className="flex-1 flex items-end justify-center gap-2 group relative">
                      <div className="chart-bar w-8 bg-primary rounded-t" style={{ height: '75%' }}></div>
                      <div className="chart-bar w-8 bg-secondary-container border border-primary border-b-0 rounded-t" style={{ height: '80%' }}></div>
                      <div className="absolute -bottom-8 text-label-bold">Tue</div>
                    </div>
                    <div className="flex-1 flex items-end justify-center gap-2 group relative">
                      <div className="chart-bar w-8 bg-primary rounded-t" style={{ height: '90%' }}></div>
                      <div className="chart-bar w-8 bg-secondary-container border border-primary border-b-0 rounded-t" style={{ height: '70%' }}></div>
                      <div className="absolute -bottom-8 text-label-bold text-error">Wed</div>
                      <div className="absolute top-0 w-full h-full bg-error/5 border-x border-error/20 hidden group-hover:block transition-all"></div>
                    </div>
                    <div className="flex-1 flex items-end justify-center gap-2 group relative">
                      <div className="chart-bar w-8 bg-primary rounded-t" style={{ height: '65%' }}></div>
                      <div className="chart-bar w-8 bg-secondary-container border border-primary border-b-0 rounded-t" style={{ height: '88%' }}></div>
                      <div className="absolute -bottom-8 text-label-bold">Thu</div>
                    </div>
                    <div className="flex-1 flex items-end justify-center gap-2 group relative">
                      <div className="chart-bar w-8 bg-primary rounded-t" style={{ height: '82%' }}></div>
                      <div className="chart-bar w-8 bg-secondary-container border border-primary border-b-0 rounded-t" style={{ height: '82%' }}></div>
                      <div className="absolute -bottom-8 text-label-bold">Fri</div>
                    </div>
                    <div className="flex-1 flex items-end justify-center gap-2 group relative">
                      <div className="chart-bar w-8 bg-primary rounded-t" style={{ height: '40%' }}></div>
                      <div className="chart-bar w-8 bg-secondary-container border border-primary border-b-0 rounded-t" style={{ height: '45%' }}></div>
                      <div className="absolute -bottom-8 text-label-bold">Sat</div>
                    </div>
                    <div className="flex-1 flex items-end justify-center gap-2 group relative">
                      <div className="chart-bar w-8 bg-primary rounded-t" style={{ height: '30%' }}></div>
                      <div className="chart-bar w-8 bg-secondary-container border border-primary border-b-0 rounded-t" style={{ height: '42%' }}></div>
                      <div className="absolute -bottom-8 text-label-bold">Sun</div>
                    </div>
                  </div>

                  <div className="mt-12 flex justify-center mb-8">
                    <div className="p-md bg-error/10 border border-error/20 rounded-lg flex items-center gap-md">
                      <span className="material-symbols-outlined text-error">info</span>
                      <span className="text-body-sm text-error">Critical gap identified on Wednesday. Suggested reallocation: 4 Nurses from CHC South to PHC Sarita Vihar.</span>
                    </div>
                  </div>

                  {/* Immutable Audit Logs & Mock External Gateways */}
                  <div className="border-t border-outline-variant pt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-headline-sm text-base text-primary flex items-center gap-2">
                          <span className="material-symbols-outlined text-base">receipt_long</span>
                          {isHi ? 'अपरिवर्तनीय ऑडिट लॉग' : 'Immutable Audit Logs'}
                        </h4>
                        <span className="text-[10px] bg-surface-container-high text-secondary px-2 py-0.5 rounded font-mono">Real-time</span>
                      </div>
                      <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                        {logs.map(log => (
                          <div key={log.id} className="p-2.5 bg-surface-container-low rounded-lg border border-outline-variant space-y-1 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono text-secondary">{log.timestamp} - {log.facility}</span>
                              <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded ${
                                log.type === 'ALERT' ? 'bg-error-container text-on-error-container' :
                                log.type === 'TRANSFER' ? 'bg-primary-fixed text-on-primary-fixed-variant' :
                                log.type === 'SYNC' ? 'bg-green-100 text-green-800' :
                                log.type === 'MAINTENANCE' ? 'bg-blue-100 text-blue-800' :
                                log.type === 'STAFF' ? 'bg-purple-100 text-purple-800' :
                                'bg-secondary-container text-on-secondary-container'
                              }`}>
                                {log.type}
                              </span>
                            </div>
                            <p className="text-on-surface text-[11px] font-mono leading-tight">
                              {isHi ? log.messageHi : log.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Interactive Gateway Mock Triggers */}
                    <div className="space-y-3">
                      <h4 className="font-headline-sm text-base text-primary flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">sensors</span>
                        {isHi ? 'बाहरी गेटवे इनपुट सिमुलेशन' : 'Simulate Incoming External Gateway Feeds'}
                      </h4>
                      <p className="text-xs text-on-surface-variant">
                        {isHi ? 'बुनियादी मोबाइल एसएमएस या बायोमेट्रिक सिंक का परीक्षण करें:' : 'Trigger mock external telemetry inputs from rural health centers in real-time:'}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <button
                          onClick={() => addLog('INFO', 'USSD Gateway Check-in: Pharmacist at PHC Delta logged daily consumption via basic mobile phone SMS.', 'USSD गेटवे चेक-इन: PHC Delta के फार्मासिस्ट ने साधारण मोबाइल एसएमएस के माध्यम से दैनिक खपत दर्ज की।', 'PHC Delta')}
                          className="p-3 bg-surface-container-low hover:bg-surface-container border border-outline-variant rounded-xl text-left text-xs font-bold text-primary transition flex items-center justify-between shadow-sm"
                        >
                          <span>📱 Mock USSD SMS Check-in</span>
                          <span className="material-symbols-outlined text-sm text-primary">arrow_forward</span>
                        </button>
                        <button
                          onClick={() => addLog('INFO', 'Biometric API Feed: Nurse staff shift check-in successfully synchronized with central state LIS database.', 'बायोमेट्रिक API फीड: नर्स स्टाफ शिफ्ट चेक-इन सफलतापूर्वक केंद्रीय राज्य LIS डेटाबेस के साथ सिंक्रनाइज़ हुआ।', 'CHC Beta')}
                          className="p-3 bg-surface-container-low hover:bg-surface-container border border-outline-variant rounded-xl text-left text-xs font-bold text-primary transition flex items-center justify-between shadow-sm"
                        >
                          <span>🔒 Mock Biometric API Feed</span>
                          <span className="material-symbols-outlined text-sm text-primary">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}


          {/* TAB 2: INVENTORY MANAGEMENT & PHARMACIST PORTAL */}
          {activeTab === 'inventory' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* AI Computer Vision Stock Scanner */}
              <StockScanner language={language} />

              {/* Top Pharmacist Portal Quick Entry Box */}

              <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-primary-container text-on-primary-container rounded-xl shadow-sm">
                      <span className="material-symbols-outlined text-3xl">medication</span>
                    </div>
                    <div>
                      <h2 className="text-lg font-extrabold text-primary tracking-tight">
                        {isHi ? 'फार्मासिस्ट इन्वेंटरी लॉगिंग एवं पूर्वानुमान पोर्टल' : 'Pharmacist Inventory Logging & Forecast Portal'}
                      </h2>
                      <p className="text-xs text-on-surface-variant">
                        {isHi ? 'दैनिक उपभोग दर्ज करें और एआई द्वारा स्टॉक-आउट चेतावनी का प्रबंधन करें' : 'Log daily consumption and review AI early stock-out warnings across facilities'}
                      </p>
                    </div>
                  </div>

                  {/* Facility Selector */}
                  <div>
                    <label className="text-[11px] font-bold text-secondary block mb-1 uppercase tracking-wider">
                      {isHi ? 'कार्यरत स्वास्थ्य केंद्र चुनें:' : 'Select Operating Health Centre:'}
                    </label>
                    <select 
                      value={selectedFacilityId}
                      onChange={(e) => setSelectedFacilityId(e.target.value)}
                      className="bg-surface border border-outline-variant rounded-xl px-4 py-2 text-xs text-primary font-bold focus:outline-none focus:border-primary transition shadow-sm"
                    >
                      {facilities.map(f => (
                        <option key={f.id} value={f.id}>{isHi ? f.nameHi : f.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Notice regarding Offline/Online Simulation */}
                <div className="p-4 bg-surface-container-low border border-outline-variant rounded-xl flex items-center justify-between text-xs text-on-surface">
                  <div className="space-y-1">
                    <span className="font-extrabold text-primary block flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base">
                        {offlineMode ? 'wifi_off' : 'wifi'}
                      </span>
                      {offlineMode ? (isHi ? 'स्थानीय ऑफ़लाइन कैश मोड सक्रिय है' : 'Local Offline Cache Mode is Active') : (isHi ? 'केंद्रीय क्लाउड सर्वर से सीधा जुड़ा हुआ है' : 'Directly Connected to Central Cloud Server')}
                    </span>
                    <p className="text-on-surface-variant">
                      {offlineMode 
                      ? (isHi ? 'आपकी सभी कार्रवाइयां नीचे कतारबद्ध की जा रही हैं। शीर्षलेख में ऑनलाइन टॉगल करने पर वे तुरंत सिंक हो जाएंगी।' : 'Your logged actions are being queued locally. Toggle back online in the header to trigger automatic background sync.')
                      : (isHi ? 'आपकी सभी कार्रवाइयां सीधे जिला व्यवस्थापक डैशबोर्ड और इन्वेंटरी खाता-बही में अपडेट हो रही हैं।' : 'Your logged actions are instantly updated in the District Administrator Dashboard and inventory ledger.')}
                    </p>
                  </div>
                </div>

                {/* Quick Logging Actions */}
                <div className="py-2 space-y-4">
                  <h3 className="text-xs font-bold text-secondary uppercase tracking-wider">
                    {isHi ? 'त्वरित लॉगिंग क्रियाएं (Quick Logging Actions):' : 'Quick Logging Actions:'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => logDailyConsumption(selectedFacilityId, 'amox', 10)}
                      className="p-5 bg-surface hover:bg-surface-container-low border border-outline-variant rounded-xl text-left shadow-sm active:scale-95 transition-all group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-extrabold text-primary">Amoxicillin 500mg (10 Boxes)</span>
                        <span className="material-symbols-outlined text-xl text-primary group-hover:scale-110 transition-transform">inventory_2</span>
                      </div>
                      <p className="text-xs text-on-surface-variant">
                        {isHi ? 'दैनिक खपत के लिए 10 बॉक्स का निर्गम (Issue) दर्ज करें।' : 'Deduct 10 boxes from active stock ledger for daily outpatient issues.'}
                      </p>
                    </button>

                    <button
                      onClick={() => logDailyConsumption(selectedFacilityId, 'iv', 5)}
                      className="p-5 bg-surface hover:bg-surface-container-low border border-outline-variant rounded-xl text-left shadow-sm active:scale-95 transition-all group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-extrabold text-primary">IV Fluids RL (5 Bottles)</span>
                        <span className="material-symbols-outlined text-xl text-primary group-hover:scale-110 transition-transform">inventory_2</span>
                      </div>
                      <p className="text-xs text-on-surface-variant">
                        {isHi ? 'आईवी फ्लुइड्स की 5 बोतलों की खपत दर्ज करें।' : 'Deduct 5 bottles of IV Fluids from active emergency stock.'}
                      </p>
                    </button>
                  </div>
                </div>

                {/* OFFLINE QUEUE PREVIEW TABLE */}
                {offlineMode && (
                  <div className="border-t border-outline-variant pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm">schedule</span> {isHi ? 'स्थानीय ऑफ़लाइन कतार (Pending Cache Queue):' : 'Local Offline Pending Queue:'}
                      </h3>
                      <span className="text-xs bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold border border-amber-300">
                        {offlineQueue.length} Events Queued
                      </span>
                    </div>

                    {offlineQueue.length === 0 ? (
                      <div className="p-6 text-center text-xs text-secondary bg-surface-container-low rounded-xl border border-outline-variant">
                        {isHi ? 'कोई ऑफ़लाइन ईवेंट कतारबद्ध नहीं है। ऊपर दिए गए त्वरित बटन दबाकर डेटा लॉग करें।' : 'No offline events queued yet. Click a quick logging action above to add items to the local cache.'}
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[250px] overflow-y-auto">
                        {offlineQueue.map(ev => (
                          <div key={ev.id} className="p-3 bg-surface-container-low rounded-xl border border-outline-variant flex items-center justify-between text-xs">
                            <div>
                              <span className="text-[10px] text-secondary font-mono block">{ev.timestamp} - {ev.facilityId}</span>
                              <span className="text-on-surface font-bold">{ev.summary}</span>
                            </div>
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-mono text-[10px]">
                              Pending Cloud Sync
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Comprehensive District Inventory Ledger */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                <div className="p-lg border-b border-outline-variant bg-surface-container-low flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-primary">Master Inventory Ledger & AI Forecasts</h3>
                    <p className="text-body-sm text-on-surface-variant">Real-time stock level monitoring across all district primary & community health centres</p>
                  </div>
                  {/* Category Filter Pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {['All', 'Antibiotics', 'Antipyretics', 'Electrolytes', 'Fluids'].map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setInventoryFilter(cat)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${inventoryFilter === cat ? 'bg-primary text-white shadow-sm' : 'bg-surface border border-outline-variant text-on-surface-variant hover:text-on-surface'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-outline-variant text-label-bold text-secondary uppercase">
                      <tr>
                        <th className="p-md">Facility</th>
                        <th className="p-md">Item Description</th>
                        <th className="p-md">Category</th>
                        <th className="p-md">Stock Level</th>
                        <th className="p-md">Status</th>
                        <th className="p-md">Expiry</th>
                        <th className="p-md">AI Demand Forecast</th>
                        <th className="p-md">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant text-xs">
                      {facilities.map(facility => 
                        facility.inventory
                          .filter(item => inventoryFilter === 'All' || item.category === inventoryFilter)
                          .map(item => (
                            <tr key={`${facility.id}-${item.id}`} className="hover:bg-slate-50 transition-colors">
                              <td className="p-md font-bold text-primary">
                                {isHi ? facility.nameHi : facility.name}
                                <span className="text-[10px] block text-secondary font-normal">{facility.type} • {facility.location}</span>
                              </td>
                              <td className="p-md font-bold text-on-surface">
                                {isHi ? item.nameHi : item.name}
                              </td>
                              <td className="p-md text-secondary">{item.category}</td>
                              <td className="p-md font-mono-data font-bold">
                                <span className={item.status === 'CRITICAL' ? 'text-error font-extrabold text-sm' : item.status === 'LOW' ? 'text-amber-700 font-bold' : 'text-green-700'}>
                                  {item.stock} {item.unit}
                                </span>
                                <span className="text-[10px] block text-secondary font-normal">Min: {item.minThreshold}</span>
                              </td>
                              <td className="p-md">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                                  item.status === 'CRITICAL' ? 'bg-error-container text-on-error-container animate-pulse' :
                                  item.status === 'LOW' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {item.status}
                                </span>
                              </td>
                              <td className="p-md font-mono text-secondary">{item.expiryDate}</td>
                              <td className="p-md text-on-surface-variant max-w-xs leading-relaxed">
                                {item.status === 'CRITICAL' ? (
                                  <span className="text-error font-bold flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">warning</span> Depletion imminent in 5 days!
                                  </span>
                                ) : item.status === 'LOW' ? (
                                  <span className="text-amber-800 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">trending_up</span> High seasonal usage spike detected.
                                  </span>
                                ) : (
                                  <span className="text-green-700 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">check_circle</span> Stable buffer level maintained.
                                  </span>
                                )}
                              </td>
                              <td className="p-md space-x-2 whitespace-nowrap">
                                <button 
                                  onClick={() => logDailyConsumption(facility.id, item.id, 5)}
                                  className="px-2.5 py-1 bg-surface-container-high hover:bg-surface-container border border-outline-variant rounded font-bold text-primary active:scale-95 transition"
                                >
                                  Deduct 5
                                </button>
                                {item.status !== 'OPTIMAL' && (
                                  <button 
                                    onClick={() => {
                                      if (facility.id === 'phc-alpha' && item.id === 'amox' && crisisMode && !transferApproved) {
                                        approveTransfer();
                                      } else {
                                        alert(`Restocking order placed for ${item.name} at ${facility.name}`);
                                      }
                                    }}
                                    className="px-2.5 py-1 bg-primary text-white hover:opacity-90 rounded font-bold active:scale-95 transition shadow-sm"
                                  >
                                    {facility.id === 'phc-alpha' && item.id === 'amox' && crisisMode && !transferApproved ? 'AI Redistribute 50' : 'Restock'}
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}


          {/* TAB 3: PATIENT FLOW & LIVE TRIAGE PORTAL */}
          {activeTab === 'patients' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Doctor Quick Entry Container */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-primary-container text-on-primary-container rounded-xl shadow-sm">
                      <span className="material-symbols-outlined text-3xl">clinical_notes</span>
                    </div>
                    <div>
                      <h2 className="text-lg font-extrabold text-primary tracking-tight">
                        {isHi ? 'चिकित्सक मरीज फुटफॉल एवं ट्रिएज पोर्टल' : 'Doctor Patient Footfall & Live Triage Portal'}
                      </h2>
                      <p className="text-xs text-on-surface-variant">
                        {isHi ? 'बाह्य रोगियों का त्वरित पंजीकरण करें और ट्रिएज कतार का लाइव प्रबंधन करें' : 'Register incoming outpatients and manage emergency triage queue in real-time'}
                      </p>
                    </div>
                  </div>

                  {/* Facility Selector */}
                  <div>
                    <label className="text-[11px] font-bold text-secondary block mb-1 uppercase tracking-wider">
                      {isHi ? 'कार्यरत स्वास्थ्य केंद्र चुनें:' : 'Select Operating Health Centre:'}
                    </label>
                    <select 
                      value={selectedFacilityId}
                      onChange={(e) => setSelectedFacilityId(e.target.value)}
                      className="bg-surface border border-outline-variant rounded-xl px-4 py-2 text-xs text-primary font-bold focus:outline-none focus:border-primary transition shadow-sm"
                    >
                      {facilities.map(f => (
                        <option key={f.id} value={f.id}>{isHi ? f.nameHi : f.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Quick Logging Actions */}
                <div className="py-2 space-y-4">
                  <h3 className="text-xs font-bold text-secondary uppercase tracking-wider">
                    {isHi ? 'त्वरित ट्रिएज पंजीकरण क्रियाएं:' : 'Quick Triage Registration Actions:'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => logPatientFootfall(selectedFacilityId, false)}
                      className="p-5 bg-surface hover:bg-surface-container-low border border-outline-variant rounded-xl text-left shadow-sm active:scale-95 transition-all group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-extrabold text-primary">Log General OPD Patient (Green Triage)</span>
                        <span className="material-symbols-outlined text-xl text-primary group-hover:scale-110 transition-transform">group_add</span>
                      </div>
                      <p className="text-xs text-on-surface-variant">
                        {isHi ? 'सामान्य बाह्य रोगी (OPD) के आगमन का पंजीकरण करें।' : 'Register incoming general outpatient walk-in queue check-in.'}
                      </p>
                    </button>

                    <button
                      onClick={() => logPatientFootfall(selectedFacilityId, true)}
                      className="p-5 bg-error-container hover:opacity-90 border border-error-container rounded-xl text-left shadow-sm active:scale-95 transition-all group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-extrabold text-on-error-container">Log Urgent Triage Patient (Red Triage)</span>
                        <span className="material-symbols-outlined text-xl text-error group-hover:scale-110 transition-transform">emergency</span>
                      </div>
                      <p className="text-xs text-on-error-container">
                        {isHi ? 'तत्काल ध्यान देने योग्य (Urgent Triage) मरीज का पंजीकरण करें।' : 'Register high-priority emergency walk-in requiring immediate doctor allocation.'}
                      </p>
                    </button>
                  </div>
                </div>
              </div>

              {/* Master Patient Queue Overview Table */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                <div className="p-lg border-b border-outline-variant bg-surface-container-low flex items-center justify-between">
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-primary">Real-Time Facility Waiting Queues</h3>
                    <p className="text-body-sm text-on-surface-variant">Active patient distribution and estimated triage wait times</p>
                  </div>
                  <span className="text-xs bg-primary-fixed text-on-primary-fixed-variant px-3 py-1 rounded-full font-bold">
                    Live Telemetry
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-outline-variant text-label-bold text-secondary uppercase">
                      <tr>
                        <th className="p-md">Facility Name</th>
                        <th className="p-md">Active Queue</th>
                        <th className="p-md">Est. Wait Time</th>
                        <th className="p-md">Urgent Triage (Red)</th>
                        <th className="p-md">Daily Total Check-ins</th>
                        <th className="p-md">Queue Status</th>
                        <th className="p-md">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant text-xs">
                      {facilities.map(facility => (
                        <tr key={facility.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-md font-bold text-primary">
                            {isHi ? facility.nameHi : facility.name}
                            <span className="text-[10px] block text-secondary font-normal">{facility.location}</span>
                          </td>
                          <td className="p-md font-mono font-extrabold text-sm text-on-surface">
                            {facility.footfall.currentQueue} Patients waiting
                          </td>
                          <td className="p-md font-mono font-bold text-primary">
                            ~{facility.footfall.estimatedWaitMinutes} mins
                          </td>
                          <td className="p-md font-mono font-extrabold text-error flex items-center gap-1 mt-3">
                            <span className="material-symbols-outlined text-sm">emergency</span> {facility.footfall.triageUrgent} Cases
                          </td>
                          <td className="p-md font-mono text-secondary">{facility.footfall.dailyTotal} Patients</td>
                          <td className="p-md">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              facility.footfall.estimatedWaitMinutes > 40 ? 'bg-error-container text-on-error-container' :
                              facility.footfall.estimatedWaitMinutes > 25 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {facility.footfall.estimatedWaitMinutes > 40 ? 'Severe Backlog' : facility.footfall.estimatedWaitMinutes > 25 ? 'Moderate Queue' : 'Manageable'}
                            </span>
                          </td>
                          <td className="p-md space-x-2 whitespace-nowrap">
                            <button 
                              onClick={() => {
                                alert(`Patient visit complete. Discharged 1 patient from queue at ${facility.name}.`);
                              }}
                              className="px-3 py-1 bg-green-700 text-white hover:bg-green-800 rounded font-bold active:scale-95 transition shadow-sm"
                            >
                              Discharge 1
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}


          {/* TAB 4: BED MANAGEMENT */}
          {activeTab === 'beds' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-primary-container text-on-primary-container rounded-xl shadow-sm">
                    <span className="material-symbols-outlined text-3xl">bed</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-primary tracking-tight">
                      {isHi ? 'बिस्तर उपलब्धता एवं ICU संसाधन प्रबंधन' : 'Bed Availability & ICU Resource Allocation Portal'}
                    </h2>
                    <p className="text-xs text-on-surface-variant">
                      {isHi ? 'जिले के स्वास्थ्य केंद्रों में सामान्य और ICU बेड का रीयल-टाइम आवंटन करें' : 'Manage live bed occupancy, oxygen support, and ICU resource distribution across facilities'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bed Availability Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {facilities.map(facility => {
                  const occupancyRate = Math.round((facility.beds.occupied / facility.beds.total) * 100);
                  const isHighOccupancy = occupancyRate >= 90;

                  return (
                    <div key={facility.id} className={`bg-surface-container-lowest border rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-all ${isHighOccupancy ? 'border-error ring-1 ring-error/30' : 'border-outline-variant'}`}>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-outline-variant pb-3">
                          <div>
                            <h3 className="font-bold text-base text-primary">{isHi ? facility.nameHi : facility.name}</h3>
                            <span className="text-[11px] text-secondary">{facility.type} • {facility.location}</span>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${isHighOccupancy ? 'bg-error-container text-on-error-container animate-pulse' : 'bg-green-100 text-green-800'}`}>
                            {isHighOccupancy ? 'Capacity Warning' : 'Optimal'}
                          </span>
                        </div>

                        {/* Occupancy Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-on-surface-variant">General Ward Occupancy:</span>
                            <span className={isHighOccupancy ? 'text-error font-extrabold' : 'text-primary'}>{facility.beds.occupied} / {facility.beds.total} ({occupancyRate}%)</span>
                          </div>
                          <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                            <div className={`h-full ${isHighOccupancy ? 'bg-error' : 'bg-primary'}`} style={{ width: `${occupancyRate}%` }}></div>
                          </div>
                        </div>

                        {/* Bed Stats Breakdown */}
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant text-center">
                            <span className="text-[10px] text-secondary font-bold uppercase block">Available Beds</span>
                            <span className="text-lg font-extrabold text-green-700 font-mono">{facility.beds.available}</span>
                          </div>
                          <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant text-center">
                            <span className="text-[10px] text-secondary font-bold uppercase block">ICU Occupied</span>
                            <span className="text-lg font-extrabold text-primary font-mono">{facility.beds.icuOccupied} / {facility.beds.icuTotal}</span>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Bed Controls */}
                      <div className="border-t border-outline-variant pt-4 mt-4 space-y-2">
                        <span className="text-[11px] font-bold text-secondary uppercase tracking-wider block">Bed Allocation Controls:</span>
                        <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                          <button 
                            onClick={() => allocateBed(facility.id, false)}
                            className="py-2 bg-primary hover:bg-primary/90 text-white rounded-lg shadow active:scale-95 transition"
                          >
                            [+] Assign General
                          </button>
                          <button 
                            onClick={() => releaseBed(facility.id, false)}
                            className="py-2 bg-surface hover:bg-surface-container border border-outline-variant text-primary rounded-lg active:scale-95 transition"
                          >
                            [-] Release General
                          </button>
                          {facility.beds.icuTotal > 0 && (
                            <>
                              <button 
                                onClick={() => allocateBed(facility.id, true)}
                                className="py-2 bg-error hover:bg-error/90 text-white rounded-lg shadow active:scale-95 transition"
                              >
                                [+] Assign ICU
                              </button>
                              <button 
                                onClick={() => releaseBed(facility.id, true)}
                                className="py-2 bg-surface hover:bg-surface-container border border-outline-variant text-error rounded-lg active:scale-95 transition"
                              >
                                [-] Release ICU
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}


          {/* TAB 5: STAFF ATTENDANCE AUDIT */}
          {activeTab === 'staff' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-primary-container text-on-primary-container rounded-xl shadow-sm">
                    <span className="material-symbols-outlined text-3xl">event_available</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-primary tracking-tight">
                      {isHi ? 'कर्मचारी उपस्थिति ऑडिट एवं ड्यूटी रोस्टर' : 'Doctor & Staff Attendance Audit & Duty Roster'}
                    </h2>
                    <p className="text-xs text-on-surface-variant">
                      {isHi ? 'बायोमेट्रिक उपस्थिति ट्रैक करें और स्वास्थ्यकर्मियों का पुनर्नियोजन करें' : 'Track real-time biometric check-ins and dynamically redeploy healthcare staff across facilities'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Staff Roster Table */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                <div className="p-lg border-b border-outline-variant bg-surface-container-low flex items-center justify-between">
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-primary">District Active Roster</h3>
                    <p className="text-body-sm text-on-surface-variant">Biometric attendance records from central LIS gateway</p>
                  </div>
                  <span className="text-xs bg-primary text-white px-3 py-1 rounded-full font-bold shadow-sm">
                    92% Overall Attendance
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-outline-variant text-label-bold text-secondary uppercase">
                      <tr>
                        <th className="p-md">Staff Name</th>
                        <th className="p-md">Designation / Role</th>
                        <th className="p-md">Assigned Facility</th>
                        <th className="p-md">Attendance Status</th>
                        <th className="p-md">Biometric Check-in</th>
                        <th className="p-md">Action / Redeploy</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant text-xs">
                      {staffMembers.map(staff => (
                        <tr key={staff.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-md font-bold text-primary flex items-center gap-2">
                            <span className="material-symbols-outlined text-secondary text-base">person</span>
                            {staff.name}
                          </td>
                          <td className="p-md font-bold text-on-surface">{staff.role}</td>
                          <td className="p-md text-secondary">{staff.assignedFacilityName}</td>
                          <td className="p-md">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              staff.attendanceStatus === 'PRESENT' ? 'bg-green-100 text-green-800' :
                              staff.attendanceStatus === 'ABSENT' ? 'bg-error-container text-on-error-container' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {staff.attendanceStatus}
                            </span>
                          </td>
                          <td className="p-md font-mono text-secondary">{staff.biometricTimestamp}</td>
                          <td className="p-md space-x-2 whitespace-nowrap">
                            <button 
                              onClick={() => {
                                redeployStaff(staff.id, 'phc-alpha', 'PHC Alpha (Mundawar)');
                              }}
                              className="px-2.5 py-1 bg-primary text-white hover:opacity-90 rounded font-bold active:scale-95 transition shadow-sm"
                            >
                              Redeploy to PHC Alpha
                            </button>
                            <button 
                              onClick={() => {
                                redeployStaff(staff.id, 'chc-beta', 'CHC Beta (Tijara)');
                              }}
                              className="px-2.5 py-1 bg-surface-container-high hover:bg-surface-container border border-outline-variant rounded font-bold text-primary active:scale-95 transition"
                            >
                              Assign CHC Beta
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}


          {/* TAB 6: DIAGNOSTIC TESTS AUDIT */}
          {activeTab === 'tests' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-primary-container text-on-primary-container rounded-xl shadow-sm">
                    <span className="material-symbols-outlined text-3xl">biotech</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-primary tracking-tight">
                      {isHi ? 'डायग्नोस्टिक टेस्ट एवं उपकरण उपलब्धता ऑडिट' : 'Lab Diagnostics & Test Availability Audits'}
                    </h2>
                    <p className="text-xs text-on-surface-variant">
                      {isHi ? 'परीक्षण उपकरणों की स्थिति जांचें और रखरखाव टीमों को रवाना करें' : 'Monitor diagnostic machinery status, reagent availability, and test turnaround times'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Diagnostics Audit Table */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                <div className="p-lg border-b border-outline-variant bg-surface-container-low flex items-center justify-between">
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-primary">Equipment Operating Telemetry</h3>
                    <p className="text-body-sm text-on-surface-variant">Continuous IoT audit of laboratory analysers and radiology units</p>
                  </div>
                  <span className="text-xs bg-primary-fixed text-on-primary-fixed-variant px-3 py-1 rounded-full font-bold">
                    Automated IoT Audit
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-outline-variant text-label-bold text-secondary uppercase">
                      <tr>
                        <th className="p-md">Facility Name</th>
                        <th className="p-md">Diagnostic Test / Machine</th>
                        <th className="p-md">Category</th>
                        <th className="p-md">Equipment Status</th>
                        <th className="p-md">Tests Today</th>
                        <th className="p-md">Avg Turnaround</th>
                        <th className="p-md">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant text-xs">
                      {diagnosticTests.map(test => (
                        <tr key={test.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-md font-bold text-primary">{test.facilityName}</td>
                          <td className="p-md font-bold text-on-surface">{isHi ? test.testNameHi : test.testName}</td>
                          <td className="p-md text-secondary">{test.category}</td>
                          <td className="p-md">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              test.equipmentStatus === 'OPERATIONAL' ? 'bg-green-100 text-green-800' :
                              test.equipmentStatus === 'MAINTENANCE_REQUIRED' ? 'bg-error-container text-on-error-container animate-pulse' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {test.equipmentStatus}
                            </span>
                          </td>
                          <td className="p-md font-mono text-secondary">{test.testsConductedToday} Tests</td>
                          <td className="p-md font-mono text-secondary">{test.avgTurnaroundMinutes > 0 ? `${test.avgTurnaroundMinutes} mins` : 'N/A'}</td>
                          <td className="p-md space-x-2 whitespace-nowrap">
                            {test.equipmentStatus !== 'OPERATIONAL' ? (
                              <button 
                                onClick={() => requestMaintenance(test.id)}
                                className="px-3 py-1 bg-primary text-white hover:opacity-90 rounded font-bold active:scale-95 transition shadow-sm"
                              >
                                Dispatch Repair Crew / Restore
                              </button>
                            ) : (
                              <span className="text-green-700 font-bold flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">check_circle</span> Verified Good
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}


          {/* TAB 7: ANALYTICS & AI PREDICTIVE MODELLING */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-primary-container text-on-primary-container rounded-xl shadow-sm">
                    <span className="material-symbols-outlined text-3xl">analytics</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-primary tracking-tight">
                      {isHi ? 'एआई एनालिटिक्स एवं मांग पूर्वानुमान इंजन' : 'AI Analytics & Predictive Modelling Engine'}
                    </h2>
                    <p className="text-xs text-on-surface-variant">
                      {isHi ? 'जेमिनी 1.5 प्रो द्वारा जिले भर के स्वास्थ्य पैटर्न का सघन विश्लेषण' : 'Comprehensive district-wide health pattern analysis powered by Gemini 1.5 Pro'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Predictive Modelling Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ForecastingChart 
                  itemName="Amoxicillin 500mg"
                  currentStock={450}
                  averageDailyUsage={32}
                  facilityType="District Aggregated"
                  language={language}
                />

                <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center space-x-2 text-primary font-headline-sm text-base border-b border-outline-variant pb-3">
                    <span className="material-symbols-outlined text-xl">swap_horiz</span>
                    <h3>Smart Resource Redistribution Strategy</h3>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    <strong>AI Finding:</strong> Community Health Centres (specifically CHC Beta at Tijara and CHC Epsilon at Behror) consistently maintain a surplus inventory of essential fluids and antibiotics ranging between 150% and 200% of required buffer levels.
                  </p>
                  <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant space-y-2 text-xs">
                    <span className="font-extrabold text-primary block">Logistics Recommendation:</span>
                    <p className="text-on-surface-variant">Enable automated Smart Manifest generation to periodically transfer 15% of surplus antibiotic inventory from CHC Beta to neighboring under-resourced facilities like PHC Alpha and PHC Gamma.</p>
                  </div>
                </div>
              </div>

              {/* Performance Analytics Leaderboard */}
              <PerformanceAnalytics language={language} />

              {/* Nightly AI Workflow Timeline */}
              <NightlyWorkflow language={language} />

              {/* Resource Simulation Engine */}
              <ResourceSimulator language={language} />

              {/* AI Explainability Panel */}
              <AIExplainability language={language} transferApproved={transferApproved} />
            </div>
          )}


        </main>
      </div>

      {/* Floating Action Button matching code.html */}
      <button 
        onClick={() => alert('Opening Assign Task Modal')}
        className="fixed bottom-lg right-lg w-14 h-14 bg-primary text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform group z-50"
      >
        <span className="material-symbols-outlined text-3xl text-white">add</span>
        <span className="absolute right-full mr-md bg-on-background text-white px-md py-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-label-bold shadow-lg">
          Assign Task
        </span>
      </button>

      {/* Professional Footer */}
      <footer className="bg-surface-container-low border-t border-outline-variant py-4 px-6 text-center text-xs text-secondary space-y-1 z-30">
        <p className="font-bold text-primary">
          {isHi ? 'गूगल जीडीजी हैकाथॉन परियोजना • हेल्थनेक्सस एआई (HealthNexus AI)' : 'Google GDG Hackathon Project • HealthNexus AI Orchestrator'}
        </p>
        <p className="text-[11px] text-on-surface-variant">
          {isHi ? 'एचएल7/एफएचआईआर मानक संगत • संपूर्ण डेटा एंड-टू-एंड एन्क्रिप्टेड है' : 'HL7/FHIR Standards Compliant • All Telemetry Data is End-to-End Encrypted'}
        </p>
      </footer>
      <DemoStoryMode
        language={language}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSimulateCrisis={simulateCrisis}
        transferApproved={transferApproved}
      />
      <VoiceReporter language={language} />
    </div>
  );
}
