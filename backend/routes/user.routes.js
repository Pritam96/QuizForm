import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  addAnswer,
  getAllAnswerSets,
  getAvailableQuestionSets,
  removeAnswer,
  submitAnswerSet,
} from "../controllers/user.controller.js";

const router = express.Router();

// GET /api/user/questions     Getting available question sets
router.get("/questions", protect, getAvailableQuestionSets);

// POST /api/user/answer/:id     Answering a question - QuestionSet id required
router.post("/answer/:id", protect, addAnswer);

// DELETE /api/user/answer/:id     Removing an answer - AnswerSet id required
router.delete("/answer/:id", protect, removeAnswer);

// GET /api/user/submit/:id   Submitting an answer set - AnswerSet id required
router.get("/submit/:id", protect, submitAnswerSet);

// POST /api/user/answers   Getting all submitted answer sets
router.post("/answers", protect, getAllAnswerSets);

export default router;
