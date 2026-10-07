import express from "express";
import { profileController } from "../controllers/profileController.js";

const router = express.Router();

router.get("/", profileController.getProfile);
router.put("/", profileController.updateProfile);

export default router;
