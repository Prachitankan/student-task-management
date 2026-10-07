# Student Task Manager // Backend API

Express.js REST API with **Google Gemini AI** integration and persistent file storage for the Student Task Manager.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Open `.env` and set your configuration:
```env
PORT=5000
GEMINI_API_KEY=YOUR_FREE_GEMINI_API_KEY_HERE
GEMINI_MODEL=gemini-2.5-flash
```

> **🔑 How to get a free Google Gemini API key:**
> 1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey).
> 2. Sign in with your Google Account.
> 3. Click **"Create API Key"**.
> 4. Copy the key and paste it as `GEMINI_API_KEY` in `backend/.env`.

### 3. Run the Backend
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server starts at **http://localhost:5000**.

---

## 📡 REST API Endpoints

### 1. System Health
- **`GET /api/health`**
  - Returns service status and Gemini AI configuration status.

### 2. Tasks Management
- **`GET /api/tasks`** — Retrieve all tasks (supports query filters: `?search=...&status=...&priority=...&subject=...`)
- **`GET /api/tasks/:id`** — Get a single task by ID
- **`GET /api/tasks/stats`** — Get summary counts (total, completed, pending, completion rate)
- **`POST /api/tasks`** — Create a new task
- **`PUT /api/tasks/:id`** — Update an existing task
- **`PATCH /api/tasks/:id/status`** — Toggle status between `Pending` and `Completed`
- **`DELETE /api/tasks/:id`** — Delete a task

### 3. Student Profile
- **`GET /api/profile`** — Fetch academic student profile
- **`PUT /api/profile`** — Update student profile (GPA, major, semester, study goal)

---

## 🧠 Google Gemini AI Endpoints

### 1. Smart Task Breakdown
- **`POST /api/ai/breakdown`**
  - Analyzes a task and generates actionable study milestones with estimated minutes and tips.
  - **Payload:**
    ```json
    {
      "title": "Complete DBMS Normalization Assignment",
      "subject": "DBMS",
      "description": "Solve 3NF and BCNF questions",
      "estimatedHours": 3.5
    }
    ```

### 2. Daily Study Schedule Generator
- **`POST /api/ai/study-plan`**
  - Analyzes unfinished assignments and designs a focused daily study schedule.
  - **Payload:**
    ```json
    {
      "dailyGoalHours": 4
    }
    ```

### 3. Academic Concept Explainer
- **`POST /api/ai/explain`**
  - Explains concepts and provides exam revision tips for any coursework topic.
  - **Payload:**
    ```json
    {
      "topic": "Difference between 3NF and BCNF",
      "subject": "DBMS"
    }
    ```

---

## 💾 Data Persistence

All data is stored in `backend/data/tasks.json` and `backend/data/profile.json`. Data persists across restarts without needing an external database setup, while the architecture uses repository controllers that can easily connect to MongoDB or PostgreSQL later.
