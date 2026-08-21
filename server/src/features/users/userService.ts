import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userRepository } from "./userRepository";

export const userService = {
  async register(name: string, email: string, password: string) {
    if (!name || !email || !password) {
      throw new Error("All fields are required");
    }
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userRepository.create(name, email, hashedPassword);
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET as string, {
      expiresIn: "24h",
    });
    return {
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    };
  },

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new Error("All fields are required");
    }
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    const passwordMatch = await bcrypt.compare(password, user.password as string);
    if (!passwordMatch) {
      throw new Error("Invalid credentials");
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "24h",
    });
    return {
      token,
      user: { id: user._id, name: user.name, email: user.email },
    };
  },
};