import type { calendar_v3 } from "googleapis";

export interface EventLabel {
  id?: string | null;
  backgroundColor?: string | null;
  name?: string | null;
}

export type CalendarWithLabels = calendar_v3.Schema$Calendar & {
  labelProperties?: { eventLabels?: EventLabel[] };
};

export type EventWithLabel = calendar_v3.Schema$Event & {
  eventLabelId?: string | null;
};