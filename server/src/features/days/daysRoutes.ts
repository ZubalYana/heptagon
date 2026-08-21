import Router from "express";
import type { Request, Response } from "express";
import { daysService } from "./daysService";
import { authMiddleware } from "../../middleware/auth";
import { formErrorMessage } from "../../helpers/formErrorMessage";

const router = Router();
router.use(authMiddleware);

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const dayId = req.params.id as string;
    const day = await daysService.getById(userId, dayId);
    res.status(200).json(day);
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

export default router;