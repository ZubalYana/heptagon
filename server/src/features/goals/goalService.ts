import { goalRepository } from "./goalRepository";
import { GOAL_UNITS, type GoalUnit } from "./goalSchema";

function isGoalUnit(value: unknown): value is GoalUnit {
  return typeof value === "string" && (GOAL_UNITS as readonly string[]).includes(value);
}

function parseTarget(value: unknown) {
  const target = Number(value);
  if (!Number.isFinite(target) || target <= 0) {
    throw new Error("targetValue is required");
  }
  return target;
}

function parseDeadline(value: unknown) {
  if (value === undefined || value === null || value === "") {
    throw new Error("deadline is required");
  }
  const deadline = new Date(value as string);
  if (Number.isNaN(deadline.getTime())) {
    throw new Error("Invalid deadline");
  }
  return deadline;
}

function parseUnit(value: unknown): GoalUnit | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  if (!isGoalUnit(value)) throw new Error("Invalid unit");
  return value;
}

export const goalService = {
  async list(userId: string) {
    if (!userId) throw new Error("Lacking credentials");
    return await goalRepository.findAll(userId);
  },

  async create(
    userId: string,
    body: {
      name?: unknown;
      description?: unknown;
      targetValue?: unknown;
      unit?: unknown;
      deadline?: unknown;
    }
  ) {
    if (!userId) throw new Error("Lacking credentials");
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) throw new Error("Name is required");
    const description =
      typeof body.description === "string" ? body.description.trim() : "";
    return await goalRepository.create({
      userId,
      name,
      description: description || undefined,
      targetValue: parseTarget(body.targetValue),
      unit: parseUnit(body.unit),
      deadline: parseDeadline(body.deadline),
    });
  },

  async update(
    userId: string,
    id: string,
    body: {
      name?: unknown;
      description?: unknown;
      targetValue?: unknown;
      currentValue?: unknown;
      unit?: unknown;
      deadline?: unknown;
    }
  ) {
    if (!userId || !id) throw new Error("Lacking credentials");
    const existing = await goalRepository.findById(userId, id);
    if (!existing) throw new Error("Goal not found");

    const update: {
      name?: string;
      description?: string | null;
      targetValue?: number;
      currentValue?: number;
      unit?: GoalUnit | null;
      deadline?: Date;
    } = {};

    if (body.name !== undefined) {
      const name = typeof body.name === "string" ? body.name.trim() : "";
      if (!name) throw new Error("Name is required");
      update.name = name;
    }
    if (body.description !== undefined) {
      update.description =
        typeof body.description === "string" ? body.description.trim() : "";
    }
    if (body.targetValue !== undefined) {
      update.targetValue = parseTarget(body.targetValue);
    }
    if (body.currentValue !== undefined) {
      const current = Number(body.currentValue);
      if (!Number.isFinite(current) || current < 0) {
        throw new Error("Invalid currentValue");
      }
      update.currentValue = current;
    }
    if (body.unit !== undefined) {
      update.unit = parseUnit(body.unit) ?? null;
    }
    if (body.deadline !== undefined) {
      update.deadline = parseDeadline(body.deadline);
    }

    const saved = await goalRepository.update(userId, id, update);
    if (!saved) throw new Error("Goal not found");
    return saved;
  },

  async adjustValue(userId: string, id: string, delta: unknown) {
    if (!userId || !id) throw new Error("Lacking credentials");
    if (delta !== 1 && delta !== -1) throw new Error("Invalid delta");
    const existing = await goalRepository.findById(userId, id);
    if (!existing) throw new Error("Goal not found");
    const saved = await goalRepository.adjustValue(userId, id, delta);
    if (!saved) throw new Error("Goal not found");
    return saved;
  },

  async delete(userId: string, id: string) {
    if (!userId || !id) throw new Error("Lacking credentials");
    const existing = await goalRepository.findById(userId, id);
    if (!existing) throw new Error("Goal not found");
    await goalRepository.delete(userId, id);
    return "Deleted successfully";
  },
};
