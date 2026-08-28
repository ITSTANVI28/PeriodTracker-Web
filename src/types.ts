export type Language = 'EN' | 'HI' | 'MR';

export type FlowIntensity = 'light' | 'medium' | 'heavy' | 'spotting';

export type SymptomType = 
  | 'cramps'
  | 'headache'
  | 'acne'
  | 'bloating'
  | 'fatigue'
  | 'mood_swings'
  | 'breast_tenderness'
  | 'cravings'
  | 'backache'
  | 'insomnia'
  | 'nausea'
  | 'anxiety';

export interface SymptomLog {
  id: string;
  date: string; // YYYY-MM-DD
  symptoms: {
    type: SymptomType;
    severity: number; // 1 to 5
  }[];
  notes?: string;
  waterIntakeGlass?: number;
  moodEmoji?: string;
}

export interface PeriodLog {
  id: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  flow: FlowIntensity;
  notes?: string;
}

export interface PcodQuizAnswer {
  questionId: number;
  score: number;
}

export interface PcodResult {
  date: string;
  totalScore: number;
  riskLevel: 'Low' | 'Moderate' | 'High';
  recommendations: string[];
}

export interface UserProfile {
  name: string;
  avgCycleLength: number; // default 28
  avgPeriodLength: number; // default 5
  lastPeriodDate: string; // YYYY-MM-DD
}

export interface SecurityQuestion {
  question: string;
  answerHash: string;
}

export interface UserSettings {
  language: Language;
  theme: 'light' | 'dark';
  pinEnabled: boolean;
  pinHash?: string;
  securityQuestion?: SecurityQuestion;
  profile: UserProfile;
}

export interface AppState {
  view: 'landing' | 'app';
  currentAppTab: 'home' | 'calendar' | 'history' | 'wellness' | 'settings';
  isUnlocked: boolean;
  settings: UserSettings;
  periodLogs: PeriodLog[];
  symptomLogs: SymptomLog[];
  pcodHistory: PcodResult[];
}
