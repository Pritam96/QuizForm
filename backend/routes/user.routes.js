import express from "express";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// user and admin can access this route
router.get("/check", protect, (req, res, next) => {
  return res.status(200).json({ success: true, user: req.user });
});

export default router;
