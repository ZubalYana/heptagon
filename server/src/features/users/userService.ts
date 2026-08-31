import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { userRepository } from "./userRepository";
import { isValidEmail } from "../../helpers/isValidEmail";
import { sendPasswordChangeEmail, sendVerificationEmail } from "../../helpers/mailer";
import { isPasswordStrongEnough } from "../../helpers/passwordStrength";
import {
  hashesMatch,
  hashToken,
  newFamilyId,
  refreshExpiryDate,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../helpers/authTokens";

const VERIFY_TTL_MS = 24 * 60 * 60 * 1000;
const PASSWORD_CHANGE_TTL_MS = 60 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;

export function toPublicUser(user: {
  _id: unknown;
  name?: string | null;
  email?: string | null;
  emailVerified?: boolean | null;
  password?: string | null;
}) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    emailVerified: Boolean(user.emailVerified),
    hasPassword: Boolean(user.password),
  };
}

function verificationLink(rawToken: string) {
  const frontend = process.env.FRONTEND_URL || "http://localhost:5173";
  return `${frontend}/verify-email?token=${encodeURIComponent(rawToken)}`;
}

async function createAndSendVerification(userId: string, email: string) {
  const rawToken = crypto.randomBytes(32).toString("base64url");
  await userRepository.setEmailVerification(
    userId,
    hashToken(rawToken),
    new Date(Date.now() + VERIFY_TTL_MS),
    new Date()
  );
  try {
    await sendVerificationEmail(email, verificationLink(rawToken));
  } catch (err) {
    console.error("Failed to send verification email:", err);
  }
}

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
    await createAndSendVerification(userId, normalizedEmail);
    return {
      token,
      refreshToken,
      user: toPublicUser(newUser),
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
    if (!user.password) {
      throw new Error("This account uses Google sign-in");
    }
    const passwordMatch = await bcrypt.compare(password, user.password as string);
    if (!passwordMatch) {
      throw new Error("Invalid credentials");
    }
    const { token, refreshToken } = await issueNewSession(String(user._id));
    return {
      token,
      refreshToken,
      user: toPublicUser(user),
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
  },

  async loginWithGoogle(profile: {
    googleId: string;
    email: string;
    name: string;
  }) {
    const email = profile.email.trim().toLowerCase();
    if (!isValidEmail(email)) {
      throw new Error("Invalid email");
    }

    const byGoogleId = await userRepository.findByGoogleId(profile.googleId);
    if (byGoogleId) {
      if (!byGoogleId.emailVerified) {
        await userRepository.linkGoogleAccount(
          String(byGoogleId._id),
          profile.googleId
        );
      }
      const { token, refreshToken } = await issueNewSession(String(byGoogleId._id));
      return {
        token,
        refreshToken,
        user: toPublicUser(byGoogleId),
      };
    }

    const existing = await userRepository.findByEmail(email);
    if (existing) {
      if (!existing.emailVerified) {
        throw new Error(
          "This email is already registered. Log in with your password. You can use Google after verifying your email."
        );
      }
      const linked = await userRepository.linkGoogleAccount(
        String(existing._id),
        profile.googleId
      );
      const account = linked ?? existing;
      const { token, refreshToken } = await issueNewSession(String(account._id));
      return {
        token,
        refreshToken,
        user: toPublicUser(account),
      };
    }

    const created = await userRepository.createGoogleUser(
      profile.name.trim(),
      email,
      profile.googleId
    );
    const { token, refreshToken } = await issueNewSession(String(created._id));
    return {
      token,
      refreshToken,
      user: toPublicUser(created),
    };
  },

  async verifyEmail(rawToken: string) {
    if (!rawToken) {
      throw new Error("Verification token is required");
    }
    const user = await userRepository.findByVerificationHash(hashToken(rawToken));
    if (!user) {
      throw new Error("Verification link is invalid or expired");
    }
    const updated = await userRepository.markEmailVerified(String(user._id));
    return { user: toPublicUser(updated ?? user) };
  },

  async resendVerification(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    if (user.emailVerified) {
      throw new Error("Email is already verified");
    }
    if (!user.password) {
      throw new Error("This account uses Google sign-in");
    }
    const sentAt = user.emailVerification?.sentAt;
    if (sentAt && Date.now() - new Date(sentAt).getTime() < RESEND_COOLDOWN_MS) {
      throw new Error("Please wait before requesting another verification email");
    }
    await createAndSendVerification(String(user._id), user.email as string);
    return { message: "Verification email sent" };
  },

  async requestPasswordChange(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    if (!currentPassword || !newPassword) {
      throw new Error("All fields are required");
    }
    if (!isPasswordStrongEnough(newPassword)) {
      throw new Error("Password is too weak");
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    if (!user.password) {
      throw new Error("This account uses Google sign-in");
    }

    const currentMatch = await bcrypt.compare(
      currentPassword,
      user.password as string
    );
    if (!currentMatch) {
      throw new Error("Current password is incorrect");
    }

    const sameAsOld = await bcrypt.compare(newPassword, user.password as string);
    if (sameAsOld) {
      throw new Error("New password must be different");
    }

    const sentAt = user.pendingPasswordChange?.sentAt;
    if (sentAt && Date.now() - new Date(sentAt).getTime() < RESEND_COOLDOWN_MS) {
      throw new Error("Please wait before requesting another password change email");
    }

    const rawToken = crypto.randomBytes(32).toString("base64url");
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await userRepository.setPendingPasswordChange(
      userId,
      hashToken(rawToken),
      passwordHash,
      new Date(Date.now() + PASSWORD_CHANGE_TTL_MS),
      new Date()
    );

    const frontend = process.env.FRONTEND_URL || "http://localhost:5173";
    const confirmUrl = `${frontend}/confirm-password?token=${encodeURIComponent(rawToken)}`;
    try {
      await sendPasswordChangeEmail(user.email as string, confirmUrl);
    } catch (err) {
      console.error("Failed to send password change email:", err);
    }

    return { message: "Confirmation email sent" };
  },

  async confirmPasswordChange(rawToken: string) {
    if (!rawToken) {
      throw new Error("Password change token is required");
    }
    const user = await userRepository.findByPasswordChangeHash(hashToken(rawToken));
    if (!user || !user.pendingPasswordChange?.passwordHash) {
      throw new Error("Password change link is invalid or expired");
    }
    await userRepository.applyPasswordChange(
      String(user._id),
      user.pendingPasswordChange.passwordHash
    );
    return { message: "Password updated" };
  },
};
