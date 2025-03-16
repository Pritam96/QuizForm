import { model, Schema } from "mongoose";

const QuestionSchema = Schema({
  questionText: { type: String, required: true },
  questionType: {
    type: String,
    enum: ["text", "mcq", "boolean"],
    default: "text",
  },
  options: { type: [String], default: [] }, // used fro mcq and boolean
});

const QuestionSetSchema = Schema(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    questions: [QuestionSchema],
    assignedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

export const Question = model("Question", QuestionSchema);
export const QuestionSet = model("QuestionSet", QuestionSetSchema);
