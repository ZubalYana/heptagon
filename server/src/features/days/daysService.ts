import { daysRepository } from "./daysRepository";

export const daysService = {
  async getById(userId: string, dayId: string) {
    if (!userId || !dayId) throw new Error("Lacking credentials");
    const day = await daysRepository.findById(userId, dayId);
    if (!day) throw new Error("Day not found");
    return day;
  },
};