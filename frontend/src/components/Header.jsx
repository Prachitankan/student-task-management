import React, { useState } from "react";

export function Header({
  activePage,
  onNavigate,
  onOpenAddTask,
  onOpenNotifications,
  unreadAlertCount = 0,
  studentName = "Alex Dev",
  backendStatus = { online: false }
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", marker: "[1]" },
    { id: "tasks", label: "Tasks", marker: "[2]" },
    { id: "calendar", label: "Calendar", marker: "[3]" },
    { id: "profile", label: "Profile", marker: "[4]" },
    { id: "settings", label: "Settings", marker: "[5]" }
  ];

  return (
    <header
      style={{
        backgroundColor: "var(--canvas)",
        borderBottom: "1px solid var(--hairline)",
        position: "sticky",
        top: 0,
        zIndex: 900
      }}
    >
      <div
        style={{
          maxWidth: "var(--content-max-width)",
          margin: "0 auto",
          padding: "0 20px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px"
        }}
      >
        {/* Left: ASCII Wordmark & Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            onClick={() => onNavigate("dashboard")}
            style={{
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              lineHeight: 1.1
            }}
          >
            <div style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "var(--ink)",
              letterSpacing: "-0.01em",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}>
              <span style={{
                backgroundColor: "var(--ink)",
                color: "var(--on-dark)",
                padding: "1px 5px",
                borderRadius: "var(--radius-sm)",
                fontSize: "11px",
                fontWeight: 700
              }}>
                OS
              </span>
              <span>STUDENT_TASK_MANAGER</span>
            </div>
            <span style={{ fontSize: "10px", color: "var(--mute)", letterSpacing: "0.06em" }}>
              ACADEMIC_SYSTEM // v1.0
            </span>
          </div>

          {/* Desktop Nav Items */}
          <nav
            style={{
              display: "none",
              alignItems: "center",
              gap: "4px",
              marginLeft: "18px"
            }}
            className="header-desktop-nav"
          >
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  style={{
                    background: isActive ? "var(--surface-card)" : "transparent",
                    color: isActive ? "var(--ink)" : "var(--mute)",
                    border: "none",
                    borderBottom: isActive ? "2px solid var(--ink)" : "2px solid transparent",
                    padding: "8px 12px",
                    fontSize: "13px",
                    fontWeight: isActive ? 600 : 400,
                    cursor: "pointer",
                    fontFamily: "var(--font-mono)",
                    transition: "all 0.15s ease",
                    borderRadius: "0px"
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right side controls: Notifications, Add Task, Profile, Backend Status */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

          {/* Alert / Notification bell with count badge */}
          <button
            onClick={onOpenNotifications}
            className="btn-secondary"
            style={{
              fontSize: "12px",
              padding: "5px 10px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              position: "relative"
            }}
            title="Deadline Reminders"
          >
            <span>🔔</span>
            {unreadAlertCount > 0 ? (
              <span
                style={{
                  backgroundColor: "var(--danger)",
                  color: "#fff",
                  fontSize: "10px",
                  fontWeight: 700,
                  padding: "1px 5px",
                  borderRadius: "999px"
                }}
              >
                {unreadAlertCount}
              </span>
            ) : (
              <span style={{ fontSize: "11px", color: "var(--mute)" }} className="hide-on-mobile">
                0
              </span>
            )}
          </button>

          {/* Add Task Primary CTA */}
          <button
            onClick={onOpenAddTask}
            className="btn-primary"
            style={{ fontSize: "13px", padding: "6px 14px" }}
          >
            <span>[+]</span>
            <span className="hide-on-mobile">Add Task</span>
          </button>

          {/* Backend Connection Indicator */}
          <div
            style={{
              display: "none",
              alignItems: "center",
              gap: "5px",
              fontSize: "11px",
              padding: "4px 8px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--hairline)",
              backgroundColor: backendStatus?.online ? "rgba(48,209,88,0.12)" : "var(--surface-soft)",
              color: backendStatus?.online ? "#12752b" : "var(--mute)"
            }}
            className="header-profile-chip"
            title={backendStatus?.online ? `REST API Connected: ${backendStatus.url}` : "Backend offline / Standalone localStorage mode"}
          >
            <span style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: backendStatus?.online ? "#30d158" : "#ff9f0a",
              display: "inline-block"
            }} />
            <span>{backendStatus?.online ? "API: Live" : "Mode: Local"}</span>
          </div>

          {/* Student Profile Quick Chip */}
          <div
            onClick={() => onNavigate("profile")}
            style={{
              display: "none",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              color: "var(--ink)",
              cursor: "pointer",
              padding: "4px 8px",
              border: "1px solid var(--hairline)",
              borderRadius: "var(--radius-sm)",
              backgroundColor: "var(--surface-soft)"
            }}
            className="header-profile-chip"
            title="View Student Profile"
          >
            <span>👤</span>
            <span>{studentName.split(" ")[0]}</span>
          </div>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn-ghost mobile-menu-button"
            style={{ display: "none", fontSize: "16px", padding: "4px 8px" }}
          >
            {mobileMenuOpen ? "[✕]" : "[☰]"}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: "var(--canvas)",
            borderBottom: "1px solid var(--hairline-strong)",
            padding: "12px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}
          className="mobile-nav-drawer"
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileMenuOpen(false);
              }}
              className="btn-ghost"
              style={{
                justifyContent: "flex-start",
                padding: "8px 12px",
                fontSize: "14px",
                backgroundColor: activePage === item.id ? "var(--surface-card)" : "transparent",
                color: activePage === item.id ? "var(--ink)" : "var(--body)"
              }}
            >
              {item.marker} {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
