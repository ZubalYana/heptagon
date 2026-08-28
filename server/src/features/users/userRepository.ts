import User from "./userSchema";
import { MAX_REFRESH_SESSIONS } from "../../helpers/authTokens";

export type RefreshSession = {
  familyId: string;
  tokenHash: string;
  expiresAt: Date;
  createdAt?: Date;
};

export const userRepository = {
  async findByEmail(email: string) {
    return await User.findOne({ email });
  },

  async create(name: string, email: string, hashedPassword: string) {
    const user = new User({
      name,
      email,
      password: hashedPassword,
      emailVerified: false,
      refreshSessions: [],
    });
    await user.save();
    return user;
  },

  async createGoogleUser(name: string, email: string, googleId: string) {
    const user = new User({
      name,
      email,
      googleId,
      emailVerified: true,
      refreshSessions: [],
    });
    await user.save();
    return user;
  },

  async findByGoogleId(googleId: string) {
    return await User.findOne({ googleId });
  },

  async linkGoogleAccount(userId: string, googleId: string) {
    return await User.findByIdAndUpdate(
      userId,
      { $set: { googleId, emailVerified: true } },
      { returnDocument: "after" }
    );
  },

  async findById(userId: string) {
    return await User.findById(userId);
  },

  async setEmailVerification(
    userId: string,
    tokenHash: string,
    expiresAt: Date,
    sentAt: Date
  ) {
    return await User.findByIdAndUpdate(userId, {
      $set: {
        emailVerification: { tokenHash, expiresAt, sentAt },
      },
    });
  },

  async findByVerificationHash(tokenHash: string) {
    return await User.findOne({
      "emailVerification.tokenHash": tokenHash,
      "emailVerification.expiresAt": { $gt: new Date() },
    });
  },

  async markEmailVerified(userId: string) {
    return await User.findByIdAndUpdate(
      userId,
      {
        $set: { emailVerified: true },
        $unset: { emailVerification: "" },
      },
      { returnDocument: "after" }
    );
  },

  async addRefreshSession(userId: string, session: RefreshSession) {
    await User.updateOne(
      { _id: userId },
      { $pull: { refreshSessions: { expiresAt: { $lte: new Date() } } } }
    );

    const user = await User.findById(userId).select("refreshSessions");
    if (!user) return null;

    const sessions = user.refreshSessions ?? [];
    if (sessions.length >= MAX_REFRESH_SESSIONS) {
      const oldest = [...sessions].sort(
        (a, b) =>
          new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime()
      )[0];
      await User.updateOne(
        { _id: userId },
        { $pull: { refreshSessions: { familyId: oldest.familyId } } }
      );
    }

    return await User.findByIdAndUpdate(
      userId,
      { $push: { refreshSessions: session } },
      { returnDocument: "after" }
    );
  },

  async rotateRefreshSession(
    userId: string,
    familyId: string,
    tokenHash: string
  ) {
    return await User.findOneAndUpdate(
      { _id: userId, "refreshSessions.familyId": familyId },
      { $set: { "refreshSessions.$.tokenHash": tokenHash } },
      { returnDocument: "after" }
    );
  },

  async removeRefreshSession(userId: string, familyId: string) {
    return await User.updateOne(
      { _id: userId },
      { $pull: { refreshSessions: { familyId } } }
    );
  },

  async clearRefreshSessions(userId: string) {
    return await User.updateOne(
      { _id: userId },
      { $set: { refreshSessions: [] } }
    );
  },

  async clearGoogleTokens(userId: string) {
    return await User.findByIdAndUpdate(userId, {
      $unset: { googleTokens: "" },
    });
  },

  async deleteUser(userId: string) {
    return await User.findByIdAndDelete(userId);
  },
};
