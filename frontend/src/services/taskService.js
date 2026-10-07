// Task Logic and State Services

export const taskService = {
  // Normalize date comparison to local calendar day (YYYY-MM-DD)
  getTodayString: () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  },

  getTomorrowString: () => {
    const tmrw = new Date();
    tmrw.setDate(tmrw.getDate() + 1);
    const year = tmrw.getFullYear();
    const month = String(tmrw.getMonth() + 1).padStart(2, "0");
    const day = String(tmrw.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  },

  getDateDiffDays: (dateStr) => {
    if (!dateStr) return null;
    const [y, m, d] = dateStr.split("-").map(Number);
    const target = new Date(y, m - 1, d);

    const now = new Date();
    const current = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const diffTime = target.getTime() - current.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  },

  isToday: (dateStr) => {
    if (!dateStr) return false;
    const diff = taskService.getDateDiffDays(dateStr);
    return diff === 0;
  },

  isTomorrow: (dateStr) => {
    if (!dateStr) return false;
    const diff = taskService.getDateDiffDays(dateStr);
    return diff === 1;
  },

  isOverdue: (dateStr, status) => {
    if (!dateStr || status === "Completed") return false;
    const diff = taskService.getDateDiffDays(dateStr);
    return diff < 0;
  },

  formatDate: (dateStr) => {
    if (!dateStr) return "No date";
    try {
      const [year, month, day] = dateStr.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    } catch {
      return dateStr;
    }
  },

  getDeadlineStatusBadge: (dateStr, status) => {
    if (status === "Completed") {
      return { text: "[✓ Completed]", type: "completed" };
    }
    if (!dateStr) {
      return { text: "[No deadline]", type: "none" };
    }
    const diff = taskService.getDateDiffDays(dateStr);
    if (diff < 0) {
      const days = Math.abs(diff);
      return {
        text: `[! OVERDUE: ${days}d ago]`,
        type: "overdue"
      };
    }
    if (diff === 0) {
      return { text: "[! DUE TODAY]", type: "today" };
    }
    if (diff === 1) {
      return { text: "[◷ DUE TOMORROW]", type: "tomorrow" };
    }
    if (diff <= 7) {
      return { text: `[◷ ${diff} days left]`, type: "soon" };
    }
    return { text: `[Due: ${taskService.formatDate(dateStr)}]`, type: "upcoming" };
  },

  calculateStats: (tasks) => {
    const total = tasks.length;
    let pending = 0;
    let inProgress = 0;
    let completed = 0;
    let dueToday = 0;
    let dueTomorrow = 0;
    let overdue = 0;
    let totalEstimatedHours = 0;
    let pendingEstimatedHours = 0;

    const subjectsMap = {};
    const prioritiesMap = { High: 0, Medium: 0, Low: 0 };

    tasks.forEach((t) => {
      const hours = Number(t.estimatedHours) || 1;
      totalEstimatedHours += hours;

      if (t.status === "Completed") {
        completed++;
      } else if (t.status === "In Progress") {
        inProgress++;
        pendingEstimatedHours += hours;
      } else {
        pending++;
        pendingEstimatedHours += hours;
      }

      // Check deadline for non-completed
      if (t.status !== "Completed") {
        if (taskService.isOverdue(t.dueDate, t.status)) {
          overdue++;
        } else if (taskService.isToday(t.dueDate)) {
          dueToday++;
        } else if (taskService.isTomorrow(t.dueDate)) {
          dueTomorrow++;
        }
      }

      // Priority count
      if (prioritiesMap[t.priority] !== undefined) {
        prioritiesMap[t.priority]++;
      }

      // Subject count
      const subj = t.subject || "General";
      if (!subjectsMap[subj]) {
        subjectsMap[subj] = { subject: subj, total: 0, completed: 0, pending: 0 };
      }
      subjectsMap[subj].total++;
      if (t.status === "Completed") {
        subjectsMap[subj].completed++;
      } else {
        subjectsMap[subj].pending++;
      }
    });

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const subjectList = Object.values(subjectsMap).map((s) => ({
      ...s,
      percentage: s.total > 0 ? Math.round((s.completed / s.total) * 100) : 0
    }));

    return {
      total,
      pending,
      inProgress,
      totalUnfinished: pending + inProgress,
      completed,
      dueToday,
      dueTomorrow,
      overdue,
      completionRate,
      totalEstimatedHours: totalEstimatedHours.toFixed(1),
      pendingEstimatedHours: pendingEstimatedHours.toFixed(1),
      subjectList,
      prioritiesMap
    };
  },

  filterTasks: (tasks, filters) => {
    const {
      search = "",
      status = "All",
      priority = "All",
      subject = "All",
      dueDateFilter = "All", // 'All' | 'today' | 'tomorrow' | 'overdue' | 'upcoming'
      sortBy = "dueDate", // 'dueDate' | 'priority' | 'title' | 'createdAt'
      sortOrder = "asc"
    } = filters;

    const query = search.trim().toLowerCase();

    return tasks
      .filter((task) => {
        // Search query filter
        if (query) {
          const matchTitle = (task.title || "").toLowerCase().includes(query);
          const matchDesc = (task.description || "").toLowerCase().includes(query);
          const matchSubj = (task.subject || "").toLowerCase().includes(query);
          if (!matchTitle && !matchDesc && !matchSubj) return false;
        }

        // Status filter
        if (status !== "All") {
          if (status === "Pending" && (task.status === "Completed")) return false;
          if (status === "Completed" && task.status !== "Completed") return false;
          if (status === "In Progress" && task.status !== "In Progress") return false;
        }

        // Priority filter
        if (priority !== "All" && task.priority !== priority) {
          return false;
        }

        // Subject filter
        if (subject !== "All" && task.subject !== subject) {
          return false;
        }

        // Specific Due Date filter
        if (dueDateFilter === "overdue") {
          return taskService.isOverdue(task.dueDate, task.status);
        }
        if (dueDateFilter === "today") {
          return taskService.isToday(task.dueDate) && task.status !== "Completed";
        }
        if (dueDateFilter === "tomorrow") {
          return taskService.isTomorrow(task.dueDate) && task.status !== "Completed";
        }
        if (dueDateFilter === "upcoming") {
          const diff = taskService.getDateDiffDays(task.dueDate);
          return diff > 1 && task.status !== "Completed";
        }

        return true;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortBy === "dueDate") {
          const dateA = a.dueDate || "9999-99-99";
          const dateB = b.dueDate || "9999-99-99";
          comp = dateA.localeCompare(dateB);
        } else if (sortBy === "priority") {
          const weight = { High: 3, Medium: 2, Low: 1 };
          comp = (weight[b.priority] || 0) - (weight[a.priority] || 0);
        } else if (sortBy === "title") {
          comp = (a.title || "").localeCompare(b.title || "");
        } else if (sortBy === "createdAt") {
          comp = (b.createdAt || "").localeCompare(a.createdAt || "");
        }

        return sortOrder === "asc" ? comp : -comp;
      });
  },

  createTask: (data) => {
    return {
      id: "task-" + Date.now().toString(36) + "-" + Math.random().toString(36).substr(2, 4),
      title: data.title.trim(),
      description: data.description ? data.description.trim() : "",
      subject: data.subject ? data.subject.trim() : "General",
      priority: data.priority || "Medium",
      dueDate: data.dueDate || taskService.getTodayString(),
      status: data.status || "Pending",
      createdAt: taskService.getTodayString(),
      estimatedHours: Number(data.estimatedHours) || 2
    };
  }
};
