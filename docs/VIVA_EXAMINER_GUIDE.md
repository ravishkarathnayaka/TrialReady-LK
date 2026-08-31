# Viva & Examiner Demonstration Guide — TrialReady LK

> **BSc (Hons) in Cyber Security — Final Project Demonstration**  
> **Candidate:** Ravishka Rathnayaka  
> **Project Title:** TrialReady LK: AI-Assisted Driving Academy Management & Regulatory Compliance System

---

## 🎯 1. Demonstration Outline (10-Minute Walkthrough)

This guide provides a structured walkthrough for the viva examination panel, demonstrating all core system capabilities across the three distinct user personas.

---

## 🚀 2. Pre-Demonstration Setup (1-Click)

1. Launch development server:
   ```bash
   cd frontend
   npm run dev
   ```
2. Open **`http://localhost:5173`** in your browser.
3. Click the **`🌱 Demo Data`** button in the header navigation bar to populate the complete Sri Lankan Driving Academy dataset (Royal Driving Academy, 3 branches, 4 instructors, 5 vehicles, 5 student personas across all readiness tiers).

---

## 🎭 3. Persona Walkthrough Script

### Act 1: Administrator View (`Role: Administrator`)
1. **Executive Analytics (`/analytics`)**:
   - Show the **DMT Practical Trial Pass Rate KPI (78%)**, first-attempt vs repeat attempt benchmarks, and the **Failure Point Distribution Bar Chart** (Hill Start rollback, Reverse S-Bend).
   - Click **`📥 Export Audit Logs`** $\rightarrow$ Show the **RFC-4180 UTF-8 CSV download** formatted for DMT regulatory inspections.
2. **Learner Journey Pipeline (`/journey` $\rightarrow$ Student: Kavindu Dilshan)**:
   - Walk through the visual **7-Stage Compliance Pipeline**.
   - Show the **6-Month DMT Learner Permit dynamic countdown** (e.g., *Active, 73 days remaining*).
   - Show the **NTMI Medical Fitness Clearance**.
3. **Official DMT Document Generation**:
   - Click **`📄 View DMT Logbook`** $\rightarrow$ Show the pixel-perfect A4 official practical logbook (`DMT/SL/LOG-01`) complete with session history and principal instructor signature block.
   - Click **`🎫 Print Trial Pass`** $\rightarrow$ Show the trial admission slip (`DMT/SL/ADM-PASS`) with the **DMT Examiner 8-Maneuver Scorecard**.
4. **AI Trial Readiness Hub (`/readiness`)**:
   - Inspect the **6-factor radar evaluation**: Permit validity, Medical fitness, Theory clearance, Practical road hours, Maneuver checklist, Instructor rating.
   - Point out how expired permits automatically trigger risk warnings and block trial registration.

---

### Act 2: Instructor View (`Switch Role: Instructor` $\rightarrow$ `/instructor/portal`)
1. **Today's Practical Agenda**:
   - View assigned morning and afternoon driving lessons with vehicle registration (`WP CAB-4921`) and learner category (Class B).
2. **Session Attendance & Skill Evaluation**:
   - Open a scheduled session $\rightarrow$ Mark attendance as `Present` $\rightarrow$ Check off mastered maneuvers (*Hill Start*, *Parallel Parking*) $\rightarrow$ Give a 5-star student rating.
   - Observe how the student's AI Readiness Score recalculates immediately in real-time.

---

### Act 3: Student View (`Switch Role: Student` $\rightarrow$ `/student/portal` & `/theory`)
1. **Student Self-Service Portal**:
   - View personalized **Permit Expiry Countdown Badge** (*Never miss the 6-month DMT deadline*).
   - View enrolled package (*Standard Car Auto+Manual*) and remaining instalment balance.
   - Access personal **DMT Logbook & Trial Admission Slip**.
2. **Trilingual DMT Highway Code & Mock Exam (`/theory`)**:
   - Click the language selector: switch between **English $\leftrightarrow$ සිංහල (Sinhala) $\leftrightarrow$ தமிழ் (Tamil)**.
   - Launch the **40-Question Timed Mock Exam**: Demonstrate question randomization, 45-minute countdown timer, road signs flashcards, and instant pass/fail score certification.

---

## 🛡️ 4. Key Cyber Security & Quality Highlights for the Panel

1. **Row Level Security (RLS)**: Enforces multi-tenant data segregation at the database kernel level; no driving school can ever read another academy's candidate records.
2. **Defensive CSV Sanitization**: Protection against Spreadsheet Formula Injection (`CSV Injection`) by sanitizing cells starting with `=`, `+`, `-`, or `@`.
3. **Automated Unit & Integration Testing**:
   - Run in terminal: `npm test`
   - Show **36 tests passing across 7 test suites** in under 3 seconds using Vitest.
4. **Browser-Native A4 Print Layout**: Zero reliance on third-party PDF server rendering engines, eliminating server-side rendering attack vectors.
