import { weeksRepository } from "./weeksRepository";
import { daysRepository } from "../days/daysRepository";
import { weekTaskRepository } from "../weekTask/weekTaskRepository";
import { taskRepository } from "../tasks/taskRepository";
import { getStartOfWeek } from "../../helpers/weekHelpers";
import { addCalendarDays, toCalendarDate } from "../../helpers/calendarDate";
import toDateString from "../../helpers/toDateString";
import occursOn from "../../helpers/occursOn";
import type Task from "../tasks/taskTypes";

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const weeksService = {
  async getOrCreate(userId: string, year: number, weekNumber: number) {
    if (!userId) throw new Error("Lacking credentials");

    const existing = await weeksRepository.findByYearAndNumber(userId, year, weekNumber);
    if (existing) return existing;

    const startDate = toCalendarDate(getStartOfWeek(year, weekNumber));

    const days = await Promise.all(
      DAY_NAMES.map((name, i) =>
        daysRepository.create(userId, name, addCalendarDays(startDate, i))
      )
    );

    return await weeksRepository.create(
      userId,
      year,
      weekNumber,
      startDate,
      days[6].date,
      days.map((d) => d._id.toString())
    );
  },

  async getWeekProgress(userId: string, year: number, week: number) {
    if (!userId) throw new Error("Lacking credentials");

    const [weekDoc, repeatingTasks, weeklyTasks] = await Promise.all([
      this.getOrCreate(userId, year, week),
      taskRepository.findRepeatingForUser(userId),
      weekTaskRepository.findByWeek(userId, year, week),
    ]);

    let completed = 0;
    let total = 0;

    for (const day of weekDoc.days ?? []) {
      const dateStr = toDateString(day.date);
      const occurring = repeatingTasks.filter((task) =>
        occursOn(task as unknown as Task, day.date)
      );
      const tasks = [...(day.tasks ?? []), ...occurring];
      for (const task of tasks as Array<{
        repetition?: { frequency?: string } | null;
        completedDates?: string[];
        completed?: boolean;
      }>) {
        total += 1;
        const done = task.repetition
          ? Boolean(task.completedDates?.includes(dateStr))
          : Boolean(task.completed);
        if (done) completed += 1;
      }
    }

    for (const task of weeklyTasks) {
      total += task.targetCount;
      completed += task.completedCount;
    }

    return { completed, total };
  },
};