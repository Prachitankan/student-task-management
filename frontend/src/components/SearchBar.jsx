import React from "react";

export function SearchBar({ value, onChange, onClear, totalMatches, totalCount }) {
  return (
    <div style={{
      position: "relative",
      display: "flex",
      alignItems: "center",
      width: "100%"
    }}>
      <span style={{
        position: "absolute",
        left: "12px",
        color: "var(--mute)",
        fontSize: "13px",
        pointerEvents: "none",
        fontFamily: "var(--font-mono)"
      }}>
        [?]
      </span>

      <input
        type="text"
        className="text-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search tasks by title, subject, notes... (Press '/' to focus)"
        style={{
          paddingLeft: "42px",
          paddingRight: value ? "120px" : "40px",
          height: "40px"
        }}
        id="task-search-input"
      />

      {value && (
        <div style={{
          position: "absolute",
          right: "34px",
          display: "flex",
          alignItems: "center",
          gap: "6px"
        }}>
          <span style={{ fontSize: "11px", color: "var(--mute)" }}>
            {totalMatches}/{totalCount}
          </span>
          <button
            onClick={onClear}
            className="btn-ghost"
            style={{
              fontSize: "11px",
              padding: "2px 6px"
            }}
            title="Clear search"
          >
            [✕]
          </button>
        </div>
      )}

      <span style={{
        position: "absolute",
        right: "10px",
        fontSize: "11px",
        color: "var(--ash)",
        border: "1px solid var(--hairline)",
        borderRadius: "var(--radius-sm)",
        padding: "1px 4px"
      }}>
        /
      </span>
    </div>
  );
}
