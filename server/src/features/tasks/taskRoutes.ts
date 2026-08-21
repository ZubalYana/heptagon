import Router from "express";
import type { Request, Response } from "express";
import { taskService } from "./taskService";
import { formErrorMessage } from "../../helpers/formErrorMessage";
import { authMiddleware } from "../../middleware/auth";

const router = Router();
router.use(authMiddleware);  

router.post("/create", async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const { text, priority, regular, dayId, frequency, interval, daysOfWeek, startDate, endDate } = req.body;
    const data = { userId, text, priority, regular, dayId, frequency, interval, daysOfWeek, startDate, endDate };
    const task = await taskService.create(data);
    res.status(201).json(task);
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

router.get("/:dayId", async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const dayId = req.params.dayId as string;
    const task = await taskService.getByDay(userId, dayId);
    res.status(200).json(task);
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

router.patch("/toggle/:dayId/:taskId", async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const dayId = req.params.dayId as string;
    const taskId = req.params.taskId as string;
    const task = await taskService.toggle(userId, taskId, dayId);
    res.status(200).json(task);
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

router.patch("/edit/:taskId", async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const taskId = req.params.taskId as string;
    const { text, priority, repetition } = req.body;
    const data = { userId, taskId, text, priority, repetition };
    const task = await taskService.edit(data);
    res.status(200).json(task);
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

router.delete("/:taskId", async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const taskId = req.params.taskId as string;
    const result = await taskService.delete(userId, taskId);
    res.status(200).json({ message: result });
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

router.patch("/add-subtask/:taskId", async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const taskId = req.params.taskId as string;
    const { subtaskText, taskDate } = req.body;
    const task = await taskService.addSubtask(
      userId,
      taskId,
      taskDate,
      subtaskText
    );
    res.status(200).json(task);
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

router.patch(
  "/edit-subtask/:taskId/:subtaskId",
  async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id as string;
      const taskId = req.params.taskId as string;
      const subtaskId = req.params.subtaskId as string;
      const { text } = req.body;
      const task = await taskService.editSubtask(
        userId,
        taskId,
        subtaskId,
        text
      );
      return res.status(200).json(task);
    } catch (err) {
      const errorResult = formErrorMessage(err);
      res.status(errorResult.status).json({ error: errorResult.message });
    }
  }
);

router.patch(
  "/toggle-subtask/:taskId/:subtaskId",
  async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id as string;
      const taskId = req.params.taskId as string;
      const subtaskId = req.params.subtaskId as string;
      const {date} = req.body;
      const task = await taskService.toggleSubtask(
        userId,
        taskId,
        subtaskId,
        date
      );
      return res.status(200).json(task);
    } catch (err) {
      const errorResult = formErrorMessage(err);
      res.status(errorResult.status).json({ error: errorResult.message });
    }
  }
);

router.delete("/subtask/:taskId/:subtaskId", async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const taskId = req.params.taskId as string;
    const subtaskId = req.params.subtaskId as string;
    const result = await taskService.deleteSubtask(userId, taskId, subtaskId);
    res.status(200).json(result);
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

export default router;