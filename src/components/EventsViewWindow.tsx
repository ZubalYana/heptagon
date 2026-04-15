import { useState, useEffect } from "react";
import EventBlock from "./customElements/EventBlock";
import type { CalendarEvent } from "../interfaces/CalendarEvent";

interface EventsViewWindowProps {
  day: Date | string; 
}

export default function EventsViewWindow({ day }: EventsViewWindowProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const dayStr = new Date(day).toLocaleDateString("en-CA");
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/calendar/events", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const dayEvents = data.events.filter((event: CalendarEvent) => {
          const eventDate = event.start.dateTime
            ? event.start.dateTime.slice(0, 10)
            : event.start.date;
          return eventDate === dayStr;
        });
        
        setEvents(dayEvents);
      });
  }, [day]);

  if(events.length == 0) return <></>

  return (
    <div className="w-[25%] flex-shrink-0">
      <h2 className="text-[18px] lg:h-[38px]">Your events:</h2>
      <div className="w-full min-h-[20%] flex flex-col gap-2 bg-[#121212] mt-2 p-4 rounded-lg">
        {events.length === 0 ? (
          <p className="text-[#ccc] text-[14px]">No events for this day.</p>
        ) : (
          events.map((event: CalendarEvent) => (
            <EventBlock
              key={event.id}
              summary={event.summary}
              colorId={event.colorId}
              startTime={event.start}
              endTime={event.end}
            />
          ))
        )}
      </div>
    </div>
  );
}