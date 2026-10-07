import express from "express";
import { aiController } from "../controllers/aiController.js";

const router = express.Router();

router.get("/status", aiController.getStatus);
router.post("/breakdown", aiController.breakdownTask);
router.post("/study-plan", aiController.getStudyPlan);
router.post("/explain", aiController.explainTopic);

export default router;
