import Goal from "./goalSchema";
import type { GoalUnit } from "./goalSchema";

export type GoalCreate = {
  userId: string;
  name: string;
  description?: string;
  targetValue: number;
  unit?: GoalUnit;
  deadline: Date;
};

export type GoalUpdate = {
  name?: string;
  description?: string | null;
  targetValue?: number;
  currentValue?: number;
  unit?: GoalUnit | null;
  deadline?: Date;
};

function syncCompletion(goal: {
  currentValue: number;
  targetValue: number;
  completedAt?: Date | null;
}) {
  if (goal.currentValue >= goal.targetValue) {
    if (!goal.completedAt) goal.completedAt = new Date();
  } else {
    goal.completedAt = null;
  }
}

export const goalRepository = {
  async create(data: GoalCreate) {
    return await Goal.create({
      ...data,
      currentValue: 0,
    });
  },

  async findAll(userId: string) {
    return await Goal.find({ userId }).sort({ completedAt: 1, deadline: 1 });
  },

  async findById(userId: string, id: string) {
    return await Goal.findOne({ _id: id, userId });
  },

  async update(userId: string, id: string, update: GoalUpdate) {
    const goal = await Goal.findOne({ _id: id, userId });
    if (!goal) return null;
    if (update.name !== undefined) goal.name = update.name;
    if (update.description !== undefined) {
      goal.set("description", update.description || undefined);
    }
    if (update.unit !== undefined) {
      goal.set("unit", update.unit || undefined);
    }
    if (update.deadline !== undefined) goal.deadline = update.deadline;
    if (update.targetValue !== undefined) goal.targetValue = update.targetValue;
    if (update.currentValue !== undefined) {
      goal.currentValue = update.currentValue;
    }
    if (goal.currentValue > goal.targetValue) {
      goal.currentValue = goal.targetValue;
    }
    if (goal.currentValue < 0) goal.currentValue = 0;
    syncCompletion(goal);
    await goal.save();
    return goal;
  },

  async adjustValue(userId: string, id: string, delta: number) {
    const goal = await Goal.findOne({ _id: id, userId });
    if (!goal) return null;
    goal.currentValue = Math.min(
      goal.targetValue,
      Math.max(0, goal.currentValue + delta)
    );
    syncCompletion(goal);
    await goal.save();
    return goal;
  },

  async delete(userId: string, id: string) {
    return await Goal.findOneAndDelete({ _id: id, userId });
  },

  async deleteAllForUser(userId: string) {
    await Goal.deleteMany({ userId });
  },
};
