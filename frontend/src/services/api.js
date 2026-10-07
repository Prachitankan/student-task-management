import { storageService } from "./storageService";

// Base API URL configured from environment (defaults to proxy /api)
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
const DATA_MODE = import.meta.env.VITE_DATA_MODE || "auto"; // 'auto' | 'local' | 'api'

let isBackendOnline = false;

export const api = {
  getBaseUrl: () => API_BASE_URL,
  getDataMode: () => DATA_MODE,
  isOnline: () => isBackendOnline,

  /**
   * Health check to detect if backend server is currently active
   */
  checkHealth: async () => {
    if (DATA_MODE === "local") {
      isBackendOnline = false;
      return { online: false, mode: "local", reason: "Forced Local Storage mode" };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200); // 1.2s ping timeout

      const res = await fetch(`${API_BASE_URL}/health`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        isBackendOnline = true;
        return { online: true, mode: "api", url: API_BASE_URL };
      }
    } catch {
      // Backend is currently offline/unreachable
    }

    isBackendOnline = false;
    return { online: false, mode: "local", reason: "Backend server offline, using localStorage" };
  },

  /**
   * Fetch all tasks (REST: GET /api/tasks with fallback to localStorage)
   */
  getTasks: async () => {
    if (DATA_MODE !== "local") {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const res = await fetch(`${API_BASE_URL}/tasks`, {
          signal: controller.signal,
          headers: { "Accept": "application/json" }
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          isBackendOnline = true;
          // Sync with local storage as offline cache
          const tasksList = Array.isArray(data) ? data : data.tasks || [];
          storageService.saveTasks(tasksList);
          return { tasks: tasksList, source: "backend" };
        }
      } catch (err) {
        console.info("[API Service] Backend unreachable, falling back to localStorage:", err.message);
      }
    }

    isBackendOnline = false;
    return { tasks: storageService.getTasks(), source: "localStorage" };
  },

  /**
   * Create a new task (REST: POST /api/tasks with fallback to localStorage)
   */
  createTask: async (taskData) => {
    if (isBackendOnline && DATA_MODE !== "local") {
      try {
        const res = await fetch(`${API_BASE_URL}/tasks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(taskData)
        });

        if (res.ok) {
          const created = await res.json();
          return { success: true, task: created.task || created, source: "backend" };
        }
      } catch (err) {
        console.warn("[API Service] POST /tasks failed, saving locally:", err.message);
      }
    }

    // Local Storage Fallback
    const existing = storageService.getTasks();
    const updated = [taskData, ...existing];
    storageService.saveTasks(updated);
    return { success: true, task: taskData, source: "localStorage" };
  },

  /**
   * Update an existing task (REST: PUT /api/tasks/:id)
   */
  updateTask: async (taskId, updates) => {
    if (isBackendOnline && DATA_MODE !== "local") {
      try {
        const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(updates)
        });

        if (res.ok) {
          const updated = await res.json();
          return { success: true, task: updated.task || updated, source: "backend" };
        }
      } catch (err) {
        console.warn(`[API Service] PUT /tasks/${taskId} failed, saving locally:`, err.message);
      }
    }

    // Local Storage Fallback
    const existing = storageService.getTasks();
    const modified = existing.map((t) => (t.id === taskId ? { ...t, ...updates } : t));
    storageService.saveTasks(modified);
    return { success: true, task: updates, source: "localStorage" };
  },

  /**
   * Delete a task (REST: DELETE /api/tasks/:id)
   */
  deleteTask: async (taskId) => {
    if (isBackendOnline && DATA_MODE !== "local") {
      try {
        const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
          method: "DELETE"
        });

        if (res.ok) {
          return { success: true, source: "backend" };
        }
      } catch (err) {
        console.warn(`[API Service] DELETE /tasks/${taskId} failed:`, err.message);
      }
    }

    // Local Storage Fallback
    const existing = storageService.getTasks();
    const filtered = existing.filter((t) => t.id !== taskId);
    storageService.saveTasks(filtered);
    return { success: true, source: "localStorage" };
  },

  /**
   * Toggle task status (REST: PATCH /api/tasks/:id/status or PUT)
   */
  toggleStatus: async (taskId, newStatus) => {
    return api.updateTask(taskId, { status: newStatus });
  },

  /**
   * Fetch student profile (REST: GET /api/profile)
   */
  getProfile: async () => {
    if (isBackendOnline && DATA_MODE !== "local") {
      try {
        const res = await fetch(`${API_BASE_URL}/profile`);
        if (res.ok) {
          const profile = await res.json();
          storageService.saveProfile(profile);
          return { profile, source: "backend" };
        }
      } catch {
        // Fallback
      }
    }
    return { profile: storageService.getProfile(), source: "localStorage" };
  },

  /**
   * Update student profile (REST: PUT /api/profile)
   */
  updateProfile: async (profileData) => {
    if (isBackendOnline && DATA_MODE !== "local") {
      try {
        const res = await fetch(`${API_BASE_URL}/profile`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profileData)
        });
        if (res.ok) {
          const updated = await res.json();
          return { success: true, profile: updated, source: "backend" };
        }
      } catch {
        // Fallback
      }
    }

    storageService.saveProfile(profileData);
    return { success: true, profile: profileData, source: "localStorage" };
  },

  /**
   * Gemini AI: Generate task breakdown & milestones
   */
  getAiBreakdown: async (task) => {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/breakdown`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task)
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn("AI breakdown failed:", err);
    }
    return null;
  },

  /**
   * Gemini AI: Generate study plan
   */
  getAiStudyPlan: async (tasks, dailyGoalHours = 4) => {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/study-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks, dailyGoalHours })
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn("AI study plan failed:", err);
    }
    return null;
  },

  /**
   * Gemini AI: Explain academic topic
   */
  explainTopic: async (topic, subject) => {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/explain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, subject })
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn("AI explain failed:", err);
    }
    return null;
  }
};
