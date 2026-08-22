import type Task from "../features/tasks/taskTypes";
import {
  calendarDaysBetween,
  mondayBasedWeekday,
  toCalendarDate,
} from "./calendarDate";

export default function occursOn(task: Task, date: Date | string): boolean {
  const day = toCalendarDate(date);

  if (!task.repetition) {
    if (!task.date) return false;
    return toCalendarDate(task.date) === day;
  }

  const { startDate, endDate, frequency, interval, daysOfWeek } =
    task.repetition;
  const start = toCalendarDate(startDate);

  if (start > day) return false;
  if (endDate && toCalendarDate(endDate) < day) return false;

  const span = calendarDaysBetween(start, day);

  if (frequency === "daily") {
    return span % interval === 0;
  }

  if (frequency === "weekly") {
    const weeksElapsed = Math.floor(span / 7);
    return (
      daysOfWeek.includes(mondayBasedWeekday(day)) &&
      weeksElapsed % interval === 0
    );
  }

  if (frequency === "monthly") {
    return span % interval === 0;
  }

  if (frequency === "yearly") {
    return span % interval === 0;
  }

  return false;
}
