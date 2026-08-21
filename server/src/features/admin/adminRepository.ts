import User from "../users/userSchema";

export const adminRepository = {
  async findAllUsers() {
    return await User.find();
  },

  async deleteUser(userId: string) {
    return await User.findByIdAndDelete(userId);
  },
};