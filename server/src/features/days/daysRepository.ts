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
};
