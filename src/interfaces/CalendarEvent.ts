export interface EventDateTime {
  dateTime?: string; 
  date?: string;     
  timeZone?: string;
}

interface EventPerson {
  email: string;
  self?: boolean;
}

interface EventReminder {
  method: string;
  minutes: number;
}

interface EventReminders {
  useDefault: boolean;
  overrides?: EventReminder[];
}

export interface CalendarEvent {
  kind: "calendar#event";
  etag: string;
  id: string;
  status: string;
  htmlLink: string;
  created: string;
  updated: string;
  summary: string;
  colorId?: string;
  creator: EventPerson;
  organizer: EventPerson;
  start: EventDateTime;
  end: EventDateTime;
  originalStartTime?: EventDateTime;
  recurringEventId?: string;
  iCalUID: string;
  sequence: number;
  eventType: string;
  reminders: EventReminders;
}