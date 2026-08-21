import User from "./userSchema";

export const userRepository = {
  async findByEmail(email: string) {
    return await User.findOne({ email });
  },

  async create(name: string, email: string, hashedPassword: string) {
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    return user;
  },

  async findById(userId: string) {
    return await User.findById(userId);
  },

  async clearGoogleTokens(userId: string) {
    return await User.findByIdAndUpdate(userId, {
      $unset: { googleTokens: "" },
    });
  },
};
