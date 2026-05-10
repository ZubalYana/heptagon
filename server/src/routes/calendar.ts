import express from "express";
import { google } from "googleapis";
import {
  getAuthClient,
  getAuthUrl,
  exchangeCodeForToken,
} from "../middleware/googleAuth";
import { authMiddleware } from "../middleware/auth";
import User from "../models/User";
const router = express.Router();

router.get("/auth-url", authMiddleware, async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const url = await getAuthUrl(req.user.id);
  res.json({ url });
});

router.get("/auth/callback", async (req, res) => {
  const code = req.query.code as string;
  const userId = req.query.state as string;
  if (!code || !userId)
    return res.status(400).json({ message: "Missing params" });
  await exchangeCodeForToken(code, userId);
  res.redirect(`${process.env.FRONTEND_URL}/settings?calendar=connected`);
});

router.get("/status", authMiddleware, async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const user = await User.findById(req.user.id);
  res.json({ connected: !!user?.googleTokens?.access_token });
});

router.get("/events", authMiddleware, async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  try {
    const auth = await getAuthClient(req.user.id);
    if (!auth)
      return res.status(200).json({ events: [], connected: false });

    const calendar = google.calendar({ version: "v3", auth });
    const result = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 50,
      singleEvents: true,
      orderBy: "startTime",
    });

    return res.status(200).json({ events: result.data.items });
  } catch (err) {
    console.error("Calendar error:", err);
    return res.status(500).json({ message: "Failed to fetch events" });
  }
});

export default router;
