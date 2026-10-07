import { initialTasks, initialProfile } from "../data/initialTasks";

const TASKS_STORAGE_KEY = "student_task_manager_tasks_v1";
const PROFILE_STORAGE_KEY = "student_task_manager_profile_v1";
const SETTINGS_STORAGE_KEY = "student_task_manager_settings_v1";

const defaultSettings = {
  viewMode: "cards", // 'cards' | 'table'
  compactMode: false,
  soundEnabled: false,
  autoArchiveCompleted: false,
  filterDefaults: {
    status: "All",
    priority: "All",
    subject: "All"
  }
};

export const storageService = {
  getTasks: () => {
    try {
      const stored = localStorage.getItem(TASKS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to load tasks from localStorage:", e);
    }
    // Default to initial mock dataset
    return initialTasks;
  },

  saveTasks: (tasks) => {
    try {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
      return true;
    } catch (e) {
      console.error("Failed to save tasks to localStorage:", e);
      return false;
    }
  },

  getProfile: () => {
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to load profile:", e);
    }
    return initialProfile;
  },

  saveProfile: (profile) => {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      return true;
    } catch (e) {
      console.error("Failed to save profile:", e);
      return false;
    }
  },

  getSettings: () => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        return { ...defaultSettings, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error("Failed to load settings:", e);
    }
    return defaultSettings;
  },

  saveSettings: (settings) => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      return true;
    } catch (e) {
      console.error("Failed to save settings:", e);
      return false;
    }
  },

  resetAll: () => {
    try {
      localStorage.removeItem(TASKS_STORAGE_KEY);
      localStorage.removeItem(PROFILE_STORAGE_KEY);
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
      return {
        tasks: initialTasks,
        profile: initialProfile,
        settings: defaultSettings
      };
    } catch (e) {
      console.error("Failed to reset storage:", e);
      return null;
    }
  },

  exportJSON: (tasks, profile, settings) => {
    const exportBundle = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      tasks,
      profile,
      settings
    };
    return JSON.stringify(exportBundle, null, 2);
  },

  importJSON: (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || !Array.isArray(parsed.tasks)) {
        throw new Error("Invalid task format. 'tasks' must be an array.");
      }
      return {
        success: true,
        tasks: parsed.tasks,
        profile: parsed.profile || initialProfile,
        settings: parsed.settings || defaultSettings
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
};
