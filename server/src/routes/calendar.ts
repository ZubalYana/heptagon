import express from "express";
import { google } from "googleapis";
import { getAuthClient, getAuthUrl, exchangeCodeForToken } from '../middleware/googleAuth'
import { authMiddleware } from "../middleware/auth";
const router = express.Router();

router.get("/auth-url", authMiddleware, async (req, res) => {
  const url = await getAuthUrl(req.user.id); 
  res.json({url});
});

router.get("/auth/callback", async (req, res) => {
  const code = req.query.code as string;
  const userId = req.query.state as string; 
  
  if (!code || !userId) return res.status(400).json({ message: "Missing params" });
  
  await exchangeCodeForToken(code, userId);
  res.redirect('https://yourdomain.com/settings?calendar=connected');
});

router.get("/events", authMiddleware, async (req, res) => {
  try {
    const auth = await getAuthClient(req.user.id);
    if (!auth) return res.status(403).json({ message: "Calendar not connected" });

    if (!auth) {
      return res.status(401).json({
        message: "Not authorised. Visit /api/calendar/auth first.",
      });
    }

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