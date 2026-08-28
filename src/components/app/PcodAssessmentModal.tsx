import React, { useState } from 'react';
import { Stethoscope, X, FileText, CheckCircle2, AlertTriangle, HelpCircle, ArrowRight } from 'lucide-react';
import { PcodQuizAnswer, PcodResult, UserProfile, PeriodLog, SymptomLog } from '../../types';
import { PCOD_QUESTIONS, evaluatePcodAssessment } from '../../utils/cycleEngine';
import { exportHealthPdfReport } from '../../utils/pdfExport';
import { translations } from '../../utils/translations';

interface PcodAssessmentModalProps {
  profile: UserProfile;
  periodLogs: PeriodLog[];
  symptomLogs: SymptomLog[];
  language: 'EN' | 'HI' | 'MR';
  onSaveResult: (result: PcodResult) => void;
  onClose: () => void;
}

export const PcodAssessmentModal: React.FC<PcodAssessmentModalProps> = ({
  profile,
  periodLogs,
  symptomLogs,
  language,
  onSaveResult,
  onClose
}) => {
  const t = translations[language] || translations.EN;

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<PcodResult | null>(null);

  const handleSelectOption = (questionId: number, score: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }));
  };

  const handleNext = () => {
    if (currentStep < PCOD_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate
      const answerList: PcodQuizAnswer[] = PCOD_QUESTIONS.map(q => ({
        questionId: q.id,
        score: answers[q.id] || 0
      }));
      const computed = evaluatePcodAssessment(answerList);
      setResult(computed);
      onSaveResult(computed);
    }
  };

  const currentQ = PCOD_QUESTIONS[currentStep];
  const isOptionSelected = answers[currentQ.id] !== undefined;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-4 overflow-y-auto">
      <div className="bg-white border border-[#B95679]/20 w-full max-md:rounded-t-3xl max-md:max-h-[92vh] md:rounded-3xl p-5 sm:p-8 md:max-w-2xl shadow-2xl space-y-5 my-0 md:my-8 animate-slide-up md:animate-none overflow-y-auto">
        {/* Mobile Drag Indicator Handle Bar */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto md:hidden -mt-1 mb-2"></div>

        <div className="flex justify-between items-center pb-3.5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#B95679] text-white flex items-center justify-center shadow-md shadow-[#B95679]/20">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-display text-[#16213E]">
                {t.pcodTitle}
              </h3>
              <p className="text-xs text-gray-500">{t.pcodSubtitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!result ? (
          /* Quiz Questions Step */
          <div className="space-y-5">
            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-gray-400">
                <span>{t.question} {currentStep + 1} {t.of} {PCOD_QUESTIONS.length}</span>
                <span>{Math.round(((currentStep + 1) / PCOD_QUESTIONS.length) * 100)}%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#B95679] transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / PCOD_QUESTIONS.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-3.5">
              <h4 className="text-base sm:text-lg font-bold text-[#16213E] leading-snug">
                {currentQ.question}
              </h4>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => {
                  const selected = answers[currentQ.id] === opt.score;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(currentQ.id, opt.score)}
                      className={`w-full p-3.5 sm:p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all active:scale-[0.98] flex items-center justify-between gap-3 ${
                        selected
                          ? 'border-[#B95679] bg-[#FFF8F8] text-[#B95679] shadow-sm'
                          : 'border-gray-200 text-[#16213E] hover:border-gray-300 bg-gray-50/50'
                      }`}
                    >
                      <span className="leading-snug">{opt.label}</span>
                      <div className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center text-xs ${
                        selected ? 'bg-[#B95679] text-white border-[#B95679]' : 'border-gray-300'
                      }`}>
                        {selected && '✓'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Next / Prev Buttons */}
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <button
                type="button"
                disabled={currentStep === 0}
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2 text-xs font-bold text-gray-500 disabled:opacity-30 hover:text-gray-800"
              >
                ← Back
              </button>

              <button
                type="button"
                disabled={!isOptionSelected}
                onClick={handleNext}
                className="px-6 py-2.5 bg-[#B95679] hover:bg-[#9E4566] active:scale-95 disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                {currentStep === PCOD_QUESTIONS.length - 1 ? t.calculateResult : 'Next Question'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Result Card View */
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className={`p-5 sm:p-6 rounded-3xl border text-center space-y-2 ${
              result.riskLevel === 'High'
                ? 'bg-red-50 border-red-200 text-red-900'
                : result.riskLevel === 'Moderate'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}>
              <div className="inline-flex p-3 rounded-2xl bg-white shadow-sm mb-1">
                {result.riskLevel === 'High' ? (
                  <AlertTriangle className="w-7 h-7 text-red-600" />
                ) : (
                  <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                )}
              </div>

              <h4 className="text-xl sm:text-2xl font-black font-display">
                {result.riskLevel === 'Low' ? t.lowRisk : result.riskLevel === 'Moderate' ? t.moderateRisk : t.highRisk}
              </h4>

              <p className="text-xs font-bold uppercase tracking-widest opacity-80">
                Score: {result.totalScore} / 20 Points
              </p>
            </div>

            {/* Clinical Recommendations */}
            <div className="space-y-2.5">
              <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Actionable Next Steps & Recommendations:
              </h5>
              <ul className="space-y-2 text-xs text-[#16213E]/80 max-h-[200px] overflow-y-auto pr-1">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-2.5">
                    <span className="text-[#B95679] font-bold">•</span>
                    <span className="leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-[11px] text-gray-400 italic">
              {t.consultDoctorNotice}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => exportHealthPdfReport(profile, periodLogs, symptomLogs, result)}
                className="flex-1 py-3 bg-[#B95679] hover:bg-[#9E4566] active:scale-95 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                {t.downloadPcodReport}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-200 hover:bg-gray-50 active:scale-95 text-xs font-bold text-gray-700 rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
