import express from "express";
import Task from "../models/Task";
import Day from "../models/Day";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();
router.use(authMiddleware);

router.post("/", async (req, res) => {
  try {
    const { text, priority, dayId } = req.body;
    const task = await Task.create({ text, priority });

    const day = await Day.findByIdAndUpdate(
      dayId,
      { $push: { tasks: task._id } },
      { returnDocument: 'after' }
    );

    if (!day) return res.status(404).json({ message: "Day not found" });

    res.status(201).json(task);
  } catch (err) {
    return res.status(500).json({ message: "Failed to create task", err });
  }
});

router.put("/complete", async (req, res) => {
  try {
    const { id } = req.body;
    const task = await Task.findById(id);
    const updated = await Task.findByIdAndUpdate(
      id,
      { completed: !task.completed },
      { returnDocument: 'after' }
    );
    return res.status(200).json({ task: updated });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error marking task:", error: err.message });
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
      { returnDocument: 'after' }
    );

    if (!updated) return res.status(404).json({ message: "Task not found" });
    return res.status(200).json({ task: updated });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error editing task:", error: err.message });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const { id } = req.body;
    const task = await Task.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error deleting the task:", error: err.message });
  }
});

router.patch('/add-subtask', async (req, res) =>{
  try{
    const { id, text } = req.body;
    const parentalTask = await Task.findById(id);
    if(!parentalTask) return res.status(404).json({message: 'Task not found'});
    parentalTask.subtasks.push({text});
    await parentalTask.save();

    return res.status(200).json({task: parentalTask});
  }catch(err){
    return res.status(500).json({message: 'Error creting subtask:', error: err.message})
  }
})

export default router;
