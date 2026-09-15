import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Search, 
  Globe, 
  Volume2, 
  VolumeX, 
  Type, 
  Sun, 
  Moon, 
  Bell, 
  Check, 
  X, 
  ArrowRight,
  Compass,
  Clock,
  IndianRupee,
  FolderArchive,
  Scale,
  MessageSquare,
  Calendar,
  Download,
  Building2,
  ShieldCheck,
  LayoutDashboard,
  Scroll
} from 'lucide-react';

// Subcomponents
import CitizenDashboard from './citizen/CitizenDashboard';
import MyLandGISMap from './citizen/MyLandGISMap';
import AcquisitionTimeline from './citizen/AcquisitionTimeline';
import CompensationBreakdown from './citizen/CompensationBreakdown';
import DocumentVaultUpload from './citizen/DocumentVaultUpload';
import ApplyLandPapers from './citizen/ApplyLandPapers';
import LegalObjectionCases from './citizen/LegalObjectionCases';
import GrievanceTracker from './citizen/GrievanceTracker';
import ImportantDeadlines from './citizen/ImportantDeadlines';
import AuthorityContactCard from './citizen/AuthorityContactCard';
import ReportGenerator from './citizen/ReportGenerator';
import PrivacyConsentCenter from './citizen/PrivacyConsentCenter';

// Data & Translations
import { CITIZEN_TRANSLATIONS } from './citizen/CitizenTranslations';
import { CITIZEN_NOTIFICATIONS } from './citizen/citizenData';

export default function CitizenPortal({ parcels, selectedParcel, setSelectedParcel }) {
  // Active parcel state
  const [activeParcel, setActiveParcel] = useState(selectedParcel || parcels[0]);
  const [searchQuery, setSearchQuery] = useState(activeParcel.ulpin);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Multilingual state ('en' | 'hi')
  const [lang, setLang] = useState('en');
  const t = CITIZEN_TRANSLATIONS[lang];

  // Accessibility states
  const [fontSizeClass, setFontSizeClass] = useState('text-sm'); // 'text-sm' | 'text-base' | 'text-lg'
  const [highContrast, setHighContrast] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Notification center states
  const [notifications, setNotifications] = useState(CITIZEN_NOTIFICATIONS);
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Sync when selectedParcel prop changes
  useEffect(() => {
    if (selectedParcel) {
      setActiveParcel(selectedParcel);
      setSearchQuery(selectedParcel.ulpin);
    }
  }, [selectedParcel]);

  // Handle parcel search or select
  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase().trim();
    const found = parcels.find(p => 
      p.ulpin.toLowerCase().includes(query) ||
      p.surveyNo.toLowerCase().includes(query) ||
      p.ownerName.toLowerCase().includes(query)
    );
    if (found) {
      setActiveParcel(found);
      if (setSelectedParcel) setSelectedParcel(found);
    } else {
      alert(`No parcel found matching "${searchQuery}". Please try: 06-12-8891-K9X2A4 or 45/2A`);
    }
  };

  const handleSelectParcel = (pId) => {
    const found = parcels.find(p => p.id === pId);
    if (found) {
      setActiveParcel(found);
      setSearchQuery(found.ulpin);
      if (setSelectedParcel) setSelectedParcel(found);
    }
  };

  // Text-to-Speech (Accessibility Read Aloud)
  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const textToRead = lang === 'hi'
        ? `भू-सेतु नागरिक पोर्टल में आपका स्वागत है। आपके भू-खंड का भू-आधार यूएलपीआईएन ${activeParcel.ulpin} है। भू-स्वामी ${activeParcel.ownerName}। वर्तमान स्थिति ${activeParcel.status}। कुल निर्धारित मुआवजा राशि ₹${activeParcel.totalAwardAmount} है।`
        : `Welcome to BhoomiSetu Citizen Portal. Your parcel ULPIN is ${activeParcel.ulpin} registered to ${activeParcel.ownerName}. Current acquisition status is ${activeParcel.status.replace(/_/g, ' ')}. Total determined compensation award is ₹${activeParcel.totalAwardAmount}.`;

      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  // Notification actions
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  // Navigation Items Definitions
  const navTabs = [
    { id: 'dashboard', label: t.tabDashboard, icon: LayoutDashboard },
    { id: 'gis', label: t.tabMyLand, icon: Compass },
    { id: 'timeline', label: t.tabTimeline, icon: Clock },
    { id: 'compensation', label: t.tabCompensation, icon: IndianRupee },
    { id: 'documents', label: t.tabDocuments, icon: FolderArchive },
    { id: 'applyPapers', label: t.tabApplyPapers, icon: Scroll },
    { id: 'legal', label: t.tabLegal, icon: Scale },
    { id: 'grievances', label: t.tabGrievances, icon: MessageSquare },
    { id: 'deadlines', label: t.tabDeadlines, icon: Calendar },
    { id: 'report', label: t.tabReport, icon: Download },
    { id: 'authority', label: t.tabAuthority, icon: Building2 },
    { id: 'privacy', label: t.tabPrivacy, icon: ShieldCheck }
  ];

  return (
    <div className={`min-h-screen transition-colors ${highContrast ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'} ${fontSizeClass}`}>
      
      {/* 1. Top Utility & Accessibility Bar */}
      <header className={`sticky top-0 z-[100] border-b backdrop-blur-md ${
        highContrast ? 'bg-black/90 border-slate-700' : 'bg-white/95 border-slate-200 shadow-xs'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          
          {/* Brand & Portal Title */}
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xs">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xs sm:text-sm font-black font-mono tracking-tight flex items-center space-x-1.5">
                <span className="text-emerald-700">BHOOMISETU</span>
                <span className="text-slate-400">/</span>
                <span className="truncate">{t.portalTitle}</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
                {t.portalSubtitle}
              </p>
            </div>
          </div>

          {/* Accessibility & Language Controls */}
          <div className="flex items-center space-x-2">
            
            {/* Language Selector (EN / हिन्दी) */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  lang === 'en' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  lang === 'hi' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Accessibility Toolbar */}
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              
              {/* Font Size Scaling */}
              <button
                onClick={() => setFontSizeClass('text-xs')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${fontSizeClass === 'text-xs' ? 'bg-white shadow-xs' : 'text-slate-600'}`}
                title="A- Decrease font size"
              >
                A-
              </button>
              <button
                onClick={() => setFontSizeClass('text-sm')}
                className={`px-1.5 py-0.5 rounded text-xs font-bold ${fontSizeClass === 'text-sm' ? 'bg-white shadow-xs' : 'text-slate-600'}`}
                title="A Normal font size"
              >
                A
              </button>
              <button
                onClick={() => setFontSizeClass('text-base')}
                className={`px-1.5 py-0.5 rounded text-sm font-bold ${fontSizeClass === 'text-base' ? 'bg-white shadow-xs' : 'text-slate-600'}`}
                title="A+ Increase font size"
              >
                A+
              </button>

              <div className="w-px h-3.5 bg-slate-300 mx-1" />

              {/* High Contrast Mode Toggle */}
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`p-1 rounded-lg transition-colors ${highContrast ? 'bg-amber-400 text-slate-950' : 'text-slate-700 hover:bg-white'}`}
                title="Toggle High Contrast Mode"
              >
                {highContrast ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>

              {/* Read Aloud (Speech Synthesis) */}
              <button
                onClick={toggleSpeech}
                className={`p-1 rounded-lg transition-colors ${isSpeaking ? 'bg-rose-500 text-white animate-pulse' : 'text-slate-700 hover:bg-white'}`}
                title={isSpeaking ? t.accStopSpeech : t.accReadAloud}
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Notifications Dropdown Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative bg-slate-100 hover:bg-slate-200 border border-slate-200 p-2 rounded-xl text-slate-700 transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Drawer */}
              {showNotifications && (
                <div className="absolute right-0 top-11 w-80 sm:w-96 bg-white border border-slate-300 rounded-2xl shadow-2xl p-4 z-50 text-slate-900 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center space-x-2">
                      <Bell className="w-4 h-4 text-amber-600" />
                      <h4 className="font-black text-xs font-mono">{t.notifications}</h4>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[10px] text-emerald-700 hover:underline font-bold cursor-pointer"
                      >
                        {t.markAllRead}
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1 text-xs">
                    {notifications.map((n) => {
                      const getPriorityBadge = (p) => {
                        switch (p) {
                          case 'URGENT':
                            return 'bg-rose-100 text-rose-800 border-rose-200';
                          case 'LEGAL':
                            return 'bg-amber-100 text-amber-800 border-amber-200';
                          case 'DOCUMENTS':
                            return 'bg-blue-100 text-blue-800 border-blue-200';
                          default:
                            return 'bg-slate-100 text-slate-700 border-slate-200';
                        }
                      };

                      return (
                        <div 
                          key={n.id}
                          className={`p-2.5 rounded-xl border transition-colors ${
                            n.read ? 'bg-slate-50 border-slate-200' : 'bg-amber-50/40 border-amber-200 font-semibold'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border uppercase ${getPriorityBadge(n.priority)}`}>
                              {n.priority}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">{n.timestamp}</span>
                          </div>
                          <h5 className="font-bold text-slate-900 mt-1">
                            {lang === 'hi' ? n.titleHi : n.title}
                          </h5>
                          <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                            {lang === 'hi' ? n.messageHi : n.message}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-slate-200 pt-2 flex justify-end">
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* 2. Parcel Selection & ULPIN Quick Search Bar */}
      <section className="max-w-7xl mx-auto px-4 pt-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Active Parcel Pill */}
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 font-black font-mono text-sm shrink-0">
              06
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                  {t.verifiedRecord}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Owner: <strong className="text-slate-900">{activeParcel.ownerName}</strong>
                </span>
              </div>
              <h2 className="text-base font-black font-mono text-slate-900 mt-0.5 flex items-center space-x-2">
                <span>{activeParcel.ulpin}</span>
                <span className="text-xs text-slate-500 font-sans font-normal">(Plot {activeParcel.surveyNo})</span>
              </h2>
            </div>
          </div>

          {/* Quick Parcel Switcher Dropdown & Search Form */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            
            {/* Quick Parcel Switcher */}
            <select
              value={activeParcel.id}
              onChange={(e) => handleSelectParcel(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:border-emerald-500 cursor-pointer"
            >
              {parcels.map(p => (
                <option key={p.id} value={p.id}>
                  {p.ulpin} — {p.ownerName} (Plot {p.surveyNo})
                </option>
              ))}
            </select>

            {/* Direct ULPIN Search */}
            <form onSubmit={handleSearch} className="flex items-center space-x-1.5">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 placeholder-slate-400 focus:border-emerald-500 w-36 sm:w-48"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center space-x-1 cursor-pointer transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.verifyBtn}</span>
              </button>
            </form>

          </div>

        </div>
      </section>

      {/* 3. Horizontal Navigation Tabs Bar */}
      <nav className="max-w-7xl mx-auto px-4 pt-3">
        <div className="flex items-center space-x-1 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
                  isActive 
                    ? 'bg-slate-900 text-white shadow-sm' 
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 4. Main Subcomponent Content View */}
      <main className="max-w-7xl mx-auto px-4 py-4">
        {activeTab === 'dashboard' && (
          <CitizenDashboard 
            parcel={activeParcel} 
            lang={lang} 
            onNavigateTab={setActiveTab} 
          />
        )}

        {activeTab === 'gis' && (
          <MyLandGISMap 
            parcel={activeParcel} 
            lang={lang} 
            onNavigateTab={setActiveTab} 
          />
        )}

        {activeTab === 'timeline' && (
          <AcquisitionTimeline 
            parcel={activeParcel} 
            lang={lang} 
            onNavigateTab={setActiveTab} 
          />
        )}

        {activeTab === 'compensation' && (
          <CompensationBreakdown 
            parcel={activeParcel} 
            lang={lang} 
            onNavigateTab={setActiveTab} 
          />
        )}

        {activeTab === 'documents' && (
          <DocumentVaultUpload 
            parcel={activeParcel} 
            lang={lang} 
          />
        )}

        {activeTab === 'applyPapers' && (
          <ApplyLandPapers 
            parcel={activeParcel} 
            lang={lang} 
          />
        )}

        {activeTab === 'legal' && (
          <LegalObjectionCases 
            parcel={activeParcel} 
            lang={lang} 
            onNavigateTab={setActiveTab} 
          />
        )}

        {activeTab === 'grievances' && (
          <GrievanceTracker 
            parcel={activeParcel} 
            lang={lang} 
          />
        )}

        {activeTab === 'deadlines' && (
          <ImportantDeadlines 
            parcel={activeParcel} 
            lang={lang} 
            onNavigateTab={setActiveTab} 
          />
        )}

        {activeTab === 'report' && (
          <ReportGenerator 
            parcel={activeParcel} 
            lang={lang} 
          />
        )}

        {activeTab === 'authority' && (
          <AuthorityContactCard 
            parcel={activeParcel} 
            lang={lang} 
          />
        )}

        {activeTab === 'privacy' && (
          <PrivacyConsentCenter 
            parcel={activeParcel} 
            lang={lang} 
          />
        )}
      </main>

    </div>
  );
}
