# 🌸 Materna AI 2.0 - Maternal Wellness & Clinical Companion

> **Materna AI 2.0** is a responsive, mobile-first pregnancy wellness web app designed to help expectant mothers track vitals, nutrition, medications, activity, and symptoms alongside an empathetic, intelligent AI assistant.

Live Baseline Inspiration: [https://rajeshrana-cse.github.io/MATRENA-AI-2.0/](https://rajeshrana-cse.github.io/MATRENA-AI-2.0/)

---

## ✨ Features Overview

### 1. Core Foundations (Section 1)
- **Guided Onboarding**: Captures expectant mother's name, gestational week, due date or LMP, height, pre-pregnancy weight, current weight, diet preference, and food allergies.
- **Home Dashboard & Dual Input Styles**:
  - **Precise Input**: Guided clinical form for exact metrics.
  - **Talk with Materna AI**: Conversational assistant that extracts week, weight, diet, BP, iron, Vit D3, and height from free text.
- **"Today at a Glance" Cards**: Gestational age & trimester, water intake tracker with 1-tap glass increments, medication adherence %, and diet profile.
- **Quick Action Bar**: 1-tap shortcuts to Nutrition, Meds, Activity, Asanas, Kick Counter, Contractions, and Doctor Report.
- **Nutrient Table & Food Recommendations**: Trimester-tailored daily meals (Breakfast, Lunch, Snacks, Dinner) with *"Log this meal"* action, plus comprehensive nutrient analysis (Protein, Iron, Calcium, Fiber, Folate, DHA, Iodine).
- **Medication Adherence & Schedule**: Dose time tracking, taken/missed toggle, snooze, and live adherence percentage.
- **Physical Activity & Pregnancy Asanas**: Gentle walking, prenatal mobility, Cat-Cow, Supported Child's Pose, and Bound Angle with obstetric safety guidance.
- **Maternal Health Trends**: Real-time cards for Weight, Blood Pressure, Vitamin D3, and Iron.

### 2. Advanced Clinical Features (Section 2)
- **Rule-Based Smart Analysis Engine**:
  - Trimester-aware calorie, protein, iron, and micronutrient targets adjusted for diet type.
  - BMI-based weight-gain trajectory analysis against IOM clinical guidelines.
  - Blood Pressure grading with **Hypertensive Red-Flag Alerts (≥140/90)** and emergency contact buttons.
  - Transparent **"Why"** medical explanations behind every evaluation.
- **Trends with Real Chart.js Visualizations**:
  - Interactive charts for Weight, Blood Pressure (with alert line), Laboratory Biomarkers (Hb, Vit D3, Iron), and Hydration & Sleep.
  - Weekly and Monthly timeframe toggles with normal physiological reference bands.
- **Baby Development (Weeks 4 - 40+)**:
  - Week-by-week fruit and vegetable size comparisons (e.g., Week 24 Ear of Corn).
  - Baby length (cm/in) and weight (g/oz).
  - Fetal anatomical milestones, maternal body changes, and clinical tips.
- **Symptom & Mood Logger with Red-Flag Safety Interception**:
  - Nausea, swelling, headaches, back pain, and mood tracking.
  - Automatic emergency triage protocol for red flags (bleeding, severe headache with visual aura, decreased kicks, fluid leakage).
- **3rd Trimester Tools**:
  - **Cardiff Kick Counter**: Count 10 kicks in 2 hours with timer and history.
  - **Contraction Timer**: Duration, interval frequency, and automated **5-1-1 Active Labor Rule Alert**.
- **Prenatal Appointments & Clinical Document Uploader**:
  - Key milestone scheduler (Level II scan, OGTT, Tdap) + secure offline report upload.
- **Medication Reminders**: Browser notifications with snooze (15m) and missed dose alerts.
- **Weekly Indian-Friendly Meal Planner & Smart Grocery List**:
  - 7-day nourishing menus for Vegetarian, Eggetarian, and Non-vegetarian diets.
  - Medical guide to foods to avoid during pregnancy (papaya, unpasteurized dairy, mercury fish, caffeine).
  - Categorized, checkable grocery list.
- **4-7-8 Guided Relaxation Breathing**: Animated breathing circle widget to calm the nervous system and reduce cortisol.
- **Emergency SOS Medical Card**: Blood group, Rh factor, attending obstetrician, hospital triage, and 1-tap phone dial links (`tel:`) accessible from every screen.
- **Clinical Doctor Report & Partner Sharing**:
  - Printable/PDF prenatal clinical summary report.
  - Shareable read-only partner link simulation.
- **Postpartum Mode (4th Trimester)**:
  - Transition past due date to newborn feeding, lochia tracking, pelvic recovery, and maternal mental wellness.
- **Multilingual & Voice Support**:
  - English, Hindi (हिंदी), Bengali (বাংলা), and Spanish (Español).
  - Speech-to-Text (Voice Input) and Text-to-Speech (Audio Voice Readout).

### 3. AI Assistant Behavior (Section 3)
- Warm, empathetic tone specifically trained for pregnancy challenges (mood swings, fatigue, morning sickness, heartburn, leg cramps).
- Automatically parses unstructured natural language inputs and presents a **"Sync to My Profile"** confirmation card.
- Never diagnoses or prescribes treatments; strictly follows safety guardrails and refers to clinicians.

### 4. UI/UX Design System (Section 4)
- Soft, calming palette (Rose/Peach, Sage Green, Warm Cream) with high contrast (WCAG AA).
- Responsive layout: Desktop left sidebar, mobile bottom tab bar, persistent floating chat and emergency buttons.
- Dark mode theme & adjustable font size (`A+` / `A++`) for eye comfort.
- Works **100% offline as an installable PWA** (`sw.js` and `manifest.json`).

---

## 📁 Project Structure

```
materna-ai-2.0/
├── index.html              # Main application entry point (all views & modals)
├── manifest.json           # Web App Manifest for PWA installation
├── sw.js                   # Service Worker for complete offline functionality
├── README.md               # Documentation and GitHub deployment guide
├── SAFETY_RULES.md         # Clinical safety policies, red flags, and disclaimers
├── css/
│   ├── main.css            # Design tokens, variables, typography, dark mode, layout
│   └── components.css      # Cards, progress ring, chat UI, breathing widget, toast
├── js/
│   ├── chart.min.js        # Local Chart.js library (bundled for offline use)
│   ├── app.js              # Master controller, router, UI bindings, PWA hooks
│   ├── storage.js          # LocalStorage / IndexedDB engine, backup export & import
│   ├── demo-data.js        # Realistic sample profile (Priya Sharma, Week 24)
│   ├── rules-engine.js     # Trimester nutrition, BMI weight gain, BP evaluation
│   ├── baby-development.js # Week-by-week fruit comparisons & fetal milestones
│   ├── ai-assistant.js     # Empathetic NLP companion, parameter extraction, voice
│   ├── charts.js           # Trends visualizer with Chart.js
│   ├── tools.js            # Kick counter, contraction timer, 4-7-8 breathing
│   ├── meal-planner.js     # Weekly Indian menus, foods-to-avoid, grocery list
│   ├── i18n.js             # Multilingual dictionary (EN, HI, BN, ES)
│   └── sharing.js          # Printable clinical PDF doctor report & partner link
├── icons/
│   ├── icon.svg            # Modern SVG app logo
│   └── favicon.svg         # SVG favicon
└── server/                 # Optional Node.js / Express backend
    ├── server.js           # REST API endpoints (/api/profile, /api/vitals, /api/chat)
    ├── package.json        # Backend dependencies
    └── README.md           # Backend startup guide
```

---

## 🚀 How to Run Locally

### Option A: Direct Open (Zero Setup)
Simply double-click `index.html` or open it in any modern browser (Chrome, Edge, Safari, Firefox). All CSS, JS, and Chart.js files are bundled locally and run immediately with zero installation!

### Option B: Using a Simple Local Server
```bash
# Using VS Code Live Server extension or npx:
npx serve .
# Or run with the included backend:
cd server
npm install
npm start
```

### ⚡ 1-Click Testing with Demo Data
When the app opens, click **"⚡ Load Sample Demo Profile (Priya Sharma, Week 24)"** on the onboarding card. This immediately pre-populates 8 weeks of clinical vitals, prescriptions, appointments, and nutrition data so you can test every chart and feature right away!

---

## 🌐 How to Deploy to GitHub Pages

1. **Create a GitHub Repository**:
   - Go to [GitHub.com](https://github.com) and create a new repository named `MATRENA-AI-2.0` (or `materna-ai-2.0`).

2. **Upload / Push the Files**:
   - Push the contents of this folder to your repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Materna AI 2.0"
   git branch -M main
   git remote add origin https://github.com/<YOUR-USERNAME>/MATRENA-AI-2.0.git
   git push -u origin main
   ```
   *(Alternatively, you can drag and drop all files into GitHub's web interface).*

3. **Enable GitHub Pages**:
   - In your GitHub repository, click on **Settings** (top tabs).
   - In the left menu, click **Pages**.
   - Under **Build and deployment > Source**, select **Deploy from a branch**.
   - Under **Branch**, select `main` (or `master`) and folder `/(root)`.
   - Click **Save**.

4. **Visit Your Live App**:
   - Within 1–2 minutes, your site will be live at:
     `https://<YOUR-USERNAME>.github.io/MATRENA-AI-2.0/`
   - It will work seamlessly on desktop, tablets, and smartphones, and can be installed to home screen as a PWA!

---

## 🔒 Safety & Medical Disclaimer
Materna AI 2.0 is an educational wellness application designed to support expectant mothers. It is not an approved medical device and does not diagnose conditions or prescribe medications. Please consult a qualified obstetric clinician for all health decisions. Review [SAFETY_RULES.md](./SAFETY_RULES.md) for full clinical protocols.
