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

export function calendarDateToLocalDate(value: Date | string): Date {
  const ymd = toCalendarDate(value);
  const [year, month, day] = ymd.split("-").map(Number);
  return new Date(year, month - 1, day);
}
