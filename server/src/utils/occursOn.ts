import type Task from "../types/task";

function isSameDay(d1: Date, d2: Date) {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}

export default function occursOn(task: Task, date: Date): boolean {
  const msPerDay = 24 * 60 * 60 * 1000;

  if (task.repetition === null) {
    return isSameDay(task.date, date);
  }

  const { startDate, endDate, frequency, interval, daysOfWeek } = task.repetition;

  if (startDate > date) return false;
  if (endDate && endDate < date) return false;

  const span = Math.round((Number(date) - Number(startDate)) / msPerDay);

  if (frequency === 'daily') {
    return span % interval === 0;
  }

  if (frequency === 'weekly') {
    const weeksElapsed = Math.floor(span / 7);
    return daysOfWeek.includes(date.getDay()) && weeksElapsed % interval === 0;
  }

  if (frequency === 'monthly') {
    return span % interval === 0; 
  }

  if (frequency === 'yearly') {
    return span % interval === 0; 
  }

  return false;
}