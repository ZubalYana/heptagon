import { weeksRepository } from "./weeksRepository";
import { daysRepository } from "../days/daysRepository";
import { taskService } from "../tasks/taskService";
import { weekTaskRepository } from "../weekTask/weekTaskRepository";
import { getStartOfWeek } from "../../helpers/weekHelpers";
import { addCalendarDays, toCalendarDate } from "../../helpers/calendarDate";
import toDateString from "../../helpers/toDateString";

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
    const weekDoc = await this.getOrCreate(userId, year, week);
    const days = weekDoc.days ?? [];

    let completed = 0;
    let total = 0;

    for (const day of days) {
      const dayId = String(day._id);
      const tasks = await taskService.getByDay(userId, dayId);
      const dateStr = toDateString(day.date);
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

    const weeklyTasks = await weekTaskRepository.findByWeek(userId, year, week);
    for (const task of weeklyTasks) {
      total += task.targetCount;
      completed += task.completedCount;
    }

    return { completed, total };
  },
};