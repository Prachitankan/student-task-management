import { taskRepository } from "../services/taskRepository.js";

export const profileController = {
  getProfile: (req, res) => {
    try {
      const profile = taskRepository.getProfile();
      return res.status(200).json(profile);
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch student profile", details: err.message });
    }
  },

  updateProfile: (req, res) => {
    try {
      const updated = taskRepository.updateProfile(req.body);
      return res.status(200).json({ success: true, profile: updated });
    } catch (err) {
      return res.status(500).json({ error: "Failed to update profile", details: err.message });
    }
  }
};
