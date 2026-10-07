import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { initialTasks, initialProfile } from "../data/initialData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "../../data");

const TASKS_FILE = path.join(DATA_DIR, "tasks.json");
const PROFILE_FILE = path.join(DATA_DIR, "profile.json");

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJSONFile(filePath, defaultValue) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), "utf8");
      return defaultValue;
    }
    const content = fs.readFileSync(filePath, "utf8");
    return JSON.parse(content);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
    return defaultValue;
  }
}

function writeJSONFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err.message);
    return false;
  }
}

export const taskRepository = {
  getAllTasks: () => {
    return readJSONFile(TASKS_FILE, initialTasks);
  },

  getTaskById: (id) => {
    const tasks = taskRepository.getAllTasks();
    return tasks.find((t) => t.id === id) || null;
  },

  createTask: (taskData) => {
    const tasks = taskRepository.getAllTasks();
    const newTask = {
      id: taskData.id || "task-" + Date.now().toString(36) + "-" + Math.random().toString(36).substr(2, 4),
      title: taskData.title.trim(),
      description: taskData.description ? taskData.description.trim() : "",
      subject: taskData.subject ? taskData.subject.trim() : "General",
      priority: taskData.priority || "Medium",
      dueDate: taskData.dueDate || new Date().toISOString().slice(0, 10),
      status: taskData.status || "Pending",
      createdAt: taskData.createdAt || new Date().toISOString().slice(0, 10),
      estimatedHours: Number(taskData.estimatedHours) || 2
    };

    tasks.unshift(newTask);
    writeJSONFile(TASKS_FILE, tasks);
    return newTask;
  },

  updateTask: (id, updates) => {
    const tasks = taskRepository.getAllTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;

    tasks[index] = {
      ...tasks[index],
      ...updates,
      id // preserve ID
    };

    writeJSONFile(TASKS_FILE, tasks);
    return tasks[index];
  },

  deleteTask: (id) => {
    const tasks = taskRepository.getAllTasks();
    const filtered = tasks.filter((t) => t.id !== id);
    if (filtered.length === tasks.length) {
      return false;
    }
    writeJSONFile(TASKS_FILE, filtered);
    return true;
  },

  getProfile: () => {
    return readJSONFile(PROFILE_FILE, initialProfile);
  },

  updateProfile: (profileData) => {
    const current = taskRepository.getProfile();
    const updated = { ...current, ...profileData };
    writeJSONFile(PROFILE_FILE, updated);
    return updated;
  },

  resetDefaults: () => {
    writeJSONFile(TASKS_FILE, initialTasks);
    writeJSONFile(PROFILE_FILE, initialProfile);
    return { tasks: initialTasks, profile: initialProfile };
  }
};
