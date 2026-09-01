import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Plus, 
  Heart, 
  Sparkles, 
  Droplet, 
  Trash2, 
  X, 
  Edit3,
  CheckCircle2,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { AppState, PeriodLog, SymptomLog } from '../../types';
import { calculateCyclePrediction, formatDateStr } from '../../utils/cycleEngine';
import { translations } from '../../utils/translations';

interface InteractiveCalendarProps {
  appState: AppState;
  onSelectDateToLog: (dateStr: string) => void;
  onOpenSymptomLoggerForDate?: (dateStr: string) => void;
  onDeletePeriodLog?: (id: string) => void;
  onDeleteSymptomLog?: (id: string) => void;
}

export const InteractiveCalendar: React.FC<InteractiveCalendarProps> = ({
  appState,
  onSelectDateToLog,
  onOpenSymptomLoggerForDate,
  onDeletePeriodLog,
  onDeleteSymptomLog
}) => {
  const lang = appState.settings.language || 'EN';
  const t = translations[lang] || translations.EN;

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayDetails, setSelectedDayDetails] = useState<{
    dateStr: string;
    dayNum: number;
    periodLog?: PeriodLog;
    symptomLog?: SymptomLog;
    phaseName: string;
    pregnancyChance: string;
    pregnancyChanceColor: string;
    isToday: boolean;
  } | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sun
  const daysInMonth = lastDayOfMonth.getDate();

  const profile = appState.settings.profile;
  const prediction = calculateCyclePrediction(
    appState.periodLogs,
    profile.avgCycleLength,
    profile.avgPeriodLength
  );

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const resetToday = () => {
    setCurrentDate(new Date());
  };

  const todayStr = formatDateStr(new Date());

  // Helper to determine cycle phase & pregnancy chance for any date
  const getCyclePhaseAndPregnancyChance = (dateStr: string) => {
    const isLoggedPeriod = appState.periodLogs.some(
      p => dateStr >= p.startDate && dateStr <= p.endDate
    );
    const isPredictedPeriod =
      dateStr >= formatDateStr(prediction.nextPeriodStart) &&
      dateStr <= formatDateStr(prediction.nextPeriodEnd);
    const isOvulation = dateStr === formatDateStr(prediction.ovulationDate);
    const isFertile =
      dateStr >= formatDateStr(prediction.fertileStart) &&
      dateStr <= formatDateStr(prediction.fertileEnd);

    if (isLoggedPeriod || isPredictedPeriod) {
      return {
        phaseName: 'Menstrual Phase 🩸',
        pregnancyChance: 'Very Low Chance',
        pregnancyChanceColor: 'text-gray-500 bg-gray-100 border-gray-200'
      };
    } else if (isOvulation) {
      return {
        phaseName: 'Ovulation Peak ✨',
        pregnancyChance: 'Peak Fertility (High Chance)',
        pregnancyChanceColor: 'text-amber-700 bg-amber-100 border-amber-300'
      };
    } else if (isFertile) {
      return {
        phaseName: 'Fertile Window 🌱',
        pregnancyChance: 'High Chance',
        pregnancyChanceColor: 'text-orange-700 bg-orange-100 border-orange-300'
      };
    } else {
      // Check if Follicular or Luteal relative to ovulation
      const targetTime = new Date(dateStr).getTime();
      const ovulationTime = prediction.ovulationDate.getTime();
      if (targetTime < ovulationTime) {
        return {
          phaseName: 'Follicular Phase 🌸',
          pregnancyChance: 'Low Chance',
          pregnancyChanceColor: 'text-emerald-700 bg-emerald-100 border-emerald-300'
        };
      } else {
        return {
          phaseName: 'Luteal Phase 🌾',
          pregnancyChance: 'Low to Moderate Chance',
          pregnancyChanceColor: 'text-purple-700 bg-purple-100 border-purple-300'
        };
      }
    }
  };

  // Generate calendar grid days
  const gridCells = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    gridCells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    const dateStr = formatDateStr(d);

    const periodLog = appState.periodLogs.find(
      p => dateStr >= p.startDate && dateStr <= p.endDate
    );
    const symptomLog = appState.symptomLogs.find(s => s.date === dateStr);

    const isPredictedPeriod =
      dateStr >= formatDateStr(prediction.nextPeriodStart) &&
      dateStr <= formatDateStr(prediction.nextPeriodEnd);
    const isOvulation = dateStr === formatDateStr(prediction.ovulationDate);
    const isFertile =
      dateStr >= formatDateStr(prediction.fertileStart) &&
      dateStr <= formatDateStr(prediction.fertileEnd);

    gridCells.push({
      day,
      dateStr,
      isToday: dateStr === todayStr,
      periodLog,
      symptomLog,
      isPredictedPeriod,
      isOvulation,
      isFertile
    });
  }

  const monthName = currentDate.toLocaleDateString(lang === 'EN' ? 'en-US' : 'hi-IN', {
    month: 'long',
    year: 'numeric'
  });

  const handleDayClick = (cellDateStr: string, cellDayNum: number) => {
    const periodLog = appState.periodLogs.find(
      p => cellDateStr >= p.startDate && cellDateStr <= p.endDate
    );
    const symptomLog = appState.symptomLogs.find(s => s.date === cellDateStr);
    const phaseInfo = getCyclePhaseAndPregnancyChance(cellDateStr);

    setSelectedDayDetails({
      dateStr: cellDateStr,
      dayNum: cellDayNum,
      periodLog,
      symptomLog,
      phaseName: phaseInfo.phaseName,
      pregnancyChance: phaseInfo.pregnancyChance,
      pregnancyChanceColor: phaseInfo.pregnancyChanceColor,
      isToday: cellDateStr === todayStr
    });
  };

  return (
    <div className="space-y-6 pb-24 md:pb-12 px-1 sm:px-0">
      {/* Calendar Header Card */}
      <div className="p-4 sm:p-6 bg-white border border-[#B95679]/15 rounded-3xl shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold font-display text-[#16213E] flex items-center gap-2">
              <CalendarIcon className="w-5 sm:w-6 h-5 sm:h-6 text-[#B95679]" />
              {t.calendarTitle}
            </h2>
            <p className="text-xs text-[#16213E]/60 mt-0.5">
              Tap any date to open the interactive Day Details Bottom Sheet popup!
            </p>
          </div>

          <div className="flex items-center gap-2.5 justify-between sm:justify-end">
            <button
              onClick={resetToday}
              className="px-3.5 py-1.5 text-xs font-bold text-[#B95679] bg-[#B95679]/10 rounded-xl hover:bg-[#B95679]/20 active:scale-95 transition-all"
            >
              Today
            </button>

            <div className="flex items-center gap-1 border border-gray-200 rounded-xl p-1 bg-gray-50">
              <button
                onClick={prevMonth}
                className="p-1.5 hover:bg-white active:scale-90 rounded-lg transition-all"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5 text-[#16213E]" />
              </button>
              <span className="px-2 sm:px-3 text-xs sm:text-sm font-bold text-[#16213E] min-w-[100px] sm:min-w-[120px] text-center">
                {monthName}
              </span>
              <button
                onClick={nextMonth}
                className="p-1.5 hover:bg-white active:scale-90 rounded-lg transition-all"
                title="Next Month"
              >
                <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5 text-[#16213E]" />
              </button>
            </div>
          </div>
        </div>

        {/* Legend Bar */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-6 pt-3 border-t border-gray-100 text-[11px] sm:text-xs font-semibold text-gray-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#B95679] shadow-sm"></span>
            <span>{t.loggedPeriod}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#F48FB1] border border-[#B95679]"></span>
            <span>{t.predictedPeriod}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#FBC02D]"></span>
            <span>{t.fertileDays}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#FF8F00]"></span>
            <span>{t.ovulation}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#00B4D8]"></span>
            <span>{t.today}</span>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] sm:text-xs text-gray-400 uppercase py-1">
          <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
        </div>

        {/* Month Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {gridCells.map((cell, idx) => {
            if (!cell) {
              return <div key={idx} className="h-14 sm:h-18 md:h-20 bg-gray-50/30 rounded-xl sm:rounded-2xl"></div>;
            }

            let bgStyle = "bg-gray-50 hover:bg-gray-100/80 border-gray-100 text-[#16213E]";
            if (cell.periodLog) {
              bgStyle = "bg-[#B95679] text-white border-[#B95679] shadow-md shadow-[#B95679]/20";
            } else if (cell.isPredictedPeriod) {
              bgStyle = "bg-[#F48FB1]/30 text-[#16213E] border-[#F48FB1] border-dashed";
            } else if (cell.isOvulation) {
              bgStyle = "bg-[#FF8F00]/20 text-[#16213E] border-[#FF8F00]";
            } else if (cell.isFertile) {
              bgStyle = "bg-[#FBC02D]/20 text-[#16213E] border-[#FBC02D]";
            }

            return (
              <div
                key={idx}
                onClick={() => handleDayClick(cell.dateStr, cell.day)}
                className={`relative h-14 sm:h-18 md:h-20 rounded-xl sm:rounded-2xl border p-1.5 sm:p-2 flex flex-col justify-between cursor-pointer transition-all active:scale-95 ${bgStyle} ${
                  cell.isToday ? 'ring-2 ring-[#00B4D8] ring-offset-1 sm:ring-offset-2' : ''
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`text-xs sm:text-sm font-bold ${cell.periodLog ? 'text-white' : 'text-[#16213E]'}`}>
                    {cell.day}
                  </span>

                  {cell.symptomLog && (
                    <span className="w-2 h-2 rounded-full bg-[#FF8F00] ring-1 ring-white" title="Symptoms logged"></span>
                  )}
                </div>

                {/* Flow / Status Label inside Cell */}
                <div className="text-[8px] sm:text-[9px] font-bold overflow-hidden text-ellipsis whitespace-nowrap">
                  {cell.periodLog && (
                    <span className="opacity-95">🩸 {cell.periodLog.flow}</span>
                  )}
                  {!cell.periodLog && cell.isPredictedPeriod && (
                    <span className="text-[#B95679]">Predicted</span>
                  )}
                  {!cell.periodLog && cell.isOvulation && (
                    <span className="text-[#FF8F00]">✨ Ovulation</span>
                  )}
                  {!cell.periodLog && !cell.isPredictedPeriod && !cell.isOvulation && cell.isFertile && (
                    <span className="text-[#D4A017]">Fertile</span>
                  )}
                </div>

                <div className="absolute bottom-1 right-1 opacity-0 hover:opacity-100 transition-opacity hidden sm:block">
                  <Plus className="w-3 h-3 text-gray-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🗓️ INTERACTIVE DAY DETAILS POPUP (BOTTOM SHEET / MODAL) */}
      {selectedDayDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#B95679]/20 overflow-hidden animate-in slide-in-from-bottom duration-300 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-[#FFF8F8] to-[#FFF0F3] border-b border-[#B95679]/15 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#B95679]/15 text-[#B95679] text-xs font-bold font-mono">
                    {new Date(selectedDayDetails.dateStr).toLocaleDateString(lang === 'EN' ? 'en-US' : 'hi-IN', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  {selectedDayDetails.isToday && (
                    <span className="px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-700 text-[10px] font-extrabold">
                      Today
                    </span>
                  )}
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold font-display text-[#16213E]">
                  Day Details & Cycle Status
                </h3>
              </div>

              <button
                onClick={() => setSelectedDayDetails(null)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-white/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
              {/* Phase & Pregnancy Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Cycle Phase</span>
                  <p className="text-sm font-bold text-[#16213E] flex items-center gap-1.5">
                    {selectedDayDetails.phaseName}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Pregnancy Chance</span>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${selectedDayDetails.pregnancyChanceColor}`}>
                    {selectedDayDetails.pregnancyChance}
                  </span>
                </div>
              </div>

              {/* Logged Period Status */}
              <div className="p-4 rounded-2xl bg-[#FFF8F8] border border-[#B95679]/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#B95679] flex items-center gap-1.5">
                    <Droplet className="w-4 h-4 text-[#B95679]" /> Menstrual Flow Record
                  </span>
                  {selectedDayDetails.periodLog && onDeletePeriodLog && (
                    <button
                      onClick={() => {
                        if (confirm('Delete period log entry?')) {
                          onDeletePeriodLog(selectedDayDetails.periodLog!.id);
                          setSelectedDayDetails(null);
                        }
                      }}
                      className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  )}
                </div>

                {selectedDayDetails.periodLog ? (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-[#16213E]">
                      Intensity:{' '}
                      <span className="capitalize font-bold text-[#B95679]">
                        {selectedDayDetails.periodLog.flow} Flow
                      </span>
                    </p>
                    {selectedDayDetails.periodLog.notes && (
                      <p className="text-xs text-gray-600 italic">
                        "{selectedDayDetails.periodLog.notes}"
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">No menstrual flow recorded for this date.</p>
                )}
              </div>

              {/* Logged Symptoms Status */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-amber-600" /> Daily Health & Mood Log
                  </span>
                  {selectedDayDetails.symptomLog && onDeleteSymptomLog && (
                    <button
                      onClick={() => {
                        if (confirm('Delete symptom log entry?')) {
                          onDeleteSymptomLog(selectedDayDetails.symptomLog!.id);
                          setSelectedDayDetails(null);
                        }
                      }}
                      className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  )}
                </div>

                {selectedDayDetails.symptomLog ? (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1.5">
                      {selectedDayDetails.symptomLog.symptoms.map((s, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-medium"
                        >
                          {s.type.replace('_', ' ')} (Level {s.severity}/5)
                        </span>
                      ))}
                    </div>
                    {selectedDayDetails.symptomLog.waterIntakeGlass && (
                      <p className="text-xs font-semibold text-blue-700">
                        💧 Water Intake: {selectedDayDetails.symptomLog.waterIntakeGlass} Glasses
                      </p>
                    )}
                    {selectedDayDetails.symptomLog.notes && (
                      <p className="text-xs text-gray-600 italic">
                        "{selectedDayDetails.symptomLog.notes}"
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">No symptoms or moods logged for this date.</p>
                )}
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-end gap-2.5">
              <button
                onClick={() => {
                  const targetDate = selectedDayDetails.dateStr;
                  setSelectedDayDetails(null);
                  if (onOpenSymptomLoggerForDate) {
                    onOpenSymptomLoggerForDate(targetDate);
                  } else {
                    onSelectDateToLog(targetDate);
                  }
                }}
                className="px-4 py-2.5 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-xl transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Heart className="w-3.5 h-3.5 text-amber-700" />
                <span>Log Symptoms</span>
              </button>

              <button
                onClick={() => {
                  const targetDate = selectedDayDetails.dateStr;
                  setSelectedDayDetails(null);
                  onSelectDateToLog(targetDate);
                }}
                className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#B95679] to-[#9E4566] hover:from-[#a04665] hover:to-[#883a54] rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5"
              >
                <Droplet className="w-3.5 h-3.5" />
                <span>Log Period Flow</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
