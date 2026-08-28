import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Play, Pause, RotateCcw, Utensils, Zap } from 'lucide-react';
import { translations } from '../../utils/translations';

interface WellnessHubProps {
  language: 'EN' | 'HI' | 'MR';
}

export const WellnessHub: React.FC<WellnessHubProps> = ({ language }) => {
  const t = translations[language] || translations.EN;

  const [activeTab, setActiveTab] = useState<'nutrition' | 'cramp' | 'breathing'>('nutrition');

  // Breathing exercise state
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathTimer, setBreathTimer] = useState(60);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');

  useEffect(() => {
    let interval: any = null;
    if (isBreathing && breathTimer > 0) {
      interval = setInterval(() => {
        setBreathTimer(prev => prev - 1);
        const rem = breathTimer % 12;
        if (rem > 8) setBreathPhase('Inhale');
        else if (rem > 4) setBreathPhase('Hold');
        else setBreathPhase('Exhale');
      }, 1000);
    } else if (breathTimer === 0) {
      setIsBreathing(false);
    }
    return () => clearInterval(interval);
  }, [isBreathing, breathTimer]);

  const toggleBreathing = () => {
    if (breathTimer === 0) setBreathTimer(60);
    setIsBreathing(!isBreathing);
  };

  const resetBreathing = () => {
    setIsBreathing(false);
    setBreathTimer(60);
    setBreathPhase('Inhale');
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-24 md:pb-12 px-1 sm:px-0">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold font-display text-[#16213E] flex items-center gap-2">
          <Heart className="w-5 sm:w-6 h-5 sm:h-6 text-[#B95679]" />
          {t.wellnessTitle}
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">Holistic nutrition, cramps relief, and mental wellness</p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-gray-200 text-xs sm:text-sm font-bold overflow-x-auto scrollbar-none pb-0.5">
        <button
          onClick={() => setActiveTab('nutrition')}
          className={`pb-3 px-3.5 sm:px-4 transition-all flex items-center gap-2 border-b-2 whitespace-nowrap active:scale-95 ${
            activeTab === 'nutrition'
              ? 'border-[#B95679] text-[#B95679]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Utensils className="w-4 h-4" />
          {t.phaseNutrition}
        </button>

        <button
          onClick={() => setActiveTab('cramp')}
          className={`pb-3 px-3.5 sm:px-4 transition-all flex items-center gap-2 border-b-2 whitespace-nowrap active:scale-95 ${
            activeTab === 'cramp'
              ? 'border-[#B95679] text-[#B95679]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Zap className="w-4 h-4" />
          {t.crampRelief}
        </button>

        <button
          onClick={() => setActiveTab('breathing')}
          className={`pb-3 px-3.5 sm:px-4 transition-all flex items-center gap-2 border-b-2 whitespace-nowrap active:scale-95 ${
            activeTab === 'breathing'
              ? 'border-[#B95679] text-[#B95679]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          {t.breathingExercise}
        </button>
      </div>

      {/* Tab 1: Phase-Based Nutrition */}
      {activeTab === 'nutrition' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 animate-in fade-in duration-200">
          <div className="p-5 sm:p-6 bg-white border border-[#B95679]/15 rounded-3xl space-y-2.5">
            <span className="px-3 py-1 bg-[#B95679]/10 text-[#B95679] text-[11px] sm:text-xs font-bold rounded-full inline-block">
              Phase 1: Menstrual Phase (Days 1-5)
            </span>
            <h3 className="font-bold text-base sm:text-lg text-[#16213E]">Iron & Hydration Focus</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Replenish iron levels lost during menstruation. Eat spinach, lentils, dark chocolate, ginger tea, and vitamin C-rich fruits.
            </p>
          </div>

          <div className="p-5 sm:p-6 bg-white border border-[#B95679]/15 rounded-3xl space-y-2.5">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[11px] sm:text-xs font-bold rounded-full inline-block">
              Phase 2: Follicular Phase (Days 6-13)
            </span>
            <h3 className="font-bold text-base sm:text-lg text-[#16213E]">Energy & Gut Health</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Estrogen levels rise. Consume fermented foods (yogurt, kimchi), avocado, broccoli, and lean protein for steady metabolic energy.
            </p>
          </div>

          <div className="p-5 sm:p-6 bg-white border border-[#B95679]/15 rounded-3xl space-y-2.5">
            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-[11px] sm:text-xs font-bold rounded-full inline-block">
              Phase 3: Ovulatory Phase (Days 14-16)
            </span>
            <h3 className="font-bold text-base sm:text-lg text-[#16213E]">Antioxidant Fiber Foods</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Peak energy and fertility. Include berries, quinoa, chia seeds, and raw leafy greens to support liver clearance of excess hormones.
            </p>
          </div>

          <div className="p-5 sm:p-6 bg-white border border-[#B95679]/15 rounded-3xl space-y-2.5">
            <span className="px-3 py-1 bg-purple-100 text-purple-800 text-[11px] sm:text-xs font-bold rounded-full inline-block">
              Phase 4: Luteal Phase (Days 17-28)
            </span>
            <h3 className="font-bold text-base sm:text-lg text-[#16213E]">Magnesium & Anti-Bloat</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Progesterone peaks. Reduce sodium to prevent bloating. Eat pumpkin seeds, bananas, chamomile tea, and complex whole grains.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Cramp Relief & Yoga */}
      {activeTab === 'cramp' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-5 sm:p-6 bg-white border border-[#B95679]/15 rounded-3xl space-y-2.5">
              <span className="text-2xl">🔥</span>
              <h3 className="font-bold text-sm sm:text-base text-[#16213E]">Heat Therapy</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Apply a warm heating pad or hot water bag to your lower abdomen for 15-20 minutes to relax uterine muscles.
              </p>
            </div>

            <div className="p-5 sm:p-6 bg-white border border-[#B95679]/15 rounded-3xl space-y-2.5">
              <span className="text-2xl">🍵</span>
              <h3 className="font-bold text-sm sm:text-base text-[#16213E]">Ginger & Peppermint Tea</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Natural anti-inflammatory herbs help decrease prostaglandin levels responsible for painful uterine contractions.
              </p>
            </div>

            <div className="p-5 sm:p-6 bg-white border border-[#B95679]/15 rounded-3xl space-y-2.5">
              <span className="text-2xl">🧘</span>
              <h3 className="font-bold text-sm sm:text-base text-[#16213E]">Child's Pose (Balasana)</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Kneel on the floor, stretch arms forward, and rest forehead down to relieve lower back tension.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Calm Breathing Timer */}
      {activeTab === 'breathing' && (
        <div className="p-6 sm:p-8 bg-gradient-to-br from-[#16213E] to-[#1A1A2E] text-white rounded-3xl text-center space-y-6 shadow-xl animate-in fade-in duration-200">
          <div>
            <span className="text-xs font-bold text-[#B95679] uppercase tracking-widest block mb-1">
              Mindfulness
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-display">1-Minute Diaphragmatic Breathwork</h3>
            <p className="text-xs text-white/60 mt-1 max-w-md mx-auto">
              Follow the expanding circle to soothe pelvic nerve tension & reduce stress.
            </p>
          </div>

          {/* Animated Circle */}
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto flex items-center justify-center">
            <div
              className={`absolute inset-0 rounded-full bg-[#B95679]/20 border-2 border-[#B95679] transition-transform duration-1000 ${
                isBreathing
                  ? breathPhase === 'Inhale'
                    ? 'scale-125 bg-[#B95679]/40'
                    : breathPhase === 'Hold'
                    ? 'scale-125'
                    : 'scale-90 bg-[#B95679]/10'
                  : 'scale-100'
              }`}
            ></div>

            <div className="relative z-10 space-y-1">
              <span className="text-2xl sm:text-3xl font-black font-display">{breathTimer}s</span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#B95679] block">
                {isBreathing ? breathPhase : 'Ready'}
              </span>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={toggleBreathing}
              className="px-6 py-3 bg-[#B95679] hover:bg-[#9E4566] active:scale-95 text-white text-xs font-bold rounded-2xl shadow-lg transition-all flex items-center gap-2"
            >
              {isBreathing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isBreathing ? 'Pause' : t.startBreathing}
            </button>

            <button
              onClick={resetBreathing}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-bold rounded-2xl transition-all"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
