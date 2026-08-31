# Live Hosting & Custom Domain Setup Guide — TrialReady LK

> **Target Goal:** Deploy TrialReady LK to production with 100% free hosting, automatic HTTPS SSL certificates, and a custom domain for your live viva examination demonstration.  
> **Recommended Hosting Platform:** **Vercel** (Free Tier — zero config, global edge CDN, automatic CI/CD on git push).

---

## 🏗️ Architecture Summary for Live Deployment

```mermaid
graph LR
    User[Examiner Browser] --> Domain["Custom Domain (e.g. trialready.lk)"]
    Domain --> DNS[Cloudflare / Domain Registrar DNS]
    DNS --> Vercel[Vercel Global Edge CDN (Frontend SPA)]
    Vercel --> Supabase[(Cloud Supabase PostgreSQL & Auth)]
```

---

## 📋 Step 1: Prepare Cloud Supabase Database

1. Log in to [https://supabase.com](https://supabase.com) and create a free project (e.g., `trialready-lk-prod`).
2. Go to **SQL Editor** in your Supabase dashboard.
3. Open `supabase/migrations/20260808115000_core_foundation.sql` (and subsequent migration files in `supabase/migrations/`) $\rightarrow$ Click **Run** to execute the database schema.
4. Copy the contents of `supabase/seed.sql` $\rightarrow$ Paste in the **SQL Editor** $\rightarrow$ Click **Run** to seed Royal Driving Academy, branches, instructors, vehicles, and student personas.
5. In your Supabase Dashboard:
   - Go to **Project Settings** $\rightarrow$ **API**.
   - Copy your **Project URL** (`https://xyzcompany.supabase.co`).
   - Copy your **anon / public key** (`eyJhbGciOi...`).

---

## 🚀 Step 2: Deploy Frontend to Vercel (5 Minutes)

1. Go to [https://vercel.com](https://vercel.com) and **Log In with GitHub**.
2. On your Vercel dashboard, click **`Add New...`** $\rightarrow$ **`Project`**.
3. Select your GitHub repository: **`ravishkarathnayaka/TrialReady-LK`** $\rightarrow$ Click **Import**.
4. Configure Project Settings:
   - **Framework Preset:** `Vite` (automatically detected).
   - **Root Directory:** Click **Edit** and select **`frontend`**.
   - **Build Command:** `npm run build` (default).
   - **Output Directory:** `dist` (default).
5. Expand **Environment Variables** and add:
   | Key | Value (from Supabase Step 1) |
   | :--- | :--- |
   | `VITE_SUPABASE_URL` | `https://your-project.supabase.co` |
   | `VITE_SUPABASE_PUBLISHABLE_KEY` | `your-supabase-anon-key` |
6. Click **Deploy**! 🚀
   - Vercel will build and deploy your application in ~45 seconds.
   - You will receive a live `.vercel.app` URL (e.g. `https://trialready-lk.vercel.app`).

---

## 🌐 Step 3: Connect Your Custom Domain

You can use any custom domain (e.g., `trialready.lk`, `trialreadylk.com`, `app.yourname.com`, etc.) from registrars like **LK Domain Registry (domains.lk)**, **Namecheap**, **GoDaddy**, or **Cloudflare**.

### 1. In Vercel:
1. Open your project on Vercel $\rightarrow$ Go to **Settings** $\rightarrow$ **Domains**.
2. Enter your custom domain (e.g., `trialready.lk` or `app.trialready.lk`) $\rightarrow$ Click **Add**.
3. Vercel will show the exact **DNS Records** to configure.

### 2. In Your Domain Registrar / DNS Manager:
Log in to where you purchased your domain and add the following DNS records:

#### Option A: Root Domain (e.g. `trialready.lk`)
| Type | Name / Host | Value / Destination | TTL |
| :---: | :---: | :---: | :---: |
| **A** | `@` (or blank) | `76.76.21.21` | Automatic / 300 |
| **CNAME** | `www` | `cname.vercel-dns.com` | Automatic / 300 |

#### Option B: Subdomain (e.g. `app.trialready.lk` or `demo.yourdomain.com`)
| Type | Name / Host | Value / Destination | TTL |
| :---: | :---: | :---: | :---: |
| **CNAME** | `app` (or `demo`) | `cname.vercel-dns.com` | Automatic / 300 |

---

## 🔒 Step 4: Automatic SSL Certificate & Verification

* Once DNS records are saved, Vercel will automatically verify the records (usually takes 1 to 5 minutes).
* Vercel will issue a **free, automatic Let's Encrypt SSL/TLS Certificate** for HTTPS security (`https://yourdomain.lk`).
* You will see a green **`Valid Configuration`** checkmark in Vercel.

---

## 🎯 Step 5: Live Viva Demonstration Checklist

Before presenting live to the examination panel:

- [ ] **Open live custom URL in browser** (e.g., `https://trialready.lk`).
- [ ] **Verify SSL Padlock**: Ensure HTTPS is secure.
- [ ] **1-Click Demo Data**: Verify the `🌱 Demo Data` button seeds data correctly on the cloud database.
- [ ] **Test Trilingual Toggle**: Switch between English, Sinhala (සිංහල), and Tamil (தமிழ்) on `/theory`.
- [ ] **Test AI Copilot**: Open the floating assistant and ask a test question.
- [ ] **Test Print Layout**: Open a student logbook $\rightarrow$ Click *Print / Save as PDF* to show the A4 layout.
- [ ] **Offline Backup Ready**: Keep your local dev server running in terminal (`npm run dev`) as a contingency fallback.
