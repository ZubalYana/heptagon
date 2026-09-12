import Router from "express";
import type { Request, Response } from "express";
import { authMiddleware } from "../../middleware/auth";
import { goalService } from "./goalService";
import { formErrorMessage } from "../../helpers/formErrorMessage";

const router = Router();
router.use(authMiddleware);

router.get("/", async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const goals = await goalService.list(userId);
    res.status(200).json(goals);
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const goal = await goalService.create(userId, req.body);
    res.status(201).json(goal);
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

router.patch("/:id/value", async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const id = req.params.id as string;
    const goal = await goalService.adjustValue(userId, id, req.body.delta);
    res.status(200).json(goal);
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const id = req.params.id as string;
    const goal = await goalService.update(userId, id, req.body);
    res.status(200).json(goal);
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const id = req.params.id as string;
    const result = await goalService.delete(userId, id);
    res.status(200).json({ message: result });
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

export default router;
