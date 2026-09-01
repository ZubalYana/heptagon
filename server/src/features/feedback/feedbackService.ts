import { feedbackRepository } from "./feedbackRepository";
import { userRepository } from "../users/userRepository";

export const feedbackService = {
  async create(userId: string, feedbackText: string) {
    if (!feedbackText?.trim()) {
      throw new Error("Feedback text is required");
    }
    const user = await userRepository.findById(userId);
    if (!user?.email) {
      throw new Error("User not found");
    }
    return await feedbackRepository.create(
      userId,
      user.name || "User",
      user.email,
      feedbackText.trim()
    );
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
