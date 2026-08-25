import { useState, useEffect } from "react";
import EventBlock from "./EventBlock";
import type { CalendarEvent } from "../../../interfaces/CalendarEvent";
import apiClient from "../../../helpers/apiClient";
import { toCalendarDate } from "../../../helpers/calendarDate";
interface EventsViewWindowProps {
  day: Date | string;
}

export default function EventsViewWindow({ day }: EventsViewWindowProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const dayStr = toCalendarDate(day);
  useEffect(() => {
    apiClient.get("/calendar/events").then(({ data }) => {
      console.log("Fetched events:", data.events); // Debugging line
      const dayEvents = data.events?.filter((event: CalendarEvent) => {
        const eventDate = event.start.dateTime
          ? event.start.dateTime.slice(0, 10)
          : event.start.date;
        return eventDate === dayStr;
      });

      setEvents(dayEvents);
    });
  }, [day]);

  if (events.length == 0) return <></>;

  return (
    <div className="w-full mt-8 md:mt-0 md:w-[25%] flex-shrink-0">
      <h2 className="text-[18px] lg:h-[38px]">Your events:</h2>
      <div className="w-full min-h-[20%] flex flex-col gap-2 bg-[#121212] mt-2 p-4 rounded-lg">
        {events.length === 0 ? (
          <p className="text-[#ccc] text-[14px]">No events for this day.</p>
        ) : (
          events.map((event: CalendarEvent) => (
            <EventBlock
  key={event.id}
  summary={event.summary}
  resolvedColor={event.resolvedColor}
  startTime={event.start}
  endTime={event.end}
/>
          ))
        )}
      </div>
    </div>
  );
}
