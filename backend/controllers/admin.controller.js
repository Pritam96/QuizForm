import { AnswerSet } from "../models/answer.model.js";
import { QuestionSet } from "../models/question.model.js";
import { User } from "../models/user.model.js";

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
    const questionSets = await QuestionSet.find({ adminId: req.user._id }).sort(
      { updatedAt: -1 }
    );
    return res.status(200).json({ success: true, questionSets });
  } catch (error) {
    console.error("Error while getting question sets:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

// GET /api/admin/questions/:id
export const getQuestionSet = async (req, res) => {
  try {
    const questionSet = await QuestionSet.findById(req.params.id);
    if (!questionSet) {
      return res
        .status(404)
        .json({ success: false, message: "Question set not found." });
    }
    return res.status(200).json({ success: true, questionSet });
  } catch (error) {
    console.error("Error while getting a question set:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

// PUT /api/admin/questions/:id
export const updateQuestionSet = async (req, res) => {
  try {
    const { title, description } = req.body;
    const questionSet = await QuestionSet.findByIdAndUpdate(
      req.params.id,
      { title, description },
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

// POST /api/admin/questions/assign
export const assignQuestionSetToUser = async (req, res) => {
  try {
    const { questionSetId, userId } = req.body;

    if (!questionSetId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Question set ID and user ID are required.",
      });
    }

    const questionSet = await QuestionSet.findById(questionSetId);
    if (!questionSet) {
      return res
        .status(404)
        .json({ success: false, message: "Question set not found." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const isAlreadyAssigned = questionSet.assignedUsers.some(
      (u) => u.toString() === userId
    );

    if (isAlreadyAssigned) {
      return res.status(400).json({
        success: false,
        message: "User is already assigned to this question set.",
      });
    }

    questionSet.assignedUsers.push(userId);

    // Mongoose validates the entire document, including questions.
    // If any question lacks questionText, validation fails.
    // We only want to validate the assignedUsers field.
    await questionSet.save({ validateModifiedOnly: true });

    return res.status(201).json({
      success: true,
      message: "User assigned successfully.",
      questionSet,
    });
  } catch (error) {
    console.error("Error while assigning question set:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

// POST /api/admin/answers/:id
export const getAllAnswerSets = async (req, res) => {
  const { answerSetId } = req.body;
  try {
    // if answerSetId is provided, return the answer set
    if (answerSetId) {
      const answerSet = await AnswerSet.findById(answerSetId)
        .populate("questionSetId", "title description questions")
        .populate("userId", "name email");

      if (!answerSet) {
        return res
          .status(404)
          .json({ success: false, message: "Answer set not found." });
      }

      return res.status(200).json({ success: true, answerSet });
    }

    // if answerSetId is not provided, return all answer sets
    const questionSets = await QuestionSet.find({ adminId: req.user._id });

    if (!questionSets.length) {
      return res
        .status(404)
        .json({ success: false, message: "No question sets found." });
    }

    const questionSetIds = questionSets.map((qs) => qs._id);

    const answerSets = await AnswerSet.find({
      questionSetId: { $in: questionSetIds },
      status: "Modified",
    })
      .select("-__v -answers")
      .populate("questionSetId", "title description")
      .populate("userId", "name email");

    return res.status(200).json({ success: true, answerSets });
  } catch (error) {
    console.error("Error while getting answer sets:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

// POST /api/admin/answer/:id - AnswerSet id is required
export const modifyAnswer = async (req, res) => {
  try {
    const { answerId, answer } = req.body;

    if (!answerId || !answer) {
      return res.status(400).json({
        success: false,
        message: "Answer ID and answer are required.",
      });
    }

    const answerSet = await AnswerSet.findById(req.params.id);
    if (!answerSet) {
      return res
        .status(404)
        .json({ success: false, message: "Answer set not found." });
    }

    const existingAnswer = answerSet.answers.find(
      (a) => a._id.toString() === answerId
    );

    if (!existingAnswer) {
      return res.status(404).json({
        success: false,
        message: "Answer not found in the answer set.",
      });
    }

    existingAnswer.answerText = answer;
    answerSet.modifiedByAdmin = true;
    await answerSet.save();

    return res.status(200).json({
      success: true,
      message: "Answer updated successfully.",
      answerSet,
    });
  } catch (error) {
    console.error("Error while modifying answer:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

// GET /api/admin/approve/:id
export const approveAnswerSet = async (req, res) => {
  try {
    const answerSet = await AnswerSet.findById(req.params.id);
    if (!answerSet) {
      return res
        .status(404)
        .json({ success: false, message: "Answer set not found." });
    }

    answerSet.status = "Approved";
    await answerSet.save();

    return res.status(200).json({
      success: true,
      message: "Answer set approved successfully.",
      answerSet,
    });
  } catch (error) {
    console.error("Error while approving answer set:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};
