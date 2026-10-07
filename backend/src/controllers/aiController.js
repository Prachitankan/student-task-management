import { geminiService } from "../services/geminiService.js";
import { taskRepository } from "../services/taskRepository.js";
import { defaultModel } from "../config/gemini.js";

export const aiController = {
  getStatus: (req, res) => {
    return res.status(200).json({
      configured: geminiService.isConfigured(),
      model: defaultModel,
      message: geminiService.isConfigured()
        ? "Google Gemini AI is active and ready."
        : "Gemini API key not configured yet. Add GEMINI_API_KEY in backend/.env to activate live Google Gemini AI features."
    });
  },

  breakdownTask: async (req, res) => {
    try {
      const { taskId, title, description, subject, estimatedHours } = req.body;

      let taskData = { title, description, subject, estimatedHours };

      // If taskId was passed, retrieve it from repo
      if (taskId && !title) {
        const found = taskRepository.getTaskById(taskId);
        if (found) {
          taskData = found;
        }
      }

      if (!taskData.title) {
        return res.status(400).json({ error: "Task title is required for AI breakdown." });
      }

      const breakdown = await geminiService.breakdownTask(taskData);
      return res.status(200).json({ success: true, data: breakdown });
    } catch (err) {
      return res.status(500).json({ error: "Failed to generate AI breakdown", details: err.message });
    }
  },

  getStudyPlan: async (req, res) => {
    try {
      const { tasks, dailyGoalHours } = req.body;
      const tasksToAnalyze = tasks && Array.isArray(tasks) ? tasks : taskRepository.getAllTasks();

      const profile = taskRepository.getProfile();
      const goalHours = dailyGoalHours || profile.dailyStudyGoalHours || 4;

      const studyPlan = await geminiService.generateStudyPlan(tasksToAnalyze, goalHours);
      return res.status(200).json({ success: true, data: studyPlan });
    } catch (err) {
      return res.status(500).json({ error: "Failed to generate AI study plan", details: err.message });
    }
  },

  explainTopic: async (req, res) => {
    try {
      const { topic, subject } = req.body;
      if (!topic || !topic.trim()) {
        return res.status(400).json({ error: "Topic is required for explanation." });
      }

      const result = await geminiService.explainTopic(topic.trim(), subject || "General");
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      return res.status(500).json({ error: "Failed to explain topic", details: err.message });
    }
  }
};
