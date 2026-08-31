# DMT Regulatory Compliance Specification — Sri Lanka

> **Regulatory Reference:** Motor Traffic Act No. 14 of 1951 (Sri Lanka) & Amendments  
> **Target Authorities:** Department of Motor Traffic (DMT) & National Transport Medical Institute (NTMI)  
> **System Alignment:** TrialReady LK Driving Academy Management System

---

## 1. Regulatory Context

In Sri Lanka, obtaining a driver's licence is strictly governed by the **Department of Motor Traffic (DMT / මෝටර් රථ ප්‍රවාහන දෙපාර්තමේන්තුව)** under the statutory framework of the *Motor Traffic Act No. 14 of 1951*.

Driving academies are required by law to maintain verified candidate logs, enforce mandatory medical and permit validity windows, and certify learner proficiency before presenting candidates for practical examinations.

**TrialReady LK** directly enforces these statutory mandates in software.

---

## 2. Regulatory Compliance Matrix

| Statutory Mandate | DMT Legal Requirement | TrialReady LK Implementation | Enforcement Mechanism |
| :--- | :--- | :--- | :--- |
| **NTMI Medical Fitness** | Valid medical certificate from the National Transport Medical Institute (Form MTA 30). | Stage 2 of Learner Pipeline; tracks certificate number, NTMI branch, and validity window. | AI Readiness blocks trial qualification if medical is missing or expired. |
| **Learner's Permit (6 Months)** | DMT Learner Permit is valid for exactly **6 months** (180 days) from issue date. | Dynamic countdown engine (`journeyUtils.ts`) calculates remaining days; alerts trigger at $\le 30$ days. | Stage 3 marks permit as `Blocked (Expired)` once days left $< 0$. |
| **DMT Theory Exam** | 40 computerized MCQs covering Highway Code; candidate must score $\ge 75\%$ (30/40). | Mock Exam Simulator with authentic Sri Lanka Highway Code questions in **English, Sinhala, and Tamil**. | Theory status recorded with attempt number and score. |
| **Mandatory Training Log** | Driving school must log practical training sessions, vehicle registration, and hours. | **Official DMT Practical Training Logbook (`DMT/SL/LOG-01`)** generated in A4 printable layout. | Aggregates all verified instructor sessions, vehicle registrations, and skills covered. |
| **DMT Trial Grounds Pass** | Candidate must present an official admission docket and valid paperwork on trial day. | **Candidate Practical Trial Admission Slip (`DMT/SL/ADM-PASS`)** with 8-maneuver scorecard. | Includes required documents checklist (NIC, Permit, Medical, Logbook, Photos). |

---

## 3. Mandatory Practical Trial Maneuvers

The Department of Motor Traffic assesses candidate driving competence on 8 standardized practical maneuvers. TrialReady LK embeds these directly into the instructor evaluation checklist and the examiner trial scorecard:

1. **Gradient Start / Hill Start**: Stopping on an incline and moving forward without rolling back using proper handbrake and clutch balance.
2. **Reverse S-Bend (Serpentine)**: Reversing through curved cone markers without touching boundary lines or stopping abruptly.
3. **Parallel Parking**: Parking between simulated vehicles within 30cm of the curb.
4. **Three-Point Turn (K-Turn)**: Turning the vehicle around in a narrow roadway using forward and reverse gears safely.
5. **On-Road Traffic Driving**: Demonstrating vehicle control, speed limits, mirror checks, and indicator discipline in live Sri Lankan urban traffic.
6. **Emergency Braking Response**: Controlled rapid stop on command without wheel lockup or loss of steering control.
7. **Lane Discipline & Roundabout Entry**: Correct lane selection, right-of-way yielding, and signaling at multi-lane roundabouts.
8. **Overall Road Awareness & Courtesy**: Observation of pedestrian crossings (Zebra crossings), school zones, and defensive driving habits.

---

## 4. Official Document Reference Codes

| Document Title | Reference Code | Purpose |
| :--- | :--- | :--- |
| **Practical Training Logbook** | `DMT/SL/LOG-01` | Official summary of candidate driving hours, instructor endorsements, and AI readiness certification. |
| **Trial Day Candidate Pass** | `DMT/SL/ADM-PASS` | Admission slip presented at DMT Practical Test Ground (e.g., Werahera, Kandy, Kurunegala). |
| **NTMI Medical Fitness Docket** | `NTMI/MTA-30` | Transport medical examination clearance record. |
| **Candidate Compliance Audit** | `DMT/AUDIT-CSV` | RFC-4180 audit export for official DMT academy inspection audits. |
