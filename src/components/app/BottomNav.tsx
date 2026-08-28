import React from 'react';
import { Home, Calendar, BarChart3, Heart, Settings, ArrowLeft } from 'lucide-react';
import { AppState } from '../../types';
import { translations } from '../../utils/translations';

interface BottomNavProps {
  currentTab: AppState['currentAppTab'];
  language: 'EN' | 'HI' | 'MR';
  onSelectTab: (tab: AppState['currentAppTab']) => void;
  onBackToLanding: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  language,
  onSelectTab,
  onBackToLanding
}) => {
  const t = translations[language] || translations.EN;

  const navItems: { id: AppState['currentAppTab']; label: string; icon: any }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'history', label: 'History', icon: BarChart3 },
    { id: 'wellness', label: 'Wellness', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <>
      {/* Desktop Web App Sticky Navigation Header */}
      <header className="hidden md:block sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-[#B95679]/15 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-5">
            <button
              onClick={onBackToLanding}
              className="text-xs font-bold text-[#B95679] hover:text-[#9E4566] hover:bg-[#B95679]/10 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              {t.backToLanding}
            </button>
            <span className="h-4 w-px bg-gray-200"></span>
            <div 
              className="flex items-center space-x-2.5 cursor-pointer group" 
              onClick={() => onSelectTab('home')}
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">🌸</span>
              <span className="text-xl font-black font-display tracking-tight text-[#B95679]">CycleSync</span>
            </div>
          </div>

          <nav className="flex items-center space-x-1.5">
            {navItems.map(item => {
              const Icon = item.icon;
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
                    active
                      ? 'bg-[#B95679] text-white shadow-md shadow-[#B95679]/25 scale-105'
                      : 'text-[#16213E]/70 hover:text-[#B95679] hover:bg-[#B95679]/10'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'animate-bounce' : ''}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Mobile App Glassmorphism Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#B95679]/15 px-3 py-2 flex justify-around items-center shadow-2xl pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] select-none">
        {navItems.map(item => {
          const Icon = item.icon;
          const active = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`relative flex flex-col items-center py-1.5 px-3 rounded-2xl transition-all duration-200 active:scale-90 ${
                active ? 'text-[#B95679] font-extrabold' : 'text-gray-400 hover:text-gray-600 font-semibold'
              }`}
            >
              {active && (
                <span className="absolute -top-1 w-6 h-1 rounded-full bg-[#B95679] shadow-sm shadow-[#B95679]"></span>
              )}
              <Icon className={`w-5 h-5 transition-transform duration-200 ${active ? 'scale-110 text-[#B95679]' : ''}`} />
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};

