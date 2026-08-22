import { taskRepository } from "./taskRepository";
import { daysRepository } from "../days/daysRepository";
import type { Repetition } from "./taskTypes";
import type { CreateTaskInput } from "./taskTypes";
import type { EditTaskInput } from "./taskTypes";
import { calendarParts, toCalendarDate } from "../../helpers/calendarDate";

function fillRepetitionAnchors(repetition: Repetition): Repetition {
  const start = calendarParts(repetition.startDate);
  if (repetition.frequency === "monthly") {
    return {
      ...repetition,
      dayOfMonth: repetition.dayOfMonth ?? start.day,
      monthOfYear: null,
    };
  }
  if (repetition.frequency === "yearly") {
    return {
      ...repetition,
      dayOfMonth: repetition.dayOfMonth ?? start.day,
      monthOfYear: repetition.monthOfYear ?? start.month,
    };
  }
  return {
    ...repetition,
    dayOfMonth: null,
    monthOfYear: null,
  };
}

function assertCalendarRepetition(repetition: Repetition) {
  if (repetition.frequency === "monthly") {
    if (
      repetition.dayOfMonth == null ||
      repetition.dayOfMonth < 1 ||
      repetition.dayOfMonth > 31
    ) {
      throw new Error("Day of month is required for monthly tasks");
    }
  }
  if (repetition.frequency === "yearly") {
    if (
      repetition.monthOfYear == null ||
      repetition.monthOfYear < 1 ||
      repetition.monthOfYear > 12
    ) {
      throw new Error("Month is required for yearly tasks");
    }
    if (
      repetition.dayOfMonth == null ||
      repetition.dayOfMonth < 1 ||
      repetition.dayOfMonth > 31
    ) {
      throw new Error("Day of month is required for yearly tasks");
    }
  }
}

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
          daysOfWeek: data.daysOfWeek ?? [],
          dayOfMonth: data.dayOfMonth ?? null,
          monthOfYear: data.monthOfYear ?? null,
          startDate: toCalendarDate(data.startDate!),
          endDate: data.endDate ? toCalendarDate(data.endDate) : null,
        }
      : null;

    const savedRepetition = repetition
      ? fillRepetitionAnchors(repetition)
      : null;
    if (savedRepetition) assertCalendarRepetition(savedRepetition);

    const task = await taskRepository.create(
      userId,
      text,
      priority,
      savedRepetition
    );

    if (!regular) {
      if (!dayId) throw new Error("dayId is required for non-regular tasks");
      const day = await daysRepository.addTask(userId, dayId, String(task._id));
      if (!day) throw new Error("Day not found");
    }

    return task;
  },

  async getByDay(userId: string, dayId: string) {
    if (!userId || !dayId) throw new Error("Lacking credentials");
    return await taskRepository.getByDay(userId, dayId);
  },

  async toggle(userId: string, taskId: string, dayId: string) {
    if (!userId || !taskId || !dayId) throw new Error("Lacking credentials");
    return await taskRepository.toggle(userId, taskId, dayId);
  },

  async edit(data: EditTaskInput) {
    const { userId, taskId, text, priority } = data;
    if (!userId || !taskId || !text || !priority)
      throw new Error("Lacking credentials");

    const repetition = data.repetition
      ? fillRepetitionAnchors({
          ...data.repetition,
          startDate: toCalendarDate(data.repetition.startDate),
          endDate: data.repetition.endDate
            ? toCalendarDate(data.repetition.endDate)
            : null,
        })
      : data.repetition;

    if (repetition) assertCalendarRepetition(repetition);

    if (
      repetition &&
      repetition.endDate &&
      repetition.startDate > repetition.endDate
    ) {
      throw new Error("Start date must precede end date");
    }
    return await taskRepository.edit(
      userId,
      taskId,
      text,
      priority,
      repetition
    );
  },

  async delete(userId: string, taskId: string) {
    if (!userId || !taskId) throw new Error("Lacking credentials");
    return taskRepository.delete(userId, taskId);
  },

  async addSubtask(
    userId: string,
    taskId: string,
    taskDate: string,
    subtaskText: string
  ) {
    if (!userId || !taskId || !taskDate || !subtaskText) {
      throw new Error("Lacking credentials");
    }
    return await taskRepository.addSubtask(
      userId,
      taskId,
      taskDate,
      subtaskText
    );
  },

  async toggleSubtask(
    userId: string,
    taskId: string,
    subtaskId: string,
    date: string
  ) {
    if (!userId || !taskId || !subtaskId || !date) {
      throw new Error("Lacking credentials");
    }
    return taskRepository.toggleSubtask(userId, taskId, subtaskId, date);
  },

  async editSubtask(
    userId: string,
    taskId: string,
    subtaskId: string,
    text: string
  ) {
    if (!userId || !taskId || !subtaskId || !text) {
      throw new Error("Lacking credentials");
    }
    return await taskRepository.editSubtask(userId, taskId, subtaskId, text);
  },

  async deleteSubtask(userId: string, taskId: string, subtaskId: string) {
    if (!userId || !taskId || !subtaskId) {
      throw new Error("Lacking credentials");
    }
    return await taskRepository.deleteSubtask(userId, taskId, subtaskId);
  },
};
