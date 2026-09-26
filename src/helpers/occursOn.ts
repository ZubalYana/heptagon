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
  const end =
    endDate && toCalendarDate(endDate) >= start
      ? toCalendarDate(endDate)
      : null;

  if (start > day) return false;
  if (end && end < day) return false;

  const span = calendarDaysBetween(start, day);
  const step = Math.max(1, Math.floor(interval) || 1);

  if (frequency === "daily") {
    return span % step === 0;
  }

  if (frequency === "weekly") {
    if (!daysOfWeek.length) return false;
    const weeksElapsed = Math.floor((span + mondayBasedWeekday(start)) / 7);
    return (
      daysOfWeek.includes(mondayBasedWeekday(day)) &&
      weeksElapsed % step === 0
    );
  }

  if (frequency === "monthly") {
    const targetDay = dayOfMonth ?? startParts.day;
    return (
      monthsBetween(start, day) % step === 0 &&
      matchesDayOfMonth(day, targetDay)
    );
  }

  if (frequency === "yearly") {
    const { year, month } = calendarParts(day);
    const targetMonth = monthOfYear ?? startParts.month;
    const targetDay = dayOfMonth ?? startParts.day;
    const yearsElapsed = year - startParts.year;
    return (
      yearsElapsed % step === 0 &&
      month === targetMonth &&
      matchesDayOfMonth(day, targetDay)
    );
  }

  return false;
}
