<div align="center">

# 🌸 CycleSync (PeriodTracker-Web)

**Master Your Menstrual Health with 100% Privacy, Clinical Precision & Phase-Aligned Wellness.**

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.1.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Privacy](https://img.shields.io/badge/Privacy-100%25_Offline-success?style=for-the-badge&logo=shield)](https://github.com/ITSPRANAV16/PeriodTracker-Web)
[![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](LICENSE)

[Live Demo](http://localhost:3000/) • [Features](#-key-features) • [Installation](#-getting-started) • [Tech Stack](#-tech-stack) • [Privacy Architecture](#-100-offline-privacy-guarantee)

</div>

---

## 📖 Overview

**CycleSync** is a privacy-first, offline-ready menstrual cycle and reproductive health web application. Engineered with modern responsive design and medical-grade screening heuristics, CycleSync empowers users to log period cycles, track 12+ daily physical and emotional symptoms, assess PCOD/PCOS risk profiles, align nutrition and fitness with cycle phases, and export comprehensive doctor-ready clinical PDF reports.

---

## ✨ Key Features

### 🔄 1. Intelligent Cycle & Fertility Engine
- **Dynamic Predictions:** Calculates historical cycle length and period duration trends to accurately forecast upcoming periods, ovulation days, and fertile windows.
- **Radial Countdown Visualizer:** Real-time visual progress counter displaying active cycle phases (*Period Active*, *Ovulation Day*, *Fertile Window*, *Normal Phase*).
- **Interactive Calendar:** Full-month multi-status calendar grid with one-tap logging and visual event indicators.

### 🩺 2. Clinical PCOD / PCOS Risk Assessment
- **10-Point Evidence-Based Screening:** Clinical evaluation covering cycle irregularity, hirsutism, adult acne, abdominal weight fluctuations, scalp hair thinning, Acanthosis Nigricans, insulin/sugar cravings, pelvic pain, mood swings, and family medical history.
- **Risk Stratification:** Instant classification (*Low*, *Moderate*, *High*) with actionable nutritional, exercise, and lifestyle recommendations.

### 📝 3. Comprehensive Symptom & Mood Logger
- **12 Tracked Symptoms:** Cramps, headache, acne, bloating, fatigue, mood swings, breast tenderness, cravings, backache, insomnia, nausea, and anxiety.
- **Severity Rating:** 1-to-5 slider scale for precise symptom intensity tracking.
- **Daily Wellness Check-in:** Primary mood selector, hydration tracker (glasses/ml), and custom daily observation notes.
- **Mobile Bottom-Sheet UX:** Slides up smoothly with intuitive drag handles on mobile and touch devices.

### 🥗 4. Phase-Aligned Wellness Hub
- **4-Phase Nutrition Protocols:** Tailored dietary guidelines for Menstrual, Follicular, Ovulatory, and Luteal phases.
- **Holistic Cramp Relief:** Heat therapy, anti-inflammatory herbal teas, and restorative yoga poses (*Child's Pose / Balasana*).
- **Mindful Diaphragmatic Breathwork:** Guided 1-minute visual breathwork timer with expanding diaphragmatic animation to relieve pelvic tension.

### 📊 5. Analytics & Doctor-Ready PDF Export
- **Historical Trends:** Flow distribution breakdowns and symptom frequency rankings.
- **1-Click PDF Medical Report:** Generates a structured clinical health summary via `jsPDF` ready to share with gynecologists or healthcare providers.

### 🔒 6. Security, Privacy & Multilingual Support
- **100% Offline-First:** Zero cloud uploads. All user health data remains securely stored in local browser storage (`localStorage`).
- **4-Digit PIN Protection:** Web Crypto API SHA-256 encrypted PIN lock with custom security question recovery.
- **Multi-Language Localization:** Full UI support for **English (`EN`)**, **Hindi (`HI`)**, and **Marathi (`MR`)**.
- **JSON Backup & Restore:** Complete data export and import for seamless device migration.

---

## 🛠️ Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Frontend Core** | [React 18.3](https://react.dev/) + [TypeScript 5.2](https://www.typescriptlang.org/) |
| **Bundler & Server** | [Vite 5.1](https://vitejs.dev/) |
| **Styling & UI** | [TailwindCSS 3.4](https://tailwindcss.com/) + PostCSS + Custom Glassmorphism |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **PDF Generation** | [jsPDF 2.5](https://github.com/parallax/jsPDF) |
| **Storage & Encryption** | Web Crypto API (SHA-256 Hashing) + Browser LocalStorage |

---

## 📂 Project Architecture

```plaintext
cyclesync/
├── public/                     # Static assets, Web App Manifest & Service Worker
├── src/
│   ├── components/
│   │   ├── app/                # Main Web Application Views
│   │   │   ├── BottomNav.tsx            # Sticky desktop header & mobile bottom bar
│   │   │   ├── HistoryStatsView.tsx     # Analytics, flow charts & log history
│   │   │   ├── HomeDashboard.tsx        # Hero radial countdown & quick actions
│   │   │   ├── InteractiveCalendar.tsx  # Full month interactive cycle calendar
│   │   │   ├── PcodAssessmentModal.tsx  # 10-question PCOD clinical screening quiz
│   │   │   ├── PeriodLoggerModal.tsx    # Period start/end & flow logger modal
│   │   │   ├── SettingsView.tsx         # Profile, security PIN, lang & backups
│   │   │   ├── SymptomLoggerModal.tsx   # 12-symptom & mood tracker drawer
│   │   │   └── WellnessHub.tsx          # 4-phase nutrition & breathwork timer
│   │   ├── LandingPage.tsx     # Modern interactive landing page & web app container
│   │   └── PinLockScreen.tsx   # 4-digit SHA-256 PIN authentication screen
│   ├── lib/
│   │   └── auth.ts             # Auth utilities
│   ├── utils/
│   │   ├── cycleEngine.ts      # Ovulation/fertile window & PCOD score algorithms
│   │   ├── pdfExport.ts        # jsPDF medical health report generator
│   │   ├── storage.ts          # LocalStorage persistence & SHA-256 encryption
│   │   └── translations.ts     # Localization dictionary (EN, HI, MR)
│   ├── types.ts                # TypeScript domain models and interfaces
│   ├── index.css               # Design system tokens, glassmorphism & keyframes
│   ├── App.tsx                 # Root application component
│   └── main.tsx                # React DOM entry point
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or `bun` / `pnpm` / `yarn`)

### Installation & Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ITSPRANAV16/PeriodTracker-Web.git
   cd PeriodTracker-Web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000/`.

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production bundle:**
   ```bash
   npm run preview
   ```

---

## 🛡️ 100% Offline Privacy Guarantee

Women's health data is profoundly personal. Unlike cloud-dependent tracking apps:
- **No telemetry or data tracking**: Zero third-party tracker scripts.
- **Client-Side Only**: Your menstrual history, symptoms, and health answers are stored exclusively in your device's browser `localStorage`.
- **Encrypted PIN Protection**: PIN validation uses one-way SHA-256 cryptographic hashing via the native browser Web Crypto API.
- **You Own Your Data**: Export your entire dataset as a clean JSON backup anytime or wipe everything with one click in the Danger Zone.

---

## 🌐 Multilingual Accessibility

CycleSync is accessible across multiple languages with seamless one-click switching:
- 🇬🇧 **English** (`EN`)
- 🇮🇳 **हिन्दी / Hindi** (`HI`)
- 🇮🇳 **मराठी / Marathi** (`MR`)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <b>CycleSync</b> • Designed with 🌸 for Empowerment, Health & Privacy.
</div>
