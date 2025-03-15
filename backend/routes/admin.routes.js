import express from "express";
import { adminOnly, protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// only admin can access this route
router.get("/check", protect, adminOnly, (req, res, next) => {
  return res.status(200).json({ success: true, user: req.user });
});

export default router;
