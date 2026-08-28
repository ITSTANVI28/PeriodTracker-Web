import React, { useState } from 'react';
import { 
  Settings, 
  Lock, 
  Globe, 
  FileText, 
  Download, 
  Upload, 
  RotateCcw, 
  Check, 
  KeyRound, 
  Moon, 
  Sun,
  ShieldAlert
} from 'lucide-react';
import { AppState, Language, UserSettings } from '../../types';
import { hashString, exportBackupJSON } from '../../utils/storage';
import { exportHealthPdfReport } from '../../utils/pdfExport';
import { translations } from '../../utils/translations';

interface SettingsViewProps {
  appState: AppState;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onRestoreState: (state: AppState) => void;
  onResetAllData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  appState,
  onUpdateSettings,
  onRestoreState,
  onResetAllData
}) => {
  const settings = appState.settings;
  const lang = settings.language || 'EN';
  const t = translations[lang] || translations.EN;

  // Profile form
  const [name, setName] = useState(settings.profile.name);
  const [avgCycle, setAvgCycle] = useState(settings.profile.avgCycleLength);
  const [avgPeriod, setAvgPeriod] = useState(settings.profile.avgPeriodLength);

  // PIN form
  const [pinEnabled, setPinEnabled] = useState(settings.pinEnabled);
  const [newPin, setNewPin] = useState('');
  const [secQuestion, setSecQuestion] = useState(settings.securityQuestion?.question || "What is your pet's name?");
  const [secAnswer, setSecAnswer] = useState('');

  const [saveMessage, setSaveMessage] = useState('');

  const APK_URL = "https://github.com/ITSTANVI28/PeriodTracker/releases/latest";

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserSettings = {
      ...settings,
      profile: {
        ...settings.profile,
        name,
        avgCycleLength: Number(avgCycle),
        avgPeriodLength: Number(avgPeriod)
      }
    };
    onUpdateSettings(updated);
    setSaveMessage('Profile settings saved!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleLanguageChange = (newLang: Language) => {
    const updated: UserSettings = {
      ...settings,
      language: newLang
    };
    onUpdateSettings(updated);
  };

  const handleThemeToggle = () => {
    const updated: UserSettings = {
      ...settings,
      theme: settings.theme === 'light' ? 'dark' : 'light'
    };
    onUpdateSettings(updated);
  };

  const handleSavePinSecurity = async (e: React.FormEvent) => {
    e.preventDefault();

    let pinHash = settings.pinHash;
    if (newPin.trim().length === 4) {
      pinHash = await hashString(newPin.trim());
    }

    let securityQuestion = settings.securityQuestion;
    if (secAnswer.trim()) {
      const answerHash = await hashString(secAnswer.trim());
      securityQuestion = {
        question: secQuestion,
        answerHash
      };
    }

    const updated: UserSettings = {
      ...settings,
      pinEnabled,
      pinHash,
      securityQuestion
    };

    onUpdateSettings(updated);
    setNewPin('');
    setSecAnswer('');
    setSaveMessage('Security settings updated!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.periodLogs) {
          onRestoreState(parsed);
          alert('Data successfully restored!');
        } else {
          alert('Invalid backup JSON format.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-24 md:pb-12 px-1 sm:px-0">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold font-display text-[#16213E] flex items-center gap-2">
          <Settings className="w-5 sm:w-6 h-5 sm:h-6 text-[#B95679]" />
          {t.settingsTitle}
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">Manage profile, security, multi-language, and offline data backups</p>
      </div>

      {saveMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          {saveMessage}
        </div>
      )}

      {/* Language Switcher */}
      <div className="p-5 sm:p-6 bg-white border border-[#B95679]/15 rounded-3xl shadow-sm space-y-4">
        <h3 className="font-bold text-sm sm:text-base text-[#16213E] flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#B95679]" />
          {t.languageSelect}
        </h3>

        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
          {[
            { id: 'EN', label: 'English 🇬🇧' },
            { id: 'HI', label: 'हिन्दी 🇮🇳' },
            { id: 'MR', label: 'मराठी 🇮🇳' }
          ].map(l => (
            <button
              key={l.id}
              onClick={() => handleLanguageChange(l.id as Language)}
              className={`p-3 sm:p-3.5 rounded-2xl border text-xs font-bold transition-all text-center active:scale-95 ${
                lang === l.id
                  ? 'bg-[#B95679] text-white border-[#B95679] shadow-md shadow-[#B95679]/20'
                  : 'bg-gray-50 border-gray-200 text-[#16213E] hover:border-gray-300'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Profile Settings */}
      <form onSubmit={handleSaveProfile} className="p-5 sm:p-6 bg-white border border-[#B95679]/15 rounded-3xl shadow-sm space-y-4 sm:space-y-5">
        <h3 className="font-bold text-sm sm:text-base text-[#16213E]">{t.profileSetup}</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">
              {t.userName}:
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#16213E] focus:outline-none focus:border-[#B95679]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">
              {t.avgCycleDays}:
            </label>
            <input
              type="number"
              min="20"
              max="45"
              value={avgCycle}
              onChange={e => setAvgCycle(parseInt(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#16213E] focus:outline-none focus:border-[#B95679]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">
              {t.avgPeriodDays}:
            </label>
            <input
              type="number"
              min="2"
              max="10"
              value={avgPeriod}
              onChange={e => setAvgPeriod(parseInt(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#16213E] focus:outline-none focus:border-[#B95679]"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-[#B95679] hover:bg-[#9E4566] active:scale-95 text-white text-xs font-bold rounded-xl shadow-md transition-all"
        >
          Save Profile
        </button>
      </form>

      {/* Security & PIN Lock */}
      <form onSubmit={handleSavePinSecurity} className="p-5 sm:p-6 bg-white border border-[#B95679]/15 rounded-3xl shadow-sm space-y-4 sm:space-y-5">
        <h3 className="font-bold text-sm sm:text-base text-[#16213E] flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#B95679]" />
          {t.securityPin}
        </h3>

        <div className="flex items-center justify-between p-3.5 sm:p-4 bg-gray-50 rounded-2xl">
          <div>
            <span className="text-xs font-bold text-[#16213E] block">{t.enablePin}</span>
            <span className="text-[11px] text-gray-500">Require PIN every time app opens</span>
          </div>
          <input
            type="checkbox"
            checked={pinEnabled}
            onChange={e => setPinEnabled(e.target.checked)}
            className="w-5 h-5 accent-[#B95679] rounded cursor-pointer"
          />
        </div>

        {pinEnabled && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 pt-1">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Set 4-Digit PIN:
              </label>
              <input
                type="password"
                maxLength={4}
                placeholder={settings.pinHash ? '•••• (Unchanged)' : 'Enter 4 digits'}
                value={newPin}
                onChange={e => setNewPin(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#16213E] focus:outline-none focus:border-[#B95679]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Security Recovery Question Answer:
              </label>
              <input
                type="text"
                placeholder="Secret answer for PIN reset"
                value={secAnswer}
                onChange={e => setSecAnswer(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#16213E] focus:outline-none focus:border-[#B95679]"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          className="px-6 py-2.5 bg-[#16213E] hover:bg-[#1A1A2E] active:scale-95 text-white text-xs font-bold rounded-xl shadow-md transition-all"
        >
          Update Security Settings
        </button>
      </form>

      {/* PDF & Data Backup Tools */}
      <div className="p-5 sm:p-6 bg-white border border-[#B95679]/15 rounded-3xl shadow-sm space-y-4">
        <h3 className="font-bold text-sm sm:text-base text-[#16213E] flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#B95679]" />
          {t.backupRestore}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <button
            onClick={() => exportHealthPdfReport(settings.profile, appState.periodLogs, appState.symptomLogs, appState.pcodHistory[0])}
            className="p-3.5 sm:p-4 bg-[#B95679] hover:bg-[#9E4566] active:scale-95 text-white rounded-2xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" />
            {t.exportDataPdf}
          </button>

          <button
            onClick={() => exportBackupJSON(appState)}
            className="p-3.5 sm:p-4 bg-gray-50 hover:bg-gray-100 active:scale-95 border border-gray-200 text-[#16213E] rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-[#B95679]" />
            {t.exportJson}
          </button>

          <label className="p-3.5 sm:p-4 bg-gray-50 hover:bg-gray-100 active:scale-95 border border-gray-200 text-[#16213E] rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4 text-[#B95679]" />
            {t.importJson}
            <input
              type="file"
              accept=".json"
              onChange={handleImportJson}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* APK Direct Download Section */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-[#16213E] to-[#1A1A2E] text-white rounded-3xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-sm sm:text-base text-white">Download Android APK</h4>
          <p className="text-xs text-white/60">Install directly on Android devices for full offline support</p>
        </div>
        <a
          href={APK_URL}
          target="_blank"
          rel="noreferrer"
          className="w-full sm:w-auto px-6 py-3 bg-[#B95679] hover:bg-[#9E4566] active:scale-95 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          GitHub Latest APK
        </a>
      </div>

      {/* Danger Zone */}
      <div className="p-5 sm:p-6 bg-red-50/50 border border-red-200 rounded-3xl space-y-3">
        <h4 className="font-bold text-sm text-red-800 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-red-600" />
          Danger Zone
        </h4>
        <p className="text-xs text-red-600">
          Resetting will permanently erase all offline period logs, symptoms, and settings from this device.
        </p>
        <button
          onClick={() => {
            if (confirm("Are you sure you want to erase all PeriodTracker data from this device?")) {
              onResetAllData();
            }
          }}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {t.resetData}
        </button>
      </div>
    </div>
  );
};
