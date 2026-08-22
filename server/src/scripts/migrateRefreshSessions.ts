import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

async function run() {
  const mongoUrl = process.env.MONGO_URL;
  if (!mongoUrl) {
    throw new Error("MONGO_URL is required");
  }

  await mongoose.connect(mongoUrl);
  const db = mongoose.connection.db;
  if (!db) throw new Error("MongoDB connection has no database");

  const result = await db.collection("users").updateMany(
    {
      $or: [
        { refreshSessions: { $exists: false } },
        { refreshSessions: { $eq: null } },
      ],
    },
    { $set: { refreshSessions: [] } }
  );

  console.log(
    `Refresh sessions ready: ${result.modifiedCount} users updated, ${result.matchedCount} matched`
  );

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
