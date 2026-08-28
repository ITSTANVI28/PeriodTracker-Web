import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck, 
  Calendar, 
  Stethoscope, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Heart,
  ArrowRight
} from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLang: 'en' | 'hi' | 'mr';
  onLanguageChange: (lang: 'en' | 'hi' | 'mr') => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({
  isOpen,
  onClose,
  selectedLang,
  onLanguageChange,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // Sync dontShowAgain state from localStorage
  useEffect(() => {
    const savedPref = localStorage.getItem('cyclesync_guide_dont_show');
    if (savedPref === 'true') {
      setDontShowAgain(true);
    }
  }, []);

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowRight' && currentStep < 3) setCurrentStep(prev => prev + 1);
      if (e.key === 'ArrowLeft' && currentStep > 0) setCurrentStep(prev => prev - 1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStep]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('cyclesync_guide_dont_show', 'true');
    } else {
      localStorage.removeItem('cyclesync_guide_dont_show');
    }
    onClose();
  };

  const handleNavigateToSection = (sectionId: string) => {
    handleClose();
    setTimeout(() => {
      const elem = document.getElementById(sectionId);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  // Translations for the 4-step Tour
  const content = {
    en: {
      modalBadge: "✨ Welcome & Interactive Guide",
      stepIndicator: `Step ${currentStep + 1} of 4`,
      skipTour: "Skip Guide",
      dontShowText: "Don't show automatically on page refresh",
      nextBtn: "Next Step",
      prevBtn: "Previous",
      finishBtn: "Start Exploring CycleSync 🌸",
      tryFeature: "Jump to Feature →",
      steps: [
        {
          id: "privacy",
          badge: "🛡️ 100% Privacy by Principle",
          title: "Welcome to CycleSync",
          subtitle: "Your reproductive health data stays strictly on your device.",
          description: "Unlike commercial trackers that sell intimate health data to ad brokers, CycleSync operates 100% offline using your device's local database. No cloud accounts, zero telemetry, and zero mandatory signups.",
          highlights: [
            "100% Offline Local SQLite/Room DB",
            "Zero Cloud Sync & No Data Harvesting",
            "4-Digit PIN & Biometric App Lock"
          ],
          actionText: "Check Privacy Comparison",
          targetSection: "privacy-table",
          icon: ShieldCheck,
          accentColor: "from-emerald-500 to-teal-600"
        },
        {
          id: "calculator",
          badge: "🩸 Cycle & Ovulation Forecasting",
          title: "Smart Period Predictor",
          subtitle: "Calculate upcoming cycle dates and fertile windows in seconds.",
          description: "Use our interactive mathematical algorithm to calculate your exact expected period start, fertile conception window, and peak ovulation day based on your historical cycle length.",
          highlights: [
            "Live Interactive Cycle Calculator",
            "Radial Countdown & Cycle Visualizer",
            "12+ Daily Symptom & Mood Logs"
          ],
          actionText: "Try Live Calculator",
          targetSection: "calculator",
          icon: Calendar,
          accentColor: "from-[#B95679] to-[#D87093]"
        },
        {
          id: "pcod",
          badge: "🩺 Clinical Self-Screening",
          title: "PCOD / PCOS Risk Assessment",
          subtitle: "10-question evidence-backed risk profiling quiz.",
          description: "Evaluate menstrual regularity, acne, hirsutism, and metabolic trends with our weighted clinical questionnaire to receive an immediate Low, Moderate, or High risk profile with personalized lifestyle guidance.",
          highlights: [
            "10-Question Weighted Scoring Algorithm",
            "Low, Moderate, & High Risk Classification",
            "Nutrition & Exercise Recommendations"
          ],
          actionText: "Take PCOD Assessment",
          targetSection: "features",
          icon: Stethoscope,
          accentColor: "from-purple-600 to-indigo-600"
        },
        {
          id: "download",
          badge: "📄 PDF Export & Mobile APK",
          title: "Clinical Reports & Android App",
          subtitle: "Export doctor-ready summaries or install the offline Android APK.",
          description: "Generate beautiful, clinical-ready PDF summaries to share with your gynecologist during checkups. Plus, download our direct, lightweight (6.1MB) Android APK directly with zero tracking.",
          highlights: [
            "Doctor-Ready PDF Health Summary",
            "Direct Android APK v1.0.1 (Zero Play Store Bloat)",
            "Lead Creator: Tanvi Yadav (Full-Stack Developer)"
          ],
          actionText: "Download Android APK",
          targetSection: "download-apk",
          icon: FileText,
          accentColor: "from-rose-500 to-pink-600"
        }
      ]
    },
    hi: {
      modalBadge: "✨ स्वागत एवं इंटरेक्टिव ऐप गाइड",
      stepIndicator: `चरण ${currentStep + 1} / 4`,
      skipTour: "गाइड छोड़ें",
      dontShowText: "पेज रीफ्रेश पर यह गाइड दोबारा न दिखाएं",
      nextBtn: "अगला चरण",
      prevBtn: "पिछला",
      finishBtn: "CycleSync का उपयोग शुरू करें 🌸",
      tryFeature: "इस फीचर पर जाएं →",
      steps: [
        {
          id: "privacy",
          badge: "🛡️ १००% गोपनीयता की गारंटी",
          title: "CycleSync में आपका स्वागत है",
          subtitle: "आपका स्वास्थ्य डेटा सिर्फ आपके फोन में १००% सुरक्षित रहता है।",
          description: "अन्य ऐप्स के विपरीत, CycleSync पूरी तरह से ऑफलाइन काम करता है। कोई क्लाउड सर्वर नहीं, कोई डेटा ट्रैकिंग नहीं और न ही किसी खाते की आवश्यकता है।",
          highlights: [
            "१००% ऑफलाइन लोकल SQLite स्टोरेज",
            "शून्य क्लाउड अपलोड एवं विज्ञापन मुक्त",
            "पिन (PIN) एवं बायोमेट्रिक लॉक"
          ],
          actionText: "प्रायवेसी तुलना देखें",
          targetSection: "privacy-table",
          icon: ShieldCheck,
          accentColor: "from-emerald-500 to-teal-600"
        },
        {
          id: "calculator",
          badge: "🩸 पीरियड्स एवं ओव्यूलेशन अनुमान",
          title: "स्मार्ट साइकिल कैलकुलेटर",
          subtitle: "अगले पीरियड्स और गर्भधारण के दिनों का सटीक अनुमान लगाएं।",
          description: "अपने पिछले चक्र की अवधि दर्ज करके आने वाले पीरियड्स, ओव्यूलेशन डे और फर्टाइल विंडो की तुरंत गणना करें।",
          highlights: [
            "लाइव साइकिल प्रेडिक्टर टूल",
            "रियल-टाइम काउंटडाउन विजुअलाइज़र",
            "१२+ लक्षण व मूड ट्रैकिंग"
          ],
          actionText: "कैलकुलेटर आज़माएं",
          targetSection: "calculator",
          icon: Calendar,
          accentColor: "from-[#B95679] to-[#D87093]"
        },
        {
          id: "pcod",
          badge: "🩺 क्लिनिकल स्वास्थ्य जांच",
          title: "PCOD / PCOS जोखिम मूल्यांकन",
          subtitle: "१० प्रश्नों की चिकित्सीय स्क्रीनिंग टेस्ट।",
          description: "पीरियड्स की अनियमितता, मुंहासे और अन्य लक्षणों के आधार पर अपने PCOD जोखिम (कम, मध्यम, अधिक) की तुरंत जांच करें।",
          highlights: [
            "१० प्रश्नों की वैज्ञानिक स्कोरिंग",
            "जोखिम स्तर का तुरंत परिणाम",
            "आहार एवं जीवनशैली मार्गदर्शन"
          ],
          actionText: "PCOD टेस्ट शुरू करें",
          targetSection: "features",
          icon: Stethoscope,
          accentColor: "from-purple-600 to-indigo-600"
        },
        {
          id: "download",
          badge: "📄 पीडीएफ रिपोर्ट व एंड्रॉइड ऐप",
          title: "डॉक्टर पीडीएफ रिपोर्ट एवं एपीके",
          subtitle: "डॉक्टर के लिए क्लिनिकल पीडीएफ बनाएं या एंड्रॉइड ऐप डाउनलोड करें।",
          description: "स्त्रीरोग विशेषज्ञ को दिखाने के लिए अपने चक्र की विस्तृत पीडीएफ रिपोर्ट डाउनलोड करें या थेट 6.1MB चा हलका Android APK इन्स्टॉल करा.",
          highlights: [
            "डॉक्टर के लिए प्रिंटेबल पीडीएफ समरी",
            "डायरेक्ट एंड्रॉइड APK (v1.0.1)",
            "निर्माता: तन्वी यादव (फुल-स्टॅक डेवलपर)"
          ],
          actionText: "APK डाउनलोड करें",
          targetSection: "download-apk",
          icon: FileText,
          accentColor: "from-rose-500 to-pink-600"
        }
      ]
    },
    mr: {
      modalBadge: "✨ स्वागत व ॲप मार्गदर्शक गाईड",
      stepIndicator: `टप्पा ${currentStep + 1} / ४`,
      skipTour: "गाईड बंद करा",
      dontShowText: "पेज रिफ्रेश केल्यावर पुन्हा आपोआप दाखवू नका",
      nextBtn: "पुढील टप्पा",
      prevBtn: "मागील",
      finishBtn: "CycleSync वापरायला सुरुवात करा 🌸",
      tryFeature: "या फीचरवर जा →",
      steps: [
        {
          id: "privacy",
          badge: "🛡️ १००% खाजगी व सुरक्षित",
          title: "CycleSync मध्ये आपले स्वागत आहे",
          subtitle: "तुमचा आरोग्य डेटा फक्त आणि फक्त तुमच्या फोनमध्ये सुरक्षित राहतो.",
          description: "इतर व्यावसायिक ॲप्ससारखा डेटा विकण्याऐवजी, CycleSync पूर्णपणे १००% ऑफलाइन काम करते. नो क्लाऊड सर्व्हर्स, नो ॲड्स आणि नो डेटा ट्रॅकिंग!",
          highlights: [
            "१००% ऑफलाइन स्थानिक SQLite स्टोरेज",
            "कोणतीही जाहिरात किंवा क्लाऊड ट्रॅकिंग नाही",
            "४-अंकी PIN व बायोमेट्रिक फिंगरप्रिंट लॉक"
          ],
          actionText: "प्रायव्हसी तक्ता पहा",
          targetSection: "privacy-table",
          icon: ShieldCheck,
          accentColor: "from-emerald-500 to-teal-600"
        },
        {
          id: "calculator",
          badge: "🩸 मासिक पाळी व ओव्ह्युलेशन अंदाज",
          title: "स्मार्ट सायकल कॅल्क्युलेटर",
          subtitle: "पुढील पाळीची तारीख व सुपीकता काळ काही सेकंदात जाणा.",
          description: "तुमच्या सायकल कालावधीनुसार पुढील मासिक पाळीची तारीख, ओव्ह्युलेशन दिवस आणि फर्टाईल विंडोचा अचूक अंदाज लावा.",
          highlights: [
            "थेट इंटरॅक्टिव्ह सायकल प्रेडिक्टर",
            "लाईव्ह काऊंटडाऊन व्हिज्युअलायझर",
            "१२+ लक्षणे व मूडची दैनिक नोंद"
          ],
          actionText: "कॅल्क्युलेटर वापरून पहा",
          targetSection: "calculator",
          icon: Calendar,
          accentColor: "from-[#B95679] to-[#D87093]"
        },
        {
          id: "pcod",
          badge: "🩺 वैद्यकीय स्वयं-मूल्यमापन",
          title: "PCOD / PCOS जोखीम चाचणी",
          subtitle: "१० प्रश्नांची वैद्यकीय स्क्रीनिंग प्रश्नावली.",
          description: "पाळीची अनियमितता, पिंपल्स, केस गळणे यांसारख्या लक्षणांवरून तुमचा PCOD धोका (कमी, मध्यम किंवा जास्त) तपासा आणि आरोग्यविषयक सल्ला मिळवा.",
          highlights: [
            "१०-प्रश्नांचे क्लिनिकल स्कोरिंग",
            "कमी, मध्यम, जास्त जोखीम वर्गीकरण",
            "योग्य आहार व योगासने मार्गदर्शन"
          ],
          actionText: "PCOD चाचणी सुरू करा",
          targetSection: "features",
          icon: Stethoscope,
          accentColor: "from-purple-600 to-indigo-600"
        },
        {
          id: "download",
          badge: "📄 डॉक्टरांसाठी PDF व Android ॲप",
          title: "क्लिनिकल रिपोर्ट व Android APK",
          subtitle: "डॉक्टरांसाठी PDF रिपोर्ट डाउनलोड करा किंवा ॲप इन्स्टॉल करा.",
          description: "स्त्रीरोग तज्ञांच्या भेटीसाठी संपूर्ण सायकल इतिहास असलेली प्रिंटेबल PDF डाऊनलोड करा किंवा थेट 6.1MB चा सुरक्षित Android APK इन्स्टॉल करा.",
          highlights: [
            "डॉक्टरांसाठी रेडीमेड PDF मेडिकल सारांश",
            "डायरेक्ट Android APK v1.0.1 डाऊनलोड",
            "निर्माती: तन्वी यादव (फुल-स्टॅक डेव्हलपर)"
          ],
          actionText: "APK डाऊनलोड करा",
          targetSection: "download-apk",
          icon: FileText,
          accentColor: "from-rose-500 to-pink-600"
        }
      ]
    }
  }[selectedLang];

  const activeStepData = content.steps[currentStep];
  const StepIcon = activeStepData.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#B95679]/30 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-title"
      >
        {/* Top Gradient Ribbon & Progress Bar */}
        <div className="h-1.5 w-full bg-gray-100 relative">
          <div 
            className="h-full bg-gradient-to-r from-[#B95679] to-[#E8B6CB] transition-all duration-300 ease-out"
            style={{ width: `${((currentStep + 1) / 4) * 100}%` }}
          />
        </div>

        {/* Header Bar */}
        <div className="px-5 sm:px-8 pt-5 pb-3 flex items-center justify-between border-b border-gray-100">
          {/* Left: Language Selector & Tour Badge */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="px-3 py-1 rounded-full bg-[#B95679]/10 text-[#B95679] border border-[#B95679]/20 text-xs font-bold font-display flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{content.modalBadge}</span>
            </span>

            {/* In-Modal Quick Language Pill Switcher */}
            <div className="hidden sm:flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-bold text-gray-700">
              <button
                onClick={() => onLanguageChange('mr')}
                className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${selectedLang === 'mr' ? 'bg-[#B95679] text-white shadow-xs' : 'hover:bg-gray-200'}`}
              >
                मराठी
              </button>
              <button
                onClick={() => onLanguageChange('hi')}
                className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${selectedLang === 'hi' ? 'bg-[#B95679] text-white shadow-xs' : 'hover:bg-gray-200'}`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${selectedLang === 'en' ? 'bg-[#B95679] text-white shadow-xs' : 'hover:bg-gray-200'}`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Right: Close / Skip Button */}
          <button
            onClick={handleClose}
            className="p-1.5 sm:p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer active:scale-95"
            aria-label="Close Guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Modal Body */}
        <div className="px-5 sm:px-8 py-5 sm:py-6 overflow-y-auto space-y-5">
          {/* Step Pill & Icon Header */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-extrabold uppercase tracking-wider">
              {content.stepIndicator}
            </div>

            {/* Step Category Badge */}
            <span className="text-xs font-bold text-[#B95679]">
              {activeStepData.badge}
            </span>
          </div>

          {/* Feature Card Box */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#FFF8F8] to-[#FFF0F3] border border-[#B95679]/20 shadow-xs relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${activeStepData.accentColor} text-white shadow-md shrink-0`}>
                <StepIcon className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>

              <div className="space-y-1 flex-1">
                <h3 id="guide-title" className="text-lg sm:text-2xl font-extrabold font-display text-[#201A1B] leading-tight">
                  {activeStepData.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#B95679] font-bold">
                  {activeStepData.subtitle}
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
              {activeStepData.description}
            </p>

            {/* Bullet Highlights */}
            <div className="mt-4 pt-3 border-t border-[#B95679]/15 space-y-2">
              {activeStepData.highlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#201A1B]">
                  <CheckCircle2 className="w-4 h-4 text-[#B95679] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Quick Action Button for this step */}
            <div className="mt-4 pt-3 flex items-center justify-end">
              <button
                onClick={() => handleNavigateToSection(activeStepData.targetSection)}
                className="text-xs font-bold text-[#B95679] hover:text-[#9E4566] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>{activeStepData.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 4 Step Dots Indicator */}
          <div className="flex items-center justify-center gap-2 pt-1">
            {[0, 1, 2, 3].map((idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                aria-label={`Go to step ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentStep === idx 
                    ? 'w-8 bg-[#B95679]' 
                    : 'w-2.5 bg-gray-200 hover:bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 sm:px-8 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Checkbox: Don't show again */}
          <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-4 h-4 text-[#B95679] rounded-md border-gray-300 focus:ring-[#B95679] cursor-pointer"
            />
            <span>{content.dontShowText}</span>
          </label>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-100 transition-all flex items-center gap-1 cursor-pointer active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{content.prevBtn}</span>
              </button>
            )}

            {currentStep < 3 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#B95679] hover:bg-[#9E4566] transition-all flex items-center gap-1.5 shadow-md shadow-[#B95679]/20 cursor-pointer active:scale-95"
              >
                <span>{content.nextBtn}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleClose}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#B95679] to-[#9E4566] hover:from-[#9E4566] hover:to-[#843652] transition-all flex items-center gap-2 shadow-lg shadow-[#B95679]/30 cursor-pointer active:scale-95"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>{content.finishBtn}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
