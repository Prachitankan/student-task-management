import React, { useState } from "react";
import { taskService } from "../services/taskService";
import { TaskCard } from "../components/TaskCard";

export function Calendar({
  tasks,
  onToggleStatus,
  onEditTask,
  onDeleteTask,
  onOpenAddTaskWithDate
}) {
  // Calendar month state (anchored to current month, October 2026)
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth()); // 0-indexed
  const [selectedDateStr, setSelectedDateStr] = useState(() => taskService.getTodayString());

  // Month navigation
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
    setSelectedDateStr(taskService.getTodayString());
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Calendar calculations
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sun
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Tasks due on selected date
  const selectedDayTasks = tasks.filter((t) => t.dueDate === selectedDateStr);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Calendar Header */}
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
            Academic Deadlines Schedule
          </span>
          <h1 style={{ fontSize: "28px", margin: "4px 0 2px 0", letterSpacing: "-0.02em" }}>
            Monthly Task Calendar
          </h1>
          <p style={{ fontSize: "14px", color: "var(--body)" }}>
            Visual deadline layout for <strong>{monthNames[currentMonth]} {currentYear}</strong>
          </p>
        </div>

        {/* Navigation buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button onClick={goToToday} className="btn-secondary" style={{ fontSize: "12px" }}>
            [Today]
          </button>
          <button onClick={prevMonth} className="btn-secondary" style={{ fontSize: "12px" }}>
            [← Prev]
          </button>
          <span style={{ fontSize: "14px", fontWeight: 700, padding: "0 6px" }}>
            {monthNames[currentMonth].slice(0, 3)} {currentYear}
          </span>
          <button onClick={nextMonth} className="btn-secondary" style={{ fontSize: "12px" }}>
            [Next →]
          </button>
        </div>
      </div>

      {/* Main Grid: Calendar on Left, Selected Day Inspector on Right */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: "24px"
        }}
      >
        {/* Left: Monthly Calendar Grid */}
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
          {/* Day of Week Headers */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              textAlign: "center",
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--mute)",
              paddingBottom: "8px",
              borderBottom: "1px solid var(--hairline)"
            }}
          >
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* Month Days Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "6px"
            }}
          >
            {/* Empty slots before first day */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} style={{ minHeight: "68px" }} />
            ))}

            {/* Days in Month */}
            {Array.from({ length: totalDaysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
              const isToday = dateStr === taskService.getTodayString();
              const isSelected = dateStr === selectedDateStr;

              // Find tasks for this day
              const dayTasks = tasks.filter((t) => t.dueDate === dateStr);
              const pendingCount = dayTasks.filter((t) => t.status !== "Completed").length;

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDateStr(dateStr)}
                  style={{
                    minHeight: "72px",
                    border: isSelected
                      ? "1px solid var(--ink)"
                      : isToday
                      ? "1px solid var(--accent)"
                      : "1px solid var(--hairline)",
                    backgroundColor: isSelected
                      ? "var(--surface-soft)"
                      : isToday
                      ? "rgba(0, 122, 255, 0.04)"
                      : "transparent",
                    borderRadius: "var(--radius-sm)",
                    padding: "6px",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "all 0.15s ease"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: isToday || isSelected ? 700 : 500,
                        color: isToday ? "var(--accent)" : isSelected ? "var(--ink)" : "var(--body)"
                      }}
                    >
                      {dayNum}
                    </span>
                    {dayTasks.length > 0 && (
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          padding: "1px 4px",
                          borderRadius: "var(--radius-sm)",
                          backgroundColor: pendingCount > 0 ? "var(--ink)" : "var(--surface-card)",
                          color: pendingCount > 0 ? "var(--on-dark)" : "var(--mute)"
                        }}
                      >
                        {dayTasks.length}
                      </span>
                    )}
                  </div>

                  {/* Micro task tags */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginTop: "4px" }}>
                    {dayTasks.slice(0, 2).map((t) => (
                      <div
                        key={t.id}
                        style={{
                          fontSize: "9px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          padding: "1px 3px",
                          borderRadius: "2px",
                          backgroundColor:
                            t.status === "Completed"
                              ? "rgba(48, 209, 88, 0.15)"
                              : t.priority === "High"
                              ? "rgba(255, 59, 48, 0.15)"
                              : "var(--surface-card)",
                          color: "var(--ink)"
                        }}
                        title={t.title}
                      >
                        {t.title}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <span style={{ fontSize: "8px", color: "var(--mute)" }}>
                        +{dayTasks.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Day Task Schedule Inspector */}
        <div
          style={{
            backgroundColor: "var(--surface-soft)",
            border: "1px solid var(--hairline)",
            borderRadius: "var(--radius-sm)",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div>
              <span style={{ fontSize: "11px", color: "var(--mute)", textTransform: "uppercase" }}>
                Selected Schedule
              </span>
              <h2 style={{ fontSize: "17px", margin: "2px 0 0 0" }}>
                {taskService.formatDate(selectedDateStr)}
              </h2>
            </div>

            <button
              onClick={() => onOpenAddTaskWithDate(selectedDateStr)}
              className="btn-primary"
              style={{ fontSize: "12px", padding: "4px 10px" }}
            >
              [+ Add Task Here]
            </button>
          </div>

          <div className="hairline-divider" style={{ margin: "4px 0" }} />

          {selectedDayTasks.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 16px", color: "var(--mute)" }}>
              <pre style={{ fontSize: "12px", margin: "0 0 10px 0" }}>
{`  [  DAY CLEAR  ]
  No submissions due.`}
              </pre>
              <p style={{ fontSize: "13px" }}>
                No assignments or exams recorded for this date.
              </p>
              <button
                onClick={() => onOpenAddTaskWithDate(selectedDateStr)}
                className="btn-secondary"
                style={{ fontSize: "12px", marginTop: "12px" }}
              >
                [+ Schedule an assignment]
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ fontSize: "12px", color: "var(--mute)" }}>
                {selectedDayTasks.length} task(s) due on this day:
              </div>
              {selectedDayTasks.map((t) => (
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
      </div>
    </div>
  );
}
