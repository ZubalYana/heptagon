import Router from "express";
import type { Request, Response } from "express";
import { authMiddleware } from "../../middleware/auth";
import { weeksService } from "./weeksService";
import { weekTaskService } from "../weekTask/weekTaskService";
import { formErrorMessage } from "../../helpers/formErrorMessage";
import { getWeekNumber } from "../../helpers/weekHelpers";

const router = Router();
router.use(authMiddleware);

router.get("/current", async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const { year, weekNumber } = getWeekNumber(new Date());
    const week = await weeksService.getOrCreate(userId, year, weekNumber);
    res.status(200).json(week);
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

function parseYearWeek(req: Request) {
  const year = Number(req.params.year);
  const week = Number(req.params.week ?? req.params.weekNumber);
  return { year, week };
}

router.get("/:year/:week/progress", async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const { year, week } = parseYearWeek(req);
    if (isNaN(year) || isNaN(week)) {
      return res.status(400).json({ error: "Invalid year or week number" });
    }
    const progress = await weeksService.getWeekProgress(userId, year, week);
    res.status(200).json(progress);
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

router.get("/:year/:week/tasks", async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const { year, week } = parseYearWeek(req);
    const tasks = await weekTaskService.list(userId, year, week);
    res.status(200).json(tasks);
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

router.post("/:year/:week/tasks", async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const { year, week } = parseYearWeek(req);
    const { title, priority, targetCount } = req.body;
    const task = await weekTaskService.create(
      userId,
      year,
      week,
      title,
      priority,
      targetCount
    );
    res.status(201).json(task);
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

router.patch(
  "/:year/:week/tasks/:id/count",
  async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id as string;
      const { year, week } = parseYearWeek(req);
      const id = req.params.id as string;
      const task = await weekTaskService.adjustCount(
        userId,
        id,
        year,
        week,
        req.body.delta
      );
      res.status(200).json(task);
    } catch (err) {
      const errorResult = formErrorMessage(err);
      res.status(errorResult.status).json({ error: errorResult.message });
    }
  }
);

router.patch("/:year/:week/tasks/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const { year, week } = parseYearWeek(req);
    const id = req.params.id as string;
    const { title, priority, targetCount } = req.body;
    const task = await weekTaskService.update(userId, id, year, week, {
      title,
      priority,
      targetCount,
    });
    res.status(200).json(task);
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

router.delete("/:year/:week/tasks/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const { year, week } = parseYearWeek(req);
    const id = req.params.id as string;
    const result = await weekTaskService.delete(userId, id, year, week);
    res.status(200).json({ message: result });
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

router.get("/:year/:weekNumber", async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const year = Number(req.params.year);
    const weekNumber = Number(req.params.weekNumber);
    if (isNaN(year) || isNaN(weekNumber)) {
      return res.status(400).json({ error: "Invalid year or week number" });
    }
    const week = await weeksService.getOrCreate(userId, year, weekNumber);
    res.status(200).json(week);
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});
export default router;
