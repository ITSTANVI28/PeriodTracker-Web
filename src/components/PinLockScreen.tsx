import React, { useState } from 'react';
import { Lock, KeyRound, AlertCircle, HelpCircle } from 'lucide-react';
import { UserSettings } from '../types';
import { hashString } from '../utils/storage';

interface PinLockScreenProps {
  settings: UserSettings;
  onUnlockSuccess: () => void;
  onResetPinSuccess: () => void;
}

export const PinLockScreen: React.FC<PinLockScreenProps> = ({
  settings,
  onUnlockSuccess,
  onResetPinSuccess
}) => {
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryAnswer, setRecoveryAnswer] = useState('');
  const [recoveryError, setRecoveryError] = useState('');

  const handleDigitClick = async (digit: string) => {
    if (pinInput.length < 4) {
      const nextPin = pinInput + digit;
      setPinInput(nextPin);
      setErrorMsg('');

      if (nextPin.length === 4) {
        const hashed = await hashString(nextPin);
        if (hashed === settings.pinHash) {
          onUnlockSuccess();
        } else {
          setErrorMsg('Incorrect PIN. Please try again.');
          setTimeout(() => setPinInput(''), 400);
        }
      }
    }
  };

  const handleClear = () => {
    setPinInput('');
    setErrorMsg('');
  };

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings.securityQuestion) {
      setRecoveryError('No security question was configured.');
      return;
    }
    const hashedAns = await hashString(recoveryAnswer);
    if (hashedAns === settings.securityQuestion.answerHash) {
      alert('Security verification successful. PIN protection has been reset.');
      onResetPinSuccess();
    } else {
      setRecoveryError('Incorrect answer. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#16213E] text-white flex flex-col items-center justify-center p-6 select-none">
      <div className="w-full max-w-sm flex flex-col items-center text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-[#B95679]/20 border border-[#B95679]/40 flex items-center justify-center text-[#B95679] shadow-xl shadow-[#B95679]/20">
          <Lock className="w-10 h-10" />
        </div>

        <div>
          <h2 className="text-2xl font-bold font-display">PeriodTracker Locked</h2>
          <p className="text-xs text-white/60 mt-1">Enter your 4-digit security PIN to unlock</p>
        </div>

        {/* PIN Indicator Dots */}
        <div className="flex space-x-4 my-2">
          {[0, 1, 2, 3].map(idx => (
            <div
              key={idx}
              className={`w-4 h-4 rounded-full border-2 border-[#B95679] transition-all duration-200 ${
                pinInput.length > idx ? 'bg-[#B95679] scale-110 shadow-md shadow-[#B95679]' : 'bg-transparent'
              }`}
            ></div>
          ))}
        </div>

        {errorMsg && (
          <div className="text-xs text-red-400 font-semibold flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errorMsg}
          </div>
        )}

        {/* Numpad Grid */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-[260px] pt-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button
              key={num}
              onClick={() => handleDigitClick(num)}
              className="w-16 h-16 mx-auto rounded-full bg-white/10 hover:bg-white/20 active:bg-[#B95679] text-xl font-bold transition-all flex items-center justify-center"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => setShowRecoveryModal(true)}
            className="w-16 h-16 mx-auto rounded-full text-xs text-white/50 hover:text-white flex items-center justify-center"
            title="Forgot PIN?"
          >
            <HelpCircle className="w-6 h-6" />
          </button>
          <button
            onClick={() => handleDigitClick('0')}
            className="w-16 h-16 mx-auto rounded-full bg-white/10 hover:bg-white/20 active:bg-[#B95679] text-xl font-bold transition-all flex items-center justify-center"
          >
            0
          </button>
          <button
            onClick={handleClear}
            className="w-16 h-16 mx-auto rounded-full text-xs text-[#B95679] font-bold hover:bg-white/5 flex items-center justify-center"
          >
            CLEAR
          </button>
        </div>

        {settings.securityQuestion && (
          <button
            onClick={() => setShowRecoveryModal(true)}
            className="text-xs text-[#B95679] hover:underline pt-2 font-medium"
          >
            Forgot PIN? Recover via Security Question
          </button>
        )}
      </div>

      {/* Recovery Modal */}
      {showRecoveryModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1A2E] border border-white/10 rounded-3xl p-6 w-full max-w-md space-y-5 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#B95679]" />
                Security Question Recovery
              </h3>
              <button
                onClick={() => setShowRecoveryModal(false)}
                className="text-white/50 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {settings.securityQuestion ? (
              <form onSubmit={handleRecoverySubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-white/70 block mb-1">
                    Question:
                  </label>
                  <p className="text-sm font-semibold text-[#B95679] bg-white/5 p-3 rounded-xl border border-white/10">
                    {settings.securityQuestion.question}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-white/70 block mb-1">
                    Your Answer:
                  </label>
                  <input
                    type="text"
                    required
                    value={recoveryAnswer}
                    onChange={e => setRecoveryAnswer(e.target.value)}
                    placeholder="Enter secret answer"
                    className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:border-[#B95679]"
                  />
                </div>

                {recoveryError && (
                  <p className="text-xs text-red-400 font-semibold">{recoveryError}</p>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRecoveryModal(false)}
                    className="px-4 py-2 text-xs font-bold text-white/60 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-[#B95679] rounded-xl hover:bg-[#9E4566]"
                  >
                    Reset PIN
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-sm text-white/70">
                No security question was configured during setup.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
