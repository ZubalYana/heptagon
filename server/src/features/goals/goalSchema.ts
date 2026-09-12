import mongoose from "mongoose";

export const GOAL_UNITS = [
  "times",
  "reps",
  "sessions",
  "hours",
  "minutes",
  "days",
  "pages",
  "chapters",
  "words",
  "km",
  "kg",
] as const;

export type GoalUnit = (typeof GOAL_UNITS)[number];

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: undefined },
  targetValue: { type: Number, required: true, min: 0.01 },
  currentValue: { type: Number, min: 0, default: 0 },
  unit: { type: String, enum: GOAL_UNITS, default: undefined },
  deadline: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null },
});

goalSchema.index({ userId: 1, deadline: 1 });

const Goal = mongoose.model("Goal", goalSchema);
export default Goal;
