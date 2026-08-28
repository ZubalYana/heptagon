import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  emailVerified: { type: Boolean, default: false },
  googleId: { type: String, unique: true, sparse: true },
  password: String,
  refreshSessions: {
    type: [
      {
        familyId: { type: String, required: true },
        tokenHash: { type: String, required: true },
        expiresAt: { type: Date, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  },
  googleTokens: {
    access_token: String,
    refresh_token: String,
    expiry_date: Number,
  },
},);

const User = mongoose.model("User", userSchema);
export default User;
