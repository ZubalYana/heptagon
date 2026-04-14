import express from "express";
import { google } from "googleapis";
import { getAuthClient, getAuthUrl, exchangeCodeForToken } from '../middleware/googleAuth'

const router = express.Router();

router.get("/auth", async (req, res) => {
  const url = await getAuthUrl();
  res.redirect(url);
});

router.get("/auth/callback", async (req, res) => {
  const code = req.query.code as string;
  if (!code) return res.status(400).json({ message: "No code provided" });

  await exchangeCodeForToken(code);
  res.json({ message: "Authorised — you can now call /events" });
});

router.get("/events", async (req, res) => {
  try {
    const auth = await getAuthClient();

    if (!auth) {
      return res.status(401).json({
        message: "Not authorised. Visit /api/calendar/auth first.",
      });
    }

    const calendar = google.calendar({ version: "v3", auth });
    const result = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
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