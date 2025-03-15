import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  addAnswer,
  getAvailableQuestionSets,
  removeAnswer,
} from "../controllers/user.controller.js";

const router = express.Router();

// GET /api/user/questions     Getting available question sets
router.get("/questions", protect, getAvailableQuestionSets);

// POST /api/user/questions     Answering a question
router.post("/answer/:id", protect, addAnswer);

// DELETE /api/user/questions     Removing an answer
router.delete("/answer/:id", protect, removeAnswer);

export default router;
