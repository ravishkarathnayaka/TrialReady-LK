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


## Local Supabase Setup

### Frontend

1. Open the frontend folder:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy `.env.example` and create `.env.local`.

4. Add your Supabase frontend credentials:

   ```env
   VITE_SUPABASE_URL=https://your-project-reference.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   ```

5. Start the frontend:

   ```bash
   npm run dev
   ```

### Backend

1. Open the backend folder:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   python -m pip install -r requirements.txt
   ```

3. Copy `.env.example` and create `.env`.

4. Add your Supabase backend credentials:

   ```env
   SUPABASE_URL=https://your-project-reference.supabase.co
   SUPABASE_SECRET_KEY=your-secret-key
   ```

5. Start the backend:

   ```bash
   python -m uvicorn main:app --reload
   ```

### Security

- Never commit `frontend/.env.local` or `backend/.env`.
- Never expose the Supabase secret key in frontend code.
- Only placeholder credentials should be included in `.env.example` files.