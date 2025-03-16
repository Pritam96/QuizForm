import express from "express";
import { adminOnly, protect } from "../middlewares/auth.middleware.js";
import {
  createQuestionSet,
  getAllQuestionSet,
  updateQuestionSet,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  deleteQuestionSet,
  assignQuestionSetToUser,
  getAllAnswerSets,
  modifyAnswer,
  approveAnswerSet,
} from "../controllers/admin.controller.js";

const router = express.Router();

// POST /api/admin/questions       Creating a question set
router.post("/questions", protect, adminOnly, createQuestionSet);

// GET /api/admin/questions         Getting all question sets
router.get("/questions", protect, adminOnly, getAllQuestionSet);

// PUT /api/admin/questions/:id     Updating a question set
router.get("/questions/:id", protect, adminOnly, updateQuestionSet);

// DELETE /api/admin/questions/:id     Deleting a question set
router.delete("/questions/:id", protect, adminOnly, deleteQuestionSet);

// POST /api/admin/question/:id     Adding a question
router.post("/question/:id", protect, adminOnly, addQuestion);

// PUT /api/admin/question/:id     Updating a question
router.put("/question/:id", protect, adminOnly, updateQuestion);

// DELETE /api/admin/question/:id     Deleting a question
router.delete("/question/:id", protect, adminOnly, deleteQuestion);

// POST /api/admin/questions/assign   Assign a question set to a user
router.post("/questions/assign", protect, adminOnly, assignQuestionSetToUser);

// POST /api/admin/answers         Getting an answer set / all answer sets
router.post("/answers", protect, adminOnly, getAllAnswerSets);

// POST /api/admin/answer/:id     Modifying an answer
router.post("/answer/:id", protect, adminOnly, modifyAnswer);

// GET /api/admin/approve/:id     Approving an answerSet
router.get("/approve/:id", protect, adminOnly, approveAnswerSet);

export default router;
