import CircularProgressbar from "./CircularProgressbar";
import { Link } from "react-router-dom";
import type Day from "../interfaces/Day";
import formatDate from "../helpers/fotmatDate";

interface WeekDayProps {
  day: Day;
  percentage: number;
  allTasks: number;
  completedTasks: number;
}

export default function WeekDay({ day, percentage, allTasks, completedTasks }: WeekDayProps) {
  const isToday = formatDate(day.date, "short", "includingYear") === formatDate(new Date(), "short", "includingYear");
  return (
    <Link to={`/day/${day._id}`}>
      <div
        className="
          lg:w-[140px] 
          w-full cursor-pointer
          flex flex-col items-center
          "
      >
        <CircularProgressbar percentage={percentage} />
        <div
          className={`
                lg:h-[100px] mt-4
                w-full h-auto
                bg-[#1B1B1B] rounded-md
                p-4 flex flex-col items-center justify-center
                ${isToday? 'shadow-[0_0_16px_8px_rgba(0,255,38,0.3)]': ''}
                `}
        >
          <p className="text-[12px]">Completed: {completedTasks}/{allTasks}</p>
          <p className="text-[12px] mt-1">Still to do: {allTasks - completedTasks}</p>
        </div>
        <h4 className="first-letter:uppercase mt-3">{day.dayOfWeek}</h4>
        <p className="text-[12px] font-light text-[#ccc] -mt-[4px]">
          {formatDate(day.date)}
        </p>
      </div>
    </Link>
  );
}
