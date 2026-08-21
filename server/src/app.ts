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

const app = express();
app.use(express.json());
app.use(cors());

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
