# TrialReady LK

TrialReady LK is a driving school management platform designed for Sri Lankan driving schools.

## Project Structure

- `frontend/` – React, TypeScript, Vite and Tailwind CSS
- `backend/` – FastAPI backend
- `supabase/migrations/` – Database migration files
- `docs/` – Project documentation

## Frontend Setup

From the main project folder:

```powershell
cd frontend
npm install
npm run dev
```

The frontend will usually run at:

```text
http://localhost:5173
```

## Backend Setup

From the main project folder:

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
fastapi dev main.py
```

The backend will run at:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

## Environment Variables

Copy `.env.example` and create a local `.env` file:

```powershell
Copy-Item .env.example .env
```

Add the required local credentials to `.env`.

Never commit the `.env` file or real secret keys to GitHub.