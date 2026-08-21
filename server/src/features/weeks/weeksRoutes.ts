import Router from "express";
import type { Request, Response } from "express";
import { authMiddleware } from "../../middleware/auth";
import { weeksService } from "./weeksService";
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
