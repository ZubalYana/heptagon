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

  async delete(id: string) {
    if (!id) throw new Error("Lacking credentials");
    const deleted = await feedbackRepository.delete(id);
    if (!deleted) throw new Error("Feedback not found");
    return deleted;
  },
};