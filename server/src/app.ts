import dns from "node:dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);
import express from "express";
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

import taskRouter from './features/tasks/taskRoutes';
import daysRouter from './features/days/daysRoutes';
import weeksRouter from "./features/weeks/weeksRoutes";
import feedbackRouter from './features/feedback/feedbackRoutes';
import adminRouter from './features/admin/adminRoutes';
import userRouter from './features/users/userRoutes';
import calendarRouter from "./features/calendar/calendarRoutes";

import cors from "cors";
import helmet from "helmet";
import { isAllowedOrigin } from "./helpers/corsAllowlist";
import { assertJwtSecrets } from "./helpers/authTokens";
import { enforcePublicRequest, assertPublicRequestConfig } from "./middleware/enforcePublicRequest";

assertJwtSecrets();
assertPublicRequestConfig();

const app = express();
app.set("trust proxy", 1);
app.use(
  helmet({
    hsts:
      process.env.NODE_ENV === "production"
        ? { maxAge: 15552000, includeSubDomains: true }
        : false,
  })
);
app.use(express.json({ limit: "32kb" }));
app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
  })
);
app.use(enforcePublicRequest);

app.use("/auth", userRouter);
app.use("/weeks", weeksRouter);
app.use("/days", daysRouter);
app.use("/tasks", taskRouter);
app.use("/calendar", calendarRouter);
app.use("/admin", adminRouter)
app.use("/feedback", feedbackRouter)

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome!" });
});

mongoose.connect(process.env.MONGO_URL || "").then(() => {
  console.log("MongoDB connected.");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on PORT: ${process.env.PORT}`);
});
