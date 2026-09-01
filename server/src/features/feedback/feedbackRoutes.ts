import Router from "express";
import type { Request, Response } from "express";
import { feedbackService } from "./feedbackService";
import { authMiddleware } from "../../middleware/auth";
import { verifyAdmin } from "../../middleware/verifyAdmin";
import { rateLimitFeedbackCreate } from "../../middleware/rateLimitFeedbackCreate";
import { formErrorMessage } from "../../helpers/formErrorMessage";

const router = Router();

router.post(
  "/create",
  authMiddleware,
  rateLimitFeedbackCreate,
  async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const { feedbackText } = req.body;
    const feedback = await feedbackService.create(userId, feedbackText);
    res.status(201).json({ feedback });
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

router.get("/all", verifyAdmin, async (req: Request, res: Response) => {
  try {
    const feedback = await feedbackService.getAll();
    res.status(200).json(feedback);
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

router.delete("/delete/:id", verifyAdmin, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const feedback = await feedbackService.delete(id);
    res.status(200).json(feedback);
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});
export default router;