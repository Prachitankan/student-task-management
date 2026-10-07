import express from "express";
import { taskController } from "../controllers/taskController.js";

const router = express.Router();

router.get("/", taskController.getTasks);
router.get("/stats", taskController.getStats);
router.get("/:id", taskController.getTaskById);
router.post("/", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.patch("/:id/status", taskController.toggleStatus);
router.delete("/:id", taskController.deleteTask);

export default router;
