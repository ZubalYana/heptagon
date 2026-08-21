import { feedbackRepository } from "./feedbackRepository";

export const feedbackService = {
  async create(userName: string, userEmail: string, feedbackText: string) {
    if (!userName || !userEmail || !feedbackText) {
      throw new Error("Missing credentials");
    }
    return await feedbackRepository.create(userName, userEmail, feedbackText);
  },

  async getAll() {
    return await feedbackRepository.findAll();
  },
};