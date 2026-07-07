import express from "express";
import Task from "../models/Task";
import Day from "../models/Day";
import { authMiddleware } from "../middleware/auth";
import type { Repetition } from "../types/task";

const router = express.Router();
router.use(authMiddleware);

router.post("/", async (req, res) => {
  try {
    const { text, priority, regular, frequency, interval, daysOfWeek, startDate, endDate, dayId } = req.body;

    let repetition: Repetition | null = regular? {frequency, interval, daysOfWeek, startDate, endDate} : null;

    if(regular){
      repetition = {
        frequency: frequency,
        interval: interval,
        daysOfWeek: daysOfWeek,
        startDate: startDate,
        endDate: endDate
      }
    }

    const task = await Task.create({ 
      text, 
      priority,
      repetition
    });

    const day = await Day.findByIdAndUpdate(
      dayId,
      { $push: { tasks: task._id } },
      { returnDocument: "after" }
    );
    if (!day) return res.status(404).json({ message: "Day not found" });
    res.status(201).json(task);
  } catch (err) {
    return res.status(500).json({ message: "Failed to create task", error: (err as Error).message });
  }
});

router.put("/complete", async (req, res) => {
  try {
    const { id } = req.body;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    const newCompleted = !task.completed;
    const updated = await Task.findByIdAndUpdate(
      id,
      { $set: { completed: newCompleted, "subtasks.$[].completed": newCompleted } },
      { returnDocument: "after" }
    );
    return res.status(200).json({ task: updated });
  } catch (err) {
    return res.status(500).json({ message: "Error marking task:", error: (err as Error).message });
  }
});

router.patch("/edit", async (req, res) => {
  try {
    const { id, text, priority } = req.body;
    if (!text && !priority) {
      return res.status(400).json({ message: "Nothing to update" });
    }
    const updated = await Task.findByIdAndUpdate(
      id,
      { $set: { text, priority } },
      { returnDocument: "after" }
    );
    if (!updated) return res.status(404).json({ message: "Task not found" });
    return res.status(200).json({ task: updated });
  } catch (err) {
    return res.status(500).json({ message: "Error editing task:", error: (err as Error).message });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const { id } = req.body;
    const task = await Task.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Error deleting the task:", error: (err as Error).message });
  }
});

router.patch("/add-subtask", async (req, res) => {
  try {
    const { id, text } = req.body;
    const parentalTask = await Task.findById(id);
    if (!parentalTask) return res.status(404).json({ message: "Task not found" });
    parentalTask.subtasks.push({ text });
    await parentalTask.save();
    return res.status(200).json({ task: parentalTask });
  } catch (err) {
    return res.status(500).json({ message: "Error creating subtask:", error: (err as Error).message });
  }
});

router.patch("/complete-subtask", async (req, res) => {
  try {
    const { taskId, subtaskId } = req.body;
    const parentalTask = await Task.findById(taskId);
    if (!parentalTask) return res.status(404).json({ message: "Task not found" });
    const subtask = parentalTask.subtasks.id(subtaskId);
    if (!subtask) return res.status(404).json({ message: "Subtask not found" });
    subtask.completed = !subtask.completed;
    parentalTask.completed = parentalTask.subtasks.every((s) => s.completed);
    await parentalTask.save();
    return res.status(200).json({ task: parentalTask });
  } catch (err) {
    return res.status(500).json({ message: "Error marking subtask as completed:", error: (err as Error).message });
  }
});

router.patch("/edit-subtask", async (req, res) => {
  try {
    const { taskId, subtaskId, newText } = req.body;
    const parentalTask = await Task.findById(taskId);
    if (!parentalTask) return res.status(404).json({ message: "Task not found" });
    const subtask = parentalTask.subtasks.id(subtaskId);
    if (!subtask) return res.status(404).json({ message: "Subtask not found" });
    subtask.text = newText;
    await parentalTask.save();
    return res.status(200).json({ task: parentalTask });
  } catch (err) {
    return res.status(500).json({ message: "Error editing subtask:", error: (err as Error).message });
  }
});

router.delete('/delete-subtask', async (req, res) => {
  try {
    const { taskId, subtaskId } = req.body;
    const parentalTask = await Task.findById(taskId);
    if (!parentalTask) return res.status(404).json({ message: "Task not found" });
    parentalTask.subtasks.pull({ _id: subtaskId });
    await parentalTask.save();
    return res.status(200).json({ message: "Subtask deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Error deleting subtask:", error: (err as Error).message });
  }
});

export default router;