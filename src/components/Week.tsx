import type Week from "../interfaces/Week";
import WeekDay from "./WeekDay";

interface WeekProps {
  week: Week | null;
}
export default function Week({ week }: WeekProps) {
  if (!week) {
    return <div>Loading your week...</div>;
  }

  return (
    <div className="w-full flex justify-between items-center">
      {week.days.map((day) => (
        <WeekDay
          day={day.dayOfWeek}
          date={day.date}
          percentage={0}
          key={day._id}
        />
      ))}
    </div>
  );
}
