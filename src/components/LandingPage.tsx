import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GuideModal } from './GuideModal';
import { 
  initAuthListener, 
  signInWithGoogle, 
  sendGmailEmail, 
  logoutGoogle, 
  getCachedToken 
} from '../lib/auth';
import { User } from 'firebase/auth';
import { 
  ShieldCheck, 
  Calendar, 
  Stethoscope, 
  FileSpreadsheet, 
  Download, 
  Menu, 
  X, 
  Heart, 
  Lock, 
  Globe, 
  Smartphone, 
  Bell, 
  Code2, 
  Terminal, 
  UserCheck, 
  ExternalLink, 
  Plus, 
  Minus, 
  Zap,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Github,
  QrCode,
  Star,
  CheckCircle2,
  Cpu,
  Calculator,
  FileText,
  Sparkles,
  Languages,
  Info,
  XCircle,
  ArrowRight,
  ShieldAlert,
  Mail,
  Send,
  Inbox,
  Check,
  Bug,
  MessageSquare,
  Copy,
  Quote,
  WifiOff,
  Rocket,
  Clock,
  Cloud,
  RefreshCw,
  AlarmClock,
  Layers,
  FileCode,
  Palette
} from 'lucide-react';

const GITHUB_REPO_URL = "https://github.com/ITSTANVI28/PeriodTracker";
const GITHUB_ISSUES_URL = "https://github.com/ITSTANVI28/PeriodTracker/issues";
const DIRECT_APK_DOWNLOAD_URL = "https://github.com/ITSTANVI28/PeriodTracker/releases/download/v1.0/app-release.apk";

// Exported OfflineBadge component with hover tooltip explaining offline functionality
export const OfflineBadge: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div 
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div 
        className="px-4 py-3.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-800 border border-emerald-500/30 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 cursor-help transition-all shadow-sm hover:shadow group"
        tabIndex={0}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        aria-label="Works Offline reassurance badge"
      >
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <WifiOff className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform shrink-0" />
        <span className="whitespace-nowrap font-display">Works 100% Offline</span>
        <Info className="w-3.5 h-3.5 text-emerald-600/70 group-hover:text-emerald-700 shrink-0 ml-0.5" />
      </div>

      {/* Floating Hover Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 w-64 sm:w-72 bg-[#16213E] text-white text-xs rounded-2xl p-3.5 shadow-2xl border border-[#B95679]/40 backdrop-blur-md z-40 animate-in fade-in zoom-in-95 duration-150 pointer-events-none">
          <div className="flex items-center gap-1.5 font-bold text-[#E8B6CB] mb-1 font-display">
            <WifiOff className="w-3.5 h-3.5 text-[#E8B6CB]" />
            <span>Zero Internet Required</span>
          </div>
          <p className="text-white/85 leading-relaxed font-sans">
            PeriodTracker operates completely offline using local SQLite/Room database storage on your phone. Predictions and logs stay 100% local and private!
          </p>
          {/* Tooltip Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#16213E]"></div>
        </div>
      )}
    </div>
  );
};

// Exported WhatsNewSection component spotlighting the newly implemented features in v1.0
export const WhatsNewSection: React.FC = () => {
  const whatsNewList = [
    {
      id: 'cloud-sync',
      icon: Cloud,
      title: 'Google Cloud Sync & 2-Way Backup',
      badge: '☁️ Real-Time Sync',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
      iconBg: 'bg-gradient-to-br from-sky-500 to-blue-600',
      description: 'Seamlessly sign in with Google to sync period history, symptoms, and settings to Google Cloud Firestore in real-time. Easily restore all health records when switching to a new phone.',
      highlights: [
        'Google One-Tap Sign-In authentication in Settings',
        'Real-time Firestore 2-way data synchronization',
        '1-Tap instant multi-device restore on any new phone',
        'Local-first: Works 100% offline if you choose not to sign in'
      ]
    },
    {
      id: 'smart-reminders',
      icon: Bell,
      title: 'Intelligent Daily Reminders & Custom Alerts',
      badge: '⏰ Reboot-Proof Engine',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
      description: '5 built-in smart reminders (Period Alert, Ovulation Day, Fertile Window, Daily Hydration, and Nightly Symptom Log) + create unlimited personalized custom reminders.',
      highlights: [
        '5 Built-in clinical cycle & hydration smart alerts',
        'Create unlimited personalized custom daily alarms',
        'Persistent alarms automatically reschedule after phone reboots',
        'Discreet, privacy-focused notification text with custom timings'
      ]
    },
    {
      id: 'day-details-sheet',
      icon: Calendar,
      title: 'Interactive Day Details Popup',
      badge: '🗓️ Bottom Sheet UI',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      iconBg: 'bg-gradient-to-br from-[#B95679] to-[#D87093]',
      description: 'Tap any day on the calendar to open a sleek Bottom Sheet showing real-time cycle phase, pregnancy probability chance, and quick actions to edit/delete logged flow and symptoms.',
      highlights: [
        '1-Tap Day Details Bottom Sheet popup on any calendar date',
        'Real-time cycle phase status (Follicular, Ovulation, Luteal, Menstrual)',
        'Calculates pregnancy probability chance for each cycle day',
        'Quick-action buttons to instantly log, edit, or delete flow & symptoms'
      ]
    },
    {
      id: 'apk-release',
      icon: Smartphone,
      title: 'Production Release APK v1.0',
      badge: '📦 Production v1.0',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      description: 'Direct download link for signed app-release.apk (Optimized for Android 14 / API 34, Lightweight ~8.4 MB).',
      highlights: [
        'Direct download link for official signed app-release.apk',
        'Optimized for Android 14 (API Level 34) & backward compatible (API 24+)',
        'Ultra-lightweight build (~8.4 MB) with ProGuard & R8 optimization',
        'Verified cryptographic signature for safe side-loading'
      ]
    }
  ];

  return (
    <section id="whats-new" className="py-12 sm:py-24 bg-gradient-to-b from-[#FFF8F8] via-white to-[#FFF0F3] border-t border-[#B95679]/15 relative overflow-hidden">
      {/* Glow decorative blurs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#B95679]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-3 sm:space-y-4 px-2 sm:px-0"
        >
          <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#B95679]/15 via-purple-500/15 to-[#B95679]/15 text-[#B95679] border border-[#B95679]/30 text-xs font-extrabold uppercase tracking-widest inline-flex items-center gap-1.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#B95679]" /> WHAT'S NEW IN RELEASE v1.0
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-display text-[#201A1B] tracking-tight leading-tight">
            Latest Features & Release Updates
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-[#201A1B]/75 leading-relaxed">
            Experience our newest major release: Google Cloud 2-way backup, reboot-proof intelligent cycle alerts, interactive calendar day bottom sheets, and the official signed Android 14 release APK.
          </p>
        </motion.div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {whatsNewList.map((feat, index) => {
            const IconComp = feat.icon;
            return (
              <motion.div
                key={feat.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-[#B95679]/15 hover:border-[#B95679]/50 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5 relative overflow-hidden"
              >
                {/* Top decorative gradient line */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#B95679] via-[#D87093] to-[#E8B6CB] opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div>
                  <div className="flex items-center justify-between mb-4 sm:mb-5">
                    <div className={`w-12 h-12 rounded-2xl ${feat.iconBg} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className={`px-2.5 py-1 text-[11px] font-extrabold rounded-full border ${feat.badgeColor}`}>
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold font-display text-[#201A1B] mb-2.5 group-hover:text-[#B95679] transition-colors leading-snug">
                    {feat.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#201A1B]/75 leading-relaxed mb-5 font-normal">
                    {feat.description}
                  </p>
                </div>

                {/* Highlights List */}
                <div className="pt-4 border-t border-gray-100 space-y-2">
                  {feat.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs font-semibold text-[#201A1B]/80 leading-tight">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#B95679] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Interactive Feature Deep-Dive Visual Showcase Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mt-10 sm:mt-14 bg-[#16213E] rounded-3xl p-6 sm:p-10 border border-[#B95679]/30 text-white shadow-2xl relative overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Summary & CTA */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B95679]/20 text-[#E8B6CB] border border-[#B95679]/30 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#B95679]" /> Production Release v1.0 Live
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display leading-tight text-white">
                Everything You Need for Total Cycle Harmony
              </h3>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                PeriodTracker v1.0 combines private local-first SQLite logging with optional Google Cloud Firestore sync, reboot-proof notifications, and clinical PDF medical export — completely free and ad-free.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={DIRECT_APK_DOWNLOAD_URL}
                  download
                  className="px-6 py-3 bg-gradient-to-r from-[#B95679] to-[#9E4566] hover:from-[#a04665] hover:to-[#883a54] text-white font-bold text-xs sm:text-sm rounded-2xl transition-all shadow-lg flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Signed APK (~8.4 MB)</span>
                </a>
                <a
                  href="#faq"
                  className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-2xl transition-all border border-white/15 active:scale-95"
                >
                  <span>Cloud Sync & Alarm FAQs →</span>
                </a>
              </div>
            </div>

            {/* Right: 3 Visual Mini Feature Pills */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Pill 1: Cloud Sync */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:border-[#B95679]/50 transition-all">
                <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center">
                  <Cloud className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-white font-display">Google Cloud Sync</div>
                <p className="text-[11px] text-white/70 leading-snug">
                  Real-time Firestore backup + instant restore when switching phones.
                </p>
                <span className="inline-block text-[10px] text-sky-300 font-bold bg-sky-500/10 px-2 py-0.5 rounded-md">
                  Optional & Secure
                </span>
              </div>

              {/* Pill 2: Reboot Proof Alarms */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:border-[#B95679]/50 transition-all">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-white font-display">Smart Alarms</div>
                <p className="text-[11px] text-white/70 leading-snug">
                  5 built-in alerts + custom alarms that reschedule on device reboot.
                </p>
                <span className="inline-block text-[10px] text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md">
                  Boot Receiver Ready
                </span>
              </div>

              {/* Pill 3: Day Details Sheet */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:border-[#B95679]/50 transition-all">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-white font-display">Day Details Sheet</div>
                <p className="text-[11px] text-white/70 leading-snug">
                  Tap calendar days for cycle phase, pregnancy probability chance & quick edits.
                </p>
                <span className="inline-block text-[10px] text-rose-300 font-bold bg-rose-500/10 px-2 py-0.5 rounded-md">
                  Bottom Sheet Popup
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Exported KeyFeatures component highlighting CycleSync's main value propositions
export const KeyFeatures: React.FC = () => {
  const featureList = [
    {
      id: 'cloud-sync',
      title: 'Google Cloud Sync & 2-Way Backup',
      badge: '☁️ Cloud & Local',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
      iconBg: 'bg-sky-600',
      icon: Cloud,
      description: 'Seamlessly sign in with Google to sync period history, symptoms, and settings to Google Cloud Firestore in real-time. Easily restore all health records when switching to a new phone.',
      highlights: ['Google One-Tap Login', 'Firestore Real-Time Sync', 'Instant Multi-Device Restore']
    },
    {
      id: 'smart-reminders',
      title: 'Intelligent Daily Reminders & Custom Alerts',
      badge: '⏰ Reboot-Proof',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      iconBg: 'bg-amber-600',
      icon: Bell,
      description: '5 built-in smart reminders (Period Alert, Ovulation Day, Fertile Window, Daily Hydration, and Nightly Symptom Log) + create unlimited personalized custom reminders with reboot-proof scheduling.',
      highlights: ['5 Built-in Smart Alerts', 'Unlimited Custom Alarms', 'Persistent Boot Receiver Engine']
    },
    {
      id: 'day-details',
      title: 'Interactive Day Details Popup',
      badge: '🗓️ Bottom Sheet UI',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      iconBg: 'bg-[#B95679]',
      icon: Calendar,
      description: 'Tap any day on the calendar to open a sleek Bottom Sheet showing real-time cycle phase, pregnancy probability chance, and quick actions to edit/delete logged flow and symptoms.',
      highlights: ['Real-Time Cycle Phase', 'Pregnancy Probability Rating', 'Quick Edit & Delete Actions']
    },
    {
      id: 'private-tracking',
      title: '100% Private & Local-First',
      badge: 'Zero-Cloud Security',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      iconBg: 'bg-emerald-600',
      icon: ShieldCheck,
      description: 'Your menstrual logs, notes, and cycle data are stored securely in your phone\'s local SQLite/Room database. Zero mandatory accounts, zero data harvesting, and 100% offline functionality.',
      highlights: ['Local SQLite/Room Storage', 'Optional Cloud Sync', 'Zero Data Selling']
    },
    {
      id: 'pcod-assessment',
      title: 'PCOD / PCOS Risk Assessment',
      badge: 'Clinical Screening',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      iconBg: 'bg-[#16213E]',
      icon: Stethoscope,
      description: 'An interactive 12-question diagnostic screening tool evaluating cycle regularity, hirsutism, acne, and hormonal indicators to calculate Low, Moderate, or High PCOD risk levels with health guidance.',
      highlights: ['12 Clinical Indicators', 'Instant Risk Score', 'Actionable Health Advice']
    },
    {
      id: 'symptom-logging',
      title: 'Symptom & Mood Logger',
      badge: '12+ Health Metrics',
      badgeColor: 'bg-pink-100 text-pink-800 border-pink-200',
      iconBg: 'bg-pink-600',
      icon: Heart,
      description: 'Log daily flow intensity, cramp severity, acne outbreaks, fatigue, mood swings, water intake, and custom diary notes to identify recurring hormonal patterns.',
      highlights: ['Severity Ratings (1-5)', 'Water Intake Counter', 'Cycle Trend Insights']
    },
    {
      id: 'pdf-export',
      title: 'Doctor-Ready PDF Reports',
      badge: 'Medical Export',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      iconBg: 'bg-indigo-600',
      icon: FileText,
      description: 'Generate clean, printable PDF clinical reports containing full period histories and symptom logs to present directly to your gynecologist during health checkups.',
      highlights: ['Formatted PDF Summary', 'Print or Share', 'Clinical History Table']
    },
    {
      id: 'app-security',
      title: 'PIN & Biometric Lock',
      badge: 'App Protection',
      badgeColor: 'bg-violet-100 text-violet-800 border-violet-200',
      iconBg: 'bg-violet-600',
      icon: Lock,
      description: 'Keep your personal journal safe from prying eyes with a custom 4-digit PIN lock and native Android fingerprint biometric authentication.',
      highlights: ['4-Digit PIN Security', 'Fingerprint Unlocking', 'Security Recovery Question']
    }
  ];

  return (
    <section id="features" className="py-12 sm:py-20 bg-white border-t border-[#B95679]/10 relative">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-3 sm:space-y-4 px-2 sm:px-0"
        >
          <span className="px-4 py-1.5 rounded-full bg-[#B95679]/10 text-[#B95679] border border-[#B95679]/20 text-xs font-bold uppercase tracking-widest inline-flex items-center gap-1.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#B95679]" /> Core Capabilities
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-display text-[#201A1B] tracking-tight leading-tight">
            Key Features
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-[#201A1B]/70 leading-relaxed">
            Engineered for privacy, clinical precision, and everyday simplicity — empowering you with total ownership of your menstrual health offline.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featureList.map((feat, index) => {
            const IconComponent = feat.icon;
            return (
              <motion.div 
                key={feat.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: (index % 4) * 0.1, ease: "easeOut" }}
                className="bg-gradient-to-br from-[#FFF8F8] to-[#FFF0F3] p-5 sm:p-7 rounded-3xl border border-[#B95679]/15 hover:border-[#B95679]/40 transition-all duration-300 hover:-translate-y-1.5 active:scale-[0.98] shadow-xs hover:shadow-xl group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${feat.iconBg} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <span className={`px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-extrabold rounded-full border ${feat.badgeColor}`}>
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold font-display text-[#201A1B] mb-2 group-hover:text-[#B95679] transition-colors leading-snug">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#201A1B]/70 leading-relaxed mb-4 sm:mb-6 font-normal">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-3.5 sm:pt-4 border-t border-[#B95679]/10 space-y-1.5">
                  {feat.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-[#201A1B]/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#B95679] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export interface LandingPageProps {
  onOpenWebApp?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenWebApp }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Language state for Multi-language Preview Demo
  const [selectedLang, setSelectedLang] = useState<'en' | 'hi' | 'mr'>('en');

  // Direct Download Architecture Selector state
  const [selectedArch, setSelectedArch] = useState<'arm64' | 'armv7' | 'x86_64' | 'universal'>('arm64');

  // Dev Log Card Expanded State
  const [expandedDevCards, setExpandedDevCards] = useState<Record<string, boolean>>({});

  // Live Cycle Calculator state
  const [lastPeriod, setLastPeriod] = useState('2026-07-20');
  const [cycleDays, setCycleDays] = useState(28);
  const [calcResult, setCalcResult] = useState<{
    nextDate: string;
    ovulationDate: string;
    fertileStart: string;
    fertileEnd: string;
    daysRemaining: number;
  } | null>({
    nextDate: 'Aug 17, 2026',
    ovulationDate: 'Aug 03, 2026',
    fertileStart: 'Jul 30, 2026',
    fertileEnd: 'Aug 04, 2026',
    daysRemaining: 14
  });

  // GitHub Issue Submission & Feedback state
  const [issueType, setIssueType] = useState<'bug' | 'feature' | 'health' | 'ui' | 'privacy'>('bug');
  const [issueTitle, setIssueTitle] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [issueSteps, setIssueSteps] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [issueSubmitted, setIssueSubmitted] = useState(false);
  const [issueError, setIssueError] = useState('');
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [lastSubmittedIssueUrl, setLastSubmittedIssueUrl] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [guideModalOpen, setGuideModalOpen] = useState(false);

  // Auto-open Welcome & Feature Guide modal on page load/refresh unless disabled
  useEffect(() => {
    const dontShow = localStorage.getItem('cyclesync_guide_dont_show');
    if (dontShow !== 'true') {
      const timer = setTimeout(() => {
        setGuideModalOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueTitle.trim()) {
      setIssueError('Please enter a brief title for your issue or feature request.');
      return;
    }
    if (!issueDescription.trim()) {
      setIssueError('Please provide a description explaining the issue or suggestion.');
      return;
    }

    setIssueError('');

    const typeLabels: Record<string, string> = {
      bug: 'bug',
      feature: 'enhancement',
      health: 'health-tracker',
      ui: 'ui-ux',
      privacy: 'privacy'
    };

    const typePrefix: Record<string, string> = {
      bug: '[BUG]',
      feature: '[FEATURE]',
      health: '[HEALTH TRACKER]',
      ui: '[UI/UX]',
      privacy: '[PRIVACY/SECURITY]'
    };

    const fullTitle = `${typePrefix[issueType]} ${issueTitle.trim()}`;

    const bodyContent = `### 📌 Issue Summary
${issueDescription.trim()}

${issueSteps.trim() ? `### 🔄 Steps to Reproduce / Details\n${issueSteps.trim()}\n` : ''}
### 💻 System & Environment Details
- **Application:** CycleSync Menstrual & PCOD Health Companion
- **Category:** ${issueType.toUpperCase()}
- **Reporter Contact:** ${reporterContact.trim() || 'Anonymous Community Contributor'}
- **Environment Spec:** ${typeof navigator !== 'undefined' ? navigator.userAgent : 'Web Browser'}
- **Logged Date:** ${new Date().toLocaleString()}

---
*Submitted via CycleSync In-App Issue Reporter for [ITSTANVI28/PeriodTracker](https://github.com/ITSTANVI28/PeriodTracker)*`;

    const newIssueUrl = `https://github.com/ITSTANVI28/PeriodTracker/issues/new?title=${encodeURIComponent(fullTitle)}&body=${encodeURIComponent(bodyContent)}&labels=${encodeURIComponent(typeLabels[issueType])}`;

    setLastSubmittedIssueUrl(newIssueUrl);
    setIssueSubmitted(true);
    setToastMessage(`Issue report received! Opening GitHub issue form...`);
    setShowSuccessToast(true);

    setTimeout(() => {
      setShowSuccessToast(false);
    }, 6000);

    try {
      window.open(newIssueUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.warn('Popup blocked, link provided in confirmation panel:', err);
    }
  };

  const copyMarkdownToClipboard = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedMarkdown(true);
      setTimeout(() => setCopiedMarkdown(false), 2500);
    }
  };

  const toggleDevCard = (id: string) => {
    setExpandedDevCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const archDetails = {
    arm64: { name: 'ARM64-V8A (RECOMMENDED)', size: '8.4 MB', tag: 'Android 14 Ready / Modern Devices (95%+)' },
    armv7: { name: 'ARMV7 (32-BIT)', size: '8.1 MB', tag: 'Older 32-Bit Android Devices' },
    x86_64: { name: 'X86_64', size: '8.7 MB', tag: 'Emulators & Intel Chromebooks' },
    universal: { name: 'UNIVERSAL (ALL ARCHITECTURES)', size: '18.5 MB', tag: 'All Android Devices (Fat Signed APK)' }
  };

  // Translations for Multi-Language Demo
  const t = {
    en: {
      badge: "✨ 100% Private Menstrual Health Tracker",
      heroTitle: "Master Your Cycle.",
      heroSub: "Track periods, predict ovulation, log symptoms & assess PCOD risk safely on your Android device.",
      feat1Title: "📅 Period & Ovulation Prediction",
      feat1Desc: "Smart mathematical algorithm predicts upcoming period start dates, fertile windows, and peak ovulation days.",
      feat2Title: "☁️ Google Cloud Sync & 2-Way Backup",
      feat2Desc: "Seamlessly sign in with Google to sync period history, symptoms, and settings to Google Cloud Firestore in real-time.",
      feat3Title: "🔔 Smart Reminders & Reboot-Proof Alarms",
      feat3Desc: "5 built-in smart reminders + unlimited custom alerts that automatically reschedule even after phone restarts.",
      feat4Title: "🩺 PCOD/PCOS Self-Assessment Quiz",
      feat4Desc: "10-question weighted diagnostic questionnaire calculating Low, Moderate, or High risk profiles with advice.",
      feat5Title: "📝 Symptom & Mood Logger (12+ Symptoms)",
      feat5Desc: "Log cramps, headache, acne, bloating, fatigue, mood swings, backache, and water intake with 1-5 severity levels.",
      feat6Title: "📄 PDF Medical Report Export",
      feat6Desc: "Generate clean, printable PDF health reports containing cycle history and symptom trends to present to your doctor."
    },
    hi: {
      badge: "✨ 100% सुरक्षित और गोपनीय पीरियड्स ट्रैकर",
      heroTitle: "अपने चक्र को समझें।",
      heroSub: "पीरियड्स ट्रैक करें, ओव्यूलेशन का अनुमान लगाएं, लक्षण रिकॉर्ड करें और PCOD जोखिम की जांच करें।",
      feat1Title: "📅 पीरियड्स एवं ओव्यूलेशन अनुमान",
      feat1Desc: "सटीक गणितीय एल्गोरिदम आपके अगले पीरियड्स और ओव्यूलेशन के दिनों की सटीक भविष्यवाणी करता है।",
      feat2Title: "☁️ गूगल क्लाउड सिंक व 2-वे बैकअप",
      feat2Desc: "गूगल अकाउंट से सुरक्षित साइन-इन करके अपना पूरा पीरियड्स डेटा रियल-टाइम में सुरक्षित क्लाउड पर बैकअप करें।",
      feat3Title: "🔔 स्मार्ट रिमाइंडर्स एवं रीबूट-प्रूफ अलार्म",
      feat3Desc: "५ इन-बिल्ट स्मार्ट अलर्ट्स व कस्टम रिमाइंडर्स जो फोन रीस्टार्ट होने के बाद भी अपने-आप रीशेड्यूल हो जाते हैं।",
      feat4Title: "🩺 PCOD/PCOS स्व-मूल्यांकन क्विज़",
      feat4Desc: "10-प्रश्नों का परीक्षण जो आपके स्वास्थ्य संकेतकों के आधार पर PCOD जोखिम का स्तर बताता है।",
      feat5Title: "📝 लक्षण और मूड लॉगिंग (12+ लक्षण)",
      feat5Desc: "पेट दर्द, मुंहासे, सिरदर्द, थकान, मूड स्विंग्स और पानी के सेवन की मात्रा आसानी से दर्ज करें।",
      feat6Title: "📄 डॉक्टर हेतु पीडीएफ मेडिकल रिपोर्ट",
      feat6Desc: "अपने डॉक्टर को दिखाने के लिए चक्र इतिहास और लक्षणों की प्रिंट-योग्य पीडीएफ रिपोर्ट बनाएं।"
    },
    mr: {
      badge: "✨ १००% खाजगी आणि सुरक्षित मासिक पाळी ट्रॅकर",
      heroTitle: "तुमच्या सायकलवर नियंत्रण ठेवा.",
      heroSub: "मासिक पाळी ट्रॅक करा, ओव्ह्युलेशनचा अंदाज लावा आणि PCOD धोक्याचे मूल्यांकन करा.",
      feat1Title: "📅 मासिक पाळी आणि ओव्ह्युलेशन अंदाज",
      feat1Desc: "स्मार्ट अल्गोरिदम पुढील पाळीची तारीख, सुपीकता काळ आणि ओव्ह्युलेशनच्या दिवसांचा अंदाज लावतो.",
      feat2Title: "☁️ गुगल क्लाउड सिंक व २-वे बॅकअप",
      feat2Desc: "गुगल साइन-इन द्वारे पाळीचा इतिहास आणि लक्षणे सुरक्षित क्लाउडवर त्वरित सिंक आणि रिस्टोअर करा.",
      feat3Title: "🔔 स्मार्ट रिमाइंडर्स व रीबूट-प्रूफ अलार्म्स",
      feat3Desc: "५ अंगभूत स्मार्ट नोटिफिकेशन्स आणि फोन रीस्टार्ट झाल्यावरही चालू राहणारे सुरक्षित अलार्म्स.",
      feat4Title: "🩺 PCOD/PCOS स्वयं-मूल्यमापन चाचणी",
      feat4Desc: "१० प्रश्नांची चाचणी जी तुम्हाला PCOD/PCOS धोक्याचे प्रमाण (कमी, मध्यम, जास्त) दर्शवते.",
      feat5Title: "📝 लक्षणे आणि मूड नोंद (१२+ लक्षणे)",
      feat5Desc: "पोटदुखी, डोकेदुखी, पिंपल्स, थकवा आणि पाण्याच्या सेवनाची नोंद १-५ तीव्रतेसह करा.",
      feat6Title: "📄 डॉक्टरांसाठी पीडीएफ मेडिकल रिपोर्ट",
      feat6Desc: "तुमच्या स्त्रीरोग तज्ञांना दाखवण्यासाठी पाळीचा इतिहास आणि लक्षणे असलेली पीडीएफ डाउनलोड करा."
    }
  }[selectedLang];

  // Calculation Logic
  const handleCalculate = () => {
    if (!lastPeriod) return;
    const start = new Date(lastPeriod);
    if (isNaN(start.getTime())) return;

    const next = new Date(start);
    next.setDate(start.getDate() + Number(cycleDays));

    const ovulation = new Date(next);
    ovulation.setDate(next.getDate() - 14);

    const fertileStart = new Date(ovulation);
    fertileStart.setDate(ovulation.getDate() - 4);

    const fertileEnd = new Date(ovulation);
    fertileEnd.setDate(ovulation.getDate() + 1);

    const today = new Date();
    const diffTime = next.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const formatDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    setCalcResult({
      nextDate: formatDate(next),
      ovulationDate: formatDate(ovulation),
      fertileStart: formatDate(fertileStart),
      fertileEnd: formatDate(fertileEnd),
      daysRemaining: diffDays > 0 ? diffDays : 0
    });
  };

  // Sample PDF Generator for Clinical Report Preview
  const generateSamplePDF = () => {
    try {
      const { jsPDF } = (window as any).jspdf || {};
      if (jsPDF) {
        const doc = new jsPDF();
        // Header Banner
        doc.setFillColor(185, 86, 121); // #B95679
        doc.rect(0, 0, 210, 24, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.text("CYCLESYNC - CLINICAL HEALTH SUMMARY", 14, 16);

        // Section Title
        doc.setTextColor(22, 33, 62);
        doc.setFontSize(12);
        doc.text("PATIENT SUMMARY REPORT", 14, 36);
        
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.text("Patient Identifier: Anonymous #PT-9042", 14, 45);
        doc.text("Export Date: August 03, 2026", 14, 52);
        doc.text("App Build: PeriodTracker v1.0.0 Stable (Signed Release APK)", 14, 59);
        doc.text("Project Creator: Tanvi Yadav (Full-Stack Developer)", 14, 66);

        doc.setDrawColor(232, 182, 203);
        doc.line(14, 72, 196, 72);

        doc.setFontSize(12);
        doc.setTextColor(22, 33, 62);
        doc.text("CYCLE METRICS & OVERVIEW", 14, 83);
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        doc.text("• Average Cycle Duration: 28 Days", 18, 93);
        doc.text("• Last Logged Period Start: July 20, 2026", 18, 100);
        doc.text("• Next Predicted Period: August 17, 2026", 18, 107);
        doc.text("• PCOD/PCOS Screening Score: 3/30 (LOW RISK)", 18, 114);

        doc.line(14, 122, 196, 122);

        doc.setFontSize(12);
        doc.setTextColor(22, 33, 62);
        doc.text("RECENT LOGGED SYMPTOMS (LAST 30 DAYS)", 14, 134);
        
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text("Date          Cramps    Acne      Mood           Water Intake", 18, 144);
        doc.text("----------------------------------------------------------------------", 18, 149);
        doc.setTextColor(40, 40, 40);
        doc.text("July 20, 2026   Mild      None      Irritable       2.5 Liters", 18, 156);
        doc.text("July 21, 2026   Moderate  Mild      Fatigued        3.0 Liters", 18, 163);
        doc.text("July 22, 2026   Mild      None      Normal          2.8 Liters", 18, 170);
        doc.text("July 23, 2026   None      None      Happy           3.1 Liters", 18, 177);

        doc.line(14, 186, 196, 186);
        doc.setFontSize(11);
        doc.setTextColor(22, 33, 62);
        doc.text("GYNECOLOGIST NOTES & CLINICAL REMARKS:", 14, 198);
        doc.setFontSize(9.5);
        doc.setTextColor(60, 60, 60);
        doc.text("Patient maintains a regular 28-day cycle with minimal symptom variation.", 18, 208);
        doc.text("All health data remains 100% private with optional encrypted Google Cloud Sync.", 18, 215);

        doc.setFontSize(8);
        doc.setTextColor(140, 140, 140);
        doc.text("Generated by PeriodTracker Android App | Created by Tanvi Yadav | https://github.com/ITSTANVI28/PeriodTracker", 14, 280);

        doc.save("PeriodTracker_Sample_Medical_Report.pdf");
      } else {
        window.location.href = DIRECT_APK_DOWNLOAD_URL;
      }
    } catch (err) {
      window.location.href = DIRECT_APK_DOWNLOAD_URL;
    }
  };

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: "How does Google Cloud Sync work?",
      a: "Simply sign in with your Google account in Settings. Your period logs and symptoms will automatically sync to secure Firebase Firestore and can be restored on any new device instantly."
    },
    {
      q: "Will my reminders still work if my phone restarts?",
      a: "Yes! Our smart Boot Receiver automatically restores all scheduled period, ovulation, and custom reminders right after your device boots up."
    },
    {
      q: "Is Cloud Sync mandatory?",
      a: "No, PeriodTracker is local-first. You can use the entire app 100% offline without signing in."
    },
    {
      q: "Is my period and symptom data completely private?",
      a: "Yes, 100%. PeriodTracker uses a local-first architecture. All your period logs, symptom entries, notes, and cycle statistics are stored locally on your device's SQLite/Room database. Cloud sync to Google Firestore is completely optional and user-controlled."
    },
    {
      q: "Do I need an account or internet connection to use the app?",
      a: "No account or login is required. The app functions completely offline without requiring an active internet connection, so your data remains accessible anywhere, anytime. Google sign-in is available as an optional feature for multi-device restore."
    },
    {
      q: "How does the PIN & Biometric lock work?",
      a: "You can enable a custom 4-digit PIN lock or biometric fingerprint authentication in the settings. This ensures that even if someone accesses your phone, your personal menstrual log remains locked."
    },
    {
      q: "What is the PCOD/PCOS Self-Assessment tool?",
      a: "The PCOD/PCOS tool is an interactive screening questionnaire that evaluates key clinical indicators such as cycle irregularity, acne, hirsutism, and weight changes to provide an initial risk indication (Low, Moderate, High) along with actionable lifestyle advice."
    },
    {
      q: "Can I export my health records for my doctor?",
      a: "Yes! PeriodTracker includes a built-in PDF generator that creates clean, doctor-ready medical summary reports containing your cycle history and logged symptom trends."
    },
    {
      q: "Are there any hidden subscription fees or advertisements?",
      a: "No. PeriodTracker is 100% free, open-source, and free of any advertisements or monetized user tracking."
    }
  ];

  return (
    <div className="w-full bg-[#FFF8F8] text-[#201A1B] overflow-x-hidden font-sans selection:bg-[#B95679] selection:text-white">
      {/* 1. Sticky Navigation Bar */}
      <nav className="sticky top-0 z-50 w-full glass-nav transition-all border-b border-[#B95679]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 shrink-0 group">
            <img 
              src="/ic_launcher-playstore-removebg-preview.png" 
              alt="CycleSync Logo" 
              className="w-9 h-9 sm:w-10 sm:h-10 object-contain drop-shadow-md group-hover:scale-105 transition-transform shrink-0" 
            />
            <span className="text-xl sm:text-2xl font-extrabold font-display tracking-tight text-[#B95679] whitespace-nowrap">
              CycleSync
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6 text-sm font-semibold text-[#201A1B]/85 shrink min-w-0">
            <a href="#whats-new" className="hover:text-[#B95679] transition-colors flex items-center gap-1 font-bold text-[#B95679] whitespace-nowrap">
              <Sparkles className="w-3.5 h-3.5 text-[#B95679]" /> What's New <span className="px-1.5 py-0.5 text-[9px] bg-[#B95679]/10 text-[#B95679] rounded-full font-bold">v1.0</span>
            </a>
            <a href="#calculator" className="hover:text-[#B95679] transition-colors flex items-center gap-1 font-semibold whitespace-nowrap">
              <Calculator className="w-4 h-4 shrink-0" /> Calculator
            </a>
            <a href="#features" className="hover:text-[#B95679] transition-colors whitespace-nowrap">Features</a>
            <a href="#privacy" className="hover:text-[#B95679] transition-colors whitespace-nowrap">Privacy</a>
            <a href="#download" className="hover:text-[#B95679] transition-colors font-bold text-[#B95679] whitespace-nowrap">Download</a>
            <a href="#pdf-report" className="hover:text-[#B95679] transition-colors whitespace-nowrap">PDF Report</a>
            <a href="#devlog" className="hover:text-[#B95679] transition-colors hidden xl:flex items-center gap-1 whitespace-nowrap">
              <span>Dev Log</span>
              <span className="px-1.5 py-0.5 text-[9px] bg-[#B95679]/10 text-[#B95679] rounded-full font-bold">
                v1.0
              </span>
            </a>
            <a href="#issues" className="hover:text-[#B95679] transition-colors hidden xl:flex items-center gap-1 font-semibold text-[#B95679] whitespace-nowrap">
              <Bug className="w-3.5 h-3.5 shrink-0" /> Issues
            </a>
            <a href="#faq" className="hover:text-[#B95679] transition-colors whitespace-nowrap">FAQ</a>
          </div>

          {/* Desktop Action Button & Guide */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            {onOpenWebApp && (
              <button
                onClick={onOpenWebApp}
                className="px-4 py-2 text-xs sm:text-sm font-bold bg-[#B95679] text-white hover:bg-[#9E4566] rounded-full transition-all shadow-md shadow-[#B95679]/20 hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <span>Launch Web App 🌐</span>
              </button>
            )}

            <button
              onClick={() => setGuideModalOpen(true)}
              className="px-3.5 py-2 text-xs sm:text-sm font-bold bg-[#B95679]/10 hover:bg-[#B95679]/20 text-[#B95679] border border-[#B95679]/25 rounded-full transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-xs whitespace-nowrap"
              title="Open Welcome & Feature Guide"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{selectedLang === 'mr' ? '📖 ॲप गाईड' : selectedLang === 'hi' ? '📖 ऐप गाइड' : '📖 Guide Tour'}</span>
            </button>

            <a 
              href={DIRECT_APK_DOWNLOAD_URL}
              download
              className="px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold bg-[#16213E] hover:bg-[#1A1A2E] text-white rounded-full shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>APK v1.0 📱</span>
            </a>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#201A1B] rounded-lg hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-[#B95679]" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav Slide-in Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-[#B95679]/15 px-4 sm:px-6 py-5 space-y-4 animate-in slide-in-from-top duration-200 shadow-2xl">
            {/* Language Toggle Mobile */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="text-xs font-bold text-[#16213E] flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#B95679]" /> Language:
              </span>
              <div className="flex items-center bg-white p-1 rounded-xl shadow-xs border border-gray-200 text-xs font-bold gap-1">
                <button 
                  onClick={() => setSelectedLang('en')} 
                  className={`px-3 py-1.5 rounded-lg transition-all active:scale-95 ${selectedLang === 'en' ? 'bg-[#B95679] text-white shadow-xs' : 'text-gray-600 hover:text-[#B95679]'}`}
                >
                  EN
                </button>
                <button 
                  onClick={() => setSelectedLang('hi')} 
                  className={`px-3 py-1.5 rounded-lg transition-all active:scale-95 ${selectedLang === 'hi' ? 'bg-[#B95679] text-white shadow-xs' : 'text-gray-600 hover:text-[#B95679]'}`}
                >
                  हिन्दी
                </button>
                <button 
                  onClick={() => setSelectedLang('mr')} 
                  className={`px-3 py-1.5 rounded-lg transition-all active:scale-95 ${selectedLang === 'mr' ? 'bg-[#B95679] text-white shadow-xs' : 'text-gray-600 hover:text-[#B95679]'}`}
                >
                  मराठी
                </button>
              </div>
            </div>

            {/* In-Drawer Quick Guide Button */}
            <button
              onClick={() => {
                setGuideModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#FFF8F8] text-[#B95679] border border-[#B95679]/30 text-xs font-bold active:scale-95 transition-all shadow-xs"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 fill-[#B95679]/20" />
                <span>{selectedLang === 'mr' ? '📖 ॲप मार्गदर्शक गाईड टूर' : selectedLang === 'hi' ? '📖 ऐप मार्गदर्शक टूर' : '📖 Interactive App Guide Tour'}</span>
              </span>
              <ChevronRight className="w-4 h-4 text-[#B95679]" />
            </button>

            <div className="grid grid-cols-2 gap-2 text-xs font-bold text-[#201A1B]/85">
              <a href="#whats-new" onClick={() => setMobileMenuOpen(false)} className="p-3 bg-[#FFF8F8] border border-[#B95679]/15 rounded-xl text-[#B95679] flex items-center gap-2 active:scale-95">
                <Sparkles className="w-4 h-4 text-[#B95679]" /> What's New v1.0
              </a>
              <a href="#calculator" onClick={() => setMobileMenuOpen(false)} className="p-3 bg-gray-50 border border-gray-100 rounded-xl hover:text-[#B95679] flex items-center gap-2 active:scale-95">
                <Calculator className="w-4 h-4" /> Calculator
              </a>
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="p-3 bg-gray-50 border border-gray-100 rounded-xl hover:text-[#B95679] flex items-center gap-2 active:scale-95">
                <Sparkles className="w-4 h-4 text-[#B95679]" /> Features
              </a>
              <a href="#privacy" onClick={() => setMobileMenuOpen(false)} className="p-3 bg-gray-50 border border-gray-100 rounded-xl hover:text-[#B95679] flex items-center gap-2 active:scale-95">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Privacy First
              </a>
              <a href="#pdf-report" onClick={() => setMobileMenuOpen(false)} className="p-3 bg-gray-50 border border-gray-100 rounded-xl hover:text-[#B95679] flex items-center gap-2 active:scale-95">
                <FileText className="w-4 h-4 text-indigo-600" /> PDF Report
              </a>
              <a href="#issues" onClick={() => setMobileMenuOpen(false)} className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-[#B95679] flex items-center gap-2 active:scale-95">
                <Bug className="w-4 h-4" /> Report Issue
              </a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="p-3 bg-gray-50 border border-gray-100 rounded-xl hover:text-[#B95679] flex items-center gap-2 active:scale-95 col-span-2">
                <Info className="w-4 h-4 text-amber-600" /> Frequently Asked Questions
              </a>
            </div>

            {/* In-Drawer Quick Launch Web App Button */}
            {onOpenWebApp && (
              <button
                onClick={() => {
                  onOpenWebApp();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 text-center text-xs sm:text-sm font-extrabold text-white bg-[#B95679] rounded-2xl shadow-md flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <span>Launch Web App Directly 🌐</span>
              </button>
            )}

            <div className="pt-1">
              <a 
                href={DIRECT_APK_DOWNLOAD_URL}
                download
                className="w-full py-3.5 text-center text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-[#16213E] to-[#1A1A2E] rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <Download className="w-4 h-4" />
                Download Android APK v1.0 📱
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* 2. Hero Section */}
      <section className="relative py-8 sm:py-12 lg:py-20 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
            {/* Top Badges & Floating Update Banner */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#B95679]/15 via-purple-500/15 to-[#B95679]/15 text-[#B95679] border border-[#B95679]/30 text-xs font-extrabold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#B95679] shrink-0" />
                <span>✨ New: Google Cloud Sync & Smart Reminders Enabled</span>
              </div>

              {/* Feature Pill: Cloud Backup & Restore */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-800 border border-sky-500/30 text-xs font-bold shadow-xs">
                <Cloud className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>☁️ Cloud Backup & Restore</span>
              </div>

              {/* Feature Pill: Reboot-Proof Smart Alarms */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 border border-amber-500/30 text-xs font-bold shadow-xs">
                <Bell className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>⏰ Reboot-Proof Smart Alarms</span>
              </div>

              {/* Feature Pill: Android 14 Ready */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 border border-emerald-500/30 text-xs font-bold shadow-xs">
                <Smartphone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>📱 Android 14 Ready</span>
              </div>

              {/* 100% Ad-Free Visual Tag */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-800 border border-purple-500/30 text-xs font-bold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>100% Ad-Free</span>
              </div>

              {/* 100% Private Visual Badge Button */}
              <button
                onClick={() => setPrivacyModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-800 border border-emerald-500/30 text-xs font-bold transition-all shadow-xs cursor-pointer group active:scale-95"
                title="Click to view local-only data storage policy details"
                aria-label="Open 100% Private Local Data Storage Policy"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>100% Private (Local-First)</span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-900 px-1.5 py-0.5 rounded-full font-extrabold uppercase">
                  Policy 🛡️
                </span>
              </button>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold font-display leading-tight text-[#201A1B] tracking-tight my-2 sm:my-4">
              {t.heroTitle.split(" ")[0]} {' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B95679] via-[#D87093] to-[#E8B6CB]">
                {t.heroTitle.split(" ").slice(1).join(" ")}
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-[#201A1B]/75 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal mb-4 sm:mb-6 px-1 sm:px-0">
              {t.heroSub}
            </p>

            {/* Main CTA Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-1">
              {onOpenWebApp && (
                <button
                  onClick={onOpenWebApp}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-[#B95679] hover:bg-[#9E4566] text-white rounded-2xl font-extrabold text-sm sm:text-base shadow-xl shadow-[#B95679]/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <span>Launch Web App 🌐</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}

              <a 
                href={DIRECT_APK_DOWNLOAD_URL}
                download
                className="w-full sm:w-auto px-6 sm:px-7 py-3.5 sm:py-4 bg-gradient-to-r from-[#16213E] to-[#1A1A2E] text-white rounded-2xl font-bold text-sm sm:text-base shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>Download v1.0 APK 📱</span>
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>

              <a 
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-5 sm:px-6 py-3.5 sm:py-4 border-2 border-[#201A1B]/15 hover:border-[#B95679] rounded-2xl font-bold text-sm sm:text-base text-[#201A1B] hover:text-[#B95679] flex items-center justify-center gap-2 transition-all hover:bg-white/60 active:scale-95"
              >
                <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>GitHub</span>
              </a>

              <OfflineBadge className="w-full sm:w-auto justify-center" />
            </div>

            {/* Subtext */}
            <p className="text-[11px] sm:text-xs font-semibold text-[#201A1B]/60 pt-0.5">
              Android 14 Ready (API 34) • Lightweight ~8.4 MB • Signed Production APK
            </p>

            {/* Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 text-[11px] sm:text-xs font-semibold text-[#201A1B]/70">
              <span className="flex items-center gap-1 text-sky-900 font-bold bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/20">
                <Cloud className="w-3.5 h-3.5 text-sky-600" /> Google Cloud Sync
              </span>
              <span className="hidden sm:inline w-1.5 h-1.5 bg-[#B95679]/40 rounded-full"></span>
              <span className="flex items-center gap-1 text-amber-900 font-bold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                <Bell className="w-3.5 h-3.5 text-amber-600" /> Reboot-Proof Alarms
              </span>
              <span className="hidden sm:inline w-1.5 h-1.5 bg-[#B95679]/40 rounded-full"></span>
              <button 
                onClick={() => setPrivacyModalOpen(true)}
                className="flex items-center gap-1 hover:text-[#B95679] transition-colors cursor-pointer group bg-white/70 sm:bg-transparent px-2 sm:px-0 py-0.5 sm:py-0 rounded-lg"
                title="View local-only data storage policy"
              >
                <Lock className="w-3.5 h-3.5 text-[#B95679]" /> 
                <span>No Account Needed (Offline)</span>
              </button>
            </div>
          </div>

          {/* Right Column: Floating CSS Mobile Phone Mockup showing Android App UI */}
          <div className="lg:col-span-5 relative flex justify-center items-center px-2 sm:px-0">
            <div className="absolute w-[240px] sm:w-[360px] h-[240px] sm:h-[360px] bg-[#B95679]/20 rounded-full blur-[80px] pointer-events-none animate-pulse-glow"></div>

            <div className="relative w-full max-w-[260px] sm:max-w-[300px] md:max-w-[320px] h-[500px] sm:h-[580px] bg-[#16213E] rounded-[40px] sm:rounded-[48px] border-[6px] sm:border-[8px] border-[#0D0D1A] shadow-2xl shadow-[#16213E]/40 overflow-hidden flex flex-col animate-float z-10">
              {/* Phone Status Bar */}
              <div className="h-6 sm:h-7 bg-[#16213E] flex justify-between items-center px-6 sm:px-8 pt-1.5 sm:pt-2">
                <span className="text-[10px] sm:text-[11px] text-white font-bold tracking-tight">9:41</span>
                <div className="w-12 sm:w-16 h-3.5 sm:h-4 bg-[#0D0D1A] rounded-full mx-auto -mt-1.5 sm:-mt-2"></div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 border border-white/60 rounded-full"></div>
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white/60 rounded-full"></div>
                </div>
              </div>

              {/* Screen Content inside Phone */}
              <div className="p-3.5 sm:p-5 flex-1 bg-white rounded-t-[30px] sm:rounded-t-[36px] mt-2 sm:mt-3 flex flex-col justify-between overflow-hidden">
                <div className="space-y-3 sm:space-y-4">
                  <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto"></div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400">Android Dashboard</span>
                      <h4 className="text-sm sm:text-base font-bold text-[#16213E]">My Cycle Status</h4>
                    </div>
                    <span className="text-[9px] sm:text-[10px] px-2 py-0.5 sm:px-2.5 sm:py-1 bg-[#B95679]/10 text-[#B95679] rounded-full font-bold">Luteal Phase</span>
                  </div>

                  {/* Period Countdown Card */}
                  <div className="p-3.5 sm:p-5 bg-gradient-to-br from-[#FFF8F8] to-[#FFF0F3] rounded-2xl sm:rounded-3xl border border-[#B95679]/15 text-center shadow-xs relative overflow-hidden">
                    <img 
                      src="/ic_launcher-playstore-removebg-preview.png" 
                      alt="Logo" 
                      className="absolute top-2 right-2 w-6 h-6 opacity-30 object-contain" 
                    />
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#B95679] font-bold mb-0.5">Period Countdown</p>
                    <h3 className="text-2xl sm:text-4xl font-extrabold font-display text-[#16213E] mb-0.5">12 Days</h3>
                    <p className="text-[11px] sm:text-xs text-[#16213E]/70 font-medium">until next predicted period</p>
                    <div className="mt-2.5 pt-2 sm:mt-3 sm:pt-3 border-t border-[#B95679]/10 flex justify-around text-[9px] sm:text-[10px] font-bold text-gray-500">
                      <span>Cycle: 28d</span>
                      <span>Period: 5d</span>
                    </div>
                  </div>

                  {/* Cycle Calendar Preview */}
                  <div className="p-2 sm:p-3 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-100">
                    <div className="flex justify-between text-[9px] sm:text-[10px] font-bold text-gray-400 mb-1.5">
                      <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] sm:text-xs font-semibold">
                      <span className="p-0.5 rounded-full text-gray-400">12</span>
                      <span className="p-0.5 rounded-full text-gray-400">13</span>
                      <span className="p-0.5 rounded-full bg-[#B95679] text-white font-bold">14</span>
                      <span className="p-0.5 rounded-full bg-[#B95679]/20 text-[#B95679]">15</span>
                      <span className="p-0.5 rounded-full bg-[#B95679]/20 text-[#B95679]">16</span>
                      <span className="p-0.5 rounded-full text-gray-600">17</span>
                      <span className="p-0.5 rounded-full bg-amber-500/20 text-amber-700">18</span>
                    </div>
                  </div>

                  {/* Quick Action Mockup Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 sm:p-2.5 bg-[#B95679] text-white rounded-xl text-center shadow-xs">
                      <span className="text-base block">🩸</span>
                      <span className="text-[9px] font-bold uppercase tracking-wider">Log Period</span>
                    </div>
                    <div className="p-2 sm:p-2.5 bg-[#16213E] text-white rounded-xl text-center shadow-xs">
                      <span className="text-base block">🩺</span>
                      <span className="text-[9px] font-bold uppercase tracking-wider">PCOD Quiz</span>
                    </div>
                  </div>
                </div>

                <div className="py-1.5 sm:py-2 text-[10px] font-bold text-[#B95679] bg-[#B95679]/10 rounded-lg sm:rounded-xl text-center mt-2">
                  📱 Android Native App Preview
                </div>
              </div>

              {/* Bottom Phone Bar */}
              <div className="h-4 sm:h-5 bg-white flex justify-center items-center pb-1">
                <div className="w-20 sm:w-28 h-1 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🆕 WHAT'S NEW SECTION (SPOTLIGHTING v1.0 FEATURES) */}
      <WhatsNewSection />

      {/* KEY FEATURES SECTION */}
      <KeyFeatures />

      {/* NEW SECTION 1: 🧮 INTERACTIVE LIVE CYCLE CALCULATOR SECTION */}
      <section id="calculator" className="py-20 bg-gradient-to-b from-[#FFF8F8] to-white border-y border-[#B95679]/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="px-4 py-1.5 rounded-full bg-[#B95679]/10 text-[#B95679] border border-[#B95679]/20 text-xs font-bold uppercase tracking-widest inline-flex items-center gap-1.5 mb-3 shadow-xs">
              <Calculator className="w-3.5 h-3.5" /> Quick Cycle Predictor
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#201A1B] leading-tight mb-3">
              Interactive Cycle Calculator
            </h2>
            <p className="text-sm sm:text-base text-[#201A1B]/70 leading-relaxed">
              Try a quick prediction right here, then download the app for full offline tracking!
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#B95679]/20 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Input Controls Column */}
            <div className="md:col-span-6 space-y-6">
              <div>
                <label className="block text-xs font-extrabold text-[#201A1B] uppercase tracking-wider mb-2">
                  1. Date of Last Period
                </label>
                <input 
                  type="date" 
                  value={lastPeriod}
                  onChange={(e) => setLastPeriod(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FFF8F8] border-2 border-[#B95679]/20 rounded-2xl text-sm font-bold text-[#201A1B] focus:border-[#B95679] outline-none transition-all"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-extrabold text-[#201A1B] uppercase tracking-wider">
                    2. Average Cycle Length
                  </label>
                  <span className="text-sm font-extrabold text-[#B95679] font-mono bg-[#B95679]/10 px-3 py-0.5 rounded-full">
                    {cycleDays} Days
                  </span>
                </div>
                <input 
                  type="range" 
                  min="21" 
                  max="35" 
                  value={cycleDays}
                  onChange={(e) => setCycleDays(Number(e.target.value))}
                  className="w-full accent-[#B95679] cursor-pointer h-2 bg-gray-200 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-gray-400 font-bold mt-1">
                  <span>21 Days (Short)</span>
                  <span>28 Days (Avg)</span>
                  <span>35 Days (Long)</span>
                </div>
              </div>

              <button 
                onClick={handleCalculate}
                className="w-full py-4 bg-gradient-to-r from-[#B95679] to-[#9E4566] text-white rounded-2xl font-extrabold text-base shadow-lg shadow-[#B95679]/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Calculate Next Date ✨</span>
              </button>
            </div>

            {/* Results Output Card */}
            <div className="md:col-span-6 bg-[#16213E] text-white rounded-2xl p-6 sm:p-7 border border-[#B95679]/30 shadow-2xl relative overflow-hidden space-y-5">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="text-xs font-bold text-[#E8B6CB] uppercase tracking-wider">Estimated Cycle Window</span>
                <span className="text-[10px] bg-[#B95679] text-white px-2.5 py-0.5 rounded-full font-bold">
                  {calcResult?.daysRemaining} Days Away
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
                  <span className="text-[10px] font-bold text-[#E8B6CB] uppercase block mb-1">🩸 Next Period Date</span>
                  <span className="text-base font-extrabold text-white">{calcResult?.nextDate}</span>
                </div>

                <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
                  <span className="text-[10px] font-bold text-amber-300 uppercase block mb-1">✨ Peak Ovulation</span>
                  <span className="text-base font-extrabold text-white">{calcResult?.ovulationDate}</span>
                </div>
              </div>

              <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
                <span className="text-[10px] font-bold text-emerald-300 uppercase block mb-1">🌿 Fertile Window Range</span>
                <span className="text-sm font-bold text-white">{calcResult?.fertileStart} — {calcResult?.fertileEnd}</span>
              </div>

              {/* Bottom CTA inside Result */}
              <div className="pt-2 border-t border-white/10">
                <p className="text-xs text-white/70 mb-3 text-center">
                  Want daily tracking, symptom logging & automatic reminders?
                </p>
                <a 
                  href={DIRECT_APK_DOWNLOAD_URL}
                  download
                  className="w-full py-3 bg-white text-[#16213E] rounded-xl font-extrabold text-xs text-center block shadow-md hover:bg-gray-100 transition-all cursor-pointer"
                >
                  📱 Download Android App for Full Tracking
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. "Engineered For Privacy" Section (Dark Navy #1A1A2E) */}
      <section id="privacy" className="py-20 bg-[#1A1A2E] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Title Column */}
            <div className="lg:col-span-5">
              <span className="text-[#E8B6CB] text-xs sm:text-sm font-bold uppercase tracking-widest block mb-3">
                Uncompromising Security
              </span>
              <h2 className="text-4xl sm:text-6xl font-black font-display tracking-tight leading-tight text-white uppercase italic mb-4">
                ENGINEERED FOR <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B95679] via-[#D87093] to-[#E8B6CB]">
                  PRIVACY.
                </span>
              </h2>
              <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-md">
                Your reproductive health data is nobody's business but yours. CycleSync is built with a zero-cloud architecture so your logs never leave your phone.
              </p>
            </div>

            {/* Right Column: 3 Glassmorphism Cards (#16213E) with Rose Pink glowing borders */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="glass-card-dark p-6 rounded-3xl hover:border-[#B95679]/60 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-2xl bg-[#B95679]/20 flex items-center justify-center text-[#B95679] mb-6 group-hover:scale-110 transition-transform">
                  <Lock className="w-6 h-6 text-[#E8B6CB]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 leading-snug">🔐 Local SQLite/Room DB</h3>
                <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                  100% of your cycle logs, symptom entries, and notes are saved directly on local SQLite/Room database storage.
                </p>
              </div>

              <div className="glass-card-dark p-6 rounded-3xl hover:border-[#B95679]/60 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-2xl bg-[#B95679]/20 flex items-center justify-center text-[#B95679] mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6 text-[#E8B6CB]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 leading-snug">🚫 Zero Cloud Transmit</h3>
                <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                  No cloud server sync, no external accounts, no email requirements, and zero advertising SDK trackers.
                </p>
              </div>

              <div className="glass-card-dark p-6 rounded-3xl hover:border-[#B95679]/60 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-2xl bg-[#B95679]/20 flex items-center justify-center text-[#B95679] mb-6 group-hover:scale-110 transition-transform">
                  <Smartphone className="w-6 h-6 text-[#E8B6CB]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 leading-snug">🛡️ PIN & Biometric Lock</h3>
                <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                  Secure your personal period app with a 4-digit PIN lock and security recovery question options.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW SECTION 3: 🛡️ PRIVACY COMPARISON CARD */}
      <section className="py-12 sm:py-20 bg-[#16213E] text-white border-t border-white/10">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <span className="px-3.5 sm:px-4 py-1.5 rounded-full bg-[#B95679]/20 text-[#E8B6CB] border border-[#B95679]/30 text-[11px] sm:text-xs font-bold uppercase tracking-widest inline-block mb-2 sm:mb-3">
              COMMERCIAL VS PRIVACY-FIRST
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white leading-tight mb-2 sm:mb-3">
              Why CycleSync is Different
            </h2>
            <p className="text-xs sm:text-base text-white/70 leading-relaxed px-2">
              See how CycleSync protects your intimate health records compared to standard commercial apps.
            </p>
          </div>

          {/* Mobile Swipe Hint */}
          <div className="flex sm:hidden items-center justify-between text-[11px] text-[#E8B6CB] mb-2.5 px-2 bg-white/5 py-1.5 rounded-xl border border-white/10">
            <span className="flex items-center gap-1 font-bold">
              👉 Swipe table horizontally
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">100% Offline</span>
          </div>

          <div className="overflow-x-auto rounded-2xl sm:rounded-3xl border border-white/10 bg-white/[0.02] shadow-2xl">
            <table className="w-full text-left border-collapse min-w-[540px] sm:min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10 text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-[#E8B6CB]">
                  <th className="py-3.5 px-4 sm:py-4 sm:px-6">Feature / Security Standard</th>
                  <th className="py-3.5 px-4 sm:py-4 sm:px-6 bg-red-500/10 text-red-300 rounded-t-xl sm:rounded-t-2xl">Commercial Apps</th>
                  <th className="py-3.5 px-4 sm:py-4 sm:px-6 bg-[#B95679]/25 text-emerald-300 rounded-t-xl sm:rounded-t-2xl border-2 border-[#B95679]/50">CycleSync</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs sm:text-sm font-medium text-white/90">
                <tr>
                  <td className="py-3.5 px-4 sm:py-4 sm:px-6 font-semibold">Data Storage Location</td>
                  <td className="py-3.5 px-4 sm:py-4 sm:px-6 bg-red-500/5 text-red-300">
                    <div className="flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-red-400 shrink-0" /> Cloud Servers (Vulnerable)
                    </div>
                  </td>
                  <td className="py-3.5 px-4 sm:py-4 sm:px-6 bg-[#B95679]/10 text-emerald-300 font-bold border-x-2 border-[#B95679]/30">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> 100% Offline SQLite
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 sm:py-4 sm:px-6 font-semibold">Data Monetization & Ads</td>
                  <td className="py-3.5 px-4 sm:py-4 sm:px-6 bg-red-500/5 text-red-300">
                    <div className="flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-red-400 shrink-0" /> Sells Data & Targeted Ads
                    </div>
                  </td>
                  <td className="py-3.5 px-4 sm:py-4 sm:px-6 bg-[#B95679]/10 text-emerald-300 font-bold border-x-2 border-[#B95679]/30">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Zero Data Selling & Ad-Free
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 sm:py-4 sm:px-6 font-semibold">Account Requirement</td>
                  <td className="py-3.5 px-4 sm:py-4 sm:px-6 bg-red-500/5 text-red-300">
                    <div className="flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-red-400 shrink-0" /> Mandatory Signup
                    </div>
                  </td>
                  <td className="py-3.5 px-4 sm:py-4 sm:px-6 bg-[#B95679]/10 text-emerald-300 font-bold border-x-2 border-[#B95679]/30">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> No Account Needed
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 sm:py-4 sm:px-6 font-semibold">Hidden Paywalls & Pricing</td>
                  <td className="py-3.5 px-4 sm:py-4 sm:px-6 bg-red-500/5 text-red-300">
                    <div className="flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-red-400 shrink-0" /> Monthly Subscriptions
                    </div>
                  </td>
                  <td className="py-3.5 px-4 sm:py-4 sm:px-6 bg-[#B95679]/10 text-emerald-300 font-bold border-x-2 border-[#B95679]/30">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> 100% Free & Open
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 sm:py-4 sm:px-6 font-semibold">App Security Lock</td>
                  <td className="py-3.5 px-4 sm:py-4 sm:px-6 bg-red-500/5 text-red-300">
                    <div className="flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-red-400 shrink-0" /> Basic / None
                    </div>
                  </td>
                  <td className="py-3.5 px-4 sm:py-4 sm:px-6 bg-[#B95679]/10 text-emerald-300 font-bold border-x-2 border-b-2 border-[#B95679]/30 rounded-b-xl sm:rounded-b-2xl">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> PIN & Fingerprint Lock
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. 📲 DIRECT DOWNLOAD & SCAN SECTION (DARK BACKGROUND #1A1A2E) */}
      <section id="download" className="py-12 sm:py-20 bg-[#1A1A2E] text-white relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <span className="px-3.5 sm:px-4 py-1.5 rounded-full bg-[#B95679]/20 text-[#E8B6CB] border border-[#B95679]/30 text-[11px] sm:text-xs font-bold uppercase tracking-widest inline-block mb-2 sm:mb-3">
              📲 GET THE PRODUCTION APK DIRECTLY
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight leading-tight mb-2 sm:mb-3">
              Direct Download & Scan
            </h2>
            <p className="text-xs sm:text-base text-white/70 leading-relaxed px-2">
              Select your phone architecture or scan the QR code to install the signed PeriodTracker v1.0 Android APK.
            </p>
          </div>

          {/* Side-by-Side Dark Cards Container (#16213E) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
            
            {/* LEFT CARD: DIRECT DOWNLOAD (Architecture Selector) */}
            <div className="lg:col-span-7 bg-[#16213E] rounded-3xl p-4 sm:p-8 border border-[#B95679]/30 shadow-2xl flex flex-col justify-between space-y-5 sm:space-y-6">
              <div>
                {/* Header Badge */}
                <div className="inline-block px-3.5 sm:px-4 py-1.5 rounded-full bg-white text-[#16213E] text-[11px] sm:text-xs font-extrabold uppercase tracking-wider shadow-md mb-4 sm:mb-6">
                  OFFICIAL RELEASE APK
                </div>

                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-xl font-bold text-white flex items-center gap-2 leading-snug">
                    <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-[#B95679]" />
                    Select Device Architecture
                  </h3>
                  <span className="text-[11px] sm:text-xs text-[#E8B6CB] font-mono font-bold bg-[#B95679]/20 px-2 py-0.5 rounded-full">v1.0.0 Production</span>
                </div>

                {/* Radio Selection Options */}
                <div className="space-y-2.5 sm:space-y-3">
                  {(Object.keys(archDetails) as Array<keyof typeof archDetails>).map((key) => {
                    const isSelected = selectedArch === key;
                    const item = archDetails[key];

                    return (
                      <label 
                        key={key}
                        onClick={() => setSelectedArch(key)}
                        className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl cursor-pointer transition-all border active:scale-[0.98] ${
                          isSelected 
                            ? 'bg-white text-[#16213E] border-white shadow-lg font-bold' 
                            : 'bg-white/5 text-white border-white/10 hover:bg-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 sm:gap-3">
                          <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-[#B95679] bg-[#B95679]' : 'border-white/40'
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white"></div>}
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm block">{item.name}</span>
                            <span className={`text-[10px] sm:text-[11px] block font-normal ${isSelected ? 'text-gray-600' : 'text-white/50'}`}>
                              {item.tag}
                            </span>
                          </div>
                        </div>

                        <span className={`text-[11px] sm:text-xs font-mono font-bold ${isSelected ? 'text-[#B95679]' : 'text-[#E8B6CB]'}`}>
                          {item.size}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Download Action Button & Support Footer */}
              <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t border-white/10">
                <a 
                  href={DIRECT_APK_DOWNLOAD_URL}
                  download
                  className="w-full py-3.5 sm:py-4 bg-white text-[#16213E] hover:bg-gray-100 rounded-2xl sm:rounded-full font-extrabold text-sm sm:text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer text-center"
                >
                  <span>📥 DOWNLOAD SIGNED APK ({archDetails[selectedArch].size})</span>
                </a>

                {/* Support Developer Footer */}
                <div className="pt-1 sm:pt-2 text-center space-y-2">
                  <p className="text-[10px] sm:text-xs font-bold text-[#E8B6CB] uppercase tracking-widest">
                    LOVE THE APP? SUPPORT THE CREATOR!
                  </p>

                  <a 
                    href={GITHUB_REPO_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-full bg-gradient-to-r from-[#B95679] to-[#9E4566] text-white text-[11px] sm:text-xs font-extrabold hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
                  >
                    <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-300 text-amber-300" />
                    <span>⭐ STAR ON GITHUB</span>
                  </a>
                </div>
              </div>
            </div>

            {/* RIGHT CARD: SCAN TO DOWNLOAD (QR Code Panel) */}
            <div className="lg:col-span-5 bg-[#16213E] rounded-3xl p-5 sm:p-8 border border-[#B95679]/30 shadow-2xl flex flex-col items-center justify-between text-center space-y-4 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4 w-full flex flex-col items-center">
                {/* QR Icon Circle */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#B95679]/20 border border-[#B95679]/40 flex items-center justify-center text-[#E8B6CB]">
                  <QrCode className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>

                <div>
                  <h3 className="text-lg sm:text-2xl font-bold text-white font-display leading-tight mb-1 sm:mb-2">
                    SCAN TO DOWNLOAD
                  </h3>
                  <p className="text-[11px] sm:text-sm text-white/70 max-w-xs mx-auto leading-relaxed">
                    Point your mobile camera at this QR code to download the official v1.0 release APK directly.
                  </p>
                </div>

                {/* QR Code Graphic Container */}
                <div className="p-3 sm:p-4 bg-white rounded-2xl sm:rounded-3xl shadow-xl border-2 sm:border-4 border-[#B95679]/30 my-1 sm:my-2 inline-block relative group">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(DIRECT_APK_DOWNLOAD_URL)}&color=16213e&bgcolor=ffffff`}
                    alt="Scan QR Code to Download PeriodTracker APK"
                    className="w-36 h-36 sm:w-48 sm:h-48 object-contain rounded-xl"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="text-[9px] sm:text-[10px] text-[#16213E] font-bold mt-1.5 sm:mt-2 tracking-wider flex items-center justify-center gap-1.5">
                    <img src="/ic_launcher-playstore-removebg-preview.png" alt="Logo" className="w-3.5 h-3.5 object-contain" />
                    <span>PeriodTracker v1.0</span>
                  </div>
                </div>
              </div>

              <div className="w-full pt-3 sm:pt-4 border-t border-white/10">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-extrabold text-[#E8B6CB] bg-white/5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/10">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>SUPPORTS ANDROID 7.0+ (OPTIMIZED FOR ANDROID 14)</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* NEW SECTION 5: 📱 APP SPECIFICATIONS & COMPATIBILITY BOX */}
      <section className="py-12 bg-[#1A1A2E] text-white border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="text-[11px] text-[#E8B6CB] uppercase font-extrabold tracking-wider block mb-1">App Build Version</span>
              <span className="text-lg font-bold text-white font-mono">v1.0.0 Release</span>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="text-[11px] text-[#E8B6CB] uppercase font-extrabold tracking-wider block mb-1">Optimized Size</span>
              <span className="text-lg font-bold text-white font-mono">~8.4 MB (ARM64)</span>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="text-[11px] text-[#E8B6CB] uppercase font-extrabold tracking-wider block mb-1">Android Compatibility</span>
              <span className="text-lg font-bold text-emerald-400 font-mono">Android 14 (API 34)</span>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="text-[11px] text-[#E8B6CB] uppercase font-extrabold tracking-wider block mb-1">Storage & Sync</span>
              <span className="text-lg font-bold text-sky-400 font-mono">Local + Cloud Sync</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Features Showcase Grid (6 Cards on White #FFFFFF background) */}
      <section id="features" className="py-12 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <div className="inline-flex items-center gap-2 mb-2 sm:mb-3">
              <span className="text-[#B95679] font-bold text-xs sm:text-sm uppercase tracking-widest">
                All-In-One Menstrual App
              </span>
              {/* Language Switcher Demo indicator */}
              <span className="px-2.5 py-0.5 rounded-full bg-[#B95679]/10 text-[#B95679] text-[10px] font-bold border border-[#B95679]/20">
                Language: {selectedLang.toUpperCase()}
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-display text-[#201A1B] leading-tight mb-2 sm:mb-3">
              App Features Showcase
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-[#201A1B]/60 leading-relaxed px-2">
              Designed with precision for intuitive daily tracking, clinical clarity, and complete user control.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {/* Feature 1 */}
            <div className="p-5 sm:p-8 rounded-3xl bg-[#FFF8F8] border border-[#B95679]/10 hover:shadow-xl hover:-translate-y-1.5 active:scale-[0.98] transition-all duration-300">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#B95679] text-white flex items-center justify-center mb-4 sm:mb-6 shadow-md shadow-[#B95679]/20">
                <Calendar className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#201A1B] mb-2 sm:mb-3 leading-snug">{t.feat1Title}</h3>
              <p className="text-xs sm:text-sm text-[#201A1B]/70 leading-relaxed">
                {t.feat1Desc}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-5 sm:p-8 rounded-3xl bg-[#FFF8F8] border border-[#B95679]/10 hover:shadow-xl hover:-translate-y-1.5 active:scale-[0.98] transition-all duration-300">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#B95679] text-white flex items-center justify-center mb-4 sm:mb-6 shadow-md shadow-[#B95679]/20">
                <Stethoscope className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#201A1B] mb-2 sm:mb-3 leading-snug">{t.feat2Title}</h3>
              <p className="text-xs sm:text-sm text-[#201A1B]/70 leading-relaxed">
                {t.feat2Desc}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-5 sm:p-8 rounded-3xl bg-[#FFF8F8] border border-[#B95679]/10 hover:shadow-xl hover:-translate-y-1.5 active:scale-[0.98] transition-all duration-300">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#B95679] text-white flex items-center justify-center mb-4 sm:mb-6 shadow-md shadow-[#B95679]/20">
                <Heart className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#201A1B] mb-2 sm:mb-3 leading-snug">{t.feat3Title}</h3>
              <p className="text-xs sm:text-sm text-[#201A1B]/70 leading-relaxed">
                {t.feat3Desc}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-5 sm:p-8 rounded-3xl bg-[#FFF8F8] border border-[#B95679]/10 hover:shadow-xl hover:-translate-y-1.5 active:scale-[0.98] transition-all duration-300">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#B95679] text-white flex items-center justify-center mb-4 sm:mb-6 shadow-md shadow-[#B95679]/20">
                <FileSpreadsheet className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#201A1B] mb-2 sm:mb-3 leading-snug">{t.feat4Title}</h3>
              <p className="text-xs sm:text-sm text-[#201A1B]/70 leading-relaxed">
                {t.feat4Desc}
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-5 sm:p-8 rounded-3xl bg-[#FFF8F8] border border-[#B95679]/10 hover:shadow-xl hover:-translate-y-1.5 active:scale-[0.98] transition-all duration-300">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#B95679] text-white flex items-center justify-center mb-4 sm:mb-6 shadow-md shadow-[#B95679]/20">
                <Globe className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#201A1B] mb-2 sm:mb-3 leading-snug">{t.feat5Title}</h3>
              <p className="text-xs sm:text-sm text-[#201A1B]/70 leading-relaxed">
                {t.feat5Desc}
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-5 sm:p-8 rounded-3xl bg-[#FFF8F8] border border-[#B95679]/10 hover:shadow-xl hover:-translate-y-1.5 active:scale-[0.98] transition-all duration-300">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#B95679] text-white flex items-center justify-center mb-4 sm:mb-6 shadow-md shadow-[#B95679]/20">
                <Bell className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#201A1B] mb-2 sm:mb-3 leading-snug">{t.feat6Title}</h3>
              <p className="text-xs sm:text-sm text-[#201A1B]/70 leading-relaxed">
                {t.feat6Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* NEW SECTION 2: 📄 SAMPLE PDF MEDICAL REPORT PREVIEW SECTION */}
      <section id="pdf-report" className="py-12 sm:py-20 bg-[#FFF8F8] border-t border-[#B95679]/10">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <span className="px-3.5 sm:px-4 py-1.5 rounded-full bg-[#B95679]/10 text-[#B95679] border border-[#B95679]/20 text-[11px] sm:text-xs font-bold uppercase tracking-widest inline-flex items-center gap-1.5 mb-2 sm:mb-3 shadow-xs">
              <FileText className="w-3.5 h-3.5" /> Clinical Health Export
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-display text-[#201A1B] leading-tight mb-2 sm:mb-3">
              Doctor-Ready PDF Reports
            </h2>
            <p className="text-xs sm:text-base text-[#201A1B]/70 leading-relaxed px-2">
              Export your complete cycle history and symptom log to show your Gynecologist.
            </p>
          </div>

          {/* PDF Report Interactive Card Preview */}
          <div className="bg-white rounded-3xl p-4 sm:p-8 border-2 border-[#B95679]/20 shadow-2xl relative overflow-hidden">
            {/* Header Mockup */}
            <div className="bg-[#B95679] text-white p-3.5 sm:p-4 rounded-2xl flex justify-between items-center mb-4 sm:mb-6">
              <div>
                <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest opacity-80 block">OFFICIAL CLINICAL EXPORT</span>
                <h3 className="text-sm sm:text-lg font-extrabold font-display leading-tight">CYCLESYNC - HEALTH SUMMARY</h3>
              </div>
              <span className="text-[10px] sm:text-xs bg-white/20 px-2.5 py-1 rounded-full font-mono font-bold">PDF Format</span>
            </div>

            {/* Content Preview */}
            <div className="space-y-3 sm:space-y-4 text-xs text-[#201A1B]/80 font-mono">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 bg-[#FFF8F8] p-3 sm:p-4 rounded-xl border border-gray-200">
                <div>
                  <span className="text-[9px] sm:text-[10px] text-gray-500 block uppercase font-bold">Patient ID</span>
                  <span className="font-bold text-[#201A1B] text-xs">#PT-9042</span>
                </div>
                <div>
                  <span className="text-[9px] sm:text-[10px] text-gray-500 block uppercase font-bold">Avg Cycle Length</span>
                  <span className="font-bold text-[#201A1B] text-xs">28 Days</span>
                </div>
                <div>
                  <span className="text-[9px] sm:text-[10px] text-gray-500 block uppercase font-bold">Export Date</span>
                  <span className="font-bold text-[#201A1B] text-xs">Aug 03, 2026</span>
                </div>
                <div>
                  <span className="text-[9px] sm:text-[10px] text-gray-500 block uppercase font-bold">PCOD Screening</span>
                  <span className="font-bold text-emerald-600 text-xs">Low Risk (3/30)</span>
                </div>
              </div>

              {/* Sample Log Table with Mobile Horizontal Scroll */}
              <div className="border border-gray-200 rounded-xl overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[340px]">
                  <thead className="bg-gray-100 text-[9px] sm:text-[10px] uppercase font-bold text-gray-600">
                    <tr>
                      <th className="p-2 sm:p-2.5">Date</th>
                      <th className="p-2 sm:p-2.5">Cramps</th>
                      <th className="p-2 sm:p-2.5">Acne</th>
                      <th className="p-2 sm:p-2.5">Mood</th>
                      <th className="p-2 sm:p-2.5">Water</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-[10px] sm:text-[11px]">
                    <tr><td className="p-2 sm:p-2.5">Jul 20, 2026</td><td className="p-2 sm:p-2.5">Mild</td><td className="p-2 sm:p-2.5">None</td><td className="p-2 sm:p-2.5">Irritable</td><td className="p-2 sm:p-2.5">2.5 L</td></tr>
                    <tr><td className="p-2 sm:p-2.5">Jul 21, 2026</td><td className="p-2 sm:p-2.5">Moderate</td><td className="p-2 sm:p-2.5">Mild</td><td className="p-2 sm:p-2.5">Fatigued</td><td className="p-2 sm:p-2.5">3.0 L</td></tr>
                    <tr><td className="p-2 sm:p-2.5">Jul 22, 2026</td><td className="p-2 sm:p-2.5">Mild</td><td className="p-2 sm:p-2.5">None</td><td className="p-2 sm:p-2.5">Normal</td><td className="p-2 sm:p-2.5">2.8 L</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[#201A1B]">
                <span className="font-bold block text-[9px] sm:text-[10px] text-amber-800 uppercase">Gynecologist Clinical Remarks</span>
                <p className="text-[10px] sm:text-[11px] font-sans">Patient maintains a regular 28-day cycle. All health data remains 100% private & offline.</p>
              </div>
            </div>

            <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
              <span className="text-[11px] sm:text-xs font-semibold text-gray-500 text-center sm:text-left">
                📄 Built-in PDF Engine powered by Android Native Canvas
              </span>
              <button 
                onClick={generateSamplePDF}
                className="w-full sm:w-auto px-6 py-3 bg-[#B95679] hover:bg-[#9E4566] text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Download Sample PDF Preview 📄</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. 👩💻 VERTICAL DEV LOG TIMELINE SECTION (DARK SECTION #1A1A2E) */}
      <section id="devlog" className="py-12 sm:py-24 bg-[#1A1A2E] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
            
            {/* LEFT PANEL: BADGE & DEVELOPER INFO */}
            <div className="lg:col-span-5 space-y-4 sm:space-y-6 lg:sticky lg:top-28">
              {/* Pill Badge: DEV LOG */}
              <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border border-white/80 bg-white/5 backdrop-blur-md text-white font-extrabold text-xs sm:text-sm tracking-widest uppercase shadow-lg shadow-[#B95679]/20">
                <Terminal className="w-4 h-4 text-[#B95679]" />
                <span>DEV LOG</span>
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-[#E8B6CB]/20 text-[#E8B6CB] border border-[#E8B6CB]/30 text-[10px] sm:text-xs font-bold tracking-wider uppercase mb-2 sm:mb-3">
                  Crafted with passion by Tanvi Yadav
                </span>
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-white leading-tight">
                  Behind the Build
                </h2>
              </div>

              <p className="text-sm sm:text-base lg:text-lg text-white/70 leading-relaxed font-normal">
                Tracking the evolution and updates of CycleSync.
              </p>

              {/* Developer Profile Box */}
              <div className="p-4 sm:p-6 rounded-3xl bg-[#16213E]/90 border border-[#B95679]/30 backdrop-blur-sm space-y-3 sm:space-y-4 shadow-xl">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#B95679] to-[#D87093] text-white flex items-center justify-center text-lg sm:text-xl font-bold shadow-md shadow-[#B95679]/30 shrink-0 font-display">
                    TY
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white font-display">Tanvi Yadav</h3>
                    <p className="text-[11px] sm:text-xs font-semibold text-[#E8B6CB] uppercase tracking-wider">
                      Full-Stack Developer & Solo Creator
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-white/75 leading-relaxed italic border-l-2 border-[#B95679] pl-3 py-0.5">
                  "Built with 100% commitment to data privacy — no cloud servers, no account requirements, and zero advertising analytics."
                </p>

                <div className="pt-1 flex flex-wrap gap-1.5 sm:gap-2">
                  {['Java 17', 'Android SDK 34', 'Room DB', 'Material 3', 'Biometric API'].map((tech, i) => (
                    <span key={i} className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-white/5 text-[#E8B6CB] border border-white/10 text-[10px] sm:text-[11px] font-mono">
                      {tech}
                    </span>
                  ))}
                </div>

                <a 
                  href={GITHUB_REPO_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 sm:py-3 bg-[#B95679]/20 hover:bg-[#B95679]/30 border border-[#B95679]/40 text-white rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 mt-2 active:scale-95"
                >
                  <Code2 className="w-4 h-4 text-[#B95679]" />
                  <span>View GitHub Repository</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white/50" />
                </a>
              </div>
            </div>

            {/* RIGHT COLUMN: VERTICAL CONNECTING LINE WITH STACKED TIMELINE CARDS */}
            <div className="lg:col-span-7 relative pl-5 sm:pl-8">
              {/* Vertical Rose Pink Dotted Connecting Line */}
              <div className="absolute left-1.5 sm:left-3 top-3 bottom-3 w-0.5 border-l-2 border-dashed border-[#B95679]/60"></div>

              <div className="space-y-6 sm:space-y-8">
                {/* CARD 1 (v1.0.1 - 3 Aug 2026) */}
                <div className="relative group">
                  <div className="absolute -left-[22px] sm:-left-[27px] top-6 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#B95679] ring-4 ring-[#1A1A2E] shadow-lg shadow-[#B95679]/50 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-ping"></div>
                  </div>

                  <div className="p-4 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#16213E] border border-[#B95679]/40 hover:border-[#B95679] transition-all duration-300 shadow-xl space-y-3 sm:space-y-4">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#B95679] text-white text-[11px] sm:text-xs font-black tracking-wider uppercase shadow-md shadow-[#B95679]/30">
                        v1.0.0
                      </span>
                      <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/10 text-[#E8B6CB] border border-white/10 text-[11px] sm:text-xs font-bold">
                        1 Sep 2026
                      </span>
                      <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] sm:text-xs font-bold flex items-center gap-1">
                        <Zap className="w-3 h-3" /> LATEST RELEASE
                      </span>
                    </div>

                    <h3 className="text-base sm:text-2xl font-bold text-white font-display leading-snug">
                      Google Cloud Sync, Smart Reminders & Production Release v1.0
                    </h3>

                    <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-normal">
                      Added optional Google Cloud Firestore 2-way backup & multi-device restore, reboot-proof smart reminder engine with AlarmManager & BootReceiver, interactive Calendar Day Details Bottom Sheet, and signed Android 14 APK.
                    </p>

                    {expandedDevCards['v1.0.1'] && (
                      <div className="pt-3 mt-3 sm:pt-4 sm:mt-4 border-t border-white/10 text-xs text-white/70 space-y-2 animate-in fade-in duration-200">
                        <p className="font-semibold text-[#E8B6CB]">Technical Highlights:</p>
                        <ul className="list-disc list-inside space-y-1 text-white/80">
                          <li>Google One-Tap Authentication & Firestore 2-way real-time document synchronization with 100% offline fallback</li>
                          <li>Persistent AlarmManager reminders with <code className="text-[#E8B6CB]">BOOT_COMPLETED</code> BroadcastReceiver for reboot resilience</li>
                          <li>Interactive Day Details BottomSheetDialogFragment calculating real-time cycle phase & pregnancy probability chance</li>
                          <li>Official signed Production APK build optimized for Android 14 (API 34, lightweight ~8.4 MB)</li>
                        </ul>
                      </div>
                    )}

                    <div className="pt-2 flex justify-between items-center">
                      <button 
                        onClick={() => toggleDevCard('v1.0.1')}
                        className="text-xs font-bold text-[#B95679] hover:text-[#E8B6CB] transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        {expandedDevCards['v1.0.1'] ? (
                          <>
                            <Minus className="w-3.5 h-3.5" /> Read Less
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" /> Read More
                          </>
                        )}
                      </button>

                      <a 
                        href={DIRECT_APK_DOWNLOAD_URL}
                        download
                        className="text-xs font-bold text-white/70 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>Download Signed APK (~8.4 MB)</span>
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* CARD 2 (v1.0.0 - 27 Jul 2026) */}
                <div className="relative group">
                  <div className="absolute -left-[22px] sm:-left-[27px] top-6 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#B95679]/80 ring-4 ring-[#1A1A2E] shadow-md flex items-center justify-center">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/80 rounded-full"></div>
                  </div>

                  <div className="p-4 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#16213E] border border-white/10 hover:border-[#B95679]/40 transition-all duration-300 shadow-xl space-y-3 sm:space-y-4">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/15 text-white text-[11px] sm:text-xs font-black tracking-wider uppercase">
                        v1.0.0
                      </span>
                      <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] sm:text-xs font-bold">
                        27 Jul 2026
                      </span>
                      <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] sm:text-xs font-bold">
                        STABLE
                      </span>
                    </div>

                    <h3 className="text-base sm:text-2xl font-bold text-white font-display leading-snug">
                      Room Database & Architecture Overhaul
                    </h3>

                    <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-normal">
                      Migrated SQLite to Room DB (PeriodDao & SymptomDao), added PDF Export, PIN/Biometric Lock, and Localization.
                    </p>

                    {expandedDevCards['v1.0.0'] && (
                      <div className="pt-3 mt-3 sm:pt-4 sm:mt-4 border-t border-white/10 text-xs text-white/70 space-y-2 animate-in fade-in duration-200">
                        <p className="font-semibold text-[#E8B6CB]">Technical Highlights:</p>
                        <ul className="list-disc list-inside space-y-1 text-white/80">
                          <li>Replaced SQLiteOpenHelper with Jetpack Room ORM (<code className="text-[#E8B6CB]">PeriodEntity</code>, <code className="text-[#E8B6CB]">SymptomLogEntity</code>)</li>
                          <li>Integrated BiometricPrompt API for seamless fingerprint/face unlock security</li>
                          <li>Built native Android Canvas PDF generator producing doctor-ready health logs</li>
                          <li>Localized UI resource strings into English, Hindi (हिन्दी), and Marathi (मराठी)</li>
                        </ul>
                      </div>
                    )}

                    <button 
                      onClick={() => toggleDevCard('v1.0.0')}
                      className="text-xs font-bold text-[#B95679] hover:text-[#E8B6CB] transition-colors flex items-center gap-1 cursor-pointer pt-2"
                    >
                      {expandedDevCards['v1.0.0'] ? (
                        <>
                          <Minus className="w-3.5 h-3.5" /> Read Less
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" /> Read More
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* CARD 3 (v0.9.0 - 15 Jul 2026) */}
                <div className="relative group">
                  <div className="absolute -left-[22px] sm:-left-[27px] top-6 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#B95679]/60 ring-4 ring-[#1A1A2E] shadow-md flex items-center justify-center">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/60 rounded-full"></div>
                  </div>

                  <div className="p-4 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#16213E] border border-white/10 hover:border-[#B95679]/40 transition-all duration-300 shadow-xl space-y-3 sm:space-y-4">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/15 text-white text-[11px] sm:text-xs font-black tracking-wider uppercase">
                        v0.9.0
                      </span>
                      <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] sm:text-xs font-bold">
                        15 Jul 2026
                      </span>
                      <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] sm:text-xs font-bold">
                        BETA
                      </span>
                    </div>

                    <h3 className="text-base sm:text-2xl font-bold text-white font-display leading-snug">
                      PCOD/PCOS Self-Assessment Module
                    </h3>

                    <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-normal">
                      Integrated interactive 10-question screening questionnaire with weighted scoring algorithm.
                    </p>

                    {expandedDevCards['v0.9.0'] && (
                      <div className="pt-3 mt-3 sm:pt-4 sm:mt-4 border-t border-white/10 text-xs text-white/70 space-y-2 animate-in fade-in duration-200">
                        <p className="font-semibold text-[#E8B6CB]">Technical Highlights:</p>
                        <ul className="list-disc list-inside space-y-1 text-white/80">
                          <li>Evaluates clinical indicators: cycle length variation (&gt;35 days), acne, hirsutism, and weight fluctuations</li>
                          <li>Weighted formula categorizes results into Low (0-8), Moderate (9-16), or High (17+) risk levels</li>
                          <li>Provides actionable lifestyle recommendations and medical advice guides</li>
                        </ul>
                      </div>
                    )}

                    <button 
                      onClick={() => toggleDevCard('v0.9.0')}
                      className="text-xs font-bold text-[#B95679] hover:text-[#E8B6CB] transition-colors flex items-center gap-1 cursor-pointer pt-2"
                    >
                      {expandedDevCards['v0.9.0'] ? (
                        <>
                          <Minus className="w-3.5 h-3.5" /> Read Less
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" /> Read More
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* CARD 4 (v0.1.0 - 01 Jul 2026) */}
                <div className="relative group">
                  <div className="absolute -left-[22px] sm:-left-[27px] top-6 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#B95679]/40 ring-4 ring-[#1A1A2E] shadow-md flex items-center justify-center">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/40 rounded-full"></div>
                  </div>

                  <div className="p-4 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#16213E] border border-white/10 hover:border-[#B95679]/40 transition-all duration-300 shadow-xl space-y-3 sm:space-y-4">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/15 text-white text-[11px] sm:text-xs font-black tracking-wider uppercase">
                        v0.1.0
                      </span>
                      <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] sm:text-xs font-bold">
                        01 Jul 2026
                      </span>
                      <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] sm:text-xs font-bold">
                        INITIAL RELEASE
                      </span>
                    </div>

                    <h3 className="text-base sm:text-2xl font-bold text-white font-display leading-snug">
                      Initial Android Repository Launch
                    </h3>

                    <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-normal">
                      Base Android SDK build with SQLite local database schema, Material 3 UI components, and calendar grid.
                    </p>

                    {expandedDevCards['v0.1.0'] && (
                      <div className="pt-3 mt-3 sm:pt-4 sm:mt-4 border-t border-white/10 text-xs text-white/70 space-y-2 animate-in fade-in duration-200">
                        <p className="font-semibold text-[#E8B6CB]">Technical Highlights:</p>
                        <ul className="list-disc list-inside space-y-1 text-white/80">
                          <li>Configured Android Studio Gradle project with Java 17 and SDK 34 compile targets</li>
                          <li>Designed initial custom calendar grid component with period highlights</li>
                          <li>Setup offline-first SQLite database architecture</li>
                        </ul>
                      </div>
                    )}

                    <button 
                      onClick={() => toggleDevCard('v0.1.0')}
                      className="text-xs font-bold text-[#B95679] hover:text-[#E8B6CB] transition-colors flex items-center gap-1 cursor-pointer pt-2"
                    >
                      {expandedDevCards['v0.1.0'] ? (
                        <>
                          <Minus className="w-3.5 h-3.5" /> Read Less
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" /> Read More
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Planned Features Section */}
      <section id="planned-features" className="py-12 sm:py-24 bg-gradient-to-b from-[#FFF8F8] via-white to-[#FFF0F3] border-t border-[#B95679]/15 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#B95679]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-3 sm:space-y-4 px-2 sm:px-0">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#B95679]/10 text-[#B95679] border border-[#B95679]/20 text-[11px] sm:text-xs font-bold uppercase tracking-widest">
              <Rocket className="w-3.5 h-3.5" /> Product Roadmap
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-display text-[#201A1B] tracking-tight leading-tight">
              Planned Features & What's Next
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-[#201A1B]/75 leading-relaxed font-sans">
              Discover upcoming enhancements designed to elevate your cycle tracking, privacy protections, and health insights without compromising on zero-cloud security.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {[
              {
                title: "Partner Sync & Offline Sharing",
                category: "Privacy & Sharing",
                description: "Share encrypted cycle summaries or fertile window alerts with your partner using secure, offline QR code scanning or encrypted local file exports.",
                status: "In Progress",
                statusType: "in-progress",
                target: "Target: v1.3 Update",
                icon: Heart
              },
              {
                title: "On-Device AI Pattern Insights",
                category: "Smart Analytics",
                description: "On-device machine learning models to detect irregular cycle patterns, luteal phase length variations, and symptom triggers with 100% local processing.",
                status: "In Progress",
                statusType: "in-progress",
                target: "Target: v1.3 Update",
                icon: Sparkles
              },
              {
                title: "Smart Medication & Hydration Alarms",
                category: "Daily Health",
                description: "Customizable local system notifications for contraceptive pills, iron supplements, pain relief timing, and hydration logs during heavy flow days.",
                status: "Coming Soon",
                statusType: "coming-soon",
                target: "Target: v1.4 Release",
                icon: Bell
              },
              {
                title: "Custom Doctor PDF Report Builder",
                category: "Clinical Reports",
                description: "Select custom date ranges, filter specific symptoms or notes, and include blood pressure or weight trend graphs for OB/GYN consultations.",
                status: "Coming Soon",
                statusType: "coming-soon",
                target: "Target: v1.4 Release",
                icon: FileText
              },
              {
                title: "Multi-Language Regional Support",
                category: "Global Access",
                description: "Full localization in Hindi, Marathi, Tamil, Spanish, French, and Portuguese to ensure menstrual health tracking is accessible globally without language barriers.",
                status: "Under Review",
                statusType: "planned",
                target: "Community Wishlist",
                icon: Languages
              },
              {
                title: "Smartwatch & Home Screen Widgets",
                category: "Quick Access",
                description: "Quick-glance Android home screen widgets and Wear OS companion app for 1-tap period phase viewing and rapid symptom logging on the go.",
                status: "Under Review",
                statusType: "planned",
                target: "Community Wishlist",
                icon: Smartphone
              }
            ].map((feature, idx) => {
              const IconComp = feature.icon;

              return (
                <div 
                  key={idx}
                  className="bg-white rounded-3xl p-7 border border-[#B95679]/15 shadow-sm hover:shadow-xl hover:border-[#B95679]/35 transition-all duration-300 relative flex flex-col justify-between group overflow-hidden"
                >
                  {/* Subtle top hover line */}
                  <div className="h-1.5 w-full bg-gradient-to-r from-[#B95679] to-[#9E4566] opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute top-0 left-0 right-0"></div>

                  <div className="space-y-4">
                    {/* Top Row: Icon + Status Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="p-3 rounded-2xl bg-[#FFF0F3] text-[#B95679] border border-[#B95679]/20 group-hover:bg-[#B95679] group-hover:text-white transition-colors duration-300">
                        <IconComp className="w-5 h-5" />
                      </div>

                      {/* Status Badge */}
                      {feature.statusType === 'in-progress' && (
                        <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 border border-amber-500/30 text-xs font-extrabold flex items-center gap-1.5 shadow-xs">
                          <span className="relative flex h-2 w-2 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                          </span>
                          {feature.status}
                        </span>
                      )}

                      {feature.statusType === 'coming-soon' && (
                        <span className="px-3 py-1 rounded-full bg-[#B95679]/10 text-[#B95679] border border-[#B95679]/30 text-xs font-extrabold flex items-center gap-1.5 shadow-xs">
                          <Clock className="w-3 h-3 text-[#B95679]" />
                          {feature.status}
                        </span>
                      )}

                      {feature.statusType === 'planned' && (
                        <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-700 border border-purple-500/30 text-xs font-extrabold flex items-center gap-1.5 shadow-xs">
                          <Rocket className="w-3 h-3 text-purple-600" />
                          {feature.status}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#B95679] block mb-1">
                        {feature.category}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold font-display text-[#201A1B] group-hover:text-[#B95679] transition-colors">
                        {feature.title}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm text-[#201A1B]/75 leading-relaxed font-sans">
                      {feature.description}
                    </p>
                  </div>

                  {/* Footer Tag */}
                  <div className="pt-5 mt-5 border-t border-gray-100 flex items-center justify-between text-xs text-[#201A1B]/60 font-semibold">
                    <span className="flex items-center gap-1 text-[#B95679] font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      {feature.target}
                    </span>
                    <span className="text-[11px] text-gray-400">Zero Cloud Needed</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Suggest Idea Callout */}
          <div className="mt-14 text-center bg-white rounded-2xl p-6 border border-[#B95679]/20 shadow-sm max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left space-y-1">
              <h4 className="text-sm font-bold text-[#201A1B]">Have a feature request or feedback?</h4>
              <p className="text-xs text-[#201A1B]/70">Suggest new ideas directly to Tanvi Yadav on GitHub.</p>
            </div>
            <a
              href="#issues"
              className="px-5 py-2.5 bg-[#B95679] hover:bg-[#a04665] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 shrink-0"
            >
              <Bug className="w-4 h-4" />
              <span>Suggest Feature 💡</span>
            </a>
          </div>
        </div>
      </section>

      {/* 7. Frequently Asked Questions (FAQ Accordion) */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#B95679] font-bold text-xs sm:text-sm uppercase tracking-widest block mb-3">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-[#201A1B] leading-tight mb-3">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-2xl border border-[#B95679]/15 bg-[#FFF8F8] overflow-hidden transition-all duration-200"
                >
                  <button 
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-6 text-left flex justify-between items-center gap-4 focus:outline-none cursor-pointer"
                  >
                    <span className="font-bold text-base sm:text-lg text-[#201A1B] leading-snug">
                      {faq.q}
                    </span>
                    <div className={`w-8 h-8 rounded-full bg-[#B95679]/10 text-[#B95679] flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[#B95679] text-white' : ''}`}>
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-[#201A1B]/75 leading-relaxed border-t border-[#B95679]/10 pt-4 animate-in fade-in duration-200 font-sans">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Special Message from Creator */}
      <section id="team-note" className="py-16 sm:py-24 bg-gradient-to-br from-[#FFF0F3] via-[#FFF8F8] to-[#FCE7F0] border-t border-[#B95679]/20 relative overflow-hidden">
        {/* Decorative background blurs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-[#B95679]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-[#E8B6CB]/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white rounded-3xl p-6 sm:p-12 shadow-2xl border border-[#B95679]/25 relative">
            <div className="absolute top-6 right-8 text-[#B95679]/15 pointer-events-none hidden sm:block">
              <Quote className="w-24 h-24" />
            </div>

            {/* Badge Header */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B95679]/10 text-[#B95679] border border-[#B95679]/20 text-xs font-extrabold uppercase tracking-widest mb-6 shadow-xs">
              <Heart className="w-4 h-4 fill-[#B95679]" /> Message from Creator
            </div>

            {/* Dynamic Multi-Lingual Heading */}
            <h3 className="text-2xl sm:text-4xl font-extrabold font-display text-[#201A1B] leading-tight mb-6">
              {selectedLang === 'mr' && "तन्वी यादव कडून आमच्या युजर्ससाठी खास संदेश 🌸"}
              {selectedLang === 'hi' && "तन्वी यादव की ओर से सभी उपयोगकर्ताओं के लिए विशेष संदेश 🌸"}
              {selectedLang === 'en' && "A Personal Message from Creator Tanvi Yadav 🌸"}
            </h3>

            {/* Dynamic Message Body */}
            {selectedLang === 'mr' ? (
              <div className="space-y-4 text-sm sm:text-base text-[#201A1B]/85 leading-relaxed font-sans">
                <p className="font-bold text-[#B95679] text-base sm:text-lg">
                  प्रिय CycleSync परिवारास सप्रेम नमस्कार,
                </p>
                <p>
                  मी — <strong>तन्वी यादव</strong> (Full-Stack Developer & Creator) — हे ॲप एकाच मुख्य प्रेरणेतून तयार केले: <strong>महिलांचे आरोग्य, प्रतिष्ठा आणि वैयक्तिक गोपनीयतेचे (100% Privacy) सर्वोच्च रक्षण करणे.</strong>
                </p>
                <p>
                  मासिक पाळी, ओव्ह्युलेशन सायकल आणि PCOD सारख्या लक्षणांची नोंद ही प्रत्येक महिलेसाठी अतिशय खाजगी आणि संवेदनशील बाब आहे. यासाठी कोणत्याही युजरला तिचा वैयक्तिक आरोग्य डेटा क्लाऊड सर्व्हर्सवर विकावा किंवा जाहिरात कंपन्यांशी शेअर करावा लागू नये, यावर माझा ठाम विश्वास आहे.
                </p>
                <p>
                  म्हणूनच <strong>CycleSync</strong> हे पूर्णपणे <strong>100% Offline</strong> आर्किटेक्चरवर डिझाइन केले आहे. तुमचा सर्व डेटा फक्त आणि फक्त तुमच्या फोनच्या स्थानिक SQLite/Room डेटाबेसमध्ये सुरक्षित राहतो. यात <strong>कोणतेही क्लाऊड ट्रॅकिंग नाही, कोणतीही जाहिरात नाही, आणि अकाउंट बनवण्याची सक्ती नाही.</strong>
                </p>
                <p className="font-medium text-[#201A1B]">
                  आमच्यावर दाखवलेल्या विश्वासाबद्दल धन्यवाद! मी सतत CycleSync मध्ये अधिक प्रगत, सुरक्षित आणि उपयुक्त आरोग्य फीचर्स आणत राहीन. 🌸
                </p>
              </div>
            ) : selectedLang === 'hi' ? (
              <div className="space-y-4 text-sm sm:text-base text-[#201A1B]/85 leading-relaxed font-sans">
                <p className="font-bold text-[#B95679] text-base sm:text-lg">
                  प्रिय CycleSync समुदाय,
                </p>
                <p>
                  मैंने — <strong>तन्वी यादव</strong> (Full-Stack Developer & Creator) — इस ऐप का निर्माण महिलाओं के स्वास्थ्य, सम्मान और १००% गोपनीयता के संरक्षण हेतु किया है।
                </p>
                <p>
                  मासिक धर्म और स्वास्थ्य की जानकारी अत्यंत व्यक्तिगत होती है। मेरा दृढ़ विश्वास है कि पीरियड्स व PCOD ट्रैकिंग के लिए किसी को भी अपना डेटा किसी क्लाउड या विज्ञापन कंपनियों को साझा नहीं करना चाहिए।
                </p>
                <p>
                  इसीलिए <strong>CycleSync</strong> पूर्णतः <strong>100% Offline</strong> काम करता है। आपका डेटा केवल आपके फोन के सुरक्षित SQLite/Room स्टोरेज में रहता है — <strong>शून्य क्लाउड डेटा, शून्य विज्ञापन, और शून्य ट्रैकिंग!</strong>
                </p>
                <p className="font-medium text-[#201A1B]">
                  CycleSync पर अपना विश्वास बनाए रखने के लिए धन्यवाद। मैं इसे निरंतर बेहतर बनाने के लिए समर्पित हूँ। 🌸
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-sm sm:text-base text-[#201A1B]/85 leading-relaxed font-sans">
                <p className="font-bold text-[#B95679] text-base sm:text-lg">
                  Dear CycleSync Community,
                </p>
                <p>
                  I — <strong>Tanvi Yadav</strong> (Full-Stack Developer & Creator) — built <strong>CycleSync</strong> with a strong and uncompromising commitment to women's health, bodily dignity, and absolute privacy. Menstrual cycles, symptom logs, and PCOD screenings are deeply intimate — and I strongly believe that no user should ever have to trade their data privacy or be monetized by ad networks just to track their reproductive health.
                </p>
                <p>
                  That is why CycleSync is engineered to be <strong>100% offline</strong> with local SQLite/Room database storage directly on your Android device. <strong>Zero cloud servers, zero data harvesting, zero targeted advertising, and zero mandatory signups.</strong>
                </p>
                <p>
                  Whether you are predicting upcoming cycles, assessing clinical indicators, or generating a doctor-ready PDF summary for your Gynecologist, CycleSync puts complete ownership back in your hands.
                </p>
                <p className="font-medium text-[#201A1B]">
                  Thank you for putting your trust in CycleSync. I am continuously improving this platform to empower your everyday health journey. 🌸
                </p>
              </div>
            )}

            {/* 4 Core Vision Pillars */}
            <div className="mt-8 pt-6 border-t border-[#B95679]/15 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-3 bg-[#FFF8F8] rounded-2xl border border-[#B95679]/15 text-center">
                <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <span className="text-xs font-bold text-[#201A1B] block">100% Offline</span>
                <span className="text-[10px] text-gray-500 block">Local SQLite Only</span>
              </div>

              <div className="p-3 bg-[#FFF8F8] rounded-2xl border border-[#B95679]/15 text-center">
                <Sparkles className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                <span className="text-xs font-bold text-[#201A1B] block">Zero Ads</span>
                <span className="text-[10px] text-gray-500 block">No Data Monetization</span>
              </div>

              <div className="p-3 bg-[#FFF8F8] rounded-2xl border border-[#B95679]/15 text-center">
                <Stethoscope className="w-5 h-5 text-[#B95679] mx-auto mb-1" />
                <span className="text-xs font-bold text-[#201A1B] block">Clinical Clarity</span>
                <span className="text-[10px] text-gray-500 block">Doctor-Ready Reports</span>
              </div>

              <div className="p-3 bg-[#FFF8F8] rounded-2xl border border-[#B95679]/15 text-center">
                <Lock className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <span className="text-xs font-bold text-[#201A1B] block">PIN & Biometric</span>
                <span className="text-[10px] text-gray-500 block">Device-Level Lock</span>
              </div>
            </div>

            {/* Creator Profile Card */}
            <div className="mt-8 pt-6 border-t border-[#B95679]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-3.5 bg-[#FFF8F8] px-5 py-3 rounded-2xl border border-[#B95679]/20 shadow-xs">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#B95679] to-[#D87093] flex items-center justify-center text-white font-bold font-display text-base shadow-xs shrink-0">
                  TY
                </div>
                <div>
                  <h4 className="font-extrabold text-[#201A1B] text-sm sm:text-base">Tanvi Yadav</h4>
                  <p className="text-xs text-[#B95679] font-bold">Full-Stack Developer & Solo Project Creator</p>
                  <p className="text-[10px] text-gray-500">UI/UX Architecture • Android Core • Database Security</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={GITHUB_REPO_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs bg-white hover:bg-gray-50 text-[#16213E] px-4 py-2.5 rounded-full font-bold border border-gray-300 shadow-xs flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub Repository</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Report Issue & Submit Feedback Section */}
      <section id="issues" className="py-20 bg-gradient-to-br from-[#16213E] via-[#1A1A2E] to-[#201A1B] text-white relative overflow-hidden border-t border-[#B95679]/20">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-[#B95679]/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-[#E8B6CB]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B95679]/20 text-[#E8B6CB] border border-[#B95679]/30 text-xs font-bold uppercase tracking-widest mb-3">
              <Bug className="w-4 h-4 text-[#B95679]" /> GitHub Issue & Feedback Hub
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight leading-tight mb-3">
              Report an Issue or Request a Feature
            </h2>

            <p className="text-sm sm:text-base text-white/75 max-w-2xl mx-auto leading-relaxed">
              Found a bug, have a suggestion, or need a new health tracking capability? Submit your report directly to the official GitHub repository at <strong className="text-[#E8B6CB]">ITSTANVI28/PeriodTracker</strong>.
            </p>
          </div>

          {issueSubmitted ? (
            <div className="bg-[#16213E]/90 border border-emerald-500/40 p-6 sm:p-8 rounded-3xl max-w-2xl mx-auto text-center space-y-6 animate-in fade-in zoom-in-95 duration-300 shadow-2xl backdrop-blur-sm">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-3xl font-bold shadow-md">
                ✓
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold text-white font-display">
                  Issue Form Prepared & Redirected to GitHub!
                </h3>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-lg mx-auto">
                  Your issue details have been formatted for repository <strong className="text-[#E8B6CB]">ITSTANVI28/PeriodTracker</strong>. If your browser blocked the new tab, click the button below to submit on GitHub.
                </p>
              </div>

              {/* Formatted Markdown Issue Summary Card */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left space-y-3 text-xs font-sans">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="font-mono text-[#E8B6CB] font-bold flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-[#B95679]" /> Formatted GitHub Issue Draft
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#B95679]/30 text-[#E8B6CB] border border-[#B95679]/40 text-[10px] font-bold uppercase tracking-wider">
                    {issueType}
                  </span>
                </div>

                <div className="space-y-1.5 text-white/90">
                  <p><strong className="text-white">Title:</strong> <span className="font-semibold text-emerald-300">[{issueType.toUpperCase()}] {issueTitle}</span></p>
                  <p><strong className="text-white">Description:</strong> {issueDescription}</p>
                  {issueSteps && <p><strong className="text-white">Steps:</strong> {issueSteps}</p>}
                  <p><strong className="text-white">Target Repository:</strong> <span className="font-mono text-xs text-[#E8B6CB]">https://github.com/ITSTANVI28/PeriodTracker</span></p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a 
                  href={lastSubmittedIssueUrl || GITHUB_ISSUES_URL} 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-6 py-3 bg-[#B95679] hover:bg-[#a04665] text-white font-bold text-xs rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" /> Open Issue Creation Page on GitHub
                </a>

                <a 
                  href={GITHUB_ISSUES_URL} 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer border border-white/15"
                >
                  <Github className="w-4 h-4" /> View All Repository Issues
                </a>

                <button 
                  onClick={() => {
                    setIssueSubmitted(false);
                    setIssueTitle('');
                    setIssueDescription('');
                    setIssueSteps('');
                  }}
                  className="px-4 py-3 text-xs text-[#E8B6CB] hover:underline font-bold cursor-pointer"
                >
                  Submit Another Issue
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleIssueSubmit} className="bg-white/5 border border-white/15 rounded-3xl p-4 sm:p-8 backdrop-blur-md space-y-4 sm:space-y-6 shadow-2xl">
              
              {/* Category selector radio pills */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#E8B6CB] block">
                  Select Issue Type / Category:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5">
                  {[
                    { id: 'bug', label: '🐛 Bug Report', icon: Bug, desc: 'Fix broken feature', span: '' },
                    { id: 'feature', label: '💡 Feature Idea', icon: Sparkles, desc: 'Suggest new idea', span: '' },
                    { id: 'health', label: '🏥 Health Tracker', icon: Stethoscope, desc: 'PCOD or prediction', span: '' },
                    { id: 'ui', label: '🎨 UI / UX', icon: Palette, desc: 'Design & layout', span: '' },
                    { id: 'privacy', label: '🔒 Privacy / DB', icon: ShieldCheck, desc: 'SQLite & Security', span: 'col-span-2 sm:col-span-1' },
                  ].map((cat) => {
                    const isSelected = issueType === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setIssueType(cat.id as any)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between active:scale-[0.98] ${cat.span} ${
                          isSelected
                            ? 'bg-[#B95679] border-[#B95679] text-white shadow-lg shadow-[#B95679]/30 scale-[1.02]'
                            : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span className="font-bold text-xs block">{cat.label}</span>
                        <span className="text-[10px] opacity-75 block mt-0.5">{cat.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#E8B6CB] block">
                  Issue Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={issueTitle}
                  onChange={(e) => {
                    setIssueTitle(e.target.value);
                    if (issueError) setIssueError('');
                  }}
                  placeholder="e.g., PCOD diagnostic risk score calculation error or Add dark theme"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-base sm:text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#B95679] focus:border-transparent transition-all"
                />
              </div>

              {/* Description Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#E8B6CB] block">
                  Issue Description & Details <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={4}
                  value={issueDescription}
                  onChange={(e) => {
                    setIssueDescription(e.target.value);
                    if (issueError) setIssueError('');
                  }}
                  placeholder="Describe what happened or what feature you would like added to CycleSync..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-base sm:text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#B95679] focus:border-transparent transition-all resize-y"
                />
              </div>

              {/* Steps to Reproduce */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#E8B6CB] block">
                  Steps to Reproduce / Expected Behavior (Optional)
                </label>
                <input
                  type="text"
                  value={issueSteps}
                  onChange={(e) => setIssueSteps(e.target.value)}
                  placeholder="1. Open PCOD quiz  2. Select 5 questions  3. Click Calculate..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-base sm:text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#B95679] focus:border-transparent transition-all"
                />
              </div>

              {/* Contact Email / Name Optional */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#E8B6CB] block">
                  Your Name or Email (Optional)
                </label>
                <input
                  type="text"
                  value={reporterContact}
                  onChange={(e) => setReporterContact(e.target.value)}
                  placeholder="e.g., Tanvi Yadav or tanvi@example.com"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-base sm:text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#B95679] focus:border-transparent transition-all"
                />
              </div>

              {/* Error Alert */}
              {issueError && (
                <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs text-rose-200 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{issueError}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full px-6 py-3.5 bg-gradient-to-r from-[#B95679] to-[#9E4566] hover:from-[#a04665] hover:to-[#883a54] text-white font-bold text-sm rounded-2xl transition-all shadow-xl shadow-[#B95679]/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Issue to GitHub Repository 🚀</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </section>


      {/* Floating Success Toast Notification */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-[#16213E]/95 text-white border border-[#B95679]/40 rounded-2xl p-4 shadow-2xl shadow-[#B95679]/20 backdrop-blur-md flex items-start gap-3.5 animate-in fade-in slide-in-from-bottom-5 duration-300 relative overflow-hidden">
          <div className="p-2.5 bg-[#B95679]/20 text-[#E8B6CB] rounded-xl shrink-0 border border-[#B95679]/30">
            <CheckCircle2 className="w-5 h-5 text-[#E8B6CB]" />
          </div>
          <div className="flex-1 space-y-1 pr-2 pb-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white font-display">Report Received!</h4>
              <span className="text-[10px] bg-[#B95679]/30 text-[#E8B6CB] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-[#B95679]/40">
                Success
              </span>
            </div>
            <p className="text-xs text-white/80 leading-relaxed">
              {toastMessage || 'Your issue report was successfully received and prepared for GitHub.'}
            </p>
          </div>
          <button
            onClick={() => setShowSuccessToast(false)}
            className="p-1 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors cursor-pointer"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Animated Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#B95679]/20">
            <div className="h-full bg-gradient-to-r from-[#B95679] to-[#E8B6CB] animate-progress-shrink" />
          </div>
        </div>
      )}

      {/* 100% Private Local-Only Data Storage Policy Modal */}
      {privacyModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setPrivacyModalOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#B95679]/20 overflow-hidden relative flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 sm:p-8 bg-gradient-to-r from-[#16213E] via-[#1A1A2E] to-[#201A1B] text-white relative">
              <button
                onClick={() => setPrivacyModalOpen(false)}
                className="absolute top-5 right-5 p-2 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white rounded-xl transition-all cursor-pointer"
                aria-label="Close privacy policy modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5 mb-2">
                <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-[#E8B6CB] font-display">
                  Zero-Cloud Architecture
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                100% Private & Local-Only Data Guarantee
              </h3>
              <p className="text-xs sm:text-sm text-white/75 mt-1.5 leading-relaxed">
                CycleSync is engineered from the ground up to protect intimate health data without reliance on external cloud servers or remote databases.
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-[#201A1B] text-sm leading-relaxed">
              {/* Core Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#FFF8F8] border border-[#B95679]/15 space-y-1.5">
                  <div className="flex items-center gap-2 text-[#B95679] font-bold">
                    <Lock className="w-4 h-4 shrink-0" />
                    <span>Local SQLite Database</span>
                  </div>
                  <p className="text-xs text-[#201A1B]/75 leading-relaxed">
                    All period dates, symptom entries, flow intensity, and notes are saved strictly on your phone's storage in a local SQLite database.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFF8F8] border border-[#B95679]/15 space-y-1.5">
                  <div className="flex items-center gap-2 text-[#B95679] font-bold">
                    <WifiOff className="w-4 h-4 shrink-0" />
                    <span>Zero Cloud Transmission</span>
                  </div>
                  <p className="text-xs text-[#201A1B]/75 leading-relaxed">
                    CycleSync does not send telemetry, user identifiers, or cycle logs to external cloud endpoints or remote API servers.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFF8F8] border border-[#B95679]/15 space-y-1.5">
                  <div className="flex items-center gap-2 text-[#B95679] font-bold">
                    <UserCheck className="w-4 h-4 shrink-0" />
                    <span>No Accounts Required</span>
                  </div>
                  <p className="text-xs text-[#201A1B]/75 leading-relaxed">
                    No registration, email logins, passwords, or phone numbers needed. Simply launch the app and track immediately.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFF8F8] border border-[#B95679]/15 space-y-1.5">
                  <div className="flex items-center gap-2 text-[#B95679] font-bold">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>On-Device Algorithms</span>
                  </div>
                  <p className="text-xs text-[#201A1B]/75 leading-relaxed">
                    Cycle predictions, fertile window estimates, PCOD symptom evaluations, and PDF doctor reports calculate entirely on your device.
                  </p>
                </div>
              </div>

              {/* Security Comparison Table */}
              <div className="border-t border-[#B95679]/15 pt-5 space-y-3">
                <h4 className="font-bold text-base text-[#201A1B] flex items-center gap-2 font-display">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Privacy Protection Comparison</span>
                </h4>

                <div className="rounded-2xl border border-gray-200 overflow-hidden text-xs">
                  <div className="grid grid-cols-2 bg-gray-100 p-3 font-bold text-gray-700 border-b border-gray-200">
                    <span>Traditional Cloud Trackers</span>
                    <span className="text-[#B95679]">CycleSync (Offline App)</span>
                  </div>
                  <div className="grid grid-cols-2 p-3 border-b border-gray-100 text-gray-600">
                    <span>Remote Cloud Servers</span>
                    <span className="font-semibold text-emerald-700">100% Local Phone Storage</span>
                  </div>
                  <div className="grid grid-cols-2 p-3 border-b border-gray-100 text-gray-600">
                    <span>Third-party tracking & ad SDKs</span>
                    <span className="font-semibold text-emerald-700">Zero Tracker / Ad SDKs</span>
                  </div>
                  <div className="grid grid-cols-2 p-3 text-gray-600">
                    <span>Risk of remote data breaches</span>
                    <span className="font-semibold text-emerald-700">Remote leaks impossible</span>
                  </div>
                </div>
              </div>

              {/* Developer Team Pledge */}
              <div className="p-4 rounded-2xl bg-[#16213E]/5 border border-[#16213E]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <p className="font-bold text-[#201A1B]">Verified Local Privacy Architecture</p>
                  <p className="text-[#201A1B]/70">Designed & Engineered with 100% Privacy by Tanvi Yadav (Full-Stack Developer)</p>
                </div>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 rounded-full font-bold whitespace-nowrap">
                  100% Verified Offline
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-3">
              <span className="text-xs text-gray-500 hidden sm:inline">
                Your data never leaves your device.
              </span>
              <button
                onClick={() => setPrivacyModalOpen(false)}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#B95679] hover:bg-[#a04665] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md cursor-pointer"
              >
                Got it, Privacy Secured! 👍
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Quick Actions Button & Menu */}
      <div className="fixed bottom-3 left-3 sm:bottom-6 sm:left-6 z-40 max-w-[calc(100vw-1.5rem)]">
        {/* Expanded Quick Actions Menu */}
        {quickActionsOpen && (
          <div className="absolute bottom-full left-0 mb-2.5 w-64 sm:w-72 max-w-[calc(100vw-2rem)] bg-[#16213E]/95 text-white border border-[#B95679]/40 rounded-2xl shadow-2xl p-2.5 sm:p-3 backdrop-blur-md space-y-1.5 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-center justify-between pb-2 mb-1 border-b border-white/10 px-2 pt-1">
              <div className="flex items-center gap-1.5 font-bold text-xs font-display text-[#E8B6CB]">
                <Zap className="w-3.5 h-3.5 text-[#B95679] fill-[#B95679]" />
                <span>Quick Actions</span>
              </div>
              <button 
                onClick={() => setQuickActionsOpen(false)}
                className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close Quick Actions menu"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Menu Item 1: Download APK */}
            <a
              href={DIRECT_APK_DOWNLOAD_URL}
              download
              onClick={() => setQuickActionsOpen(false)}
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 hover:bg-[#B95679]/20 border border-white/5 hover:border-[#B95679]/40 transition-all text-xs group cursor-pointer active:scale-95"
            >
              <div className="p-2 rounded-lg bg-[#B95679]/20 text-[#E8B6CB] group-hover:bg-[#B95679] group-hover:text-white transition-colors">
                <Download className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-white group-hover:text-[#E8B6CB] transition-colors">Download APK</div>
                <div className="text-[10px] text-white/60">Direct Android v1.0.1</div>
              </div>
            </a>

            {/* Menu Item 2: Report Issue */}
            <a
              href="#issues"
              onClick={() => setQuickActionsOpen(false)}
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 hover:bg-[#B95679]/20 border border-white/5 hover:border-[#B95679]/40 transition-all text-xs group cursor-pointer active:scale-95"
            >
              <div className="p-2 rounded-lg bg-[#B95679]/20 text-[#E8B6CB] group-hover:bg-[#B95679] group-hover:text-white transition-colors">
                <Bug className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-white group-hover:text-[#E8B6CB] transition-colors">Report Issue</div>
                <div className="text-[10px] text-white/60">GitHub Feedback Hub</div>
              </div>
            </a>

            {/* Menu Item 3: View Privacy Policy */}
            <button
              onClick={() => {
                setPrivacyModalOpen(true);
                setQuickActionsOpen(false);
              }}
              className="w-full text-left flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 hover:bg-[#B95679]/20 border border-white/5 hover:border-[#B95679]/40 transition-all text-xs group cursor-pointer active:scale-95"
            >
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <ShieldCheck className="w-4 h-4 text-emerald-400 group-hover:text-white" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-white group-hover:text-[#E8B6CB] transition-colors">Privacy Policy</div>
                <div className="text-[10px] text-white/60">100% Offline SQLite</div>
              </div>
            </button>

            {/* Menu Item 4: Interactive Guide */}
            <button
              onClick={() => {
                setGuideModalOpen(true);
                setQuickActionsOpen(false);
              }}
              className="w-full text-left flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 hover:bg-[#B95679]/20 border border-white/5 hover:border-[#B95679]/40 transition-all text-xs group cursor-pointer active:scale-95"
            >
              <div className="p-2 rounded-lg bg-[#B95679]/20 text-[#E8B6CB] group-hover:bg-[#B95679] group-hover:text-white transition-colors">
                <Sparkles className="w-4 h-4 text-[#E8B6CB] group-hover:text-white fill-[#E8B6CB]/20" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-white group-hover:text-[#E8B6CB] transition-colors">Interactive Guide</div>
                <div className="text-[10px] text-white/60">4-Step Onboarding Tour</div>
              </div>
            </button>
          </div>
        )}

        {/* Sticky Trigger Button */}
        <button
          onClick={() => setQuickActionsOpen(!quickActionsOpen)}
          className="px-3.5 py-2.5 sm:px-4 sm:py-3 bg-[#16213E] hover:bg-[#1f2d52] text-white font-bold text-xs sm:text-sm rounded-2xl border border-[#B95679]/40 shadow-2xl shadow-[#B95679]/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md group"
          aria-expanded={quickActionsOpen}
          aria-label="Toggle Quick Actions menu"
        >
          <span className="p-1 sm:p-1.5 rounded-xl bg-[#B95679]/20 text-[#E8B6CB] group-hover:bg-[#B95679] group-hover:text-white transition-colors">
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E8B6CB] group-hover:text-white fill-[#E8B6CB]/30" />
          </span>
          <span className="font-display tracking-wide text-xs sm:text-sm">Quick Menu</span>
          <ChevronUp className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E8B6CB] transition-transform duration-200 ${quickActionsOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* 8. Footer */}
      <footer className="bg-[#1A1A2E] text-white border-t border-white/10 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
            {/* Left */}
            <div className="space-y-1.5 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <img 
                  src="/ic_launcher-playstore-removebg-preview.png" 
                  alt="CycleSync Logo" 
                  className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-sm" 
                />
                <span className="text-base sm:text-lg font-bold font-display text-white">CycleSync</span>
              </div>
              <p className="text-[11px] sm:text-xs text-white/60">
                Designed & Developed with 🌸 by <span className="text-[#E8B6CB] font-semibold">Tanvi Yadav</span> (Full-Stack Developer)
              </p>
            </div>

            {/* Right Links */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-white/70 font-semibold">
              <a href={GITHUB_REPO_URL} target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1 active:scale-95">
                <Github className="w-4 h-4" /> Source Code
              </a>
              <a href={DIRECT_APK_DOWNLOAD_URL} download className="hover:text-white transition-colors flex items-center gap-1 active:scale-95">
                <Download className="w-4 h-4" /> Direct APK
              </a>
              <button onClick={() => setPrivacyModalOpen(true)} className="hover:text-white transition-colors flex items-center gap-1 active:scale-95 cursor-pointer">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Privacy
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 text-center text-xs text-white/40">
            © {new Date().getFullYear()} CycleSync Android App by Tanvi Yadav. Built with 100% Privacy & Zero Tracking.
          </div>
        </div>
      </footer>

      {/* Interactive Welcome & Feature Guide Modal */}
      <GuideModal
        isOpen={guideModalOpen}
        onClose={() => setGuideModalOpen(false)}
        selectedLang={selectedLang}
        onLanguageChange={setSelectedLang}
      />
    </div>
  );
};
