const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function formatYmd(year: number, monthIndex: number, day: number): string {
  return `${year}-${pad(monthIndex + 1)}-${pad(day)}`;
}

function isUtcMidnight(d: Date): boolean {
  return (
    d.getUTCHours() === 0 &&
    d.getUTCMinutes() === 0 &&
    d.getUTCSeconds() === 0 &&
    d.getUTCMilliseconds() === 0
  );
}

function calendarDateFromInstant(d: Date): string {
  if (Number.isNaN(d.getTime())) {
    throw new Error("Invalid date");
  }
  if (isUtcMidnight(d)) {
    return formatYmd(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  }
  return formatYmd(d.getFullYear(), d.getMonth(), d.getDate());
}

export function toCalendarDate(value: Date | string): string {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (DATE_ONLY.test(trimmed)) return trimmed;
    return calendarDateFromInstant(new Date(trimmed));
  }
  return calendarDateFromInstant(value);
}

export function todayCalendarDate(): string {
  const now = new Date();
  return formatYmd(now.getFullYear(), now.getMonth(), now.getDate());
}

export function addCalendarDays(date: string, days: number): string {
  const [year, month, day] = toCalendarDate(date).split("-").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day + days));
  return formatYmd(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate());
}

export function calendarDaysBetween(start: string, end: string): number {
  const [sy, sm, sd] = toCalendarDate(start).split("-").map(Number);
  const [ey, em, ed] = toCalendarDate(end).split("-").map(Number);
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round(
    (Date.UTC(ey, em - 1, ed) - Date.UTC(sy, sm - 1, sd)) / msPerDay
  );
}

export function mondayBasedWeekday(date: string): number {
  const [year, month, day] = toCalendarDate(date).split("-").map(Number);
  const utcDay = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return utcDay === 0 ? 6 : utcDay - 1;
}

export function isCalendarDate(value: unknown): value is string {
  return typeof value === "string" && DATE_ONLY.test(value);
}
