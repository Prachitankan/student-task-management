import { taskRepository } from "../services/taskRepository.js";

export const taskController = {
  getTasks: (req, res) => {
    try {
      const { search, status, priority, subject } = req.query;
      let tasks = taskRepository.getAllTasks();

      if (search) {
        const q = search.toLowerCase();
        tasks = tasks.filter(
          (t) =>
            t.title?.toLowerCase().includes(q) ||
            t.description?.toLowerCase().includes(q) ||
            t.subject?.toLowerCase().includes(q)
        );
      }

      if (status && status !== "All") {
        tasks = tasks.filter((t) => t.status === status);
      }

      if (priority && priority !== "All") {
        tasks = tasks.filter((t) => t.priority === priority);
      }

      if (subject && subject !== "All") {
        tasks = tasks.filter((t) => t.subject === subject);
      }

      return res.status(200).json(tasks);
    } catch (err) {
      return res.status(500).json({ error: "Failed to retrieve tasks", details: err.message });
    }
  },

  getTaskById: (req, res) => {
    try {
      const task = taskRepository.getTaskById(req.params.id);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      return res.status(200).json(task);
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch task", details: err.message });
    }
  },

  createTask: (req, res) => {
    try {
      const { title } = req.body;
      if (!title || !title.trim()) {
        return res.status(400).json({ error: "Task title is required." });
      }

      const newTask = taskRepository.createTask(req.body);
      return res.status(201).json({ success: true, task: newTask });
    } catch (err) {
      return res.status(500).json({ error: "Failed to create task", details: err.message });
    }
  },

  updateTask: (req, res) => {
    try {
      const updated = taskRepository.updateTask(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Task not found" });
      }
      return res.status(200).json({ success: true, task: updated });
    } catch (err) {
      return res.status(500).json({ error: "Failed to update task", details: err.message });
    }
  },

  deleteTask: (req, res) => {
    try {
      const deleted = taskRepository.deleteTask(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Task not found" });
      }
      return res.status(200).json({ success: true, message: "Task deleted successfully" });
    } catch (err) {
      return res.status(500).json({ error: "Failed to delete task", details: err.message });
    }
  },

  toggleStatus: (req, res) => {
    try {
      const task = taskRepository.getTaskById(req.params.id);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      const newStatus = task.status === "Completed" ? "Pending" : "Completed";
      const updated = taskRepository.updateTask(req.params.id, { status: newStatus });
      return res.status(200).json({ success: true, task: updated });
    } catch (err) {
      return res.status(500).json({ error: "Failed to toggle status", details: err.message });
    }
  },

  getStats: (req, res) => {
    try {
      const tasks = taskRepository.getAllTasks();
      const total = tasks.length;
      let completed = 0;
      let pending = 0;

      tasks.forEach((t) => {
        if (t.status === "Completed") completed++;
        else pending++;
      });

      return res.status(200).json({
        total,
        completed,
        pending,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
      });
    } catch (err) {
      return res.status(500).json({ error: "Failed to compute stats", details: err.message });
    }
  }
};
