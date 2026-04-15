import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import type Day from "../../interfaces/Day";
import formatDate from "../../helpers/fotmatDate";
import DayTasksController from "../DayTasksController";
import EventsViewWindow from "../EventsViewWindow";

export default function DayFullPage() {
  const { dayId } = useParams();
  const [day, setDay] = useState<Day | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:5000/days/${dayId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
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
        <div className="w-full lg:w-[75%]">
          <DayTasksController
            tasks={day.tasks}
            day={day.dayOfWeek}
            dayId={day._id}
          />
        </div>
        <div className="w-full lg:w-[25%]">
          <EventsViewWindow day={day.date}/>
        </div>
      </div>
    </div>
  );
}
