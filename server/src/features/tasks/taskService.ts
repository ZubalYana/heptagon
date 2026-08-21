import { taskRepository } from "./taskRepository";
import { daysRepository } from "../days/daysRepository"; 
import type { Repetition } from "./taskTypes";
import type { CreateTaskInput } from "./taskTypes";


export const taskService = {
  async create(data: CreateTaskInput) {
    const { userId, text, priority, regular, dayId } = data;

    if (regular && !data.startDate) {
      throw new Error("startDate is required for regular tasks");
    }

    const repetition: Repetition | null = regular
      ? {
          frequency: data.frequency!,
          interval: data.interval!,
          daysOfWeek: data.daysOfWeek!,
          startDate: new Date(data.startDate!),
          endDate: data.endDate ? new Date(data.endDate) : null,
        }
      : null;

    const task = await taskRepository.create(userId, text, priority, repetition);

    if (!regular) {
      if (!dayId) throw new Error("dayId is required for non-regular tasks");
      const day = await daysRepository.addTask(userId, dayId, String(task._id));
      if (!day) throw new Error("Day not found");
    }

    return task;
  },
};