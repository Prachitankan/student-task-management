import React, { useState } from "react";
import { SearchBar } from "../components/SearchBar";
import { FilterPanel } from "../components/FilterPanel";
import { TaskCard } from "../components/TaskCard";
import { taskService } from "../services/taskService";

export function Tasks({
  tasks,
  onToggleStatus,
  onEditTask,
  onDeleteTask,
  onOpenAddTask,
  availableSubjects,
  initialFilters = {}
}) {
  const [filters, setFilters] = useState({
    search: "",
    status: "All",
    priority: "All",
    subject: "All",
    dueDateFilter: "All",
    sortBy: "dueDate",
    sortOrder: "asc",
    ...initialFilters
  });

  const [viewMode, setViewMode] = useState("cards"); // 'cards' | 'table'

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "All",
      priority: "All",
      subject: "All",
      dueDateFilter: "All",
      sortBy: "dueDate",
      sortOrder: "asc"
    });
  };

  // Filter and sort the tasks
  const filteredTasks = taskService.filterTasks(tasks, filters);

  const completedCount = tasks.filter((t) => t.status === "Completed").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header bar: Page title, active counts, and Add Task button */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "16px",
          paddingBottom: "16px",
          borderBottom: "1px solid var(--hairline)"
        }}
      >
        <div>
          <span style={{ fontSize: "11px", color: "var(--mute)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Academic Task Repository
          </span>
          <h1 style={{ fontSize: "28px", margin: "4px 0 2px 0", letterSpacing: "-0.02em" }}>
            All Assignments & Tasks
          </h1>
          <p style={{ fontSize: "14px", color: "var(--body)" }}>
            Showing <strong>{filteredTasks.length}</strong> matching of{" "}
            <strong>{tasks.length}</strong> total tasks ({completedCount} completed).
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* View mode toggle */}
          <div
            style={{
              display: "flex",
              border: "1px solid var(--hairline-strong)",
              borderRadius: "var(--radius-sm)",
              overflow: "hidden"
            }}
          >
            <button
              onClick={() => setViewMode("cards")}
              style={{
                backgroundColor: viewMode === "cards" ? "var(--ink)" : "var(--canvas)",
                color: viewMode === "cards" ? "var(--on-dark)" : "var(--mute)",
                border: "none",
                padding: "6px 10px",
                fontSize: "12px",
                cursor: "pointer",
                fontFamily: "inherit"
              }}
              title="Cards Grid View"
            >
              [:: Cards]
            </button>
            <button
              onClick={() => setViewMode("table")}
              style={{
                backgroundColor: viewMode === "table" ? "var(--ink)" : "var(--canvas)",
                color: viewMode === "table" ? "var(--on-dark)" : "var(--mute)",
                border: "none",
                borderLeft: "1px solid var(--hairline-strong)",
                padding: "6px 10px",
                fontSize: "12px",
                cursor: "pointer",
                fontFamily: "inherit"
              }}
              title="Compact Table View"
            >
              [= Table]
            </button>
          </div>

          {/* New Task CTA */}
          <button
            onClick={onOpenAddTask}
            className="btn-primary"
            style={{ fontSize: "13px" }}
          >
            [+ Add Task]
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar
        value={filters.search}
        onChange={(val) => handleFilterChange("search", val)}
        onClear={() => handleFilterChange("search", "")}
        totalMatches={filteredTasks.length}
        totalCount={tasks.length}
      />

      {/* Advanced Filter Panel */}
      <FilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        availableSubjects={availableSubjects}
      />

      {/* Task List / View */}
      {filteredTasks.length === 0 ? (
        <div
          style={{
            backgroundColor: "var(--surface-soft)",
            border: "1px dashed var(--hairline-strong)",
            borderRadius: "var(--radius-sm)",
            padding: "48px 24px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px"
          }}
        >
          <pre
            style={{
              fontSize: "12px",
              color: "var(--ash)",
              lineHeight: "1.2",
              margin: 0
            }}
          >
{`  +-------------------------+
  |  [ ] NO TASKS MATCHED   |
  +-------------------------+`}
          </pre>
          <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: 0 }}>
            No assignments match your query or filters
          </h3>
          <p style={{ fontSize: "13px", color: "var(--mute)", maxWidth: "420px" }}>
            Try adjusting your search criteria, clearing active filters, or creating a new task.
          </p>
          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <button onClick={handleResetFilters} className="btn-secondary" style={{ fontSize: "12px" }}>
              [Reset Filters]
            </button>
            <button onClick={onOpenAddTask} className="btn-primary" style={{ fontSize: "12px" }}>
              [+ Create Task]
            </button>
          </div>
        </div>
      ) : viewMode === "cards" ? (
        /* Cards Grid View */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "14px"
          }}
        >
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleStatus={onToggleStatus}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
        </div>
      ) : (
        /* Compact Table / List View */
        <div
          style={{
            backgroundColor: "var(--canvas)",
            border: "1px solid var(--hairline)",
            borderRadius: "var(--radius-sm)",
            overflowX: "auto"
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "13px",
              textAlign: "left"
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "var(--surface-soft)",
                  borderBottom: "1px solid var(--hairline)",
                  color: "var(--mute)",
                  fontSize: "11px",
                  textTransform: "uppercase"
                }}
              >
                <th style={{ padding: "10px 12px", width: "40px", textAlign: "center" }}>Done</th>
                <th style={{ padding: "10px 12px" }}>Title & Description</th>
                <th style={{ padding: "10px 12px" }}>Subject</th>
                <th style={{ padding: "10px 12px" }}>Priority</th>
                <th style={{ padding: "10px 12px" }}>Due Date</th>
                <th style={{ padding: "10px 12px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => {
                const isCompleted = task.status === "Completed";
                const badge = taskService.getDeadlineStatusBadge(task.dueDate, task.status);
                return (
                  <tr
                    key={task.id}
                    style={{
                      borderBottom: "1px solid var(--hairline)",
                      backgroundColor: isCompleted ? "rgba(248, 247, 247, 0.4)" : "transparent",
                      opacity: isCompleted ? 0.75 : 1
                    }}
                  >
                    <td style={{ padding: "10px 12px", textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={() => onToggleStatus(task.id)}
                        style={{ cursor: "pointer", accentColor: "var(--ink)" }}
                      />
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <div
                        style={{
                          fontWeight: 600,
                          color: isCompleted ? "var(--mute)" : "var(--ink)",
                          textDecoration: isCompleted ? "line-through" : "none"
                        }}
                      >
                        {task.title}
                      </div>
                      {task.description && (
                        <div style={{ fontSize: "11px", color: "var(--mute)", marginTop: "2px" }}>
                          {task.description.slice(0, 70)}...
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span className="badge">[{task.subject}]</span>
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span
                        className={`badge ${
                          task.priority === "High"
                            ? "badge-high"
                            : task.priority === "Medium"
                            ? "badge-medium"
                            : "badge-low"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{ fontSize: "12px", fontWeight: 500 }}>
                        {taskService.formatDate(task.dueDate)}
                      </div>
                      <span
                        style={{
                          fontSize: "10px",
                          color:
                            badge.type === "overdue"
                              ? "var(--danger)"
                              : badge.type === "today"
                              ? "#b56b00"
                              : "var(--mute)"
                        }}
                      >
                        {badge.text}
                      </span>
                    </td>
                    <td style={{ padding: "10px 12px", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "6px" }}>
                        <button
                          onClick={() => onEditTask(task)}
                          className="btn-ghost"
                          style={{ fontSize: "11px", padding: "2px 6px" }}
                        >
                          [✎]
                        </button>
                        <button
                          onClick={() => onDeleteTask(task.id)}
                          className="btn-danger-ghost"
                          style={{ fontSize: "11px", padding: "2px 6px" }}
                        >
                          [✕]
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
