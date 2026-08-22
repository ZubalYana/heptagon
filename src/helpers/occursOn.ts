import type Task from "../interfaces/Task";
import {
  calendarDaysBetween,
  calendarParts,
  daysInMonth,
  mondayBasedWeekday,
  monthsBetween,
  toCalendarDate,
} from "./calendarDate";

function matchesDayOfMonth(date: string, dayOfMonth: number): boolean {
  const { year, month, day } = calendarParts(date);
  const target = Math.min(dayOfMonth, daysInMonth(year, month));
  return day === target;
}

export default function occursOn(task: Task, date: Date | string): boolean {
  if (!task.repetition) return true;

  const day = toCalendarDate(date);
  const {
    startDate,
    endDate,
    frequency,
    interval,
    daysOfWeek,
    dayOfMonth,
    monthOfYear,
  } = task.repetition;
  const start = toCalendarDate(startDate);
  const startParts = calendarParts(start);

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
    const targetDay = dayOfMonth ?? startParts.day;
    return (
      monthsBetween(start, day) % interval === 0 &&
      matchesDayOfMonth(day, targetDay)
    );
  }

  if (frequency === "yearly") {
    const { year, month } = calendarParts(day);
    const targetMonth = monthOfYear ?? startParts.month;
    const targetDay = dayOfMonth ?? startParts.day;
    const yearsElapsed = year - startParts.year;
    return (
      yearsElapsed % interval === 0 &&
      month === targetMonth &&
      matchesDayOfMonth(day, targetDay)
    );
  }

  return false;
}
