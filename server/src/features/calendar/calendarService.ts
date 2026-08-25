import { google } from "googleapis";
import {
  getAuthClient,
  getAuthUrl,
  exchangeCodeForToken,
} from "../../middleware/googleAuth";
import { userRepository } from "../users/userRepository";
import { getContrastText } from "../../helpers/colorContrast";
import type { CalendarWithLabels, EventWithLabel, EventLabel } from "../../types/googleCalendarExtensions";

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

  // async getEvents(userId: string) {
  //   const auth = await getAuthClient(userId);
  //   if (!auth) return { events: [], connected: false };

  //   const calendar = google.calendar({ version: "v3", auth });
  //   const result = await calendar.events.list({
  //     calendarId: "primary",
  //     timeMin: new Date().toISOString(),
  //     maxResults: 50,
  //     singleEvents: true,
  //     orderBy: "startTime",
  //   });

  //   return { events: result.data.items, connected: true };
  // },

  async disconnect(userId: string) {
    await userRepository.clearGoogleTokens(userId);
  },

  async getEvents(userId: string) {
    const auth = await getAuthClient(userId);
    if (!auth) return { events: [], connected: false };

    const calendar = google.calendar({ version: "v3", auth });

    const [eventsRes, colorsRes, calendarRes] = await Promise.all([
      calendar.events.list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        maxResults: 50,
        singleEvents: true,
        orderBy: "startTime",
      }),
      calendar.colors.get(),
      calendar.calendars.get({ calendarId: "primary" }),
    ]);

    const colorIdMap = colorsRes.data.event ?? {};

    const calendarData = calendarRes.data as CalendarWithLabels;
    const labelMap = new Map(
      (calendarData.labelProperties?.eventLabels ?? [])
        .filter((l): l is EventLabel & { id: string } => !!l.id)
        .map((l) => [l.id, l])
    );

    const rawEvents = (eventsRes.data.items ?? []) as EventWithLabel[];
    const events = rawEvents.map((event) => {
  let colorHex: string | undefined;

  if (event.eventLabelId && labelMap.has(event.eventLabelId)) {
    colorHex = labelMap.get(event.eventLabelId)!.backgroundColor ?? undefined;
  } else if (event.colorId && colorIdMap[event.colorId]) {
    colorHex = colorIdMap[event.colorId].background ?? undefined;
  }

  return { ...event, colorHex };
});

return { events, connected: true };
  }
};