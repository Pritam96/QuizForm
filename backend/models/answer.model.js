import { model, Schema } from "mongoose";

const AnswerSchema = Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questionSetId: {
      type: Schema.Types.ObjectId,
      ref: "QuestionSet",
      required: true,
    },
    answers: [
      {
        // Individual question Id from questions array
        questionId: {
          type: Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },
        answerText: { type: String, required: true },
      },
    ],
    status: {
      type: String,
      enum: ["Pending", "Modified", "Approved"],
      default: "Pending",
    },
    modifiedByAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const AnswerSet = model("AnswerSet", AnswerSchema);
