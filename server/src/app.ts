import express from "express";
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import authRouter from "./routes/auth";
import weeksRouter from "./routes/weeks";
import daysRouter from "./routes/days";
import taskRouter from "./routes/tasks";
import calendarRouter from "./routes/calendar";
import adminRouter from './routes/admin'
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth", authRouter);
app.use("/weeks", weeksRouter);
app.use("/days", daysRouter);
app.use("/tasks", taskRouter);
app.use("/calendar", calendarRouter);
app.use("/admin", adminRouter)

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome!" });
});

mongoose.connect(process.env.MONGO_URL || "").then(() => {
  console.log("MongoDB connected.");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on PORT: ${process.env.PORT}`);
});
