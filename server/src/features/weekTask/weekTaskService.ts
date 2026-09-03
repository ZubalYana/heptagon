import { weekTaskRepository } from "./weekTaskRepository";
import {
  WEEKLY_PRIORITIES,
  type WeeklyPriority,
} from "./weekTaskSchema";

function parseWeekParams(year: number, week: number) {
  if (!Number.isInteger(year) || !Number.isInteger(week) || week < 1 || week > 53) {
    throw new Error("Invalid year or week number");
  }
}

function isWeeklyPriority(value: unknown): value is WeeklyPriority {
  return (
    typeof value === "string" &&
    (WEEKLY_PRIORITIES as readonly string[]).includes(value)
  );
}

export const weekTaskService = {
  async list(userId: string, year: number, week: number) {
    if (!userId) throw new Error("Lacking credentials");
    parseWeekParams(year, week);
    return await weekTaskRepository.findByWeek(userId, year, week);
  },

  async create(
    userId: string,
    year: number,
    week: number,
    title: string,
    priority: unknown,
    targetCount?: unknown
  ) {
    if (!userId) throw new Error("Lacking credentials");
    parseWeekParams(year, week);
    const trimmed = typeof title === "string" ? title.trim() : "";
    if (!trimmed) throw new Error("Title is required");
    if (!isWeeklyPriority(priority)) throw new Error("Invalid priority");
    const target =
      targetCount === undefined || targetCount === null || targetCount === ""
        ? 1
        : Number(targetCount);
    if (!Number.isInteger(target) || target < 1) {
      throw new Error("targetCount is required");
    }
    return await weekTaskRepository.create({
      userId,
      year,
      week,
      title: trimmed,
      priority,
      targetCount: target,
    });
  },

  async update(
    userId: string,
    id: string,
    year: number,
    week: number,
    body: { title?: string; priority?: unknown; targetCount?: unknown }
  ) {
    if (!userId || !id) throw new Error("Lacking credentials");
    parseWeekParams(year, week);
    const existing = await weekTaskRepository.findById(userId, id);
    if (!existing || existing.year !== year || existing.week !== week) {
      throw new Error("Weekly task not found");
    }
    const update: {
      title?: string;
      priority?: WeeklyPriority;
      targetCount?: number;
    } = {};
    if (body.title !== undefined) {
      const trimmed = body.title.trim();
      if (!trimmed) throw new Error("Title is required");
      update.title = trimmed;
    }
    if (body.priority !== undefined) {
      if (!isWeeklyPriority(body.priority)) throw new Error("Invalid priority");
      update.priority = body.priority;
    }
    if (body.targetCount !== undefined) {
      const target = Number(body.targetCount);
      if (!Number.isInteger(target) || target < 1) {
        throw new Error("targetCount is required");
      }
      update.targetCount = target;
    }
    const saved = await weekTaskRepository.update(userId, id, update);
    if (!saved) throw new Error("Weekly task not found");
    return saved;
  },

  async adjustCount(
    userId: string,
    id: string,
    year: number,
    week: number,
    delta: unknown
  ) {
    if (!userId || !id) throw new Error("Lacking credentials");
    parseWeekParams(year, week);
    if (delta !== 1 && delta !== -1) throw new Error("Invalid delta");
    const existing = await weekTaskRepository.findById(userId, id);
    if (!existing || existing.year !== year || existing.week !== week) {
      throw new Error("Weekly task not found");
    }
    const saved = await weekTaskRepository.adjustCount(userId, id, delta);
    if (!saved) throw new Error("Weekly task not found");
    return saved;
  },

  async delete(userId: string, id: string, year: number, week: number) {
    if (!userId || !id) throw new Error("Lacking credentials");
    parseWeekParams(year, week);
    const existing = await weekTaskRepository.findById(userId, id);
    if (!existing || existing.year !== year || existing.week !== week) {
      throw new Error("Weekly task not found");
    }
    await weekTaskRepository.delete(userId, id);
    return "Deleted successfully";
  },
};
