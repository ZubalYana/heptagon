import { weeksRepository } from "./weeksRepository";
import { daysRepository } from "../days/daysRepository";
import { getStartOfWeek } from "../../helpers/weekHelpers";
import { addCalendarDays, toCalendarDate } from "../../helpers/calendarDate";

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
};