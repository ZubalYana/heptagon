import Router from "express";
import type { Request, Response } from "express";
import { calendarService } from "./calendarService";
import { authMiddleware } from "../../middleware/auth";
import { formErrorMessage } from "../../helpers/formErrorMessage";
import { verifyCalendarOAuthState } from "../../middleware/googleAuth";

const router = Router();

router.get("/auth-url", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const url = await calendarService.getAuthUrl(userId);
    res.json({ url });
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

router.get("/auth/callback", async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;
    const userId = verifyCalendarOAuthState(String(req.query.state || ""));
    await calendarService.handleCallback(code, userId);
    res.redirect(`${process.env.FRONTEND_URL}/settings?calendar=connected`);
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

router.get("/status", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const connected = await calendarService.getStatus(userId);
    res.json({ connected });
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

router.get("/events", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const result = await calendarService.getEvents(userId);
    console.log("Events fetched successfully:", result); // Debugging line
    res.status(200).json(result);
  } catch (err) {
    console.error("Calendar error:", err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

router.delete("/disconnect", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    await calendarService.disconnect(userId);
    res.json({ success: true });
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

export default router;