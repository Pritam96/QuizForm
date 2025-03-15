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
  },
  {
    timestamps: true,
  }
);

export const QuestionSet = model("QuestionSet", QuestionSetSchema);
