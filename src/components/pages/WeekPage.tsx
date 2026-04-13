import { useState, useEffect } from "react";
import type InterfaceWeek from "../../interfaces/Week";
import Week from "../Week";
import WeeksSwitch from "../WeeksSwitch";
import { Settings } from "lucide-react";

export default function WeekPage() {
  const [week, setWeek] = useState<InterfaceWeek | null>(null);
  const [animationDirection, setAnimationDirection] = useState(1);
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
    setAnimationDirection(-1);
  }

  function handleNext() {
    let y = currentYear!;
    let w = currentWeekNumber! + 1;
    if (w > 52) {
      w = 1;
      y++;
    }
    fetchWeek(`${y}/${w}`);
    setAnimationDirection(1);
  }

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-full flex items-center justify-between lg:mb-12">
        <div className="flex gap-x-2 items-center">
          <img 
          src="/heptagonLogo.svg" 
          alt="Heptagon Logo" 
          className="w-[35px] h-[35px]"
          />
          <h2 className="text-[20px] font-medium">Heptagon</h2>
        </div>
        <div className="flex gap-x-4">
          <Settings className="cursor-pointer"/>
        </div>
      </div>

      <Week week={week} animationDirection={animationDirection} />
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
