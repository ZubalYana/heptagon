import CircularProgressbar from "../../ui/CircularProgressbar";
import { Link, useLocation } from "react-router-dom";
import type Day from "../../../interfaces/Day";
import formatDate from "../../../helpers/fotmatDate";
import { Check } from "lucide-react";

interface WeekDayProps {
  day: Day;
  percentage: number;
  allTasks: number;
  completedTasks: number;
  crucial?: number;
  crucialCompleted?: number;
  important?: number;
  importantCompleted?: number;
  optional?: number;
  optionalCompleted?: number;
}

export default function WeekDay({
  day,
  percentage,
  allTasks,
  completedTasks,
  crucial,
  crucialCompleted,
  important,
  importantCompleted,
  optional,
  optionalCompleted,
}: WeekDayProps) {
  const isToday =
    formatDate(day.date, "short", "includingYear") ===
    formatDate(new Date(), "short", "includingYear");

  const cruicalDone = crucial === crucialCompleted;
  const importantDone = important === importantCompleted;
  const optionalDone = optional === optionalCompleted;

  const location = useLocation();
  return (
    <Link
      to={`/day/${day._id}${location.search}`}
      className="
        block mb-10 md:mb-0
        w-[160px]
        xs:w-[180px]
        2xs:w-[140px]
        sm:w-[170px]
        lg:w-[140px]
        xl:w-[158px]
        2xl:w-auto 2xl:flex-1 2xl:max-w-[220px]
      "
    >
      <div className="w-full cursor-pointer flex flex-col items-center">
        <CircularProgressbar percentage={percentage} />
        <div
          className={`
                mt-4 w-full h-auto lg:h-[110px]
                2xl:h-auto 2xl:min-h-[124px]
                bg-[#1B1B1B] rounded-md
                p-4 flex flex-col items-center justify-center
                gap-y-[2px]
                ${isToday ? "shadow-[0_0_12px_3px_rgba(0,255,38,0.3)]" : ""}
                `}
        >
          <p className="text-[12px] 2xl:text-[13px] flex items-center gap-x-1">
            <span
              className={`${cruicalDone ? "text-gray-500" : "text-red-400"}`}
            >
              Crucial:
            </span>
            {cruicalDone ? (
              <span>
                <Check size={16} className="text-gray-500" />
              </span>
            ) : (
              <span>
                {crucialCompleted}/{crucial}
              </span>
            )}
          </p>

          <p className="text-[12px] 2xl:text-[13px] flex items-center gap-x-1">
            <span
              className={`${
                importantDone ? "text-gray-500" : "text-orange-400"
              }`}
            >
              Important:
            </span>
            {importantDone ? (
              <span>
                <Check size={16} className="text-gray-500" />
              </span>
            ) : (
              <span>
                {importantCompleted}/{important}
              </span>
            )}
          </p>

          <p className="text-[12px] 2xl:text-[13px] flex items-center gap-x-1">
            <span
              className={`${optionalDone ? "text-gray-500" : "text-blue-400"}`}
            >
              Optional:
            </span>
            {optionalDone ? (
              <span>
                <Check size={16} className="text-gray-500" />
              </span>
            ) : (
              <span>
                {optionalCompleted}/{optional}
              </span>
            )}
          </p>

          <p
            className={`text-[12px] 2xl:text-[13px] ${
              completedTasks === allTasks ? "text-gray-500" : ""
            }`}
          >
            Overall: {completedTasks}/{allTasks}
          </p>
        </div>
        <h4 className="first-letter:uppercase mt-2 md:mt-3 2xl:text-[16px]">
          {day.dayOfWeek}
        </h4>
        <p className="text-[12px] font-light text-[#ccc] -mt-[4px]">
          {formatDate(day.date)}
        </p>
      </div>
    </Link>
  );
}
