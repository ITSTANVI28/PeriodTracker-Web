import { AppState, PeriodLog, SymptomLog, PcodResult, UserSettings } from '../types';

const STORAGE_KEY = 'period_tracker_data_v2';

// Helper to calculate SHA-256 string hash
export async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate sample seed data for first-time usage
export function getDefaultState(): AppState {
  const today = new Date();
  
  // Create realistic past period logs
  const period1Start = new Date(today);
  period1Start.setDate(today.getDate() - 14); // 14 days ago
  const period1End = new Date(period1Start);
  period1End.setDate(period1Start.getDate() + 4);

  const period2Start = new Date(today);
  period2Start.setDate(today.getDate() - 42); // 42 days ago
  const period2End = new Date(period2Start);
  period2End.setDate(period2Start.getDate() + 5);

  const defaultSettings: UserSettings = {
    language: 'EN',
    theme: 'light',
    pinEnabled: false,
    profile: {
      name: 'Sarah',
      avgCycleLength: 28,
      avgPeriodLength: 5,
      lastPeriodDate: period1Start.toISOString().split('T')[0]
    }
  };

  const defaultPeriodLogs: PeriodLog[] = [
    {
      id: 'log-1',
      startDate: period1Start.toISOString().split('T')[0],
      endDate: period1End.toISOString().split('T')[0],
      flow: 'medium',
      notes: 'Normal flow, slight cramps on day 1.'
    },
    {
      id: 'log-2',
      startDate: period2Start.toISOString().split('T')[0],
      endDate: period2End.toISOString().split('T')[0],
      flow: 'heavy',
      notes: 'Heavy flow on day 2.'
    }
  ];

  const defaultSymptomLogs: SymptomLog[] = [
    {
      id: 'sym-1',
      date: period1Start.toISOString().split('T')[0],
      symptoms: [
        { type: 'cramps', severity: 3 },
        { type: 'fatigue', severity: 2 },
        { type: 'mood_swings', severity: 3 }
      ],
      notes: 'Rested with heating pad.'
    }
  ];

  return {
    view: 'landing',
    currentAppTab: 'home',
    isUnlocked: true,
    settings: defaultSettings,
    periodLogs: defaultPeriodLogs,
    symptomLogs: defaultSymptomLogs,
    pcodHistory: []
  };
}

export function loadStoredState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const defaultState = getDefaultState();
      saveStoredState(defaultState);
      return defaultState;
    }
    const parsed = JSON.parse(raw);
    return {
      ...getDefaultState(),
      ...parsed,
      settings: {
        ...getDefaultState().settings,
        ...(parsed.settings || {})
      }
    };
  } catch (e) {
    console.error('Failed to parse localStorage data:', e);
    return getDefaultState();
  }
}

export function saveStoredState(state: AppState): void {
  try {
    // Save state excluding transient view flags if preferred
    const toSave = {
      settings: state.settings,
      periodLogs: state.periodLogs,
      symptomLogs: state.symptomLogs,
      pcodHistory: state.pcodHistory
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error('Failed to save state to localStorage:', e);
  }
}

export function exportBackupJSON(state: AppState): void {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `PeriodTracker_Backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
