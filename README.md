# Student Task Manager // Academic OS

A modern, student-focused academic task management website built with a monospace Berkeley Mono aesthetic, layered frontend architecture, and a Node.js/Express backend powered by Google Gemini AI (`@google/genai`).

---

## 📁 Project Structure

```
student-task-management/
├── frontend/                     # React 19 + Vite Frontend
│   ├── public/                   # Static assets & SVG icons
│   ├── src/
│   │   ├── components/           # Header, TaskCard, TaskForm, SummaryCard, etc.
│   │   ├── pages/                # Dashboard, Tasks, Calendar, Profile, Settings
│   │   ├── services/
│   │   │   ├── api.js            # Dual-mode REST API Client with localStorage fallback
│   │   │   ├── taskService.js    # Task computations and filtering logic
│   │   │   └── storageService.js # LocalStorage backup and JSON export/import
│   │   ├── data/                 # Initial mock academic tasks
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── vite.config.js            # Proxy configured for /api -> http://localhost:5000
│   ├── package.json
│   └── .env.example
│
├── backend/                      # Node.js + Express REST API
│   ├── src/
│   │   ├── config/               # Gemini client initialization
│   │   ├── controllers/          # Task, Profile, and AI controllers
│   │   ├── routes/               # API route definitions
│   │   ├── services/             # Gemini service & JSON database repository
│   │   ├── data/                 # Initial seed dataset
│   │   └── server.js             # Express application entrypoint
│   ├── data/                     # Persistent JSON database (tasks.json, profile.json)
│   ├── package.json
│   └── .env.example              # Gemini API key template
│
├── design/                       # Design specification and requirements
├── package.json                  # Root runner scripts
└── README.md
```

---

## ⚡ Quick Start

### 1. Install Dependencies

Install root, frontend, and backend dependencies:
```bash
# Frontend dependencies
npm --prefix frontend install

# Backend dependencies
npm --prefix backend install
```

### 2. Configure Environment Variables

Create `.env` in `backend/` based on `backend/.env.example`:
```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` and add your free Google Gemini API key:
```env
PORT=5000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```
> **Get a Free Gemini API Key**: Visit [Google AI Studio](https://aistudio.google.com/app/apikey) to generate a free API key.

### 3. Run the Application

You can run both or either service:

- **Run Backend Server (Port 5000)**:
  ```bash
  npm run backend
  ```

- **Run Frontend Dev Server (Port 5173)**:
  ```bash
  npm run dev
  ```

Visit **http://localhost:5173** to use the application!

---

## 🤖 Google Gemini AI Features

- **Task Breakdown (`POST /api/ai/breakdown`)**: Automatically splits complex academic assignments into actionable, timed subtasks.
- **Daily Study Plan Generator (`POST /api/ai/study-plan`)**: Generates an optimized, time-blocked daily study schedule based on deadlines, priorities, and study habits.
- **Concept Explainer (`POST /api/ai/explain`)**: Provides clear, tailored explanations and study strategies for difficult academic topics.

---

## 🔌 Offline / Fallback Capability

The frontend features a dual-mode data layer:
- **Connected (Backend Running)**: Communicates directly with the Express REST API and saves changes to persistent storage.
- **Offline / Local Mode**: Seamlessly switches to browser `localStorage` when the backend is not reachable, with zero feature interruption.

---

## ⌨️ Global Keyboard Shortcuts

- <kbd>N</kbd> — Open Add Task form
- <kbd>/</kbd> — Focus task search bar
- <kbd>T</kbd> — Toggle interactive TUI Terminal
- <kbd>1</kbd> to <kbd>5</kbd> — Switch pages (Dashboard, Tasks, Calendar, Profile, Settings)
- <kbd>Esc</kbd> — Close any open modal or drawer
