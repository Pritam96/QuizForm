import { QuestionSet } from "../models/question.model.js";

// POST /api/admin/questions
export const createQuestionSet = async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Title is required." });
    }
    const questionSet = await QuestionSet.create({
      adminId: req.user._id,
      title,
      description,
      questions,
    });
    return res.status(201).json({ success: true, questionSet });
  } catch (error) {
    console.error("Error while creating question set:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

// GET /api/admin/questions
export const getAllQuestionSet = async (req, res) => {
  try {
    const questionSets = await QuestionSet.find({ adminId: req.user._id });
    return res.status(200).json({ success: true, questionSets });
  } catch (error) {
    console.error("Error while getting question sets:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

// PUT /api/admin/questions/:id
export const updateQuestionSet = async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    const questionSet = await QuestionSet.findByIdAndUpdate(
      req.params.id,
      { title, description, questions },
      { new: true }
    );
    return res.status(200).json({ success: true, questionSet });
  } catch (error) {
    console.error("Error while updating question set:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

// DELETE /api/admin/questions/:id
export const deleteQuestionSet = async (req, res) => {
  try {
    await QuestionSet.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "Question set deleted." });
  } catch (error) {
    console.error("Error while deleting question set:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

// POST /api/admin/question/:id
export const addQuestion = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res
        .status(400)
        .json({ success: false, message: "Question is required." });
    }

    const questionSet = await QuestionSet.findByIdAndUpdate(
      req.params.id,
      { $push: { questions: question } },
      { new: true }
    );

    if (!questionSet) {
      return res
        .status(404)
        .json({ success: false, message: "Question set not found." });
    }

    return res.status(201).json({ success: true, questionSet });
  } catch (error) {
    console.error("Error while adding a question:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

// PUT /api/admin/question/:id
export const updateQuestion = async (req, res) => {
  try {
    const { questionId, question } = req.body;

    if (!questionId || !question) {
      return res.status(400).json({
        success: false,
        message: "Question ID and updated question are required.",
      });
    }

    let questionSet = await QuestionSet.findById(req.params.id);
    if (!questionSet) {
      return res
        .status(404)
        .json({ success: false, message: "Question set not found." });
    }

    // Find the question inside the set
    let isUpdated = false;
    questionSet.questions = questionSet.questions.map((q) => {
      if (q._id.toString() === questionId) {
        isUpdated = true;
        return { ...q.toObject(), ...question }; // Merge updates
      }
      return q;
    });

    if (!isUpdated) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found." });
    }

    const updatedQuestionSet = await questionSet.save();

    return res
      .status(200)
      .json({ success: true, questionSet: updatedQuestionSet });
  } catch (error) {
    console.error("Error while updating a question:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

// DELETE /api/admin/question/:id
export const deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.body;

    if (!questionId) {
      return res.status(400).json({
        success: false,
        message: "Question ID is required.",
      });
    }

    const questionSet = await QuestionSet.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { questions: { _id: questionId } },
      },
      { new: true }
    );

    if (!questionSet) {
      return res
        .status(404)
        .json({ success: false, message: "Question set not found." });
    }

    return res.status(200).json({ success: true, questionSet });
  } catch (error) {
    console.error("Error while deleting a question:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};
