import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import type Day from "../../interfaces/Day";
import formatDate from "../../helpers/fotmatDate";
import DayTasksController from "../DayTasksController";

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
    <div className="w-full min-h-full">
      {/* w-[100%] expanded for testing though personal use. To be shortened once the layout is fixed & adapted */}
      <div className="w-[100%] h-full flex flex-col">
        <p className="lg:text-[32px] font-bold">{day.dayOfWeek}</p>
        <p className="lg:text-[16px] text-[#ccc] font-light lg:-mt-[3px]">
          {formatDate(day.date, "long", "includingYear")}
        </p>
        <DayTasksController
          tasks={day.tasks}
          day={day.dayOfWeek}
          dayId={day._id}
        />
      </div>
    </div>
  );
}
