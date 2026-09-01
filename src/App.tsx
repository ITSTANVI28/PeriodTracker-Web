import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { HomeDashboard } from './components/app/HomeDashboard';
import { InteractiveCalendar } from './components/app/InteractiveCalendar';
import { HistoryStatsView } from './components/app/HistoryStatsView';
import { WellnessHub } from './components/app/WellnessHub';
import { SettingsView } from './components/app/SettingsView';
import { BottomNav } from './components/app/BottomNav';
import { PeriodLoggerModal } from './components/app/PeriodLoggerModal';
import { SymptomLoggerModal } from './components/app/SymptomLoggerModal';
import { PcodAssessmentModal } from './components/app/PcodAssessmentModal';
import { PinLockScreen } from './components/PinLockScreen';
import { AppState, PeriodLog, SymptomLog, PcodResult, Language } from './types';
import { loadStoredState, saveStoredState, getDefaultState } from './utils/storage';
import { ArrowLeft, Cloud, Download, Globe, Sparkles } from 'lucide-react';

export default function App() {
  const [appState, setAppState] = useState<AppState>(() => loadStoredState());
  const [periodModalOpen, setPeriodModalOpen] = useState(false);
  const [selectedDateForPeriodLog, setSelectedDateForPeriodLog] = useState<string | undefined>(undefined);
  const [symptomModalOpen, setSymptomModalOpen] = useState(false);
  const [selectedDateForSymptomLog, setSelectedDateForSymptomLog] = useState<string | undefined>(undefined);
  const [pcodModalOpen, setPcodModalOpen] = useState(false);

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveStoredState(appState);
  }, [appState]);

  // If in Landing Page view mode
  if (appState.view === 'landing') {
    return (
      <LandingPage 
        onOpenWebApp={() => {
          setAppState(prev => ({ 
            ...prev, 
            view: 'app', 
            isUnlocked: !prev.settings.pinEnabled 
          }));
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} 
      />
    );
  }

  // If PIN protection is enabled and app is locked
  if (appState.settings.pinEnabled && !appState.isUnlocked) {
    return (
      <PinLockScreen
        settings={appState.settings}
        onUnlockSuccess={() => setAppState(prev => ({ ...prev, isUnlocked: true }))}
        onResetPinSuccess={() => setAppState(prev => ({
          ...prev,
          isUnlocked: true,
          settings: { ...prev.settings, pinEnabled: false }
        }))}
      />
    );
  }

  const handleSavePeriodLog = (log: PeriodLog) => {
    setAppState(prev => {
      const existingIdx = prev.periodLogs.findIndex(p => p.id === log.id);
      let updatedLogs = [...prev.periodLogs];
      if (existingIdx >= 0) {
        updatedLogs[existingIdx] = log;
      } else {
        updatedLogs = [log, ...updatedLogs];
      }
      return { ...prev, periodLogs: updatedLogs };
    });
  };

  const handleSaveSymptomLog = (log: SymptomLog) => {
    setAppState(prev => {
      const existingIdx = prev.symptomLogs.findIndex(s => s.id === log.id || s.date === log.date);
      let updatedLogs = [...prev.symptomLogs];
      if (existingIdx >= 0) {
        updatedLogs[existingIdx] = log;
      } else {
        updatedLogs = [log, ...updatedLogs];
      }
      return { ...prev, symptomLogs: updatedLogs };
    });
  };

  const handleSavePcodResult = (res: PcodResult) => {
    setAppState(prev => ({
      ...prev,
      pcodHistory: [res, ...prev.pcodHistory]
    }));
  };

  const handleLanguageChange = (lang: Language) => {
    setAppState(prev => ({
      ...prev,
      settings: { ...prev.settings, language: lang }
    }));
  };

  const currentLang = appState.settings.language || 'EN';
  const DIRECT_APK_DOWNLOAD_URL = "https://github.com/ITSTANVI28/PeriodTracker/releases/download/v1.0.0/app-release.apk";

  return (
    <div className="min-h-screen bg-[#FFF8F8] text-[#16213E] flex flex-col selection:bg-[#B95679] selection:text-white">
      {/* Top Web Tracker App Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#B95679]/15 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setAppState(prev => ({ ...prev, view: 'landing' }));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#B95679]/10 hover:bg-[#B95679]/20 text-[#B95679] border border-[#B95679]/20 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              title="Return to Landing Page"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Landing Page</span>
            </button>

            <span className="hidden sm:inline-block h-4 w-px bg-gray-200"></span>

            <div 
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => setAppState(prev => ({ ...prev, currentAppTab: 'home' }))}
            >
              <img 
                src="/ic_launcher-playstore-removebg-preview.png" 
                alt="Logo" 
                className="w-7 h-7 sm:w-8 sm:h-8 object-contain drop-shadow-xs group-hover:scale-105 transition-transform" 
              />
              <span className="text-base sm:text-lg font-black font-display text-[#B95679] tracking-tight">
                PeriodTracker <span className="text-[10px] font-bold text-gray-500 font-sans hidden md:inline">Web App</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cloud Sync Status Pill */}
            <div 
              onClick={() => setAppState(prev => ({ ...prev, currentAppTab: 'settings' }))}
              className={`px-3 py-1 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                appState.settings.cloudSync?.isSignedIn 
                  ? 'bg-sky-50 text-sky-800 border-sky-300 hover:bg-sky-100' 
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
              }`}
              title="Click to manage cloud backup and settings"
            >
              <Cloud className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span className="hidden md:inline">
                {appState.settings.cloudSync?.isSignedIn ? 'Cloud Synced ☁️' : 'Local-First (Offline)'}
              </span>
            </div>

            {/* Language Toggle */}
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-0.5 text-xs font-bold">
              {(['EN', 'HI', 'MR'] as Language[]).map(l => (
                <button
                  key={l}
                  onClick={() => handleLanguageChange(l)}
                  className={`px-2 py-1 rounded-lg transition-all ${
                    currentLang === l 
                      ? 'bg-[#B95679] text-white shadow-xs' 
                      : 'text-gray-600 hover:text-[#B95679]'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Direct APK Download CTA */}
            <a
              href={DIRECT_APK_DOWNLOAD_URL}
              download
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#B95679] to-[#9E4566] text-white text-xs font-bold shadow-sm hover:scale-105 active:scale-95 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>APK v1.0 📱</span>
            </a>
          </div>

        </div>
      </header>

      {/* Main Web App Workspace View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {appState.currentAppTab === 'home' && (
          <HomeDashboard
            appState={appState}
            onOpenPeriodLogger={() => {
              setSelectedDateForPeriodLog(undefined);
              setPeriodModalOpen(true);
            }}
            onOpenSymptomLogger={() => {
              setSelectedDateForSymptomLog(undefined);
              setSymptomModalOpen(true);
            }}
            onOpenPcodAssessment={() => setPcodModalOpen(true)}
            onNavigateTab={tab => setAppState(prev => ({ ...prev, currentAppTab: tab }))}
          />
        )}

        {appState.currentAppTab === 'calendar' && (
          <InteractiveCalendar
            appState={appState}
            onSelectDateToLog={d => {
              setSelectedDateForPeriodLog(d);
              setPeriodModalOpen(true);
            }}
            onOpenSymptomLoggerForDate={d => {
              setSelectedDateForSymptomLog(d);
              setSymptomModalOpen(true);
            }}
            onDeletePeriodLog={id => {
              setAppState(prev => ({
                ...prev,
                periodLogs: prev.periodLogs.filter(p => p.id !== id)
              }));
            }}
            onDeleteSymptomLog={id => {
              setAppState(prev => ({
                ...prev,
                symptomLogs: prev.symptomLogs.filter(s => s.id !== id)
              }));
            }}
          />
        )}

        {appState.currentAppTab === 'history' && (
          <HistoryStatsView
            appState={appState}
            onDeleteLog={id => {
              setAppState(prev => ({
                ...prev,
                periodLogs: prev.periodLogs.filter(p => p.id !== id)
              }));
            }}
          />
        )}

        {appState.currentAppTab === 'wellness' && (
          <WellnessHub language={currentLang} />
        )}

        {appState.currentAppTab === 'settings' && (
          <SettingsView
            appState={appState}
            onUpdateSettings={newSettings => setAppState(prev => ({ ...prev, settings: newSettings }))}
            onRestoreState={restoredState => setAppState(restoredState)}
            onResetAllData={() => {
              localStorage.clear();
              setAppState(getDefaultState());
            }}
          />
        )}
      </main>

      {/* Navigation Footer */}
      <BottomNav
        currentTab={appState.currentAppTab}
        language={currentLang}
        onSelectTab={tab => setAppState(prev => ({ ...prev, currentAppTab: tab }))}
        onBackToLanding={() => {
          setAppState(prev => ({ ...prev, view: 'landing' }));
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Modals */}
      {periodModalOpen && (
        <PeriodLoggerModal
          initialStartDate={selectedDateForPeriodLog}
          language={currentLang}
          onSave={handleSavePeriodLog}
          onClose={() => setPeriodModalOpen(false)}
        />
      )}

      {symptomModalOpen && (
        <SymptomLoggerModal
          initialDateStr={selectedDateForSymptomLog}
          language={currentLang}
          onSave={handleSaveSymptomLog}
          onClose={() => setSymptomModalOpen(false)}
        />
      )}

      {pcodModalOpen && (
        <PcodAssessmentModal
          profile={appState.settings.profile}
          periodLogs={appState.periodLogs}
          symptomLogs={appState.symptomLogs}
          language={currentLang}
          onSaveResult={handleSavePcodResult}
          onClose={() => setPcodModalOpen(false)}
        />
      )}
    </div>
  );
}
