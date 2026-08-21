import { google } from "googleapis";
import {
  getAuthClient,
  getAuthUrl,
  exchangeCodeForToken,
} from "../../middleware/googleAuth";
import { userRepository } from "../users/userRepository";

export const calendarService = {
  async getAuthUrl(userId: string) {
    return await getAuthUrl(userId);
  },

  async handleCallback(code: string, userId: string) {
    if (!code || !userId) throw new Error("Missing params");
    await exchangeCodeForToken(code, userId);
  },

  async getStatus(userId: string) {
    const user = await userRepository.findById(userId);
    return !!user?.googleTokens?.access_token;
  },

  async getEvents(userId: string) {
    const auth = await getAuthClient(userId);
    if (!auth) return { events: [], connected: false };

    const calendar = google.calendar({ version: "v3", auth });
    const result = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 50,
      singleEvents: true,
      orderBy: "startTime",
    });

    return { events: result.data.items, connected: true };
  },

  async disconnect(userId: string) {
    await userRepository.clearGoogleTokens(userId);
  },
};