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

  const { startDate, endDate, frequency, interval, days, occurrences } = task.repetition;

  if (startDate > date) return false;
  if (endDate && endDate < date) return false;

  const span = Math.round((Number(date) - Number(startDate)) / msPerDay);

  let matchesFrequencyPattern = false;
  let occurrenceNumber: number | null = null; 

  if (frequency === 'daily') {
    matchesFrequencyPattern = span % interval === 0;
    occurrenceNumber = span / interval + 1;

  } else if (frequency === 'weekly') {
    const dateDayOfWeek = date.getDay();
    const dayOfWeekMatch = days.includes(dateDayOfWeek);
    const weeksElapsed = Math.floor(span / 7);
    matchesFrequencyPattern = dayOfWeekMatch && (weeksElapsed % interval === 0);

  } else if (frequency === 'monthly') {
    matchesFrequencyPattern = span % interval === 0; 
    occurrenceNumber = span / interval + 1;

  } else if (frequency === 'yearly') {
    matchesFrequencyPattern = span % interval === 0; 
    occurrenceNumber = span / interval + 1;
  }

  if (!matchesFrequencyPattern) return false;

  if (!occurrences) return true;

  if (frequency === 'weekly') {
    let count = 0;
    const cursor = new Date(startDate);
    while (cursor <= date) {
      const weeksElapsedCursor = Math.floor((Number(cursor) - Number(startDate)) / msPerDay / 7);
      if (days.includes(cursor.getDay()) && weeksElapsedCursor % interval === 0) {
        count++;
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    return count <= occurrences;
  }

  return occurrenceNumber !== null && occurrenceNumber <= occurrences;
}