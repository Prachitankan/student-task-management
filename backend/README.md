# Student Task Manager - Backend

A simple Node.js & Express REST API for managing student tasks.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the server:**
   ```bash
   # Development mode (auto-reload)
   npm run dev

   # Or standard mode
   npm start
   ```

The server runs on **http://localhost:5000**.

## API Endpoints

- `GET /api/tasks` — Get all tasks
- `POST /api/tasks` — Add a new task (`title`, `subject`, `dueDate`, `priority`)
- `PUT /api/tasks/:id` — Update a task (e.g. toggle `completed`)
- `DELETE /api/tasks/:id` — Delete a task
