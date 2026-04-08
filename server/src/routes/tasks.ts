import express from 'express';
import Task from '../models/Task';
import Day from '../models/Day';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();
router.use(authMiddleware);

router.post('/', async (req, res) => {
  try {
    const { text, priority, dayId } = req.body;
    const task = await Task.create({ text, priority });

    const day = await Day.findByIdAndUpdate(
      dayId,
      { $push: { tasks: task._id } }, 
      { new: true }
    );

    if (!day) return res.status(404).json({ message: 'Day not found' });

    res.status(201).json(task);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create task', err });
  }
});


export default router;