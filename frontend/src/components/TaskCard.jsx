import React, { useState } from "react";
import { taskService } from "../services/taskService";
import { api } from "../services/api";

export function TaskCard({ task, onToggleStatus, onEdit, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [aiBreakdown, setAiBreakdown] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const isCompleted = task.status === "Completed";
  const deadlineBadge = taskService.getDeadlineStatusBadge(task.dueDate, task.status);

  const handleToggleAiBreakdown = async () => {
    if (aiBreakdown) {
      setAiBreakdown(null);
      return;
    }
    setLoadingAi(true);
    const data = await api.getAiBreakdown(task);
    setLoadingAi(false);
    if (data) {
      setAiBreakdown(data);
    }
  };

  // Priority color class or style
  const getPriorityBadgeClass = () => {
    switch (task.priority) {
      case "High":
        return "badge-high";
      case "Medium":
        return "badge-medium";
      case "Low":
        return "badge-low";
      default:
        return "";
    }
  };

  return (
    <div
      style={{
        backgroundColor: "var(--canvas)",
        border: isCompleted
          ? "1px solid var(--hairline)"
          : deadlineBadge.type === "overdue"
          ? "1px solid rgba(255, 59, 48, 0.45)"
          : deadlineBadge.type === "today"
          ? "1px solid rgba(255, 159, 10, 0.45)"
          : "1px solid var(--hairline)",
        borderRadius: "var(--radius-sm)",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        transition: "border-color 0.15s ease, background-color 0.15s ease",
        opacity: isCompleted ? 0.72 : 1
      }}
      className="task-card"
    >
      {/* Top row: Checkbox, Title, and Action shortcuts */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        {/* Monospace ASCII Checkbox */}
        <button
          onClick={() => onToggleStatus(task.id)}
          title={isCompleted ? "Mark pending" : "Mark completed"}
          style={{
            background: isCompleted ? "var(--ink)" : "var(--surface-soft)",
            color: isCompleted ? "var(--on-dark)" : "var(--ink)",
            border: "1px solid var(--hairline-strong)",
            borderRadius: "var(--radius-sm)",
            cursor: "pointer",
            width: "26px",
            height: "26px",
            minWidth: "26px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "13px",
            fontWeight: "bold",
            marginTop: "2px"
          }}
        >
          {isCompleted ? "✓" : " "}
        </button>

        {/* Task Title & Details */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px" }}>
            <h3
              onClick={() => setIsExpanded(!isExpanded)}
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: isCompleted ? "var(--mute)" : "var(--ink)",
                textDecoration: isCompleted ? "line-through" : "none",
                cursor: "pointer",
                lineHeight: 1.4,
                wordBreak: "break-word"
              }}
            >
              {task.title}
            </h3>
          </div>

          {/* Description preview or expanded text */}
          {task.description && (
            <p
              onClick={() => setIsExpanded(!isExpanded)}
              style={{
                fontSize: "13px",
                color: "var(--body)",
                marginTop: "4px",
                lineHeight: 1.45,
                cursor: "pointer",
                whiteSpace: isExpanded ? "pre-wrap" : "nowrap",
                overflow: isExpanded ? "visible" : "hidden",
                textOverflow: isExpanded ? "clip" : "ellipsis"
              }}
            >
              {task.description}
            </p>
          )}
        </div>
      </div>

      {/* Middle row: Metadata Pills (Subject, Priority, Status, Estimated time) */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "6px",
        paddingTop: "4px",
        fontSize: "12px"
      }}>
        {/* Subject tag */}
        <span className="badge" style={{ backgroundColor: "var(--surface-card)", color: "var(--charcoal)" }}>
          [{task.subject || "General"}]
        </span>

        {/* Priority tag */}
        <span className={`badge ${getPriorityBadgeClass()}`}>
          ! {task.priority.toUpperCase()}
        </span>

        {/* Deadline tag */}
        <span
          className={`badge ${
            deadlineBadge.type === "overdue"
              ? "badge-overdue"
              : deadlineBadge.type === "today"
              ? "badge-today"
              : deadlineBadge.type === "completed"
              ? "badge-completed"
              : ""
          }`}
        >
          {deadlineBadge.text}
        </span>

        {/* Estimated study hours if present */}
        {task.estimatedHours && (
          <span className="badge" style={{ color: "var(--mute)" }} title="Estimated effort">
            ~{task.estimatedHours}h
          </span>
        )}
      </div>

      {/* Bottom action row: complete, edit, delete, expand */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: "8px",
        borderTop: "1px solid var(--hairline)",
        fontSize: "12px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={() => onToggleStatus(task.id)}
            className="btn-ghost"
            style={{
              padding: "3px 8px",
              fontWeight: 500,
              color: isCompleted ? "var(--mute)" : "#12752b"
            }}
          >
            {isCompleted ? "[↺ Reopen]" : "[✓ Complete]"}
          </button>
          
          <button
            onClick={() => onEdit(task)}
            className="btn-ghost"
            style={{ padding: "3px 8px" }}
          >
            [✎ Edit]
          </button>

          <button
            onClick={handleToggleAiBreakdown}
            className="btn-ghost"
            style={{ padding: "3px 8px", color: "var(--accent)" }}
            title="Gemini AI Study Milestones & Tips"
          >
            {loadingAi ? "[AI...]" : aiBreakdown ? "[- AI]" : "[✨ AI Steps]"}
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {task.description && task.description.length > 50 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="btn-ghost"
              style={{ fontSize: "11px", padding: "2px 6px" }}
            >
              {isExpanded ? "[-] Less" : "[+] More"}
            </button>
          )}

          <button
            onClick={() => onDelete(task.id)}
            className="btn-danger-ghost"
            style={{ padding: "3px 8px" }}
            title="Delete task"
          >
            [✕ Del]
          </button>
        </div>
      </div>

      {/* Gemini AI Breakdown Panel */}
      {aiBreakdown && (
        <div style={{
          backgroundColor: "var(--surface-soft)",
          border: "1px dashed var(--hairline-strong)",
          borderRadius: "var(--radius-sm)",
          padding: "10px 12px",
          fontSize: "12px",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          animation: "slideIn 0.2s ease"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontWeight: 600, color: "var(--ink)", display: "flex", alignItems: "center", gap: "4px" }}>
              <span>✨</span> Gemini Study Milestones
            </span>
            <span style={{ fontSize: "10px", color: "var(--mute)" }}>
              {aiBreakdown.poweredBy}
            </span>
          </div>

          <p style={{ fontSize: "11px", color: "var(--body)", margin: "2px 0" }}>
            {aiBreakdown.summary}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "4px" }}>
            {aiBreakdown.subtasks?.map((sub, idx) => (
              <div
                key={idx}
                style={{
                  padding: "6px 8px",
                  backgroundColor: "var(--canvas)",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--hairline)"
                }}
              >
                <div style={{ fontWeight: 600, color: "var(--ink)" }}>
                  {idx + 1}. {sub.step} <span style={{ fontWeight: 400, color: "var(--mute)" }}>({sub.estimatedMinutes}m)</span>
                </div>
                {sub.tip && (
                  <div style={{ fontSize: "11px", color: "var(--body)", marginTop: "2px" }}>
                    Tip: {sub.tip}
                  </div>
                )}
              </div>
            ))}
          </div>

          {aiBreakdown.recommendedStrategy && (
            <div style={{ fontSize: "11px", color: "var(--mute)", marginTop: "4px" }}>
              Strategy: {aiBreakdown.recommendedStrategy}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
