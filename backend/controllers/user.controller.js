import { QuestionSet } from "../models/question.model.js";
import { AnswerSet } from "../models/answer.model.js";

// GET /api/user/questions
export const getAvailableQuestionSets = async (req, res) => {
  try {
    const questionSets = await QuestionSet.find();
    return res.status(200).json({ success: true, questionSets });
  } catch (error) {
    console.error("Error while getting available question sets:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

// POST /api/user/answer/:id      QuestionSet id required
export const addAnswer = async (req, res) => {
  try {
    const { questionId, answer } = req.body;

    if (!questionId || !answer) {
      return res.status(400).json({
        success: false,
        message: "Question ID and answer are required.",
      });
    }

    const questionSet = await QuestionSet.findById(req.params.id);
    if (!questionSet) {
      return res
        .status(404)
        .json({ success: false, message: "Question set not found." });
    }

    const question = questionSet.questions.find(
      (q) => q._id.toString() === questionId
    );
    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found." });
    }

    const userId = req.user?._id;

    // Update or insert answer
    const answerSet = await AnswerSet.findOneAndUpdate(
      { questionSetId: questionSet._id, userId },
      { $push: { answers: { questionId, answerText: answer } } },
      { upsert: true, new: true }
    );

    return res.status(201).json({ success: true, answerSet });
  } catch (error) {
    console.error("Error while answering a question:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

// DELETE /api/user/answer/:id      AnswerSet id required
export const removeAnswer = async (req, res) => {
  try {
    const { questionId } = req.body;

    if (!questionId) {
      return res.status(400).json({
        success: false,
        message: "Question ID is required.",
      });
    }
    const answerSet = await AnswerSet.findByIdAndUpdate(
      req.params.id,
      { $pull: { answers: { questionId: questionId.toString() } } },
      { new: true }
    );

    if (!answerSet) {
      return res
        .status(404)
        .json({ success: false, message: "Answer set not found." });
    }
    return res.status(201).json({ success: true, answerSet });
  } catch (error) {
    console.error("Error while deleting answer:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};
