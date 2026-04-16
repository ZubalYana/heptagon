import { useState, useEffect, useRef } from "react";
import type InterfaceWeek from "../../interfaces/Week";
import Week from "../Week";
import WeeksSwitch from "../WeeksSwitch";
import { Settings } from "lucide-react";
import apiClient from "../../helpers/apiClient";
import { getWeekNumber } from "../../helpers/getWeekNumber";

const SWIPE_THRESHOLD = 50;

export default function WeekPage() {
  const [week, setWeek] = useState<InterfaceWeek | null>(null);
  const [animationDirection, setAnimationDirection] = useState(1);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [currentWeekNumber, setCurrentWeekNumber] = useState<number | null>(
    null
  );

  const dragStartX = useRef<number | null>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    fetchWeek("current");
  }, []);

  function fetchWeek(path: string) {
    apiClient.get(`/weeks/${path}`).then(({ data }) => {
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

  function onDragStart(x: number) {
    dragStartX.current = x;
    isDragging.current = true;
  }

  function onDragEnd(x: number) {
    if (!isDragging.current || dragStartX.current === null) return;
    const delta = x - dragStartX.current;

    if (Math.abs(delta) >= SWIPE_THRESHOLD) {
      delta < 0 ? handleNext() : handlePrev();
    }

    dragStartX.current = null;
    isDragging.current = false;
  }

  return (
    <div
      className="w-full h-full flex flex-col items-center"
      onMouseDown={(e) => onDragStart(e.clientX)}
      onMouseUp={(e) => onDragEnd(e.clientX)}
      onMouseLeave={() => {
        isDragging.current = false;
        dragStartX.current = null;
      }}
      onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
      onTouchEnd={(e) => onDragEnd(e.changedTouches[0].clientX)}
    >
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
          <Settings className="cursor-pointer" />
        </div>
      </div>

      <Week week={week} animationDirection={animationDirection} />
      {week && (
        <div className="w-full flex flex-col items-center">
          <WeeksSwitch
            weekNumber={week.weekNumber}
            year={week.year}
            startDate={week.startDate}
            endDate={week.endDate}
            onPrev={handlePrev}
            onNext={handleNext}
          />
          {currentWeekNumber !== getWeekNumber(new Date()).weekNumber - 1 &&
            currentYear == getWeekNumber(new Date()).year && (
              <p
                className="text-[#888] text-[12px] cursor-pointer uppercase mt-2 hover:text-white transition-colors duration-200"
                onClick={() => {
                  fetchWeek("current");
                  setAnimationDirection(0);
                }}
              >
                Back to this week
              </p>
            )}
        </div>
      )}
    </div>
  );
}
