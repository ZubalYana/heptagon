import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import type Day from "../../interfaces/Day";
import formatDate from "../../helpers/fotmatDate";
import DayTasksController from "../DayTasksController";
import EventsViewWindow from "../EventsViewWindow";
import apiClient from "../../helpers/apiClient";
export default function DayFullPage() {
  const { dayId } = useParams();
  const [day, setDay] = useState<Day | null>(null);

  useEffect(() => {
    apiClient.get(`/days/${dayId}`).then(({ data }) => {
      setDay(data);
    });
  }, [dayId]);

  if (!day) return <div>Loading your day...</div>;

  return (
    <div className="w-full h-full">
      <p className="lg:text-[32px] font-bold">{day.dayOfWeek}</p>
      <p className="lg:text-[16px] text-[#ccc] font-light lg:-mt-[3px]">
        {formatDate(day.date, "long", "includingYear")}
      </p>
      <div className="w-full flex gap-x-6 mt-4">
        <div className="flex-1">
          <DayTasksController
            tasks={day.tasks}
            day={day.dayOfWeek}
            dayId={day._id}
          />
        </div>
        <EventsViewWindow day={day.date} />
      </div>
    </div>
  );
}
