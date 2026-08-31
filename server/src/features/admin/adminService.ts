import { adminRepository } from "./adminRepository";
import { toPublicUser } from "../users/userService";
import { hashToken, hashesMatch, signAdminToken } from "../../helpers/authTokens";

function secretMatches(provided: string, expected: string | undefined): boolean {
  if (!expected) return false;
  return hashesMatch(hashToken(provided), hashToken(expected));
}

export const adminService = {
  login(email: string, password: string) {
    if (!email || !password) {
      throw new Error("All fields are required");
    }
    const emailOk = secretMatches(email, process.env.ADMIN_EMAIL);
    const passwordOk = secretMatches(password, process.env.ADMIN_PASSWORD);
    if (!emailOk || !passwordOk) {
      throw new Error("Invalid credentials");
    }
    return signAdminToken();
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
