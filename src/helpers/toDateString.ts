import { toCalendarDate } from "./calendarDate";

export default function toDateString(date: Date | string): string {
  return toCalendarDate(date);
}
