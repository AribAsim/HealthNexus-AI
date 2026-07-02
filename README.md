# HealthNexus AI — District Healthcare Operating System

> **Google GDG Hackathon 2025** — AI-powered district health intelligence platform for Alwar, Rajasthan (42 PHCs/CHCs).

[![Built with Gemini](https://img.shields.io/badge/Powered%20by-Gemini%201.5%20Pro-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline%20Ready-5A0FC8?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vite.dev/)

---

## 🎯 The Problem

Rural district health infrastructure in India suffers from **operational blind spots** that cost lives:

| Pain Point | Impact |
|---|---|
| Manual medicine ledgers | Stock-outs discovered only at point of dispensing |
| No cross-facility visibility | Surplus at one PHC while another faces shortage |
| Reactive outbreak response | Disease clusters identified days after transmission begins |
| Paper-based staff rosters | Absenteeism gaps discovered during crisis, not before |
| No inter-facility bed routing | Patients turned away with no redirection |

**HealthNexus AI** transforms district healthcare from a passive, manual ledger system into an **active, AI-orchestrated District Healthcare Operating System** — real-time, predictive, explainable, and multilingual.

---

## 🌟 What HealthNexus AI Does

### 20 Phases of AI Capability — All Shipped

| # | Phase | Key Capability |
|---|---|---|
| 1 | Foundation & UX | Material-3 design, multilingual (EN/हिंदी/Regional), responsive layout |
| 2 | District Digital Twin | Live Leaflet map of 42 facilities with AI risk markers |
| 3 | Resource Monitoring | Real-time inventory, beds, staff, footfall KPIs |
| 4 | AI Risk Engine | Composite 0–100 risk score per facility via Gemini |
| 5 | Predictive Analytics | 30-day inventory forecasting with confidence bands |
| 6 | Smart Redistribution | Surplus → deficit optimization with transport manifests |
| 7 | Explainable AI | Every prediction includes confidence, reasoning & action |
| 8 | Disease Intelligence | Outbreak hotspot detection, cluster heatmaps |
| 9 | AI Command Centre | Executive district-level dashboard with health score |
| 10 | AI Copilot | Natural language administrative query assistant (own tab) |
| 11 | Voice Intelligence | Web Speech API + Gemini entity extraction |
| 12 | Computer Vision | Shelf scan simulation with bounding boxes & confidence |
| 13 | Resource Simulation | Scenario engine: Dengue / Flood / Heatwave / Strike |
| 14 | Crisis Orchestration | Crisis flow drawer with AI-driven redistribution approval |
| 15 | Intelligent Alerts | Priority-ranked (Critical → Low) notification system |
| 16 | AI Reporting | jsPDF client-side executive reports & transport manifests |
| 17 | Performance Analytics | Facility leaderboard with trend indicators & Most Improved |
| 18 | Autonomous Workflows | Nightly AI timeline: 6 automated overnight tasks |
| 19 | Security & Audit | Role switcher (Admin / Pharmacist / Doctor) + immutable audit log |
| 20 | Executive Intelligence | District health score (0–100), operational priorities, AI summary |

---

## 🏗️ Architecture

```mermaid
graph TD
    A[HealthNexus AI — App.tsx Shell] --> B[Dashboard Tab]
    A --> COP[AI Copilot Tab]
    A --> C[Inventory Tab]
    A --> D[Patients Tab]
    A --> E[Beds Tab]
    A --> F[Staff Tab]
    A --> G[Tests Tab]
    A --> H[Analytics Tab]

    B --> B1[ExecutiveIntelligence]
    B --> B2[DistrictMap — Leaflet]
    B --> B3[DiseaseIntelligence]
    B --> B4[Crisis Flow Drawer]
    B --> B5[Gateway Simulator Modal]
    B --> B6[Audit Logs Drawer]

    C --> C1[StockScanner — Computer Vision Drawer]
    C --> C2[Pharmacist Portal — Forecasting]

    H --> H1[ForecastingChart]
    H --> H2[PerformanceAnalytics]
    H --> H3[NightlyWorkflow Timeline]
    H --> H4[ResourceSimulator Drawer]
    H --> H5[AIExplainability Panel]

    A --> Z1[VoiceReporter — Floating Mic]

    B1 & B3 & H5 & COP --> AI[Gemini 1.5 Pro / Flash]
    C1 --> AI
    H4 --> AI
```

### Technology Stack

| Layer | Technology |
|---|---|
| **UI Framework** | React 19, TypeScript (strict), Vite 8 |
| **Styling** | Vanilla CSS + Material Design 3 tokens (Stitch Design System) |
| **State** | Zustand (`useHealthStore`) with offline queue |
| **AI** | Google Gemini 1.5 Pro & Flash via `@google/generative-ai` |
| **Maps** | Leaflet + React-Leaflet (Alwar district bounding box) |
| **PDF** | jsPDF (client-side, no server) |
| **Voice** | Web Speech API + Gemini entity extraction |
| **PWA** | Vite PWA plugin + Workbox service worker |
| **Icons** | Google Material Symbols |
| **Fonts** | Inter, JetBrains Mono |

---

## 🗂️ Project Structure

```
src/
├── App.tsx                         ← Shell: router + tab switcher + all overlay portals
├── store.ts                        ← Zustand global store
├── ai.ts                           ← Gemini API calls & fallback
├── data/
│   └── facilities.json             ← 42 PHCs/CHCs — Alwar district
└── modules/
    ├── map/
    │   └── DistrictMap.tsx         ← Interactive Leaflet district twin
    ├── ai/
    │   ├── riskEngine.ts           ← Composite risk scoring
    │   ├── forecasting.ts          ← 30-day demand forecasting
    │   └── ForecastingChart.tsx    ← Animated confidence-band chart
    ├── dashboard/
    │   ├── ExecutiveIntelligence.tsx   ← District health score + actions
    │   ├── DiseaseIntelligence.tsx     ← Outbreak heatmap + alerts
    │   ├── PerformanceAnalytics.tsx    ← Facility leaderboard
    │   ├── NightlyWorkflow.tsx         ← Autonomous AI overnight timeline
    │   ├── AIExplainability.tsx        ← "Why this?" evidence panel
    │   └── AICopilot.tsx               ← AI Copilot Assistant (own sidebar tab)
    ├── inventory/
    │   └── StockScanner.tsx        ← Computer vision shelf scan (modal)
    ├── simulation/
    │   └── ResourceSimulator.tsx   ← Scenario engine: Before vs After (modal)
    └── voice/
        └── VoiceReporter.tsx       ← Speech-to-text + Gemini NER
```

---

## 🖥️ Key Screens

### 📊 District Command Centre & AI Telemetry
The executive dashboard shows the District Health Score, active crisis alerts, facility map, disease intelligence clusters, and provides one-click AI report generation.

### 🤖 AI Copilot
A dedicated sidebar tab housing the natural-language AI assistant — ask operational questions, get evidence-backed recommendations, all powered by Gemini.

### 📦 Drug Inventory & Smart Redistribution
The pharmacist portal shows stock levels, AI demand forecasts, and enables the AI Shelf Scanner (computer vision modal) to detect low-stock items.

### 🛏️ Bed Availability & ICU Monitor
Real-time bed occupancy across all 42 facilities with critical threshold highlighting and AI-suggested inter-facility routing.

### 👥 Patient Flow & Triage Queue
Live triage registration form (slide-over drawer), patient footfall KPIs, and AI-prioritised queue management.

### 📋 Staff Attendance & Rostering
Biometric sync simulation, attendance rates, and staffing gap alerts.

### 🔬 Diagnostic Lab Audit
Reagent stock tracking and equipment uptime monitoring across district labs.

### 📈 Analytics & AI Modelling
Forecasting charts, facility performance leaderboard, nightly workflow timeline, resource epidemic simulation sandbox, and the AI Explainability panel.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v20+
- Git

### 1. Clone
```bash
git clone https://github.com/AribAsim/HealthNexus-AI.git
cd HealthNexus-AI
```

### 2. Install
```bash
npm install
```

### 3. Configure Gemini API Key
```bash
cp .env.example .env
```
Edit `.env`:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```
> **No API key?** The app gracefully falls back to a local AI simulation for offline demo — full functionality, zero network dependency.

### 4. Run
```bash
npm run dev
# → http://localhost:5173
```

### 5. Build (Production)
```bash
npm run build
# PWA service worker + precache generated automatically
```

---

## 🎥 Navigating the App

| Tab | Who Uses It | What to Show |
|---|---|---|
| **District Dashboard** | District Admin | Map, health score, crisis flow drawer, AI report button |
| **AI Copilot** | Any role | Type a query — Gemini answers with evidence |
| **Inventory** | Pharmacist | Stock levels, AI Scanner modal, forecasting chart |
| **Patient Flow** | Doctor / MO | Triage intake drawer, queue analytics |
| **Bed Management** | Admin | Occupancy matrix, inter-facility routing |
| **Staff Attendance** | Admin | Biometric roster, attendance KPIs |
| **Diagnostic Tests** | Lab staff | Reagent stock, equipment uptime |
| **Analytics & AI** | Admin | Forecasting, simulation sandbox, explainability |

### Live Demo Tips
- **Language Toggle:** Click the 🌐 translate circle button (top-right) — switch EN → हिंदी → Regional
- **Voice Input:** Tap the floating microphone — speak a facility update in any language
- **Offline Mode:** Toggle `Online (NHM Synced)` → `Offline (Cache Active)` to demonstrate 2G resilience
- **Role Switcher:** Switch Admin / Pharmacist / Doctor in the top navbar to see role-gated views
- **Crisis Flow:** On the Dashboard, click **"Execute AI Response"** to trigger the crisis orchestration drawer
- **Gateway Simulator:** Click **"Gateway Simulator"** at the bottom of the Dashboard to simulate USSD/Biometric feeds
- **Audit Logs:** Click **"View Audit Logs"** to inspect the immutable event log drawer

---

## 🤖 AI Capabilities — Gemini Integration

Every AI output follows the mandatory 4-field schema:

```typescript
interface AIOutput {
  prediction: unknown;        // the actual value (risk score, stockout date, etc.)
  confidence: number;         // 0–100
  explanation: string;        // human-readable reasoning
  recommendedAction: string;  // concrete next step
}
```

| Feature | Gemini Model | Fallback |
|---|---|---|
| Risk Score Engine | Gemini 1.5 Flash | Rule-based heuristic |
| Demand Forecasting | Gemini 1.5 Pro | Linear trend extrapolation |
| Voice Entity Extraction | Gemini 1.5 Flash | Regex pattern matching |
| Computer Vision Shelf Scan | Gemini Vision (mocked) | Static confidence overlay |
| AI Copilot Queries | Gemini 1.5 Pro | Canned response library |
| Executive Summary | Gemini 1.5 Pro | Template-based report |

---

## 📊 Hackathon Evaluation Alignment

| Criterion (Weight) | How HealthNexus AI Addresses It |
|---|---|
| **AI/Technical Execution (25%)** | Gemini powers risk scoring, forecasting, redistribution, voice NER, and report generation — all with real API calls and graceful fallback |
| **Deployability/Scalability (25%)** | PWA with offline cache, modular `src/modules/` architecture, Zustand offline queue, 2G-compatible bundle (~280 KB gzip) |
| **Problem-Solution Fit (20%)** | Every feature maps directly to a documented PHC/CHC operational pain point (stock-outs, bed crunch, outbreak blindspots) |
| **Inclusivity (15%)** | EN/हिंदी/Regional language support, voice input, low-bandwidth mode, accessible WCAG contrast |
| **Impact Potential (10%)** | Scales to 42+ facilities; Scenario simulator demonstrates district-level coordination impact |
| **Presentation (5%)** | Role-based views and live overlays let any judge explore the full narrative in under 5 minutes |

---

## 🛡️ Production Quality

```bash
# TypeScript strict check
npx tsc -b           # 0 errors, 238+ modules

# Production build
npm run build        # PWA + Workbox generated

# Lint
npm run lint
```

- **0 TypeScript errors** (strict mode)
- **PWA** — installable, offline-first, Workbox precache
- **Modular architecture** — every feature isolated in `src/modules/<domain>/`
- **Security** — role-based access, immutable audit log, no raw PII in state
- **Overlay system** — all drawers & modals rendered via React Portal to `document.body` for correct z-index layering

---

## 📜 License

MIT License — Built with ❤️ for the **Google GDG Hackathon 2026**.

> *"From reactive ledgers to an AI-orchestrated district — HealthNexus AI."*
