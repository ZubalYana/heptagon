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
    const user = new User({ name, email, password: hashedPassword, refreshSessions: [] });
    await user.save();
    return user;
  },

  async findById(userId: string) {
    return await User.findById(userId);
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
};
