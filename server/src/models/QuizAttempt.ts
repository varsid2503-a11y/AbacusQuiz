import mongoose, { Schema, type InferSchemaType } from "mongoose";

const QuizAttemptSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    score: { type: Number, required: true },
    correct: { type: Number, required: true },
    total: { type: Number, required: true },
    operation: { type: String, required: true },
    digits: { type: Number, required: true },
    timePerQuestionSec: { type: Number, required: true },
    avgResponseMs: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

QuizAttemptSchema.index({ userId: 1, createdAt: -1 });

export type QuizAttemptDoc = InferSchemaType<typeof QuizAttemptSchema> & {
  _id: mongoose.Types.ObjectId;
};
export const QuizAttempt =
  mongoose.models.QuizAttempt ?? mongoose.model("QuizAttempt", QuizAttemptSchema);
