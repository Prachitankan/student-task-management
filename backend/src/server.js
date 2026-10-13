import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, '../data/tasks.json');

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to read tasks from JSON file
async function getTasks() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Helper function to save tasks to JSON file
async function saveTasks(tasks) {
  await fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
}

// 1. GET all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await getTasks();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to read tasks' });
  }
});

// 2. POST create a new task
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, subject, dueDate, priority } = req.body;
    
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const tasks = await getTasks();
    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
      subject: (subject || 'General').trim(),
      dueDate: dueDate || '',
      priority: priority || 'Medium',
      completed: false
    };

    tasks.unshift(newTask);
    await saveTasks(tasks);

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task' });
  }
});

// 3. PUT update an existing task (e.g. toggle completed)
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const tasks = await getTasks();
    const index = tasks.findIndex(task => task.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update task fields
    tasks[index] = {
      ...tasks[index],
      ...req.body,
      id // preserve original ID
    };

    await saveTasks(tasks);
    res.json(tasks[index]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task' });
  }
});

// 4. DELETE a task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const tasks = await getTasks();
    const filteredTasks = tasks.filter(task => task.id !== id);

    if (tasks.length === filteredTasks.length) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await saveTasks(filteredTasks);
    res.json({ message: 'Task deleted successfully', id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
