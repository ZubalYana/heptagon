import Feedback from "./feedbackSchema";

export const feedbackRepository = {
  async create(userName: string, userEmail: string, feedbackText: string) {
    return await Feedback.create({ userName, userEmail, feedbackText });
  },

  async findAll() {
    return await Feedback.find();
  },
};