import React, { useState } from "react";
import { defaultSubjects } from "../data/initialTasks";
import { taskService } from "../services/taskService";

export function TaskForm({ isOpen, onClose, onSave, editingTask, defaultDate, availableSubjects = [] }) {
  const [title, setTitle] = useState(() => editingTask?.title || "");
  const [description, setDescription] = useState(() => editingTask?.description || "");
  const [subject, setSubject] = useState(() => editingTask?.subject || "DBMS");
  const [priority, setPriority] = useState(() => editingTask?.priority || "Medium");
  const [dueDate, setDueDate] = useState(() => editingTask?.dueDate || defaultDate || taskService.getTodayString());
  const [status, setStatus] = useState(() => editingTask?.status || "Pending");
  const [estimatedHours, setEstimatedHours] = useState(() => String(editingTask?.estimatedHours || "2"));
  const [error, setError] = useState("");

  const allSubjects = Array.from(
    new Set([...defaultSubjects, ...availableSubjects])
  ).filter(Boolean);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    onSave({
      ...(editingTask ? { id: editingTask.id, createdAt: editingTask.createdAt } : {}),
      title: title.trim(),
      description: description.trim(),
      subject: subject.trim() || "General",
      priority,
      dueDate,
      status,
      estimatedHours: parseFloat(estimatedHours) || 1
    });

    onClose();
  };

  const setRelativeDate = (offsetDays) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    setDueDate(`${y}-${m}-${day}`);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(32, 29, 29, 0.65)",
        backdropFilter: "blur(2px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "16px"
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSubmit();
      }}
    >
      <div
        style={{
          backgroundColor: "var(--canvas)",
          border: "1px solid var(--hairline-strong)",
          borderRadius: "var(--radius-sm)",
          width: "100%",
          maxWidth: "540px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          boxShadow: "0 12px 36px rgba(0,0,0,0.25)"
        }}
      >
        {/* Modal Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: "11px", color: "var(--mute)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {editingTask ? "Academic Task Modification" : "New Assignment Entry"}
            </span>
            <h2 style={{ fontSize: "18px", margin: 0 }}>
              {editingTask ? `[✎] Edit Task` : `[+] Create New Task`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="btn-ghost"
            style={{ fontSize: "14px", padding: "4px 8px" }}
            title="Close (Esc)"
          >
            [✕ Esc]
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Error Message */}
          {error && (
            <div style={{
              backgroundColor: "rgba(255, 59, 48, 0.1)",
              border: "1px solid var(--danger)",
              color: "var(--danger)",
              padding: "8px 12px",
              borderRadius: "var(--radius-sm)",
              fontSize: "13px"
            }}>
              [! ERROR]: {error}
            </div>
          )}

          {/* Task Title */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
              Task Title <span style={{ color: "var(--danger)" }}>*</span>
            </label>
            <input
              type="text"
              className="text-input"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError("");
              }}
              placeholder="e.g. Complete DBMS Assignment 4"
              autoFocus
            />
          </div>

          {/* Subject / Category */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600 }}>
                Subject / Academic Course
              </label>
              <span style={{ fontSize: "11px", color: "var(--mute)" }}>Type or select quick chip</span>
            </div>
            <input
              type="text"
              className="text-input"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Operating Systems"
              list="subject-suggestions"
            />
            <datalist id="subject-suggestions">
              {allSubjects.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>

            {/* Quick subject pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "6px" }}>
              {allSubjects.slice(0, 6).map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setSubject(s)}
                  className="btn-ghost"
                  style={{
                    fontSize: "11px",
                    padding: "2px 6px",
                    backgroundColor: subject === s ? "var(--ink)" : "var(--surface-soft)",
                    color: subject === s ? "var(--on-dark)" : "var(--mute)"
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Two Columns: Priority and Status */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                Priority Level
              </label>
              <select
                className="select-input"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="High">High [! Urgent]</option>
                <option value="Medium">Medium [◷ Normal]</option>
                <option value="Low">Low [Relaxed]</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                Current Status
              </label>
              <select
                className="select-input"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Two Columns: Due Date & Estimated Study Hours */}
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                Due Date (Deadline)
              </label>
              <input
                type="date"
                className="text-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
              {/* Quick Date Pills */}
              <div style={{ display: "flex", gap: "4px", marginTop: "6px" }}>
                <button
                  type="button"
                  onClick={() => setRelativeDate(0)}
                  className="btn-ghost"
                  style={{ fontSize: "11px", padding: "2px 6px" }}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setRelativeDate(1)}
                  className="btn-ghost"
                  style={{ fontSize: "11px", padding: "2px 6px" }}
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  onClick={() => setRelativeDate(3)}
                  className="btn-ghost"
                  style={{ fontSize: "11px", padding: "2px 6px" }}
                >
                  +3d
                </button>
                <button
                  type="button"
                  onClick={() => setRelativeDate(7)}
                  className="btn-ghost"
                  style={{ fontSize: "11px", padding: "2px 6px" }}
                >
                  +1w
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                Study Time (Est. hrs)
              </label>
              <input
                type="number"
                min="0.5"
                max="50"
                step="0.5"
                className="text-input"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                placeholder="2"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
              Notes / Description (Optional)
            </label>
            <textarea
              className="textarea-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Chapter 4 normalization exercises, submit PDF on portal before 11:59 PM..."
              rows={3}
            />
          </div>

          {/* Modal Footer Actions */}
          <div style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "10px",
            marginTop: "8px",
            paddingTop: "12px",
            borderTop: "1px solid var(--hairline)"
          }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              [Cancel]
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {editingTask ? "[✓ Save Changes]" : "[+ Add Task]"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
