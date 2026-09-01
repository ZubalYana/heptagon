import Feedback from "./feedbackSchema";

export const feedbackRepository = {
  async create(
    userId: string,
    userName: string,
    userEmail: string,
    feedbackText: string
  ) {
    return await Feedback.create({ userId, userName, userEmail, feedbackText });
  },

  async findAll() {
    return await Feedback.find();
  },

  async delete(id: string) {
    return await Feedback.findByIdAndDelete(id);
  },

  async deleteAllForUser(userId: string, email: string) {
    await Feedback.deleteMany({
      $or: [{ userId }, { userEmail: email }],
    });
  },
};