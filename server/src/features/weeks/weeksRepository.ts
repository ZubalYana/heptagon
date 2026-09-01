import Week from "./weeksSchema";

export const weeksRepository = {
  async findByYearAndNumber(userId: string, year: number, weekNumber: number) {
    return await Week.findOne({ year, weekNumber, userId }).populate({
      path: "days",
      populate: { path: "tasks" },
    });
  },

  async create(
    userId: string,
    year: number,
    weekNumber: number,
    startDate: string,
    endDate: string,
    dayIds: string[]
  ) {
    const week = await Week.create({
      userId,
      year,
      weekNumber,
      startDate,
      endDate,
      days: dayIds,
    });
    return week.populate({ path: "days", populate: { path: "tasks" } });
  },

  async deleteAllForUser(userId: string) {
    await Week.deleteMany({ userId });
  },
};