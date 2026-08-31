import jwt from "jsonwebtoken";
import { adminRepository } from "./adminRepository";
import { toPublicUser } from "../users/userService";

export const adminService = {
  login(email: string, password: string) {
    if (!email || !password) {
      throw new Error("All fields are required");
    }
    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      throw new Error("Invalid credentials");
    }
    return jwt.sign({ role: "admin" }, process.env.JWT_SECRET as string, {
      expiresIn: "2h",
    });
  },

  async getAllUsers() {
    const users = await adminRepository.findAllUsers();
    return users.map(toPublicUser);
  },

  async deleteUser(userId: string) {
    if (!userId) throw new Error("Lacking credentials");
    const user = await adminRepository.deleteUser(userId);
    if (!user) throw new Error("User not found");
    return "User deleted successfully";
  },
};