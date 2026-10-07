import React from "react";

export function FilterPanel({
  filters,
  onFilterChange,
  onResetFilters,
  availableSubjects = []
}) {
  const hasActiveFilters =
    filters.status !== "All" ||
    filters.priority !== "All" ||
    filters.subject !== "All" ||
    filters.dueDateFilter !== "All" ||
    (filters.search && filters.search.trim() !== "");

  return (
    <div
      style={{
        backgroundColor: "var(--surface-soft)",
        border: "1px solid var(--hairline)",
        borderRadius: "var(--radius-sm)",
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px"
      }}
    >
      {/* Top Filter Rows: Status and Urgency */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px" }}>
        {/* Status Group */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "12px", color: "var(--mute)", fontWeight: 600 }}>
            STATUS:
          </span>
          {["All", "Pending", "In Progress", "Completed"].map((st) => {
            const isActive = filters.status === st;
            return (
              <button
                key={st}
                onClick={() => onFilterChange("status", st)}
                className="btn-ghost"
                style={{
                  fontSize: "12px",
                  padding: "3px 8px",
                  backgroundColor: isActive ? "var(--ink)" : "var(--canvas)",
                  color: isActive ? "var(--on-dark)" : "var(--body)",
                  border: `1px solid ${isActive ? "var(--ink)" : "var(--hairline)"}`,
                  fontWeight: isActive ? 600 : 400
                }}
              >
                {st}
              </button>
            );
          })}
        </div>

        {/* Priority Group */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "12px", color: "var(--mute)", fontWeight: 600 }}>
            PRIORITY:
          </span>
          {["All", "High", "Medium", "Low"].map((pr) => {
            const isActive = filters.priority === pr;
            return (
              <button
                key={pr}
                onClick={() => onFilterChange("priority", pr)}
                className="btn-ghost"
                style={{
                  fontSize: "12px",
                  padding: "3px 8px",
                  backgroundColor: isActive ? "var(--ink)" : "var(--canvas)",
                  color: isActive ? "var(--on-dark)" : "var(--body)",
                  border: `1px solid ${isActive ? "var(--ink)" : "var(--hairline)"}`,
                  fontWeight: isActive ? 600 : 400
                }}
              >
                {pr}
              </button>
            );
          })}
        </div>

        {/* Urgency / Deadline Filter */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "12px", color: "var(--mute)", fontWeight: 600 }}>
            DUE:
          </span>
          {[
            { label: "All", value: "All" },
            { label: "Overdue", value: "overdue" },
            { label: "Today", value: "today" },
            { label: "Tomorrow", value: "tomorrow" }
          ].map((item) => {
            const isActive = filters.dueDateFilter === item.value;
            return (
              <button
                key={item.value}
                onClick={() => onFilterChange("dueDateFilter", item.value)}
                className="btn-ghost"
                style={{
                  fontSize: "12px",
                  padding: "3px 8px",
                  backgroundColor: isActive
                    ? item.value === "overdue"
                      ? "var(--danger)"
                      : "var(--ink)"
                    : "var(--canvas)",
                  color: isActive ? "var(--on-dark)" : "var(--body)",
                  border: `1px solid ${isActive ? "transparent" : "var(--hairline)"}`,
                  fontWeight: isActive ? 600 : 400
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Filter Row: Subject Dropdown, Sort Dropdown & Reset Action */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        paddingTop: "8px",
        borderTop: "1px dashed var(--hairline)"
      }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" }}>
          {/* Subject Dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "12px", color: "var(--mute)", fontWeight: 600 }}>
              SUBJECT:
            </span>
            <select
              className="select-input"
              value={filters.subject}
              onChange={(e) => onFilterChange("subject", e.target.value)}
              style={{ padding: "4px 8px", fontSize: "12px", height: "30px", width: "auto" }}
            >
              <option value="All">All Subjects ({availableSubjects.length})</option>
              {availableSubjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selection */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "12px", color: "var(--mute)", fontWeight: 600 }}>
              SORT BY:
            </span>
            <select
              className="select-input"
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split("-");
                onFilterChange("sortBy", sb);
                onFilterChange("sortOrder", so);
              }}
              style={{ padding: "4px 8px", fontSize: "12px", height: "30px", width: "auto" }}
            >
              <option value="dueDate-asc">Due Date (Earliest first)</option>
              <option value="dueDate-desc">Due Date (Latest first)</option>
              <option value="priority-desc">Priority (High to Low)</option>
              <option value="title-asc">Title (A to Z)</option>
              <option value="createdAt-desc">Recently Created</option>
            </select>
          </div>
        </div>

        {/* Reset Filters */}
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="btn-ghost"
            style={{ fontSize: "12px", color: "var(--danger)", padding: "3px 8px" }}
          >
            [✕ Reset Filters]
          </button>
        )}
      </div>
    </div>
  );
}
