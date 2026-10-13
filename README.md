# 🎓 Student Task Manager

A simple, beginner-friendly Full Stack web application to help students manage and track their daily assignments, homework, and deadlines.

---

## 🛠️ Tech Stack

- **Frontend:** React 19 + Vite (Plain CSS, no heavy dependencies)
- **Backend:** Node.js + Express
- **Storage:** JSON file storage (`backend/data/tasks.json` - works out of the box with zero database configuration needed)

---

## 📁 Project Structure

```
student-task-management/
├── frontend/                     # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskForm.jsx      # Form to add new tasks
│   │   │   └── TaskItem.jsx      # Individual task card (checkbox, badges, delete)
│   │   ├── App.jsx               # Main React component (state, stats, fetch logic)
│   │   ├── App.css               # Clean styling
│   │   ├── index.css             # Base reset & font
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js            # Proxies /api calls to backend (port 5000)
│   └── package.json
│
├── backend/                      # Express REST API
│   ├── data/
│   │   └── tasks.json            # Simple JSON database for tasks
│   ├── src/
│   │   └── server.js             # Express server & REST API routes
│   └── package.json
│
├── package.json                  # Root runner scripts
└── README.md
```

---

## 🚀 How to Run

### 1. Install Dependencies

Open a terminal in the root folder and install dependencies for both frontend and backend:

```bash
# Install frontend packages
npm --prefix frontend install

# Install backend packages
npm --prefix backend install
```

---

### 2. Run the Backend

In one terminal, start the Express backend server:

```bash
npm run backend
```
The backend will run on **http://localhost:5000**.

---

### 3. Run the Frontend

In a second terminal, start the React Vite frontend:

```bash
npm run dev
```
Open **http://localhost:5173** in your browser.

---

## 🌟 Features

- **View Tasks:** List all student tasks with title, subject, due date, and priority.
- **Add Task:** Easily add a task with title, subject, date, and priority (Low, Medium, High).
- **Mark Complete:** Check off completed tasks with a single click.
- **Delete Task:** Remove tasks when done.
- **Filter & Search:** Filter by status (All, Pending, Completed) or search by title/subject.
- **Live Statistics:** Instant counters for Total Tasks, Pending, and Completed.
