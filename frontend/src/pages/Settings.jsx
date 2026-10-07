import React, { useState } from "react";
import { storageService } from "../services/storageService";

export function Settings({
  settings,
  onUpdateSettings,
  tasks,
  profile,
  onResetAll,
  onImportData,
  backendStatus = { online: false }
}) {
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState("");
  const [showImportBox, setShowImportBox] = useState(false);

  // Handle Export
  const handleExportJSON = () => {
    const jsonStr = storageService.exportJSON(tasks, profile, settings);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `academic-tasks-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle Import
  const handleImportSubmit = () => {
    if (!importText.trim()) {
      setImportError("Please paste JSON backup contents.");
      return;
    }

    const res = storageService.importJSON(importText);
    if (!res.success) {
      setImportError(res.error || "Failed to parse JSON.");
      return;
    }

    onImportData(res.tasks, res.profile, res.settings);
    setImportText("");
    setShowImportBox(false);
    setImportError("");
  };

  // Handle File Upload Import
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === "string") {
        const res = storageService.importJSON(content);
        if (res.success) {
          onImportData(res.tasks, res.profile, res.settings);
        } else {
          setImportError("Invalid backup file: " + res.error);
          setShowImportBox(true);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to restore the default sample student tasks? Custom tasks will be overwritten.")) {
      onResetAll();
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header */}
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
            Preferences & Data Management
          </span>
          <h1 style={{ fontSize: "28px", margin: "4px 0 2px 0", letterSpacing: "-0.02em" }}>
            Settings & Storage
          </h1>
          <p style={{ fontSize: "14px", color: "var(--body)" }}>
            Local storage configuration, backup import/export, and display settings.
          </p>
        </div>
      </div>

      {/* Main Settings Sections */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: "24px"
        }}
      >
        {/* Section 1: Backup & Persistence (Data Layer) */}
        <div
          style={{
            backgroundColor: "var(--canvas)",
            border: "1px solid var(--hairline)",
            borderRadius: "var(--radius-sm)",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}
        >
          <div>
            <h2 style={{ fontSize: "16px", margin: 0, fontWeight: 700 }}>
              [DATA] Backup & Portability
            </h2>
            <p style={{ fontSize: "12px", color: "var(--mute)", marginTop: "4px" }}>
              All task and profile records are safely stored in your browser's localStorage.
            </p>
          </div>

          <div className="hairline-divider" style={{ margin: "2px 0" }} />

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {/* Export */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: "13px" }}>Export Data Backup</div>
                <div style={{ fontSize: "11px", color: "var(--mute)" }}>
                  Download all {tasks.length} tasks and profile settings as JSON
                </div>
              </div>
              <button onClick={handleExportJSON} className="btn-secondary" style={{ fontSize: "12px" }}>
                [⬇ Export JSON]
              </button>
            </div>

            <div className="hairline-divider" style={{ margin: "2px 0" }} />

            {/* Import */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: "13px" }}>Import Backup</div>
                <div style={{ fontSize: "11px", color: "var(--mute)" }}>
                  Restore previously exported task records
                </div>
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                <label className="btn-secondary" style={{ fontSize: "12px", cursor: "pointer" }}>
                  [📁 Upload File]
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                  />
                </label>
                <button
                  onClick={() => setShowImportBox(!showImportBox)}
                  className="btn-ghost"
                  style={{ fontSize: "12px" }}
                >
                  [Paste]
                </button>
              </div>
            </div>

            {/* Paste JSON box if toggled */}
            {showImportBox && (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
                {importError && (
                  <div style={{ color: "var(--danger)", fontSize: "12px" }}>
                    [!]: {importError}
                  </div>
                )}
                <textarea
                  className="textarea-input"
                  rows={4}
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="Paste exported JSON contents here..."
                />
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                  <button
                    onClick={() => setShowImportBox(false)}
                    className="btn-ghost"
                    style={{ fontSize: "12px" }}
                  >
                    [Cancel]
                  </button>
                  <button
                    onClick={handleImportSubmit}
                    className="btn-primary"
                    style={{ fontSize: "12px" }}
                  >
                    [Verify & Import]
                  </button>
                </div>
              </div>
            )}

            <div className="hairline-divider" style={{ margin: "2px 0" }} />

            {/* Reset to sample defaults */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: "13px" }}>Restore Demo Dataset</div>
                <div style={{ fontSize: "11px", color: "var(--mute)" }}>
                  Load the standard 12 university courses and assignments
                </div>
              </div>
              <button onClick={handleReset} className="btn-secondary" style={{ fontSize: "12px" }}>
                [↻ Reset Demo]
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Application Preferences */}
        <div
          style={{
            backgroundColor: "var(--canvas)",
            border: "1px solid var(--hairline)",
            borderRadius: "var(--radius-sm)",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}
        >
          <div>
            <h2 style={{ fontSize: "16px", margin: 0, fontWeight: 700 }}>
              [UI] Interface Preferences
            </h2>
            <p style={{ fontSize: "12px", color: "var(--mute)", marginTop: "4px" }}>
              Customize behavior and interaction patterns.
            </p>
          </div>

          <div className="hairline-divider" style={{ margin: "2px 0" }} />

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {/* View Mode default */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: "13px" }}>Default Tasks View</div>
                <div style={{ fontSize: "11px", color: "var(--mute)" }}>
                  Choose initial layout for task repository
                </div>
              </div>
              <select
                className="select-input"
                style={{ width: "auto", fontSize: "12px", padding: "4px 8px" }}
                value={settings.viewMode || "cards"}
                onChange={(e) => onUpdateSettings({ ...settings, viewMode: e.target.value })}
              >
                <option value="cards">Cards Grid</option>
                <option value="table">Compact Table</option>
              </select>
            </div>

            {/* Compact Mode */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: "13px" }}>Compact Typography</div>
                <div style={{ fontSize: "11px", color: "var(--mute)" }}>
                  Tighter line spacing and smaller padding
                </div>
              </div>
              <input
                type="checkbox"
                checked={!!settings.compactMode}
                onChange={(e) => onUpdateSettings({ ...settings, compactMode: e.target.checked })}
                style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "var(--ink)" }}
              />
            </div>

            {/* Auto-archive completed */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: "13px" }}>Filter Default to Pending</div>
                <div style={{ fontSize: "11px", color: "var(--mute)" }}>
                  Hide finished assignments upon opening tasks page
                </div>
              </div>
              <input
                type="checkbox"
                checked={!!settings.autoArchiveCompleted}
                onChange={(e) => onUpdateSettings({ ...settings, autoArchiveCompleted: e.target.checked })}
                style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "var(--ink)" }}
              />
            </div>

            <div className="hairline-divider" style={{ margin: "2px 0" }} />

            {/* System Specs Box */}
            <div
              style={{
                backgroundColor: "var(--surface-soft)",
                border: "1px solid var(--hairline)",
                borderRadius: "var(--radius-sm)",
                padding: "12px",
                fontSize: "11px",
                color: "var(--mute)",
                fontFamily: "var(--font-mono)",
                lineHeight: "1.6"
              }}
            >
              <div>SYSTEM: Student Task Manager // Academic OS</div>
              <div>TYPOGRAPHY: JetBrains Mono / Berkeley Mono Stack</div>
              <div>BACKEND API: {backendStatus?.online ? `CONNECTED (${backendStatus.url})` : "STANDALONE MODE (localStorage)"}</div>
              <div>PROXY ROUTE: /api/* → http://localhost:5000</div>
              <div>ACTIVE SESSION: Term Fall 2026</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
