import React from "react";

export function SummaryCard({
  title,
  value,
  subtitle,
  badge,
  type = "default", // 'default' | 'danger' | 'warning' | 'success' | 'info'
  onClick
}) {
  const getAccentBorder = () => {
    switch (type) {
      case "danger":
        return "1px solid rgba(255, 59, 48, 0.4)";
      case "warning":
        return "1px solid rgba(255, 159, 10, 0.4)";
      case "success":
        return "1px solid rgba(48, 209, 88, 0.4)";
      case "info":
        return "1px solid rgba(0, 122, 255, 0.4)";
      default:
        return "1px solid var(--hairline)";
    }
  };

  const getValueColor = () => {
    switch (type) {
      case "danger":
        return "var(--danger)";
      case "warning":
        return "#d67a00";
      case "success":
        return "#12752b";
      case "info":
        return "var(--accent)";
      default:
        return "var(--ink)";
    }
  };

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: "var(--canvas)",
        border: getAccentBorder(),
        borderRadius: "var(--radius-sm)",
        padding: "16px 20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.15s ease",
        position: "relative",
        minHeight: "108px"
      }}
      className="summary-card"
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
        <span style={{
          fontSize: "12px",
          color: "var(--mute)",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.05em"
        }}>
          {title}
        </span>
        {badge && (
          <span style={{
            fontSize: "11px",
            padding: "2px 6px",
            borderRadius: "var(--radius-sm)",
            backgroundColor: type === "danger" ? "rgba(255,59,48,0.12)" : "var(--surface-card)",
            color: type === "danger" ? "var(--danger)" : "var(--mute)",
            fontWeight: 500
          }}>
            {badge}
          </span>
        )}
      </div>

      <div style={{
        fontSize: "32px",
        fontWeight: 700,
        color: getValueColor(),
        fontFamily: "var(--font-mono)",
        lineHeight: 1.1,
        margin: "8px 0"
      }}>
        {value}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "var(--mute)" }}>
        <span>{subtitle || ""}</span>
        {onClick && (
          <span style={{ fontSize: "11px", color: "var(--ink)", fontWeight: 500 }}>
            [View →]
          </span>
        )}
      </div>
    </div>
  );
}
