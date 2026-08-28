import React from 'react';
import { BarChart3, Clock, Calendar, PieChart, Activity, Trash2 } from 'lucide-react';
import { AppState, PeriodLog } from '../../types';
import { parseDateStr } from '../../utils/cycleEngine';
import { translations } from '../../utils/translations';

interface HistoryStatsViewProps {
  appState: AppState;
  onDeleteLog: (id: string) => void;
}

export const HistoryStatsView: React.FC<HistoryStatsViewProps> = ({
  appState,
  onDeleteLog
}) => {
  const lang = appState.settings.language || 'EN';
  const t = translations[lang] || translations.EN;

  const logs = [...appState.periodLogs].sort(
    (a, b) => parseDateStr(b.startDate).getTime() - parseDateStr(a.startDate).getTime()
  );

  // Calculate flow distribution counts
  const flowCounts = {
    light: 0,
    medium: 0,
    heavy: 0,
    spotting: 0
  };
  logs.forEach(l => {
    if (flowCounts[l.flow] !== undefined) {
      flowCounts[l.flow]++;
    }
  });

  // Calculate symptom occurrence frequency
  const symptomFreq: Record<string, number> = {};
  appState.symptomLogs.forEach(s => {
    s.symptoms.forEach(item => {
      symptomFreq[item.type] = (symptomFreq[item.type] || 0) + 1;
    });
  });

  const sortedSymptoms = Object.entries(symptomFreq).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6 sm:space-y-8 pb-24 md:pb-12 px-1 sm:px-0">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold font-display text-[#16213E] flex items-center gap-2">
          <BarChart3 className="w-5 sm:w-6 h-5 sm:h-6 text-[#B95679]" />
          {t.historyTitle}
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">Analytics derived from your local logged history</p>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 bg-white border border-[#B95679]/15 rounded-3xl shadow-sm space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
            {t.avgCycleLength}
          </span>
          <h3 className="text-2xl sm:text-3xl font-black font-display text-[#16213E]">
            {appState.settings.profile.avgCycleLength} Days
          </h3>
          <span className="text-[11px] sm:text-xs text-emerald-600 font-semibold flex items-center gap-1">
            ✓ Healthy 21-35d range
          </span>
        </div>

        <div className="p-4 sm:p-5 bg-white border border-[#B95679]/15 rounded-3xl shadow-sm space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
            {t.avgPeriodLength}
          </span>
          <h3 className="text-2xl sm:text-3xl font-black font-display text-[#16213E]">
            {appState.settings.profile.avgPeriodLength} Days
          </h3>
          <span className="text-[11px] sm:text-xs text-gray-500 font-semibold">
            Typical duration
          </span>
        </div>

        <div className="p-4 sm:p-5 bg-white border border-[#B95679]/15 rounded-3xl shadow-sm space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
            Total Logged Periods
          </span>
          <h3 className="text-2xl sm:text-3xl font-black font-display text-[#16213E]">
            {logs.length} Cycles
          </h3>
          <span className="text-[11px] sm:text-xs text-gray-500 font-semibold">
            Stored in localStorage
          </span>
        </div>
      </div>

      {/* Flow Intensity Distribution */}
      <div className="p-5 sm:p-6 bg-white border border-[#B95679]/15 rounded-3xl shadow-sm space-y-4">
        <h3 className="font-bold text-sm sm:text-base text-[#16213E] flex items-center gap-2">
          <PieChart className="w-5 h-5 text-[#B95679]" />
          {t.flowDistribution}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-1">
          {[
            { id: 'light', label: 'Light 💧', count: flowCounts.light, color: 'bg-blue-50 text-blue-900 border-blue-100' },
            { id: 'medium', label: 'Medium 💧💧', count: flowCounts.medium, color: 'bg-[#B95679]/10 text-[#B95679] border-[#B95679]/20' },
            { id: 'heavy', label: 'Heavy 💧💧💧', count: flowCounts.heavy, color: 'bg-rose-50 text-rose-900 border-rose-100' },
            { id: 'spotting', label: 'Spotting 🌸', count: flowCounts.spotting, color: 'bg-amber-50 text-amber-900 border-amber-100' }
          ].map(f => (
            <div key={f.id} className={`p-3.5 sm:p-4 rounded-2xl ${f.color} border text-center space-y-1`}>
              <span className="text-xs font-bold block">{f.label}</span>
              <span className="text-xl sm:text-2xl font-black">{f.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Symptom Frequency Breakdown */}
      {sortedSymptoms.length > 0 && (
        <div className="p-5 sm:p-6 bg-white border border-[#B95679]/15 rounded-3xl shadow-sm space-y-4">
          <h3 className="font-bold text-sm sm:text-base text-[#16213E] flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#B95679]" />
            Most Frequent Symptoms
          </h3>

          <div className="space-y-3 pt-1">
            {sortedSymptoms.slice(0, 5).map(([symType, count]) => {
              const maxCount = sortedSymptoms[0][1] || 1;
              const percent = Math.round((count / maxCount) * 100);

              return (
                <div key={symType} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-[#16213E]">
                    <span className="capitalize">{t[symType] || symType}</span>
                    <span>{count} times logged</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#B95679]" style={{ width: `${percent}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Past Cycles Timeline Log Table */}
      <div className="p-5 sm:p-6 bg-white border border-[#B95679]/15 rounded-3xl shadow-sm space-y-4">
        <h3 className="font-bold text-sm sm:text-base text-[#16213E] flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#B95679]" />
          {t.pastCycles}
        </h3>

        {logs.length === 0 ? (
          <p className="text-xs text-gray-400 italic py-4">No cycle logs recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {logs.map(log => (
              <div
                key={log.id}
                className="p-3.5 sm:p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#B95679]/30 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-[#16213E]">
                      {log.startDate} to {log.endDate}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#B95679]/10 text-[#B95679]">
                      {log.flow}
                    </span>
                  </div>
                  {log.notes && (
                    <p className="text-xs text-gray-500 italic">"{log.notes}"</p>
                  )}
                </div>

                <button
                  onClick={() => onDeleteLog(log.id)}
                  className="p-2 text-gray-400 hover:text-red-500 active:scale-90 rounded-xl transition-colors self-end sm:self-center"
                  title="Delete log"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
