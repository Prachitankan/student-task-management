import React, { useState } from "react";
import { SummaryCard } from "../components/SummaryCard";
import { TaskCard } from "../components/TaskCard";
import { taskService } from "../services/taskService";
import { api } from "../services/api";

export function Dashboard({
  tasks,
  profile,
  onNavigate,
  onOpenAddTask,
  onToggleStatus,
  onEditTask,
  onDeleteTask,
  onSetFilterAndNavigate
}) {
  const [aiPlan, setAiPlan] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(false);

  const stats = taskService.calculateStats(tasks);

  const handleGenerateAiPlan = async () => {
    if (aiPlan) {
      setAiPlan(null);
      return;
    }
    setLoadingPlan(true);
    const plan = await api.getAiStudyPlan(tasks, profile.dailyStudyGoalHours || 4);
    setLoadingPlan(false);
    if (plan) {
      setAiPlan(plan);
    }
  };

  // Group tasks for quick dashboard sections
  const todayTasks = tasks.filter(
    (t) => taskService.isToday(t.dueDate) && t.status !== "Completed"
  );
  const overdueTasks = tasks.filter((t) => taskService.isOverdue(t.dueDate, t.status));
  const upcomingTasks = tasks
    .filter((t) => {
      if (t.status === "Completed") return false;
      const diff = taskService.getDateDiffDays(t.dueDate);
      return diff > 0 && diff <= 7;
    })
    .sort((a, b) => (a.dueDate || "").localeCompare(b.dueDate || ""));

  // ASCII Progress Bar
  const filledBlocks = Math.round(stats.completionRate / 5);
  const emptyBlocks = 20 - filledBlocks;
  const asciiProgressBar = `[${"=".repeat(filledBlocks)}${emptyBlocks > 0 ? ">" : ""}${"-".repeat(Math.max(0, emptyBlocks - 1))}]`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Welcome & Term Status Bar */}
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
            Academic Terminal // {profile.semester || "Semester 5"}
          </span>
          <h1 style={{ fontSize: "28px", margin: "4px 0 2px 0", letterSpacing: "-0.02em" }}>
            Student Workspace
          </h1>
          <p style={{ fontSize: "14px", color: "var(--body)" }}>
            Welcome back, <strong>{profile.name}</strong>. Today is{" "}
            <strong>{taskService.formatDate(taskService.getTodayString())}</strong>.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={handleGenerateAiPlan}
            className="btn-secondary"
            style={{ fontSize: "13px", color: "var(--accent)" }}
            title="Generate AI Daily Study Plan with Gemini"
          >
            {loadingPlan ? "[AI Planning...]" : aiPlan ? "[- AI Schedule]" : "[✨ AI Schedule]"}
          </button>
          <button
            onClick={onOpenAddTask}
            className="btn-primary"
            style={{ fontSize: "13px" }}
          >
            [+ New Assignment]
          </button>
          <button
            onClick={() => onNavigate("tasks")}
            className="btn-secondary"
            style={{ fontSize: "13px" }}
          >
            [Manage Tasks →]
          </button>
        </div>
      </div>

      {/* Gemini AI Daily Study Plan Block */}
      {aiPlan && (
        <div style={{
          backgroundColor: "var(--surface-soft)",
          border: "1px solid var(--hairline-strong)",
          borderRadius: "var(--radius-sm)",
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          animation: "slideIn 0.2s ease"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "8px" }}>
            <h3 style={{ fontSize: "15px", margin: 0, fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
              <span>✨</span> Gemini Daily Study Plan
            </h3>
            <span style={{ fontSize: "11px", color: "var(--mute)" }}>{aiPlan.poweredBy}</span>
          </div>

          <p style={{ fontSize: "13px", color: "var(--ink)", fontWeight: 500, margin: 0 }}>
            {aiPlan.headline}
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "10px"
          }}>
            {aiPlan.schedule?.map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: "var(--canvas)",
                  border: "1px solid var(--hairline)",
                  borderRadius: "var(--radius-sm)",
                  padding: "10px 12px"
                }}
              >
                <div style={{ fontSize: "11px", color: "var(--accent)", fontWeight: 700 }}>
                  {item.timeSlot}
                </div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginTop: "2px" }}>
                  {item.taskTitle} <span style={{ fontSize: "11px", color: "var(--mute)", fontWeight: 400 }}>[{item.subject}]</span>
                </div>
                <div style={{ fontSize: "12px", color: "var(--body)", marginTop: "4px" }}>
                  {item.objective}
                </div>
              </div>
            ))}
          </div>

          {aiPlan.wellnessTip && (
            <div style={{ fontSize: "11px", color: "var(--mute)", fontStyle: "italic", borderTop: "1px dashed var(--hairline)", paddingTop: "8px" }}>
              💡 Study Habit: {aiPlan.wellnessTip}
            </div>
          )}
        </div>
      )}

      {/* Urgent Warning Banner if Overdue or Due Today */}
      {(stats.overdue > 0 || stats.dueToday > 0) && (
        <div
          style={{
            backgroundColor: stats.overdue > 0 ? "rgba(255, 59, 48, 0.08)" : "rgba(255, 159, 10, 0.08)",
            border: `1px solid ${stats.overdue > 0 ? "rgba(255, 59, 48, 0.4)" : "rgba(255, 159, 10, 0.4)"}`,
            borderRadius: "var(--radius-sm)",
            padding: "12px 18px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{
              color: stats.overdue > 0 ? "var(--danger)" : "#b56b00",
              fontWeight: "bold",
              fontSize: "14px"
            }}>
              [!]
            </span>
            <span style={{ fontSize: "13px", color: "var(--ink)", fontWeight: 500 }}>
              {stats.overdue > 0
                ? `Attention: You have ${stats.overdue} overdue assignment(s) requiring immediate submission!`
                : `You have ${stats.dueToday} task(s) scheduled for completion today.`}
            </span>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            {stats.overdue > 0 && (
              <button
                onClick={() => onSetFilterAndNavigate({ dueDateFilter: "overdue" })}
                className="btn-ghost"
                style={{
                  fontSize: "12px",
                  color: "var(--danger)",
                  border: "1px solid rgba(255,59,48,0.3)"
                }}
              >
                [View Overdue →]
              </button>
            )}
            {stats.dueToday > 0 && (
              <button
                onClick={() => onSetFilterAndNavigate({ dueDateFilter: "today" })}
                className="btn-ghost"
                style={{
                  fontSize: "12px",
                  color: "#b56b00",
                  border: "1px solid rgba(255,159,10,0.3)"
                }}
              >
                [View Today's →]
              </button>
            )}
          </div>
        </div>
      )}

      {/* 6 Reusable Summary Cards Grid as defined in requirement.md */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px" }}>
          <h2 style={{ fontSize: "15px", margin: 0, fontWeight: 700 }}>
            [METRICS] Workload Overview
          </h2>
          <span style={{ fontSize: "12px", color: "var(--mute)" }}>
            Telemetry calculated from {stats.total} total recorded assignments
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
            gap: "14px"
          }}
        >
          <SummaryCard
            title="Total Tasks"
            value={stats.total}
            subtitle={`${stats.totalEstimatedHours}h estimated total`}
            onClick={() => onSetFilterAndNavigate({ status: "All" })}
          />

          <SummaryCard
            title="Pending"
            value={stats.pending}
            subtitle={`${stats.inProgress} in progress`}
            badge="Incomplete"
            type="info"
            onClick={() => onSetFilterAndNavigate({ status: "Pending" })}
          />

          <SummaryCard
            title="Completed"
            value={stats.completed}
            subtitle={`${stats.completionRate}% completion rate`}
            badge="Done"
            type="success"
            onClick={() => onSetFilterAndNavigate({ status: "Completed" })}
          />

          <SummaryCard
            title="Due Today"
            value={stats.dueToday}
            subtitle="Scheduled for today"
            badge={stats.dueToday > 0 ? "Action" : "None"}
            type={stats.dueToday > 0 ? "warning" : "default"}
            onClick={() => onSetFilterAndNavigate({ dueDateFilter: "today" })}
          />

          <SummaryCard
            title="Overdue"
            value={stats.overdue}
            subtitle={stats.overdue > 0 ? "Past deadline" : "All clean"}
            badge={stats.overdue > 0 ? "Critical" : "Clear"}
            type={stats.overdue > 0 ? "danger" : "default"}
            onClick={() => onSetFilterAndNavigate({ dueDateFilter: "overdue" })}
          />

          <SummaryCard
            title="Completion"
            value={`${stats.completionRate}%`}
            subtitle={`${stats.pendingEstimatedHours}h study remaining`}
            type={stats.completionRate >= 50 ? "success" : "default"}
            onClick={() => onNavigate("profile")}
          />
        </div>
      </div>

      {/* Semester Progress Visualizer Block (Matching ASCII Chart spec in design.md) */}
      <div
        style={{
          backgroundColor: "var(--surface-soft)",
          border: "1px solid var(--hairline)",
          borderRadius: "var(--radius-sm)",
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "8px" }}>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--ink)" }}>
            Fig 1. Academic Semester Completion Rate
          </span>
          <span style={{ fontSize: "12px", color: "var(--mute)" }}>
            {stats.completed} of {stats.total} assignments finalized ({stats.completionRate}%)
          </span>
        </div>

        {/* Monospace ASCII Bar */}
        <div style={{
          backgroundColor: "var(--canvas)",
          border: "1px solid var(--hairline)",
          borderRadius: "var(--radius-sm)",
          padding: "10px 14px",
          fontSize: "14px",
          fontFamily: "var(--font-mono)",
          color: "var(--ink)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          overflowX: "auto"
        }}>
          <span style={{ color: "#12752b", fontWeight: 700 }}>
            {asciiProgressBar}
          </span>
          <span style={{ fontSize: "12px", color: "var(--mute)", whiteSpace: "nowrap" }}>
            Target: 100% by Finals Week
          </span>
        </div>
      </div>

      {/* Main Two-Column Content Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: "24px"
        }}
      >
        {/* Left Column: Today's Tasks & Urgent Deadlines */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Today's Tasks Section */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <h2 style={{ fontSize: "16px", margin: 0, fontWeight: 700 }}>
                [TODAY] Focus Tasks ({todayTasks.length})
              </h2>
              <button
                onClick={() => onSetFilterAndNavigate({ dueDateFilter: "today" })}
                className="btn-ghost"
                style={{ fontSize: "11px" }}
              >
                [View Filtered]
              </button>
            </div>

            {todayTasks.length === 0 ? (
              <div
                style={{
                  border: "1px dashed var(--hairline)",
                  borderRadius: "var(--radius-sm)",
                  padding: "24px",
                  textAlign: "center",
                  color: "var(--mute)"
                }}
              >
                <p style={{ fontSize: "13px" }}>[✓] No tasks due today.</p>
                <button
                  onClick={onOpenAddTask}
                  className="btn-ghost"
                  style={{ fontSize: "12px", marginTop: "8px" }}
                >
                  [+ Schedule a task for today]
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {todayTasks.map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    onToggleStatus={onToggleStatus}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Overdue Tasks Section (if any) */}
          {overdueTasks.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <h2 style={{ fontSize: "16px", margin: 0, fontWeight: 700, color: "var(--danger)" }}>
                  [! OVERDUE] Action Required ({overdueTasks.length})
                </h2>
                <button
                  onClick={() => onSetFilterAndNavigate({ dueDateFilter: "overdue" })}
                  className="btn-ghost"
                  style={{ fontSize: "11px", color: "var(--danger)" }}
                >
                  [View All Overdue]
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {overdueTasks.slice(0, 3).map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    onToggleStatus={onToggleStatus}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Upcoming Deadlines & Subject Distribution */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Upcoming Deadlines */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <h2 style={{ fontSize: "16px", margin: 0, fontWeight: 700 }}>
                [UPCOMING] Next 7 Days ({upcomingTasks.length})
              </h2>
              <button
                onClick={() => onNavigate("calendar")}
                className="btn-ghost"
                style={{ fontSize: "11px" }}
              >
                [Open Calendar →]
              </button>
            </div>

            {upcomingTasks.length === 0 ? (
              <div
                style={{
                  border: "1px dashed var(--hairline)",
                  borderRadius: "var(--radius-sm)",
                  padding: "20px",
                  textAlign: "center",
                  color: "var(--mute)",
                  fontSize: "13px"
                }}
              >
                No upcoming deadlines in the next 7 days.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {upcomingTasks.slice(0, 4).map((t) => {
                  const daysLeft = taskService.getDateDiffDays(t.dueDate);
                  return (
                    <div
                      key={t.id}
                      style={{
                        backgroundColor: "var(--canvas)",
                        border: "1px solid var(--hairline)",
                        borderRadius: "var(--radius-sm)",
                        padding: "12px 14px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "10px"
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--ink)" }}>
                          {t.title}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--mute)", marginTop: "2px" }}>
                          [{t.subject}] • Due {taskService.formatDate(t.dueDate)}
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span
                          className="badge"
                          style={{
                            fontSize: "11px",
                            backgroundColor: daysLeft === 1 ? "rgba(255, 159, 10, 0.15)" : "var(--surface-soft)",
                            color: daysLeft === 1 ? "#b56b00" : "var(--charcoal)"
                          }}
                        >
                          {daysLeft === 1 ? "Tomorrow" : `${daysLeft}d left`}
                        </span>
                        <button
                          onClick={() => onToggleStatus(t.id)}
                          className="btn-ghost"
                          style={{ fontSize: "11px", padding: "2px 6px" }}
                          title="Complete"
                        >
                          [✓]
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Subject Workload Breakdown */}
          <div
            style={{
              backgroundColor: "var(--canvas)",
              border: "1px solid var(--hairline)",
              borderRadius: "var(--radius-sm)",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "10px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <h2 style={{ fontSize: "14px", margin: 0, fontWeight: 700 }}>
                Subject Distribution
              </h2>
              <span style={{ fontSize: "11px", color: "var(--mute)" }}>
                {stats.subjectList.length} enrolled subjects
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "220px", overflowY: "auto" }}>
              {stats.subjectList.map((s) => (
                <div key={s.subject} style={{ fontSize: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                    <span style={{ fontWeight: 500, color: "var(--ink)" }}>
                      [{s.subject}]
                    </span>
                    <span style={{ color: "var(--mute)" }}>
                      {s.completed}/{s.total} done ({s.percentage}%)
                    </span>
                  </div>
                  {/* Visual micro progress bar */}
                  <div
                    style={{
                      height: "6px",
                      backgroundColor: "var(--surface-card)",
                      borderRadius: "2px",
                      overflow: "hidden"
                    }}
                  >
                    <div
                      style={{
                        width: `${s.percentage}%`,
                        height: "100%",
                        backgroundColor: s.percentage === 100 ? "#12752b" : "var(--ink)",
                        transition: "width 0.3s ease"
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
