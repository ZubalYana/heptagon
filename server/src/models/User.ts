import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  googleTokens: {
    access_token: String,
    refresh_token: String,
    expiry_date: Number,
  },
});

const User = mongoose.model("User", userSchema);
export default User;
