import React, { useState, useEffect } from "react";
import "./App.css";
import { Header } from "./components/Header";
import { TaskForm } from "./components/TaskForm";

import { Dashboard } from "./pages/Dashboard";
import { Tasks } from "./pages/Tasks";
import { Calendar } from "./pages/Calendar";
import { Profile } from "./pages/Profile";
import { Settings } from "./pages/Settings";

import { storageService } from "./services/storageService";
import { taskService } from "./services/taskService";
import { api } from "./services/api";

function App() {
  // Layered State: Tasks, Profile, Settings
  const [tasks, setTasks] = useState(() => storageService.getTasks());
  const [profile, setProfile] = useState(() => storageService.getProfile());
  const [settings, setSettings] = useState(() => storageService.getSettings());

  // Backend Connectivity Status
  const [backendStatus, setBackendStatus] = useState({ online: false });

  // UI Navigation State
  const [activePage, setActivePage] = useState("dashboard"); // 'dashboard' | 'tasks' | 'calendar' | 'profile' | 'settings'

  // Modals
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskFormDefaultDate, setTaskFormDefaultDate] = useState(null);

  // Jump filters for Tasks page navigation
  const [taskFilters, setTaskFilters] = useState({});

  // Check backend health & sync data on initial load
  useEffect(() => {
    let isMounted = true;
    const checkConnection = async () => {
      const status = await api.checkHealth();
      if (!isMounted) return;
      setBackendStatus(status);

      if (status.online) {
        const { tasks: backendTasks } = await api.getTasks();
        if (isMounted && backendTasks?.length) {
          setTasks(backendTasks);
        }
        const { profile: backendProfile } = await api.getProfile();
        if (isMounted && backendProfile) {
          setProfile(backendProfile);
        }
      }
    };
    checkConnection();
    return () => { isMounted = false; };
  }, []);

  // Auto-persist tasks to storage whenever they change
  useEffect(() => {
    storageService.saveTasks(tasks);
  }, [tasks]);

  // Auto-persist profile
  useEffect(() => {
    storageService.saveProfile(profile);
  }, [profile]);

  // Auto-persist settings
  useEffect(() => {
    storageService.saveSettings(settings);
  }, [settings]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      const isInput = activeTag === "input" || activeTag === "textarea" || activeTag === "select";

      // Allow Escape everywhere to close modals
      if (e.key === "Escape") {
        if (isTaskFormOpen) {
          setIsTaskFormOpen(false);
          setEditingTask(null);
        }
        return;
      }

      if (isInput) return;

      // Shortcuts when not typing in an input
      if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        setEditingTask(null);
        setTaskFormDefaultDate(taskService.getTodayString());
        setIsTaskFormOpen(true);
      } else if (e.key === "/") {
        e.preventDefault();
        if (activePage !== "tasks") {
          setActivePage("tasks");
        }
        setTimeout(() => {
          document.getElementById("task-search-input")?.focus();
        }, 100);
      } else if (e.key === "1") {
        setActivePage("dashboard");
      } else if (e.key === "2") {
        setActivePage("tasks");
      } else if (e.key === "3") {
        setActivePage("calendar");
      } else if (e.key === "4") {
        setActivePage("profile");
      } else if (e.key === "5") {
        setActivePage("settings");
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isTaskFormOpen, activePage]);

  // Task Actions (Service Layer & Backend API integrations)
  const handleSaveTask = (taskData) => {
    if (taskData.id) {
      // Update existing task
      setTasks((prev) =>
        prev.map((t) => (t.id === taskData.id ? { ...t, ...taskData } : t))
      );
      api.updateTask(taskData.id, taskData);
    } else {
      // Create new task
      const newTask = taskService.createTask(taskData);
      setTasks((prev) => [newTask, ...prev]);
      api.createTask(newTask);
    }
  };

  const handleToggleStatus = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const isComp = t.status === "Completed";
          const newStatus = isComp ? "Pending" : "Completed";
          api.updateTask(taskId, { ...t, status: newStatus });
          return { ...t, status: newStatus };
        }
        return t;
      })
    );
  };

  const handleDeleteTask = (taskId) => {
    const target = tasks.find((t) => t.id === taskId);
    if (!target) return;

    if (window.confirm(`Delete task "${target.title}"?`)) {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      api.deleteTask(taskId);
    }
  };

  const handleUpdateProfile = (newProfile) => {
    setProfile(newProfile);
    api.updateProfile(newProfile);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleOpenAddTask = (specificDate = null) => {
    setEditingTask(null);
    setTaskFormDefaultDate(specificDate || taskService.getTodayString());
    setIsTaskFormOpen(true);
  };

  // Jump from Dashboard to Tasks with preset filter
  const handleSetFilterAndNavigate = (filterPreset) => {
    setTaskFilters(filterPreset);
    setActivePage("tasks");
  };

  // Reset all to sample defaults
  const handleResetAll = () => {
    const fresh = storageService.resetAll();
    if (fresh) {
      setTasks(fresh.tasks);
      setProfile(fresh.profile);
      setSettings(fresh.settings);
    }
  };

  // Import JSON backup
  const handleImportData = (newTasks, newProfile, newSettings) => {
    setTasks(newTasks);
    if (newProfile) setProfile(newProfile);
    if (newSettings) setSettings(newSettings);
  };

  // Extract all distinct subjects for filters and dropdowns
  const availableSubjects = Array.from(
    new Set(tasks.map((t) => t.subject).filter(Boolean))
  );

  // Compute urgent alert count for header notification badge
  const overdueCount = tasks.filter((t) => taskService.isOverdue(t.dueDate, t.status)).length;
  const dueTodayCount = tasks.filter(
    (t) => taskService.isToday(t.dueDate) && t.status !== "Completed"
  ).length;
  const unreadAlertCount = overdueCount + dueTodayCount;

  // Handle clicking the notification bell: jump to overdue or today's tasks
  const handleNotificationClick = () => {
    if (overdueCount > 0) {
      handleSetFilterAndNavigate({ dueDateFilter: "overdue" });
    } else if (dueTodayCount > 0) {
      handleSetFilterAndNavigate({ dueDateFilter: "today" });
    } else {
      setActivePage("dashboard");
    }
  };

  return (
    <div className={`app-wrapper ${settings.compactMode ? "compact-mode" : ""}`}>
      {/* Global Monospace Header */}
      <Header
        activePage={activePage}
        onNavigate={(page) => {
          setTaskFilters({}); // reset temporary jump filters on direct nav
          setActivePage(page);
        }}
        onOpenAddTask={() => handleOpenAddTask()}
        onOpenNotifications={handleNotificationClick}
        unreadAlertCount={unreadAlertCount}
        studentName={profile.name}
        backendStatus={backendStatus}
      />

      {/* Main Page Content */}
      <main className="main-content-container">
        {activePage === "dashboard" && (
          <Dashboard
            tasks={tasks}
            profile={profile}
            onNavigate={setActivePage}
            onOpenAddTask={() => handleOpenAddTask()}
            onToggleStatus={handleToggleStatus}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onSetFilterAndNavigate={handleSetFilterAndNavigate}
          />
        )}

        {activePage === "tasks" && (
          <Tasks
            tasks={tasks}
            onToggleStatus={handleToggleStatus}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onOpenAddTask={() => handleOpenAddTask()}
            availableSubjects={availableSubjects}
            initialFilters={taskFilters}
          />
        )}

        {activePage === "calendar" && (
          <Calendar
            tasks={tasks}
            onToggleStatus={handleToggleStatus}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onOpenAddTaskWithDate={(dateStr) => handleOpenAddTask(dateStr)}
          />
        )}

        {activePage === "profile" && (
          <Profile
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            tasks={tasks}
          />
        )}

        {activePage === "settings" && (
          <Settings
            settings={settings}
            onUpdateSettings={setSettings}
            tasks={tasks}
            profile={profile}
            onResetAll={handleResetAll}
            onImportData={handleImportData}
            backendStatus={backendStatus}
          />
        )}
      </main>

      {/* Footer matching design spec */}
      <footer className="footer-container">
        <div className="footer-inner">
          <div className="footer-links-grid">
            <span style={{ fontWeight: 700, color: "var(--ink)" }}>ACADEMIC_OS:</span>
            <a href="#dashboard" onClick={(e) => { e.preventDefault(); setActivePage("dashboard"); }} className="footer-link-item">
              [Dashboard]
            </a>
            <a href="#tasks" onClick={(e) => { e.preventDefault(); setActivePage("tasks"); }} className="footer-link-item">
              [Task Repository]
            </a>
            <a href="#calendar" onClick={(e) => { e.preventDefault(); setActivePage("calendar"); }} className="footer-link-item">
              [Calendar Grid]
            </a>
            <a href="#profile" onClick={(e) => { e.preventDefault(); setActivePage("profile"); }} className="footer-link-item">
              [Student Profile]
            </a>
            <a href="#settings" onClick={(e) => { e.preventDefault(); setActivePage("settings"); }} className="footer-link-item">
              [Data Backup]
            </a>
          </div>

          <div className="footer-bottom-row">
            <div>
              © 2026 Student Task Manager // Designed in Monospace Typography
            </div>
            <div>
              Local Session: Active · Keyboard: [N] New Task · [/] Search · [1-5] Navigation
            </div>
          </div>
        </div>
      </footer>

      {/* Add / Edit Task Modal Form */}
      <TaskForm
        key={isTaskFormOpen ? (editingTask ? editingTask.id : `new-${taskFormDefaultDate}`) : "closed"}
        isOpen={isTaskFormOpen}
        onClose={() => {
          setIsTaskFormOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        editingTask={editingTask}
        defaultDate={taskFormDefaultDate}
        availableSubjects={availableSubjects}
      />
    </div>
  );
}

export default App;