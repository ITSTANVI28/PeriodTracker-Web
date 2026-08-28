import { PeriodLog, PcodQuizAnswer, PcodResult } from '../types';

export interface CyclePrediction {
  lastPeriodStart: Date;
  avgCycleLength: number;
  avgPeriodLength: number;
  nextPeriodStart: Date;
  nextPeriodEnd: Date;
  ovulationDate: Date;
  fertileStart: Date;
  fertileEnd: Date;
  daysUntilNextPeriod: number;
  currentPhaseStatus: 'period' | 'fertile' | 'ovulation' | 'normal';
  currentPeriodDay?: number;
}

export function parseDateStr(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function formatDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function calculateCyclePrediction(
  periodLogs: PeriodLog[],
  defaultAvgCycle: number = 28,
  defaultAvgPeriod: number = 5
): CyclePrediction {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Sort period logs descending by start date
  const sorted = [...periodLogs].sort(
    (a, b) => parseDateStr(b.startDate).getTime() - parseDateStr(a.startDate).getTime()
  );

  let avgCycle = defaultAvgCycle;
  let avgPeriod = defaultAvgPeriod;

  // Calculate actual historical average cycle if at least 2 period logs exist
  if (sorted.length >= 2) {
    let totalGap = 0;
    let gapsCount = 0;
    for (let i = 0; i < sorted.length - 1; i++) {
      const d1 = parseDateStr(sorted[i].startDate).getTime();
      const d2 = parseDateStr(sorted[i + 1].startDate).getTime();
      const diffDays = Math.round((d1 - d2) / (1000 * 60 * 60 * 24));
      if (diffDays >= 15 && diffDays <= 60) {
        totalGap += diffDays;
        gapsCount++;
      }
    }
    if (gapsCount > 0) {
      avgCycle = Math.round(totalGap / gapsCount);
    }
  }

  // Calculate actual average period duration if logs exist
  if (sorted.length > 0) {
    let totalDur = 0;
    sorted.forEach(p => {
      const s = parseDateStr(p.startDate).getTime();
      const e = parseDateStr(p.endDate).getTime();
      const dur = Math.max(1, Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1);
      totalDur += dur;
    });
    avgPeriod = Math.round(totalDur / sorted.length);
  }

  // Determine last period start date
  let lastStart = sorted.length > 0 ? parseDateStr(sorted[0].startDate) : new Date(today.getTime() - 14 * 86400000);

  // Compute next period start
  let nextStart = new Date(lastStart);
  nextStart.setDate(lastStart.getDate() + avgCycle);

  // If next start is already in the past, advance to current upcoming cycle
  while (nextStart.getTime() + avgPeriod * 86400000 < today.getTime()) {
    lastStart = new Date(nextStart);
    nextStart = new Date(lastStart);
    nextStart.setDate(lastStart.getDate() + avgCycle);
  }

  const nextEnd = new Date(nextStart);
  nextEnd.setDate(nextStart.getDate() + avgPeriod - 1);

  // Ovulation = Next Period Start - 14 days
  const ovulationDate = new Date(nextStart);
  ovulationDate.setDate(nextStart.getDate() - 14);

  // Fertile window = Ovulation - 5 to Ovulation + 1
  const fertileStart = new Date(ovulationDate);
  fertileStart.setDate(ovulationDate.getDate() - 5);

  const fertileEnd = new Date(ovulationDate);
  fertileEnd.setDate(ovulationDate.getDate() + 1);

  const diffTime = nextStart.getTime() - today.getTime();
  const daysUntilNextPeriod = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Determine current status
  let currentPhaseStatus: 'period' | 'fertile' | 'ovulation' | 'normal' = 'normal';
  let currentPeriodDay: number | undefined;

  // Check if today is in active logged or predicted period
  const activeLog = sorted.find(p => {
    const s = parseDateStr(p.startDate);
    const e = parseDateStr(p.endDate);
    return today >= s && today <= e;
  });

  if (activeLog) {
    currentPhaseStatus = 'period';
    const s = parseDateStr(activeLog.startDate);
    currentPeriodDay = Math.floor((today.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  } else if (today >= nextStart && today <= nextEnd) {
    currentPhaseStatus = 'period';
    currentPeriodDay = Math.floor((today.getTime() - nextStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  } else if (formatDateStr(today) === formatDateStr(ovulationDate)) {
    currentPhaseStatus = 'ovulation';
  } else if (today >= fertileStart && today <= fertileEnd) {
    currentPhaseStatus = 'fertile';
  }

  return {
    lastPeriodStart: lastStart,
    avgCycleLength: avgCycle,
    avgPeriodLength: avgPeriod,
    nextPeriodStart: nextStart,
    nextPeriodEnd: nextEnd,
    ovulationDate,
    fertileStart,
    fertileEnd,
    daysUntilNextPeriod,
    currentPhaseStatus,
    currentPeriodDay
  };
}

// 10 PCOD Clinical Screening Questions & Scoring Logic
export const PCOD_QUESTIONS = [
  {
    id: 1,
    question: "How regular are your menstrual cycles?",
    options: [
      { label: "Regular (21 - 35 days apart)", score: 0 },
      { label: "Slightly irregular (varies by >7 days)", score: 1 },
      { label: "Frequently delayed (>35 days) or missed cycles", score: 2 }
    ]
  },
  {
    id: 2,
    question: "Do you experience excess facial or body hair growth (Hirsutism)?",
    options: [
      { label: "No / Normal hair growth", score: 0 },
      { label: "Mild growth on chin, upper lip, or abdomen", score: 1 },
      { label: "Moderate to severe hair growth on chin/chest", score: 2 }
    ]
  },
  {
    id: 3,
    question: "Have you noticed severe adult acne or persistent oily skin?",
    options: [
      { label: "Rarely or never", score: 0 },
      { label: "Occasional breakouts around period", score: 1 },
      { label: "Persistent adult acne unresponsive to skincare", score: 2 }
    ]
  },
  {
    id: 4,
    question: "Have you experienced sudden weight gain or difficulty losing weight?",
    options: [
      { label: "No / Stable weight", score: 0 },
      { label: "Slight weight fluctuation", score: 1 },
      { label: "Unexplained weight gain, especially abdominal", score: 2 }
    ]
  },
  {
    id: 5,
    question: "Do you experience scalp hair thinning or hair loss?",
    options: [
      { label: "Normal hair density", score: 0 },
      { label: "Mild shedding", score: 1 },
      { label: "Noticeable hair thinning on scalp crown", score: 2 }
    ]
  },
  {
    id: 6,
    question: "Have you noticed dark velvety patches of skin (Acanthosis Nigricans) on neck/armpits?",
    options: [
      { label: "No dark patches", score: 0 },
      { label: "Slight discoloration", score: 1 },
      { label: "Distinct dark skin creases on neck or underarms", score: 2 }
    ]
  },
  {
    id: 7,
    question: "Do you experience intense sugar cravings or energy crashes after meals?",
    options: [
      { label: "Rarely", score: 0 },
      { label: "Sometimes in the afternoon", score: 1 },
      { label: "Frequent strong sugar cravings & sudden fatigue", score: 2 }
    ]
  },
  {
    id: 8,
    question: "Do you experience persistent pelvic pain or discomfort outside period days?",
    options: [
      { label: "No pelvic pain", score: 0 },
      { label: "Occasional dull ache", score: 1 },
      { label: "Frequent pelvic pain or heaviness", score: 2 }
    ]
  },
  {
    id: 9,
    question: "Do you experience severe mood swings, anxiety, or depressive feelings?",
    options: [
      { label: "Normal emotional balance", score: 0 },
      { label: "Mild PMS moodiness", score: 1 },
      { label: "Frequent severe anxiety, brain fog, or low mood", score: 2 }
    ]
  },
  {
    id: 10,
    question: "Is there a family history of PCOD/PCOS, Type 2 Diabetes, or Thyroid disorders?",
    options: [
      { label: "No family history", score: 0 },
      { label: "Distant relative or unsure", score: 1 },
      { label: "Mother or sister diagnosed with PCOD or Diabetes", score: 2 }
    ]
  }
];

export function evaluatePcodAssessment(answers: PcodQuizAnswer[]): PcodResult {
  const totalScore = answers.reduce((acc, a) => acc + a.score, 0);

  let riskLevel: 'Low' | 'Moderate' | 'High' = 'Low';
  const recommendations: string[] = [];

  if (totalScore <= 6) {
    riskLevel = 'Low';
    recommendations.push(
      "Your responses indicate a low hormonal risk profile.",
      "Maintain a balanced diet rich in whole foods, fiber, and lean proteins.",
      "Engage in 30 minutes of moderate physical activity (walking, yoga, cardio) 4-5 days a week.",
      "Continue monitoring your monthly cycle regularity."
    );
  } else if (totalScore <= 12) {
    riskLevel = 'Moderate';
    recommendations.push(
      "Your responses suggest mild to moderate hormonal imbalances indicative of possible PCOD/PCOS tendencies.",
      "Adopt a low-glycemic index (GI) diet to regulate blood sugar & insulin sensitivity.",
      "Incorporate strength training and regular stress management (meditation, breathwork).",
      "Track your cycle length and symptom patterns closely for 2-3 months.",
      "Consider scheduling a routine consultation with a Gynecologist or Endocrinologist for pelvic ultrasound & blood hormone panel (FSH, LH, Testosterone)."
    );
  } else {
    riskLevel = 'High';
    recommendations.push(
      "Your responses indicate a high probability of PCOD/PCOS hormonal features.",
      "We strongly recommend consulting a certified Gynecologist or Endocrinologist for professional diagnosis.",
      "Request a comprehensive Pelvic Ultrasound and Hormone Panel (AMH, LH/FSH ratio, Fasting Insulin, Thyroid Profile).",
      "Focus on insulin-sensitizing nutritional strategies, limiting processed carbohydrates and refined sugars.",
      "Prioritize consistent 7-8 hours of sleep and stress reduction practices."
    );
  }

  return {
    date: formatDateStr(new Date()),
    totalScore,
    riskLevel,
    recommendations
  };
}
