import React, { useState } from 'react';
import { Calendar, X, Droplet } from 'lucide-react';
import { FlowIntensity, PeriodLog } from '../../types';
import { translations } from '../../utils/translations';

interface PeriodLoggerModalProps {
  initialStartDate?: string;
  existingLog?: PeriodLog;
  language: 'EN' | 'HI' | 'MR';
  onSave: (log: PeriodLog) => void;
  onClose: () => void;
}

export const PeriodLoggerModal: React.FC<PeriodLoggerModalProps> = ({
  initialStartDate,
  existingLog,
  language,
  onSave,
  onClose
}) => {
  const t = translations[language] || translations.EN;

  const todayStr = new Date().toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(
    initialStartDate || existingLog?.startDate || todayStr
  );

  // Default end date is start date + 4 days
  const defaultEnd = () => {
    const d = new Date(initialStartDate || todayStr);
    d.setDate(d.getDate() + 4);
    return d.toISOString().split('T')[0];
  };

  const [endDate, setEndDate] = useState(
    existingLog?.endDate || defaultEnd()
  );

  const [flow, setFlow] = useState<FlowIntensity>(existingLog?.flow || 'medium');
  const [notes, setNotes] = useState(existingLog?.notes || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: PeriodLog = {
      id: existingLog?.id || `log-${Date.now()}`,
      startDate,
      endDate,
      flow,
      notes
    };
    onSave(newLog);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-4 overflow-y-auto">
      <div className="bg-white border border-[#B95679]/20 w-full max-md:rounded-t-3xl md:rounded-3xl p-5 sm:p-8 md:max-w-md shadow-2xl space-y-5 animate-slide-up md:animate-none">
        {/* Mobile Drag Indicator Handle Bar */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto md:hidden -mt-1 mb-2"></div>

        <div className="flex justify-between items-center pb-3.5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#B95679] text-white flex items-center justify-center shadow-md shadow-[#B95679]/20">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-display text-[#16213E]">
                {t.logPeriodTitle}
              </h3>
              <p className="text-xs text-gray-500">Record dates and flow intensity</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Dates */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                {t.startDate}:
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#16213E] focus:outline-none focus:border-[#B95679]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                {t.endDate}:
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#16213E] focus:outline-none focus:border-[#B95679]"
              />
            </div>
          </div>

          {/* Flow Intensity Selector */}
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-2">
              {t.flowIntensity}:
            </label>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'light', label: t.light },
                { id: 'medium', label: t.medium },
                { id: 'heavy', label: t.heavy },
                { id: 'spotting', label: t.spotting }
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFlow(item.id as FlowIntensity)}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center active:scale-95 ${
                    flow === item.id
                      ? 'bg-[#B95679] text-white border-[#B95679] shadow-md shadow-[#B95679]/20 scale-[1.02]'
                      : 'bg-gray-50 border-gray-200 text-[#16213E] hover:border-gray-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">
              Personal Notes:
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="E.g. Cramps on day 1, lighter flow on day 4..."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#16213E] focus:outline-none focus:border-[#B95679]"
            ></textarea>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-gray-500 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#B95679] hover:bg-[#9E4566] active:scale-95 text-white text-xs font-bold rounded-xl shadow-md transition-all"
            >
              {t.saveLog}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
