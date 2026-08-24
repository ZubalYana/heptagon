import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userRepository } from "./userRepository";
import { isValidEmail } from "../../helpers/isValidEmail";
import {
  hashesMatch,
  hashToken,
  newFamilyId,
  refreshExpiryDate,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../helpers/authTokens";

function sessionPair(userId: string, familyId: string) {
  const token = signAccessToken(userId);
  const refreshToken = signRefreshToken(userId, familyId);
  return { token, refreshToken };
}

async function issueNewSession(userId: string) {
  const familyId = newFamilyId();
  const { token, refreshToken } = sessionPair(userId, familyId);
  await userRepository.addRefreshSession(userId, {
    familyId,
    tokenHash: hashToken(refreshToken),
    expiresAt: refreshExpiryDate(),
    createdAt: new Date(),
  });
  return { token, refreshToken };
}

export const userService = {
  async register(name: string, email: string, password: string) {
    if (!name || !email || !password) {
      throw new Error("All fields are required");
    }
    const normalizedEmail = email.trim().toLowerCase();
    if (!isValidEmail(normalizedEmail)) {
      throw new Error("Invalid email");
    }
    const existingUser = await userRepository.findByEmail(normalizedEmail);
    if (existingUser) {
      throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userRepository.create(
      name.trim(),
      normalizedEmail,
      hashedPassword
    );
    const userId = String(newUser._id);
    const { token, refreshToken } = await issueNewSession(userId);
    return {
      token,
      refreshToken,
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    };
  },

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new Error("All fields are required");
    }
    const normalizedEmail = email.trim().toLowerCase();
    if (!isValidEmail(normalizedEmail)) {
      throw new Error("Invalid email format");
    }
    const user = await userRepository.findByEmail(normalizedEmail);
    if (!user) {
      throw new Error("User not found");
    }
    const passwordMatch = await bcrypt.compare(password, user.password as string);
    if (!passwordMatch) {
      throw new Error("Invalid credentials");
    }
    const { token, refreshToken } = await issueNewSession(String(user._id));
    return {
      token,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email },
    };
  },

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new Error("Refresh token is required");
    }

    let payload: ReturnType<typeof verifyRefreshToken>;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new Error("Refresh token expired");
      }
      throw new Error("Invalid refresh token");
    }

    const user = await userRepository.findById(payload.id);
    if (!user) {
      throw new Error("Invalid refresh token");
    }

    const session = (user.refreshSessions ?? []).find(
      (s) => s.familyId === payload.familyId
    );
    if (!session) {
      throw new Error("Invalid refresh token");
    }
    if (session.expiresAt.getTime() <= Date.now()) {
      await userRepository.removeRefreshSession(payload.id, payload.familyId);
      throw new Error("Refresh token expired");
    }

    const presentedHash = hashToken(refreshToken);
    if (!hashesMatch(session.tokenHash, presentedHash)) {
      await userRepository.clearRefreshSessions(payload.id);
      throw new Error("Invalid refresh token");
    }

    const next = sessionPair(payload.id, payload.familyId);
    await userRepository.rotateRefreshSession(
      payload.id,
      payload.familyId,
      hashToken(next.refreshToken)
    );

    return next;
  },

  async logout(refreshToken: string) {
    if (!refreshToken) return;
    try {
      const payload = verifyRefreshToken(refreshToken);
      await userRepository.removeRefreshSession(payload.id, payload.familyId);
    } catch {
      return;
    }
  },

  async deleteAccount(userId: string) {
    if (!userId) {
      throw new Error("User ID is required");
    }
    return await userRepository.deleteUser(userId);
  }
};
