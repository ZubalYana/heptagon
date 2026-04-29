import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import type Day from "../../interfaces/Day";
import formatDate from "../../helpers/fotmatDate";
import DayTasksController from "../DayTasksController";
import EventsViewWindow from "../EventsViewWindow";
import apiClient from "../../helpers/apiClient";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DayFullPage() {
  const { dayId } = useParams();
  const [day, setDay] = useState<Day | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    apiClient.get(`/days/${dayId}`).then(({ data }) => {
      setDay(data);
    });
  }, [dayId]);

  if (!day) return <div>Loading your day...</div>;

  return (
    <div className="w-full md:h-full">
      <p
        className="flex items-center gap-x-1 text-[12px] text-[#888] cursor-pointer"
        onClick={() => navigate(`/${location.search}`)}
      >
        <ArrowLeft className="w-[15px] h-[15px]" />
        Back
      </p>
      <p className="lg:text-[32px] text-[24px] font-bold">{day.dayOfWeek}</p>
      <p className="lg:text-[16px] text-[14px] text-[#ccc] font-light lg:-mt-[3px]">
        {formatDate(day.date, "long", "includingYear")}
      </p>
      <div className="w-full flex flex-col md:flex-row gap-x-6 mt-4">
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
