import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Activity, 
  Stethoscope, 
  Sparkles, 
  Download, 
  X, 
  ChevronRight,
  Heart
} from 'lucide-react';
import { AppState } from '../../types';
import { calculateCyclePrediction, formatDateStr } from '../../utils/cycleEngine';
import { translations } from '../../utils/translations';

interface HomeDashboardProps {
  appState: AppState;
  onOpenPeriodLogger: () => void;
  onOpenSymptomLogger: () => void;
  onOpenPcodAssessment: () => void;
  onNavigateTab: (tab: AppState['currentAppTab']) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  appState,
  onOpenPeriodLogger,
  onOpenSymptomLogger,
  onOpenPcodAssessment,
  onNavigateTab
}) => {
  const [showApkBanner, setShowApkBanner] = useState(true);
  const lang = appState.settings.language || 'EN';
  const t = translations[lang] || translations.EN;

  const profile = appState.settings.profile;
  const prediction = calculateCyclePrediction(
    appState.periodLogs,
    profile.avgCycleLength,
    profile.avgPeriodLength
  );

  const APK_URL = "https://github.com/ITSTANVI28/PeriodTracker/releases/download/v1.0.0/app-release.apk";

  // Build mini upcoming 7 days calendar
  const today = new Date();
  const miniDays = [];
  for (let i = -1; i <= 5; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = formatDateStr(d);

    let dayType: 'period' | 'predicted' | 'fertile' | 'ovulation' | 'normal' = 'normal';

    const isLoggedPeriod = appState.periodLogs.some(p => {
      return dateStr >= p.startDate && dateStr <= p.endDate;
    });

    if (isLoggedPeriod) {
      dayType = 'period';
    } else if (dateStr >= formatDateStr(prediction.nextPeriodStart) && dateStr <= formatDateStr(prediction.nextPeriodEnd)) {
      dayType = 'predicted';
    } else if (dateStr === formatDateStr(prediction.ovulationDate)) {
      dayType = 'ovulation';
    } else if (dateStr >= formatDateStr(prediction.fertileStart) && dateStr <= formatDateStr(prediction.fertileEnd)) {
      dayType = 'fertile';
    }

    miniDays.push({
      dateObj: d,
      dateStr,
      dayNum: d.getDate(),
      dayName: d.toLocaleDateString(lang === 'EN' ? 'en-US' : 'hi-IN', { weekday: 'narrow' }),
      isToday: dateStr === formatDateStr(today),
      dayType
    });
  }

  return (
    <div className="space-y-6 pb-24 md:pb-12 px-1 sm:px-0">
      {/* Optional Dismissible APK Banner */}
      {showApkBanner && (
        <div className="bg-gradient-to-r from-[#16213E] to-[#1A1A2E] text-white p-4 sm:p-5 rounded-3xl shadow-lg border border-[#B95679]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#B95679]/20 flex items-center justify-center text-[#B95679] flex-shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-white">PeriodTracker Android App v1.0</h4>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                  Signed Release
                </span>
              </div>
              <p className="text-xs text-white/60">Android 14 Ready (API 34) • Lightweight ~8.4 MB • Local + Cloud Sync</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <a
              href={APK_URL}
              download
              className="px-4 py-2 bg-[#B95679] hover:bg-[#9E4566] active:scale-95 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 flex-shrink-0 shadow-md"
            >
              {t.downloadNow}
            </a>
            <button
              onClick={() => setShowApkBanner(false)}
              className="p-2 text-white/40 hover:text-white rounded-lg transition-colors"
              title={t.dismiss}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Countdown Hero Ring Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-white to-[#FFF5F7] border border-[#B95679]/15 rounded-3xl p-5 sm:p-8 shadow-xl shadow-[#B95679]/5">
        <div className="absolute -top-10 -right-10 w-48 sm:w-72 h-48 sm:h-72 bg-[#B95679]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 relative z-10">
          <div className="space-y-3 text-center md:text-left w-full md:w-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B95679]/10 text-[#B95679] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              {t.welcomeBack} {profile.name || 'Sarah'}
            </div>

            <h2 className="text-3xl xs:text-4xl sm:text-5xl font-black font-display text-[#16213E] tracking-tight">
              {prediction.currentPhaseStatus === 'period' ? (
                <span className="text-[#B95679]">
                  {t.periodActive}
                </span>
              ) : prediction.currentPhaseStatus === 'ovulation' ? (
                <span className="text-[#FF8F00]">
                  {t.ovulationDay}
                </span>
              ) : prediction.currentPhaseStatus === 'fertile' ? (
                <span className="text-[#FBC02D]">
                  {t.fertileWindow}
                </span>
              ) : (
                <span>
                  {prediction.daysUntilNextPeriod} {t.daysUntilPeriod}
                </span>
              )}
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-[#16213E]/70 max-w-md">
              Predicted Next Period:{' '}
              <span className="font-bold text-[#B95679]">
                {prediction.nextPeriodStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </p>

            <div className="pt-1 flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="px-3 py-1 bg-gray-100/80 border border-gray-200/50 text-[#16213E] rounded-full text-xs font-semibold">
                Avg Cycle: {prediction.avgCycleLength} Days
              </span>
              <span className="px-3 py-1 bg-gray-100/80 border border-gray-200/50 text-[#16213E] rounded-full text-xs font-semibold">
                Avg Period: {prediction.avgPeriodLength} Days
              </span>
            </div>
          </div>

          {/* Radial Visual Counter Widget */}
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex-shrink-0 flex items-center justify-center my-2 md:my-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="7"
                className="text-gray-100"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="7"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * (prediction.avgCycleLength - Math.max(0, prediction.daysUntilNextPeriod))) / prediction.avgCycleLength}
                strokeLinecap="round"
                className="text-[#B95679] transition-all duration-1000"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl sm:text-3xl font-black font-display text-[#16213E]">
                {prediction.daysUntilNextPeriod}
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Days Left
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2x2 Quick Actions Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 px-1">
          {t.quickActions}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <button
            onClick={onOpenPeriodLogger}
            className="p-4 sm:p-5 rounded-2xl bg-white border border-[#B95679]/15 shadow-sm hover:shadow-md hover:border-[#B95679] active:scale-95 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#B95679] text-white flex items-center justify-center mb-3 shadow-md shadow-[#B95679]/20 group-hover:scale-110 transition-transform">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-[#16213E]">{t.logPeriod}</h4>
            <p className="text-[10px] sm:text-[11px] text-[#16213E]/60 mt-0.5 leading-tight">Start/end date & flow</p>
          </button>

          <button
            onClick={onOpenSymptomLogger}
            className="p-4 sm:p-5 rounded-2xl bg-white border border-[#B95679]/15 shadow-sm hover:shadow-md hover:border-[#B95679] active:scale-95 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#16213E] text-white flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform">
              <Activity className="w-5 h-5 text-[#B95679]" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-[#16213E]">{t.logSymptoms}</h4>
            <p className="text-[10px] sm:text-[11px] text-[#16213E]/60 mt-0.5 leading-tight">Cramps, mood, fatigue</p>
          </button>

          <button
            onClick={onOpenPcodAssessment}
            className="p-4 sm:p-5 rounded-2xl bg-white border border-[#B95679]/15 shadow-sm hover:shadow-md hover:border-[#B95679] active:scale-95 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#B95679]/15 text-[#B95679] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-[#16213E]">{t.pcodAssessment}</h4>
            <p className="text-[10px] sm:text-[11px] text-[#16213E]/60 mt-0.5 leading-tight">10-question quiz</p>
          </button>

          <button
            onClick={() => onNavigateTab('wellness')}
            className="p-4 sm:p-5 rounded-2xl bg-white border border-[#B95679]/15 shadow-sm hover:shadow-md hover:border-[#B95679] active:scale-95 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FFF0F3] text-[#B95679] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Heart className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-[#16213E]">{t.wellnessHub}</h4>
            <p className="text-[10px] sm:text-[11px] text-[#16213E]/60 mt-0.5 leading-tight">Pain relief & diet</p>
          </button>
        </div>
      </div>

      {/* Mini Calendar Widget */}
      <div className="p-5 sm:p-6 bg-white border border-[#B95679]/15 rounded-3xl shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-sm sm:text-base text-[#16213E]">{t.upcomingCycle}</h3>
          <button
            onClick={() => onNavigateTab('calendar')}
            className="text-xs font-bold text-[#B95679] hover:underline flex items-center gap-1"
          >
            Full Calendar <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto pb-1 scrollbar-none">
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center min-w-[280px]">
            {miniDays.map((m, idx) => (
              <div
                key={idx}
                onClick={() => onNavigateTab('calendar')}
                className={`p-2 sm:p-3 rounded-2xl border cursor-pointer transition-all flex flex-col items-center justify-between h-18 sm:h-20 active:scale-95 ${
                  m.isToday
                    ? 'border-2 border-[#00B4D8] bg-[#00B4D8]/10 shadow-sm'
                    : 'border-gray-100 hover:border-[#B95679]/40 bg-gray-50/50'
                }`}
              >
                <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase">{m.dayName}</span>
                <span className={`text-sm sm:text-base font-bold ${m.isToday ? 'text-[#00B4D8]' : 'text-[#16213E]'}`}>
                  {m.dayNum}
                </span>

                {/* Status Dot */}
                <div className="h-2 flex items-center justify-center">
                  {m.dayType === 'period' && (
                    <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#B95679] shadow-sm" title="Logged Period"></span>
                  )}
                  {m.dayType === 'predicted' && (
                    <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#F48FB1] border border-[#B95679]" title="Predicted Period"></span>
                  )}
                  {m.dayType === 'ovulation' && (
                    <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#FF8F00] shadow-sm" title="Ovulation Day"></span>
                  )}
                  {m.dayType === 'fertile' && (
                    <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#FBC02D]" title="Fertile Day"></span>
                  )}
                  {m.dayType === 'normal' && (
                    <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
