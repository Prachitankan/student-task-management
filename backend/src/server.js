import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import taskRoutes from "./routes/taskRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import { isGeminiConfigured, defaultModel } from "./config/gemini.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"]
}));
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  const timestamp = new Date().toISOString().slice(11, 19);
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint (Queried by Frontend for live status detection)
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "student-task-manager-backend",
    timestamp: new Date().toISOString(),
    gemini: {
      configured: isGeminiConfigured,
      model: defaultModel
    }
  });
});

// Mount Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/ai", aiRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    path: req.originalUrl
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("[Server Error]:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message
  });
});

// Start Server
app.listen(PORT, () => {
  console.log("\n=======================================================");
  console.log(`🚀 [ACADEMIC_OS BACKEND] Server running on http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📋 Tasks API:   http://localhost:${PORT}/api/tasks`);
  console.log(`👤 Profile API: http://localhost:${PORT}/api/profile`);
  console.log(`🧠 Gemini AI:   http://localhost:${PORT}/api/ai/status`);
  if (isGeminiConfigured) {
    console.log(`✨ Google Gemini: ACTIVE (Model: ${defaultModel})`);
  } else {
    console.log(`ℹ️  Google Gemini: Unconfigured. Add GEMINI_API_KEY in backend/.env for live AI.`);
  }
  console.log("=======================================================\n");
});
