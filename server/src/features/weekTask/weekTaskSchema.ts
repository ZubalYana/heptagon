import mongoose from "mongoose";

export const WEEKLY_PRIORITIES = ["crucial", "important", "optional"] as const;
export type WeeklyPriority = (typeof WEEKLY_PRIORITIES)[number];

const weekSubtaskSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true },
  completed: { type: Boolean, default: false },
});

const weekTaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  year: { type: Number, required: true },
  week: { type: Number, required: true },
  title: { type: String, required: true, trim: true },
  priority: { type: String, enum: WEEKLY_PRIORITIES, required: true },
  targetCount: { type: Number, min: 1, default: 1 },
  completedCount: { type: Number, min: 0, default: 0 },
  subtasks: { type: [weekSubtaskSchema], default: [] },
});

weekTaskSchema.index({ userId: 1, year: 1, week: 1 });

const WeeklyTask = mongoose.model("WeeklyTask", weekTaskSchema);
export default WeeklyTask;
