import express from "express"
import path from 'node:path';
import process from 'node:process';
import {authenticate} from '@google-cloud/local-auth';
import {google} from 'googleapis';
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
const router = express.Router()

router.get('/events', async (req, res) => {
  try {
    const auth = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });
    const calendar = google.calendar({ version: 'v3', auth });
    const result = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });
    return res.status(200).json({ events: result.data.items });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch events', err });
  }
});

export default router;