# TEAM START HERE — TrialReady LK

> Last updated: 23 July 2026
> Development deadline: 20 August 2026
> Repository: <https://github.com/ravishkarathnayaka/TrialReady-LK>

Welcome to the TrialReady LK development team. Read this document completely
before starting an issue.

This file explains what we are building, what has already been completed, how
the four developers work in parallel, and the rules every contributor must
follow. GitHub issues and repository documentation are the source of truth.
Important decisions must not exist only inside private ChatGPT conversations.

## 1. Project Overview

**TrialReady LK** is an AI-assisted, customisable web platform for Sri Lankan
driving schools. It manages a learner's journey from initial registration to the
final practical trial.

The product aims to replace disconnected paper records, spreadsheets, calendar
entries, and manual reminders with one secure system.

**Product promise:** From registration to trial, nothing gets missed.

The target for 20 August 2026 is a small but complete and demonstrable final
product—not a collection of disconnected screens.

## 2. User Roles

| Role | Main capabilities |
| --- | --- |
| **Administrator** | Manage the driving school, users, students, packages, instructors, vehicles, documents, medical appointments, permits, schedules, trials, payments, reports, settings, and audit records |
| **Instructor** | View assigned students and sessions, record attendance, update practical progress, add evaluations, and view schedule changes |
| **Student** | View personal progress, upcoming sessions, medical/permit status, exam and trial dates, payment status, reminders, and recommendations |

Every protected page and data operation must enforce the correct role. Hiding a
button in the interface is not enough; permissions must also be enforced in the
database or backend.

## 3. Finalised Product Scope

The UI/UX requirements and Figma design specification for the Administrator,
Instructor, and Student interfaces were finalised on 22 July 2026. Development
must follow that specification without adding unapproved features.

### In scope

- Secure authentication and role-based access
- Driving-school profile and customisation
- User and role management
- Student registration and profile management
- Instructor, vehicle, licence-category, and package management
- Student document tracking
- Medical appointment and medical-status tracking
- Learner's permit details, validity, and expiry alerts
- Theory and practical session scheduling
- Attendance and instructor evaluation
- Automated calendar and schedule-conflict detection
- Exam and practical-trial date tracking
- Student journey/progress tracking
- AI-assisted readiness and next-action recommendations
- Manual payment, balance, income, and report tracking
- Automated in-app or supported reminder notifications
- Student and instructor portals
- DMT application summary/print support
- Dashboards and operational reports
- Settings and audit logging

### Out of scope for the 20 August release

- Direct integration with the Department of Motor Traffic
- Native Android or iOS applications
- GPS vehicle tracking
- Real online payment processing
- WhatsApp integration
- Facial recognition
- Training a custom AI model

Do not add an out-of-scope feature unless the whole team approves the scope,
deadline impact, and GitHub issue first.

## 4. AI Feature Boundary

The AI feature should analyse validated student-journey data and return a
structured recommendation, such as readiness, the next required action, or a
warning about missing requirements.

- Use an existing LLM API; do not train a custom model.
- Require structured output.
- Validate all AI output in the backend.
- Never allow AI output to directly change important records.
- Show recommendations as assistance, not as official DMT decisions.
- Do not send unnecessary personal or sensitive data to the AI provider.
- Provide a safe non-AI fallback when the AI service is unavailable.

## 5. Technology Stack

| Area | Technology |
| --- | --- |
| Frontend | React, TypeScript, Vite, Tailwind CSS, FullCalendar |
| Backend | Python, FastAPI, REST APIs |
| Database and services | Supabase, PostgreSQL, Supabase Authentication and Storage |
| AI | LLM API with structured output and backend validation |
| Planned deployment | Vercel for frontend, Render or Railway for backend, Supabase for managed data services |
| Testing and security | ESLint, Vite build, Pytest, Postman, OWASP ZAP, RBAC, RLS, validation, and audit logs |
| Collaboration | GitHub, GitHub Issues/Projects, Figma, Draw.io, and shared project documentation |

## 6. Repository Structure

```text
TrialReady-LK/
├── backend/
│   ├── .env.example
│   ├── main.py
│   ├── requirements.txt
│   └── supabase_client.py
├── docs/
│   └── TEAM_START_HERE.md
├── frontend/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       └── lib/
│           └── supabase.ts
└── README.md
```

Additional feature folders and database migrations will be added through their
assigned GitHub issues. Check the current repository before creating a new
directory or moving an existing file.

## 7. Work Completed So Far

As of 23 July 2026:

- The repository and frontend/backend foundations are available.
- The final UI/UX requirements and Figma generation specification are complete.
- Frontend and backend Supabase clients are configured.
- Safe frontend and backend `.env.example` templates are included.
- Real local environment files are ignored by Git.
- Frontend lint and production build checks passed.
- Backend dependency and Python compilation checks passed.
- A live read-only Supabase connection test passed.
- Supabase setup was merged through PR #6, which closed Issue #5.
- `main` was clean and updated to merge commit `7c594d0` after PR #6.

The finalised design specification is complete, but this does not mean all
screens have already been implemented in code.

### Project links

- GitHub repository: <https://github.com/ravishkarathnayaka/TrialReady-LK>
-- Final Figma design: To be added after the Figma design is created
- GitHub Project board: <https://github.com/users/ravishkarathnayaka/projects/1/views/1>

## 8. Team Development Ownership

Every team member owns a real development area. Ravishka coordinates integration
and quality, but is also responsible for developing a complete module.

| Member | Primary development ownership | First branch |
| --- | --- | --- |
| **Ravishka** | Student Registration and Student Management: forms, list, search/filter, profiles, editing, status handling, validation, integration, and tests | `feature/student-management` |
| **Loshan** | Shared UI component library, dashboard shell, header, sidebar, forms, tables, cards, modals, and responsive consistency | `feature/ui-component-library` |
| **Anuhas** | Authentication flow, Supabase sessions, routes, protected pages, role-based navigation, and frontend service foundation | `feature/frontend-auth-routing` |
| **Dilshan** | Supabase database schema, relationships, migrations, RLS policies, FastAPI data access, backend services, and database documentation | `feature/database-schema` |

### File ownership boundaries

- Ravishka owns student-feature files.
- Loshan owns shared UI and layout files.
- Anuhas owns authentication, session, and routing files.
- Dilshan owns migrations, database policies, and backend data-access files.
- A developer must request a review from the owner before changing another
  member's core area.
- Shared contracts must be agreed in the related GitHub issue before code is
  changed.

## 9. How Parallel Development Works

Parallel development does not mean everyone edits the same files at the same
time. Each person works from the latest `main` branch on one assigned issue and
one separate feature branch.

### First parallel development round

#### Ravishka — Student Management

Start with:

- Student feature structure
- Registration form
- Student list and details screens
- Client-side validation
- Loading, empty, success, and error states

Do not invent database fields. Agree on the student data contract with Dilshan
in the GitHub issue before implementing database integration.

#### Loshan — Shared UI Foundation

Start with:

- Application shell
- Sidebar and header
- Reusable buttons, inputs, form fields, cards, tables, badges, and modals
- Responsive behaviour
- Visual states required by the final Figma design

Publish component names, props, and usage examples in the issue or pull request
so feature developers can reuse them.

#### Anuhas — Authentication and Routing

Start with:

- Login flow
- Supabase session handling
- Protected routes
- Role checks
- Administrator, Instructor, and Student route groups
- Loading, logout, expired-session, and unauthorised states

Publish the session and user-role TypeScript contracts for other frontend
features.

#### Dilshan — Database and Backend Foundation

Start with the approved entities for:

- Driving schools
- Profiles and roles
- Students
- Instructors
- Vehicles and packages
- Documents and medical appointments
- Learner permits
- Theory and practical sessions
- Attendance and evaluations
- Exams and trials
- Payments
- Reminders and audit logs

Document table relationships, required fields, constraints, indexes, RLS
policies, and the initial API contracts before asking others to integrate.

### Integration order

The four branches may begin together, but shared foundations should normally be
merged in this order:

1. Database schema and agreed data contracts
2. Shared UI components
3. Authentication, sessions, and role routing
4. Student Management integration

Other pull requests can remain open as drafts while dependencies are reviewed.
Before final review, update the branch from the latest `main` and rerun all
checks.

## 10. First-Time Local Setup

These commands are for a new team member. Run them from PowerShell.

### Clone the repository

```powershell
git clone https://github.com/ravishkarathnayaka/TrialReady-LK.git
cd TrialReady-LK
git switch main
git pull origin main
```

### Frontend

```powershell
cd frontend
npm install
Copy-Item .env.example .env.local
npm run dev
```

Add the approved local frontend values to `frontend/.env.local`. Do not paste
credentials into GitHub, ChatGPT, screenshots, or this document.

Frontend environment-variable names:

```env
VITE_SUPABASE_URL=https://your-project-reference.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Stop the development server when the test is complete, then return to the
repository root:

```powershell
cd ..
```

### Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
python -m uvicorn main:app --reload
```

Add the approved local backend values to `backend/.env`. Only a team member who
needs backend access should receive the backend secret through an approved
private method.

Backend environment-variable names:

```env
SUPABASE_URL=https://your-project-reference.supabase.co
SUPABASE_SECRET_KEY=your-secret-key
```

Never use the backend secret key in frontend code.

### Initial verification

From the repository root:

```powershell
cd frontend
npm run lint
npm run build
cd ..

cd backend
python -m pip check
python -m py_compile main.py supabase_client.py
cd ..

git status --short
```

If setup changes are shown unexpectedly, stop and ask before staging anything.

## 11. Starting an Assigned Issue

Do not begin from an old branch. From the repository root:

```powershell
git switch main
git pull origin main
git switch -c <your-branch-name>
git branch --show-current
```

Before writing code:

1. Read this document.
2. Read the complete assigned GitHub issue.
3. Confirm the objective and acceptance criteria.
4. Confirm which files and folders you own.
5. Confirm database, API, UI, and role dependencies.
6. Move the issue from `Ready` to `In Progress`.
7. Post a short issue comment stating what you will implement.

Do not start coding when the issue requirements or ownership boundaries are
unclear.

## 12. Standard Git and Pull-Request Workflow

Use this flow for every development issue:

```text
GitHub issue
  → branch from latest main
  → implement only the assigned scope
  → test locally
  → commit intentionally
  → push feature branch
  → open pull request into main
  → peer review
  → functional testing
  → merge
  → delete feature branch
```

### Branch names

```text
feature/<short-feature-name>
fix/<short-bug-name>
chore/<short-maintenance-name>
docs/<short-document-name>
```

Rules:

- Never commit directly to `main`.
- Never develop on another member's branch.
- One GitHub issue should have one clear owner.
- Keep each pull request focused on one issue.
- Do not mix unrelated formatting or refactoring into a feature pull request.
- Never merge your own pull request without review.
- Do not merge a pull request with failed checks or unresolved comments.
- Target pull requests to `main` unless the team formally changes the workflow.

### Before committing

```powershell
git status --short
git diff --check
git diff
```

Stage only the intended files. Do not use `git add .` without reviewing the
complete status.

### Before opening a pull request

```powershell
git fetch origin
git merge origin/main
git diff --check
git status --short
```

Resolve conflicts with the relevant file owner. After testing, push the branch
and open a pull request that links the issue:

```markdown
Closes #<issue-number>
```

## 13. Required Checks

Run the checks relevant to the files you changed.

### Frontend

```powershell
cd frontend
npm run lint
npm run build
```

Also manually test:

- Correct role access
- Form validation
- Loading, empty, success, and failure states
- Desktop and mobile layouts
- Keyboard navigation for important controls
- No errors in the browser console

### Backend

```powershell
cd backend
python -m pip check
python -m py_compile main.py supabase_client.py
python -m pytest
```

If the project does not yet contain tests for the changed behaviour, add them
within the issue scope or clearly document the manual API tests in the pull
request.

### Final repository check

```powershell
git diff --check
git status --short
```

## 14. Security Rules

These rules are mandatory:

- Never commit `backend/.env` or `frontend/.env.local`.
- Never expose secret keys, passwords, access tokens, or private user data in
  code, screenshots, GitHub issues, pull requests, or ChatGPT.
- Never place `SUPABASE_SECRET_KEY` in frontend code.
- Use placeholder values only in `.env.example` and documentation.
- Rotate a secret immediately if it is exposed.
- Enforce role permissions in the backend/database, not only in the UI.
- Apply and test Supabase Row Level Security.
- Validate data in both frontend and backend.
- Treat browser input and AI output as untrusted.
- Use safe error messages that do not reveal secrets or internal details.
- Add audit records for important administrative actions.
- Use test data instead of real student data during development and demos.
- Do not disable security controls just to make a feature work.

## 15. GitHub Issue Format

Every development issue should use this structure:

```markdown
## Objective

Describe the single outcome this issue must deliver.

## Requirements

- List the exact functionality.
- Identify the relevant user role.
- Link the final Figma frame where applicable.

## Files / Area Owned

- List the folders or files the assignee may change.

## Dependencies and Contracts

- Link required schema, API, shared components, or other issues.

## Acceptance Criteria

- [ ] State observable completion conditions.
- [ ] Include permission and error-state behaviour.
- [ ] Include responsive behaviour for frontend work.

## Testing

- List automated commands.
- List required manual tests.

## Deliverables

- [ ] Working code
- [ ] Tests or documented manual results
- [ ] Relevant screenshots
- [ ] Updated documentation where required
- [ ] Pull request linked with `Closes #<issue-number>`
```

## 16. Pull-Request Review Ownership

- Loshan and Anuhas review each other's frontend work.
- Anuhas reviews frontend-to-backend contracts.
- Dilshan reviews database, RLS, and backend data changes.
- Ravishka performs functional and requirement testing.
- The owner of a shared area must review changes to that area.
- At least one teammate other than the author must approve before merge.

Review the behaviour, security, scope, and tests—not only the appearance of the
code.

## 17. Definition of Done

An issue is `Done` only when:

- All acceptance criteria are satisfied.
- The implementation matches the finalised UI and product scope.
- Role and security behaviour is correct.
- Required automated checks pass.
- Manual tests are recorded in the pull request.
- No secret or real personal data is included.
- Documentation is updated where necessary.
- Another teammate reviewed the pull request.
- The pull request was merged into `main`.
- The related GitHub issue closed.
- The local and remote feature branches were cleaned up when appropriate.

Working only on a developer's laptop does not mean the issue is complete.

## 18. Communication Rules

- Use GitHub issues for requirements, decisions, dependencies, and progress.
- Use pull-request comments for code-review discussions.
- Use the team communication channel for short coordination and urgent blockers.
- Record any final decision from a call or private message in the GitHub issue.
- Report blockers early; do not silently change the design or scope.
- Include the issue number when discussing development work.
- Keep the GitHub Project updated:

```text
Backlog → Ready → In Progress → In Review → Testing → Done
```

## 19. Using ChatGPT Safely for an Issue

Every member must use their own ChatGPT account. Do not share account passwords.
The team may use the shared project `TrialReady LK – Team Workspace`, but GitHub
issues and repository files remain the source of truth.

Start a separate chat for each issue and use:

```text
I am developing TrialReady LK with a four-member team.

My assigned GitHub issue is pasted below. Guide me through only this issue,
one verified step at a time.

Before giving code:
1. Explain the current step.
2. Check the issue's dependencies and acceptance criteria.
3. Tell me the exact file to create or modify.
4. Do not change anything outside my assigned scope.
5. Follow the final TrialReady LK UI and product requirements.
6. Do not expose or commit credentials, environment files, or personal data.
7. Ask me to test each completed stage before continuing.
8. Do not commit, push, or merge until the changes are reviewed.
9. Use GitHub issues and repository documentation as the source of truth.

Assigned issue:
[PASTE THE COMPLETE GITHUB ISSUE HERE]
```

AI assistance does not replace understanding, testing, peer review, or security
checks. Never paste real credentials or private student records into an AI chat.

## 20. New Member Start Checklist

- [ ] I have my own GitHub account and repository access.
- [ ] I read `docs/TEAM_START_HERE.md`.
- [ ] I can run the frontend locally.
- [ ] I can run the backend locally.
- [ ] My real environment files are not visible in `git status --short`.
- [ ] I can access the final Figma design.
- [ ] I understand the three user roles and approved scope.
- [ ] I have one assigned GitHub issue.
- [ ] I know my owned files and dependencies.
- [ ] I created my branch from the latest `main`.
- [ ] I moved my issue to `In Progress`.
- [ ] I know which teammate will review my pull request.

If any item is incomplete, resolve it before beginning feature development.
