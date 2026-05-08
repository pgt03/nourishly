# Nourishly — How to Run

## One-Time Setup

### 1. Install dependencies
```
cd "C:\AI Training\AI Generalist Accelerator Training\Hackathon\Nourishly"
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### 2. Add your FREE Google Gemini API key
Edit `.env` and replace the placeholder:
```
GOOGLE_AI_KEY=YOUR-GEMINI-KEY-HERE
```
Get your FREE key (no credit card needed):
1. Go to https://aistudio.google.com
2. Sign in with Google
3. Click "Get API key" → "Create API key"
4. Copy and paste it into .env

### 3. Seed demo data (only needed once)
```
cd backend
node --experimental-sqlite seed.js
cd ..
```
Demo accounts created:
- chef@demo.com / demo1234
- cook@demo.com / demo1234

---

## Every Time You Run

Open **two terminals**:

**Terminal 1 — Backend**
```
cd "C:\AI Training\AI Generalist Accelerator Training\Hackathon\Nourishly\backend"
node --experimental-sqlite src/app.js
```

**Terminal 2 — Frontend**
```
cd "C:\AI Training\AI Generalist Accelerator Training\Hackathon\Nourishly\frontend"
npx vite
```

Then open: **http://localhost:5173**

---

## n8n Automation Workflows (Optional)

**Terminal 3 — n8n**
```
npx n8n
```
Open: http://localhost:5678

Import workflows from `n8n/workflows/`:
- Settings → Workflows → Import from file → select each `.json`
- For email workflows: connect your Gmail account in Credentials
- Activate workflows you want to run

---

## What's Built

### Must-Have (all working)
- Sign up / Log in with JWT auth
- Post recipes with photo upload
- Public feed (paginated, newest first)
- Recipe detail page
- Save / unsave recipes
- Edit / delete own recipes

### Should-Have (all working)
- AI recipe description generator (Claude claude-sonnet-4-6)
- User profile page with avatar upload
- Search by title or ingredient
- Filter by difficulty, cuisine, tags

### Could-Have (all working)
- Like / unlike recipes
- Comments on recipes
- AI ingredient substitution
- "What's in your fridge?" AI recipe generator
- Budget / 15-min / kid-friendly tags and filters

### n8n Automations (6 workflows)
1. Welcome email on signup
2. Auto AI-enhance recipe descriptions on post
3. Daily recipe digest email (7am cron)
4. Popularity tracking on saves
5. Ingredient substitution pipeline
6. Fridge recipe generator pipeline

---

## API Health Check
http://localhost:3001/api/health
