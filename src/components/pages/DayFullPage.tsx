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
      headers: { Authorization: `Bearer: ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setDay(data);
      });
  }, []);

  if (!day) return <div>Loading your day...</div>;

  return (
    <div className="w-full h-full">
      <div className="w-[50%] h-full flex flex-col">
      <p className="lg:text-[32px] font-bold">{day.dayOfWeek}</p>
      <p className="lg:text-[16px] text-[#ccc] font-light lg:-mt-[3px]">
        {formatDate(day.date, "long", "includingYear")}
      </p>
      <DayTasksController tasks={day.tasks} day={day.dayOfWeek} />
      </div>
    </div>
  );
}
