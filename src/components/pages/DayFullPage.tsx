import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import type Day from "../../interfaces/Day";
import formatDate from "../../helpers/fotmatDate";
import DayTasksController from "../features/tasks/DayTasksController";
import EventsViewWindow from "../features/events/EventsViewWindow";
import apiClient from "../../helpers/apiClient";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loader from "../ui/Loader";

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


  if (!day) return <div className="w-full h-full flex items-center justify-center absolute top-0 left-0"><Loader size="lg" label="Loading day..."/></div>;

  return (
    <div className="w-full min-h-dvh flex flex-col p-5 lg:p-10 2xl:px-14 2xl:py-12">
      <p
        className="flex items-center gap-x-1 text-[12px] text-[#888] cursor-pointer"
        onClick={() => navigate(`/app${location.search}`)}
      >
        <ArrowLeft className="w-3.75 h-3.75" />
        Back
      </p>
      <p className="lg:text-[32px] 2xl:text-[36px] text-[24px] font-bold">{day.dayOfWeek}</p>
      <p className="lg:text-[16px] text-[14px] text-[#ccc] font-light lg:-mt-0.75">
        {formatDate(day.date, "long", "includingYear")}
      </p>
     <div className="w-full flex-1 flex flex-col md:flex-row gap-x-6 2xl:gap-x-10 mt-4 2xl:mt-6">
        <div className="flex-1 flex flex-col">
          <DayTasksController
            day={day}
            dayId={day._id}
          />
        </div>
        <EventsViewWindow day={day.date} />
      </div>
    </div>
  );
}
