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

  async createGoogleUser(
    name: string,
    email: string,
    googleId: string,
    picture?: string
  ) {
    const user = new User({
      name,
      email,
      googleId,
      emailVerified: true,
      refreshSessions: [],
      googlePictureUrl: picture,
      avatarUrl: picture,
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

  async setPendingPasswordChange(
    userId: string,
    tokenHash: string,
    passwordHash: string,
    expiresAt: Date,
    sentAt: Date
  ) {
    return await User.findByIdAndUpdate(userId, {
      $set: {
        pendingPasswordChange: { tokenHash, passwordHash, expiresAt, sentAt },
      },
    });
  },

  async findByPasswordChangeHash(tokenHash: string) {
    return await User.findOne({
      "pendingPasswordChange.tokenHash": tokenHash,
      "pendingPasswordChange.expiresAt": { $gt: new Date() },
    });
  },

  async applyPasswordChange(userId: string, passwordHash: string) {
    return await User.findByIdAndUpdate(
      userId,
      {
        $set: { password: passwordHash, refreshSessions: [] },
        $unset: { pendingPasswordChange: "" },
      },
      { returnDocument: "after" }
    );
  },

  async updateName(userId: string, name: string) {
    return await User.findByIdAndUpdate(
      userId,
      { $set: { name } },
      { returnDocument: "after" }
    );
  },

  async syncGooglePicture(userId: string, picture: string) {
    const user = await User.findById(userId).select("avatarPublicId");
    const update: Record<string, string> = { googlePictureUrl: picture };
    if (!user?.avatarPublicId) {
      update.avatarUrl = picture;
    }
    return await User.findByIdAndUpdate(
      userId,
      { $set: update },
      { returnDocument: "after" }
    );
  },

  async setUploadedAvatar(userId: string, avatarUrl: string, avatarPublicId: string) {
    return await User.findByIdAndUpdate(
      userId,
      { $set: { avatarUrl, avatarPublicId } },
      { returnDocument: "after" }
    );
  },

  async clearUploadedAvatar(userId: string) {
    const user = await User.findById(userId).select("googlePictureUrl");
    const avatarUrl = user?.googlePictureUrl || "";
    return await User.findByIdAndUpdate(
      userId,
      avatarUrl
        ? { $set: { avatarUrl }, $unset: { avatarPublicId: "" } }
        : { $unset: { avatarUrl: "", avatarPublicId: "" } },
      { returnDocument: "after" }
    );
  },

  async deleteUser(userId: string) {
    return await User.findByIdAndDelete(userId);
  },
};
