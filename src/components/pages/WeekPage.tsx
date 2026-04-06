import { useState, useEffect } from "react";
import type InterfaceWeek from "../../interfaces/Week";
import Week from "../Week";
import WeeksSwitch from "../WeeksSwitch";

export default function WeekPage() {
  const [week, setWeek] = useState<InterfaceWeek | null>(null);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [currentWeekNumber, setCurrentWeekNumber] = useState<number | null>(
    null
  );

  useEffect(() => {
    fetchWeek("current");
  }, []);

  function fetchWeek(path: string) {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:5000/weeks/${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setWeek(data);
        setCurrentYear(data.year);
        setCurrentWeekNumber(data.weekNumber);
      });
  }

  function handlePrev() {
    let y = currentYear!;
    let w = currentWeekNumber! - 1;
    if (w < 1) {
      w = 52;
      y--;
    }
    fetchWeek(`${y}/${w}`);
  }

  function handleNext() {
    let y = currentYear!;
    let w = currentWeekNumber! + 1;
    if (w > 52) {
      w = 1;
      y++;
    }
    fetchWeek(`${y}/${w}`);
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <Week week={week} />
      {week && (
        <WeeksSwitch
          weekNumber={week.weekNumber}
          year={week.year}
          startDate={week.startDate}
          endDate={week.endDate}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </div>
  );
}
