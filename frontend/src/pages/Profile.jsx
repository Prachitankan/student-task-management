import React, { useState } from "react";
import { taskService } from "../services/taskService";

export function Profile({ profile, onUpdateProfile, tasks }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...profile });

  const stats = taskService.calculateStats(tasks);

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Page Header */}
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
            Student Identity & Workload Analysis
          </span>
          <h1 style={{ fontSize: "28px", margin: "4px 0 2px 0", letterSpacing: "-0.02em" }}>
            Academic Profile
          </h1>
          <p style={{ fontSize: "14px", color: "var(--body)" }}>
            Academic telemetry, study statistics, and enrolled subject metrics.
          </p>
        </div>

        <div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-secondary"
            style={{ fontSize: "13px" }}
          >
            {isEditing ? "[Cancel Editing]" : "[✎ Edit Profile]"}
          </button>
        </div>
      </div>

      {/* Main Grid: Student Card on Left, Academic Analytics on Right */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: "24px"
        }}
      >
        {/* Student Information Card */}
        <div
          style={{
            backgroundColor: "var(--canvas)",
            border: "1px solid var(--hairline)",
            borderRadius: "var(--radius-sm)",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "18px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "var(--radius-full)",
                backgroundColor: "var(--ink)",
                color: "var(--on-dark)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                fontWeight: 700
              }}
            >
              {profile.name ? profile.name.charAt(0) : "S"}
            </div>
            <div>
              <h2 style={{ fontSize: "18px", margin: 0 }}>{profile.name}</h2>
              <span style={{ fontSize: "12px", color: "var(--mute)" }}>
                ID: {profile.studentId || "STU-2026-8842"}
              </span>
            </div>
          </div>

          <div className="hairline-divider" style={{ margin: "4px 0" }} />

          {isEditing ? (
            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                  Student Full Name
                </label>
                <input
                  type="text"
                  className="text-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                  Student ID / Roll No.
                </label>
                <input
                  type="text"
                  className="text-input"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                  Major / Degree Program
                </label>
                <input
                  type="text"
                  className="text-input"
                  value={formData.major}
                  onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                  Semester / Academic Term
                </label>
                <input
                  type="text"
                  className="text-input"
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                    Current GPA
                  </label>
                  <input
                    type="text"
                    className="text-input"
                    value={formData.currentGpa}
                    onChange={(e) => setFormData({ ...formData, currentGpa: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                    Target GPA
                  </label>
                  <input
                    type="text"
                    className="text-input"
                    value={formData.targetGpa}
                    onChange={(e) => setFormData({ ...formData, targetGpa: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn-secondary"
                  style={{ fontSize: "12px" }}
                >
                  [Cancel]
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ fontSize: "12px" }}
                >
                  [Save Profile]
                </button>
              </div>
            </form>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--mute)" }}>Major / Program:</span>
                <span style={{ fontWeight: 600 }}>{profile.major}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--mute)" }}>Academic Term:</span>
                <span>{profile.semester}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--mute)" }}>Institution:</span>
                <span>{profile.institution || "Engineering Faculty"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--mute)" }}>Current Standing:</span>
                <span style={{ fontWeight: 600, color: "var(--accent)" }}>
                  {profile.currentGpa} / 4.00
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--mute)" }}>Target GPA:</span>
                <span style={{ fontWeight: 600, color: "#12752b" }}>
                  {profile.targetGpa}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Study Analytics & Streaks */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Quick Metrics */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px"
            }}
          >
            <div
              style={{
                backgroundColor: "var(--surface-soft)",
                border: "1px solid var(--hairline)",
                borderRadius: "var(--radius-sm)",
                padding: "16px"
              }}
            >
              <span style={{ fontSize: "11px", color: "var(--mute)", textTransform: "uppercase" }}>
                Active Streak
              </span>
              <div style={{ fontSize: "26px", fontWeight: 700, margin: "4px 0", color: "#d67a00" }}>
                5 Days 🔥
              </div>
              <span style={{ fontSize: "12px", color: "var(--mute)" }}>
                Tasks completed 5 days in a row
              </span>
            </div>

            <div
              style={{
                backgroundColor: "var(--surface-soft)",
                border: "1px solid var(--hairline)",
                borderRadius: "var(--radius-sm)",
                padding: "16px"
              }}
            >
              <span style={{ fontSize: "11px", color: "var(--mute)", textTransform: "uppercase" }}>
                Est. Study Time
              </span>
              <div style={{ fontSize: "26px", fontWeight: 700, margin: "4px 0", color: "var(--ink)" }}>
                {stats.totalEstimatedHours} hrs
              </div>
              <span style={{ fontSize: "12px", color: "var(--mute)" }}>
                {stats.pendingEstimatedHours} hrs remaining
              </span>
            </div>
          </div>

          {/* Subject Mastery Progress Bars */}
          <div
            style={{
              backgroundColor: "var(--canvas)",
              border: "1px solid var(--hairline)",
              borderRadius: "var(--radius-sm)",
              padding: "18px",
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <h3 style={{ fontSize: "14px", margin: 0 }}>Subject Progress Matrix</h3>
              <span style={{ fontSize: "11px", color: "var(--mute)" }}>
                Completion by Course
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {stats.subjectList.map((s) => {
                const filled = Math.round(s.percentage / 10);
                const ascii = `[${"=".repeat(filled)}${"-".repeat(10 - filled)}]`;
                return (
                  <div key={s.subject} style={{ fontSize: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                      <span style={{ fontWeight: 600 }}>[{s.subject}]</span>
                      <span style={{ fontFamily: "var(--font-mono)" }}>
                        {ascii} {s.percentage}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
