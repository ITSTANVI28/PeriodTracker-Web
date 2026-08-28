import React, { useState } from 'react';
import { Activity, X, Check, Droplets } from 'lucide-react';
import { SymptomLog, SymptomType } from '../../types';
import { translations } from '../../utils/translations';

interface SymptomLoggerModalProps {
  initialDateStr?: string;
  existingLog?: SymptomLog;
  language: 'EN' | 'HI' | 'MR';
  onSave: (log: SymptomLog) => void;
  onClose: () => void;
}

const ALL_SYMPTOMS: SymptomType[] = [
  'cramps',
  'headache',
  'acne',
  'bloating',
  'fatigue',
  'mood_swings',
  'breast_tenderness',
  'cravings',
  'backache',
  'insomnia',
  'nausea',
  'anxiety'
];

export const SymptomLoggerModal: React.FC<SymptomLoggerModalProps> = ({
  initialDateStr,
  existingLog,
  language,
  onSave,
  onClose
}) => {
  const t = translations[language] || translations.EN;

  const [date, setDate] = useState(
    initialDateStr || existingLog?.date || new Date().toISOString().split('T')[0]
  );

  // Map selected symptoms with severity
  const [selectedMap, setSelectedMap] = useState<Record<SymptomType, number>>(() => {
    const initialMap: Partial<Record<SymptomType, number>> = {};
    if (existingLog?.symptoms) {
      existingLog.symptoms.forEach(s => {
        initialMap[s.type] = s.severity;
      });
    }
    return initialMap as Record<SymptomType, number>;
  });

  const [notes, setNotes] = useState(existingLog?.notes || '');
  const [waterIntake, setWaterIntake] = useState(existingLog?.waterIntakeGlass || 6);
  const [moodEmoji, setMoodEmoji] = useState(existingLog?.moodEmoji || '😊');

  const toggleSymptom = (type: SymptomType) => {
    setSelectedMap(prev => {
      const copy = { ...prev };
      if (copy[type] !== undefined) {
        delete copy[type];
      } else {
        copy[type] = 3; // Default severity
      }
      return copy;
    });
  };

  const setSeverity = (type: SymptomType, val: number) => {
    setSelectedMap(prev => ({
      ...prev,
      [type]: val
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const symptomsList = Object.entries(selectedMap).map(([type, severity]) => ({
      type: type as SymptomType,
      severity: Number(severity)
    }));

    const newLog: SymptomLog = {
      id: existingLog?.id || `sym-${Date.now()}`,
      date,
      symptoms: symptomsList,
      notes,
      waterIntakeGlass: waterIntake,
      moodEmoji
    };

    onSave(newLog);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-4 overflow-y-auto">
      <div className="bg-white border border-[#B95679]/20 w-full max-md:rounded-t-3xl max-md:max-h-[92vh] md:rounded-3xl p-5 sm:p-8 md:max-w-2xl shadow-2xl space-y-5 my-0 md:my-8 animate-slide-up md:animate-none overflow-y-auto">
        {/* Mobile Drag Indicator Handle Bar */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto md:hidden -mt-1 mb-2"></div>

        <div className="flex justify-between items-center pb-3.5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#B95679] text-white flex items-center justify-center shadow-md shadow-[#B95679]/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-display text-[#16213E]">
                {t.logSymptomsTitle}
              </h3>
              <p className="text-xs text-gray-500">{t.selectSymptoms}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Date Picker */}
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">
              Select Log Date:
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-[#16213E] focus:outline-none focus:border-[#B95679]"
            />
          </div>

          {/* Mood Selector */}
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-2">
              Today's Primary Mood:
            </label>
            <div className="flex gap-2.5 text-2xl overflow-x-auto pb-1 scrollbar-none">
              {['😊', '😴', '😭', '😡', '⚡', '🧘', '🌸'].map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setMoodEmoji(emoji)}
                  className={`p-2.5 rounded-2xl border transition-all active:scale-95 flex-shrink-0 ${
                    moodEmoji === emoji
                      ? 'border-[#B95679] bg-[#B95679]/10 scale-110 shadow-sm'
                      : 'border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Symptoms List Grid */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-600 block">
              Logged Symptoms & Severity (1 = Mild, 5 = Severe):
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[260px] overflow-y-auto pr-1">
              {ALL_SYMPTOMS.map(st => {
                const isSelected = selectedMap[st] !== undefined;
                const severity = selectedMap[st] || 3;
                const label = t[st] || st;

                return (
                  <div
                    key={st}
                    className={`p-3 rounded-2xl border transition-all space-y-2 ${
                      isSelected
                        ? 'border-[#B95679] bg-[#FFF8F8] shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSymptom(st)}>
                      <span className={`text-xs font-bold ${isSelected ? 'text-[#B95679]' : 'text-[#16213E]'}`}>
                        {label}
                      </span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                        isSelected ? 'bg-[#B95679] text-white border-[#B95679]' : 'border-gray-300'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>

                    {isSelected && (
                      <div className="pt-2 border-t border-[#B95679]/10 flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-400">Severity: {severity}</span>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={severity}
                          onChange={e => setSeverity(st, parseInt(e.target.value))}
                          className="flex-1 accent-[#B95679]"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Water Tracker */}
          <div className="flex items-center justify-between p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
            <div className="flex items-center gap-2.5">
              <Droplets className="w-5 h-5 text-blue-500" />
              <div>
                <span className="text-xs font-bold text-blue-900 block">Water Intake</span>
                <span className="text-[11px] text-blue-600">{waterIntake} Glasses (~{waterIntake * 250} ml)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setWaterIntake(Math.max(1, waterIntake - 1))}
                className="w-8 h-8 rounded-xl bg-white border border-blue-200 text-blue-600 font-bold hover:bg-blue-50 active:scale-90"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => setWaterIntake(waterIntake + 1)}
                className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 active:scale-90 shadow-sm"
              >
                +
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">
              Personal Notes & Observations:
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder={t.notesPlaceholder}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#16213E] focus:outline-none focus:border-[#B95679]"
            ></textarea>
          </div>

          {/* Buttons */}
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
