import CircularProgressbar from "./CircularProgressbar";
import { Link } from "react-router-dom";
import type Day from "../interfaces/Day";
import formatDate from "../helpers/fotmatDate";

interface WeekDayProps {
  day: Day;
  percentage: number;
}

export default function WeekDay({ day, percentage }: WeekDayProps) {
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
          className="
                lg:h-[120px] mt-4
                w-full h-auto
                bg-[#1B1B1B] rounded-md"
        ></div>
        <h4 className="first-letter:uppercase mt-2">{day.dayOfWeek}</h4>
        <p className="text-[12px] font-light text-[#ccc] -mt-[4px]">
          {formatDate(day.date)}
        </p>
      </div>
    </Link>
  );
}
