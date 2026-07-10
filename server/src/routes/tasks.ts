import express from "express";
import Task from "../models/Task";
import type TaskType from "../types/task";
import Day from "../models/Day";
import { authMiddleware } from "../middleware/auth";
import type { Repetition } from "../types/task";
import occursOn from "../utils/occursOn";
import toDateString from "../utils/toDateString";

const router = express.Router();
router.use(authMiddleware);

router.get("/dayTasks/:dayId", async (req, res) => {
  try {
    const dayId = req.params.dayId;
    if (!dayId) {
      return res.status(400).json({ message: "Day id not shipped to server" });
    }
    const day = await Day.findById(dayId).populate('tasks');
    if (!day) {
      return res.status(404).json({ message: "Day not found" });
    }
    const daysTasks = day.tasks;
    const allRegularTasks = await Task.find({ repetition: { $ne: null } });
    const occurringTasks = allRegularTasks.filter((task) =>
      occursOn(task, day.date)
    );
    res.status(200).json([...daysTasks, ...occurringTasks]);
  } catch (err) {
    res.status(500).json({
      message: `Error getting the day's tasks: ${(err as Error).message}`,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      text,
      priority,
      regular,
      frequency,
      interval,
      daysOfWeek,
      startDate,
      endDate,
      dayId,
    } = req.body;

    const repetition: Repetition | null = regular
      ? { frequency, interval, daysOfWeek, startDate, endDate }
      : null;

    const task = new Task({ text, priority, repetition });
    await task.save();
    if (!regular) {
      const day = await Day.findByIdAndUpdate(
        dayId,
        { $push: { tasks: task._id } },
        { returnDocument: "after" }
      );
      if (!day) return res.status(404).json({ message: "Day not found" });
    }

    res.status(201).json(task);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to create task",
      error: (err as Error).message,
    });
  }
});

router.put("/complete", async (req, res) => {
  try {
    const { id, dayId } = req.body;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    let updated: TaskType;

    if(task.repetition === null){
    const newCompleted = !task.completed;
    updated = await Task.findByIdAndUpdate(
      id,
      {
        $set: {
          completed: newCompleted,
          "subtasks.$[].completed": newCompleted,
        },
      },
      { returnDocument: "after" }
    );
    }else{
      const day = await Day.findById(dayId);
      if(!day) return res.status(404).json({message: 'Day not found'});
      const dayDate = toDateString(day.date);

      updated = await Task.findByIdAndUpdate(
        id,
        {
          $set: {
            completedDates: task.completedDates.includes(dayDate)?
            task.completedDates.filter(date => date !== dayDate) : 
            [...task.completedDates, dayDate]
          },
        },
        {returnDocument: 'after'}
      )
    }
    return res.status(200).json({ task: updated });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error marking task:", error: (err as Error).message });
  }
});

router.patch("/edit", async (req, res) => {
  try {
    const { id, text, priority, repetition } = req.body;
    if (!text && !priority && !repetition) {
      return res.status(400).json({ message: "Nothing to update" });
    }
    const updated = await Task.findByIdAndUpdate(
      id,
      { $set: { text, priority, repetition } },
      { returnDocument: "after" }
    );
    if (!updated) return res.status(404).json({ message: "Task not found" });
    return res.status(200).json({ task: updated });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error editing task:", error: (err as Error).message });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const { id } = req.body;
    const task = await Task.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    return res.status(500).json({
      message: "Error deleting the task:",
      error: (err as Error).message,
    });
  }
});

router.patch("/add-subtask", async (req, res) => {
  try {
    const { id, text } = req.body;
    const parentalTask = await Task.findById(id);
    if (!parentalTask)
      return res.status(404).json({ message: "Task not found" });
    parentalTask.subtasks.push({ text });
    await parentalTask.save();
    return res.status(200).json({ task: parentalTask });
  } catch (err) {
    return res.status(500).json({
      message: "Error creating subtask:",
      error: (err as Error).message,
    });
  }
});

router.patch("/complete-subtask", async (req, res) => {
  try {
    const { taskId, subtaskId } = req.body;
    const parentalTask = await Task.findById(taskId);
    if (!parentalTask)
      return res.status(404).json({ message: "Task not found" });
    const subtask = parentalTask.subtasks.id(subtaskId);
    if (!subtask) return res.status(404).json({ message: "Subtask not found" });
    subtask.completed = !subtask.completed;
    parentalTask.completed = parentalTask.subtasks.every((s) => s.completed);
    await parentalTask.save();
    return res.status(200).json({ task: parentalTask });
  } catch (err) {
    return res.status(500).json({
      message: "Error marking subtask as completed:",
      error: (err as Error).message,
    });
  }
});

router.patch("/edit-subtask", async (req, res) => {
  try {
    const { taskId, subtaskId, newText } = req.body;
    const parentalTask = await Task.findById(taskId);
    if (!parentalTask)
      return res.status(404).json({ message: "Task not found" });
    const subtask = parentalTask.subtasks.id(subtaskId);
    if (!subtask) return res.status(404).json({ message: "Subtask not found" });
    subtask.text = newText;
    await parentalTask.save();
    return res.status(200).json({ task: parentalTask });
  } catch (err) {
    return res.status(500).json({
      message: "Error editing subtask:",
      error: (err as Error).message,
    });
  }
});

router.delete("/delete-subtask", async (req, res) => {
  try {
    const { taskId, subtaskId } = req.body;
    const parentalTask = await Task.findById(taskId);
    if (!parentalTask)
      return res.status(404).json({ message: "Task not found" });
    parentalTask.subtasks.pull({ _id: subtaskId });
    await parentalTask.save();
    return res.status(200).json({ message: "Subtask deleted successfully" });
  } catch (err) {
    return res.status(500).json({
      message: "Error deleting subtask:",
      error: (err as Error).message,
    });
  }
});

export default router;
