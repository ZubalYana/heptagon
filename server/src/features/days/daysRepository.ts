import Day from "./daysSchema";

export const daysRepository = {
  async create(
    userId: string,
    dayOfWeek: string,
    date: string,
    tasks: string[] = [],
    events: object[] = []
  ) {
    return await Day.create({ userId, dayOfWeek, date, tasks, events });
  },

  async addTask(userId: string, dayId: string, taskId: string) {
    return await Day.findOneAndUpdate(
      { _id: dayId, userId },
      { $push: { tasks: taskId } },
      { returnDocument: "after" }
    );
  },

  async findById(userId: string, dayId: string) {
    return await Day.findOne({ _id: dayId, userId }).populate("tasks");
  },

  async deleteByIds(userId: string, ids: string[]) {
    if (ids.length === 0) return;
    await Day.deleteMany({ userId, _id: { $in: ids } });
  },

  async deleteAllForUser(userId: string) {
    await Day.deleteMany({ userId });
  },
};
