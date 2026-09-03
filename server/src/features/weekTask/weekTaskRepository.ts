import WeeklyTask from "./weekTaskSchema";
import type { WeeklyPriority } from "./weekTaskSchema";

export type WeeklyTaskCreate = {
  userId: string;
  year: number;
  week: number;
  title: string;
  priority: WeeklyPriority;
  targetCount: number;
};

export type WeeklyTaskUpdate = {
  title?: string;
  priority?: WeeklyPriority;
  targetCount?: number;
};

export const weekTaskRepository = {
  async create(data: WeeklyTaskCreate) {
    return await WeeklyTask.create({
      ...data,
      completedCount: 0,
    });
  },

  async findByWeek(userId: string, year: number, week: number) {
    return await WeeklyTask.find({ userId, year, week }).sort({ _id: 1 });
  },

  async findById(userId: string, id: string) {
    return await WeeklyTask.findOne({ _id: id, userId });
  },

  async update(userId: string, id: string, update: WeeklyTaskUpdate) {
    const task = await WeeklyTask.findOne({ _id: id, userId });
    if (!task) return null;
    if (update.title !== undefined) task.title = update.title;
    if (update.priority !== undefined) task.priority = update.priority;
    if (update.targetCount !== undefined) {
      task.targetCount = update.targetCount;
      if (task.completedCount > task.targetCount) {
        task.completedCount = task.targetCount;
      }
    }
    await task.save();
    return task;
  },

  async adjustCount(userId: string, id: string, delta: number) {
    const task = await WeeklyTask.findOne({ _id: id, userId });
    if (!task) return null;
    const next = task.completedCount + delta;
    task.completedCount = Math.min(task.targetCount, Math.max(0, next));
    await task.save();
    return task;
  },

  async delete(userId: string, id: string) {
    return await WeeklyTask.findOneAndDelete({ _id: id, userId });
  },

  async deleteAllForUser(userId: string) {
    await WeeklyTask.deleteMany({ userId });
  },
};
