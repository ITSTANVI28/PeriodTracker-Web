import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { AppState, PeriodLog, SymptomLog } from '../../types';
import { calculateCyclePrediction, formatDateStr } from '../../utils/cycleEngine';
import { translations } from '../../utils/translations';

interface InteractiveCalendarProps {
  appState: AppState;
  onSelectDateToLog: (dateStr: string) => void;
}

export const InteractiveCalendar: React.FC<InteractiveCalendarProps> = ({
  appState,
  onSelectDateToLog
}) => {
  const lang = appState.settings.language || 'EN';
  const t = translations[lang] || translations.EN;

  const [currentDate, setCurrentDate] = useState(new Date());

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

  // Generate calendar grid days
  const gridCells = [];
  // Empty leading cells
  for (let i = 0; i < startDayOfWeek; i++) {
    gridCells.push(null);
  }
  // Month day cells
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    const dateStr = formatDateStr(d);

    // Find if logged period
    const periodLog = appState.periodLogs.find(
      p => dateStr >= p.startDate && dateStr <= p.endDate
    );

    // Find if symptom log
    const symptomLog = appState.symptomLogs.find(s => s.date === dateStr);

    // Determine prediction status
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
            <p className="text-xs text-[#16213E]/60 mt-0.5">{t.clickDateToLog}</p>
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
                onClick={() => onSelectDateToLog(cell.dateStr)}
                className={`relative h-14 sm:h-18 md:h-20 rounded-xl sm:rounded-2xl border p-1.5 sm:p-2 flex flex-col justify-between cursor-pointer transition-all active:scale-95 ${bgStyle} ${
                  cell.isToday ? 'ring-2 ring-[#00B4D8] ring-offset-1 sm:ring-offset-2' : ''
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`text-xs sm:text-sm font-bold ${cell.periodLog ? 'text-white' : 'text-[#16213E]'}`}>
                    {cell.day}
                  </span>

                  {cell.symptomLog && (
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#FF8F00]" title="Symptoms logged"></span>
                  )}
                </div>

                {/* Flow / Status Label inside Cell */}
                <div className="text-[8px] sm:text-[9px] font-bold overflow-hidden text-ellipsis whitespace-nowrap">
                  {cell.periodLog && (
                    <span className="opacity-90">💧 {cell.periodLog.flow}</span>
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
    </div>
  );
};
