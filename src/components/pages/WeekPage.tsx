import { useState, useEffect, useRef } from "react";
import type InterfaceWeek from "../../interfaces/Week";
import Week from "../features/week/Week";
import WeeksSwitch from "../features/week/WeeksSwitch";
import ViewToggle from "../features/week/ViewToggle";
import WeekTasksView from "../features/week/WeekTasksView";
import CircularProgressbar from "../ui/CircularProgressbar";
import { Settings, UserCircle } from "lucide-react";
import apiClient from "../../helpers/apiClient";
import { getWeekNumber } from "../../helpers/getWeekNumber";
import SettingsPopup from "../modals/Settings";
import type User from "../../interfaces/User";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  progressPercent,
  type WeekProgress,
} from "../../helpers/weekProgress";
const SWIPE_THRESHOLD = 50;

interface WeekPageProps {
  user: User;
}

export default function WeekPage({ user }: WeekPageProps) {
  const [week, setWeek] = useState<InterfaceWeek | null>(null);
  const [animationDirection, setAnimationDirection] = useState(1);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [currentWeekNumber, setCurrentWeekNumber] = useState<number | null>(
    null
  );
  const [settingsOpened, setSettingsOpened] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dragStartX = useRef<number | null>(null);
  const isDragging = useRef(false);
  const [progress, setProgress] = useState<WeekProgress>({
    completed: 0,
    total: 0,
  });

  const view: "days" | "week" =
    searchParams.get("view") === "week" ? "week" : "days";

  function syncParams(year: number, weekNumber: number, nextView = view) {
    setSearchParams(
      {
        year: String(year),
        week: String(weekNumber),
        view: nextView,
      },
      { replace: true }
    );
  }

  function loadProgress(year: number, weekNumber: number) {
    apiClient
      .get(`/weeks/${year}/${weekNumber}/progress`)
      .then(({ data }) => setProgress(data))
      .catch(() => setProgress({ completed: 0, total: 0 }));
  }

  useEffect(() => {
    const year = searchParams.get("year");
    const week = searchParams.get("week");
    fetchWeek(year && week ? `${year}/${week}` : "current");
  }, []);

  function fetchWeek(path: string) {
    apiClient.get(`/weeks/${path}`).then(({ data }) => {
      setWeek(data);
      setCurrentYear(data.year);
      setCurrentWeekNumber(data.weekNumber);
      syncParams(data.year, data.weekNumber);
      loadProgress(data.year, data.weekNumber);
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
    if (settingsOpened || view === "week") return;
    dragStartX.current = x;
    isDragging.current = true;
  }

  function onDragEnd(x: number) {
    if (settingsOpened) return;
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
      className="relative w-full min-h-dvh 2xl:h-dvh 2xl:overflow-hidden flex flex-col items-center p-[20px] lg:p-[40px] 2xl:px-14 2xl:pt-12 2xl:pb-6"
      onMouseDown={(e) => onDragStart(e.clientX)}
      onMouseUp={(e) => onDragEnd(e.clientX)}
      onMouseLeave={() => {
        isDragging.current = false;
        dragStartX.current = null;
      }}
      onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
      onTouchEnd={(e) => onDragEnd(e.changedTouches[0].clientX)}
    >
      <div className="w-full grid grid-cols-3 items-center mb-6 lg:mb-12 2xl:mb-8">
        <div className="flex gap-x-2 items-center justify-self-start">
          <img
            src="/heptagonLogo.svg"
            alt="Heptagon Logo"
            className="w-[35px] h-[35px] 2xl:w-10 2xl:h-10"
          />
          <h2 className="text-[20px] 2xl:text-[22px] font-medium">Heptagon</h2>
        </div>
        <div className="justify-self-center">
          <ViewToggle
            view={view}
            onChange={(next) => {
              if (currentYear != null && currentWeekNumber != null) {
                syncParams(currentYear, currentWeekNumber, next);
              } else {
                setSearchParams(
                  (prev) => {
                    const nextParams = new URLSearchParams(prev);
                    nextParams.set("view", next);
                    return nextParams;
                  },
                  { replace: true }
                );
              }
            }}
          />
        </div>
        <div className="flex items-center justify-self-end">
          {view === "days" && (
            <button
              type="button"
              className="mr-6 lg:mr-8 cursor-pointer shrink-0"
              onClick={() => {
                if (currentYear != null && currentWeekNumber != null) {
                  syncParams(currentYear, currentWeekNumber, "week");
                }
              }}
              onMouseDown={(e) => e.stopPropagation()}
              aria-label="Open week view"
            >
              <CircularProgressbar
                percentage={progressPercent(progress)}
                size="header"
              />
            </button>
          )}
          <div className="flex gap-x-4 items-center">
            <UserCircle
              className="cursor-pointer 2xl:size-7"
              onClick={() => {
                const qs = searchParams.toString();
                navigate(qs ? `/profile?${qs}` : "/profile");
              }}
            />
            <Settings
              className="cursor-pointer 2xl:size-7"
              onClick={() => setSettingsOpened(true)}
            />
          </div>
        </div>
      </div>

      {user.emailVerified === false && (
        <div className="w-full mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg border border-[#2a2a2a] bg-[#1B1B1B] px-4 py-3 text-[13px] text-[#ccc]">
          <p>
            Confirm <span className="text-white">{user.email}</span> via the link we sent.
            Check spam if you do not see it.
          </p>
          <button
            type="button"
            className="text-[#00FF26] hover:underline cursor-pointer shrink-0 text-left"
            onClick={() => {
              apiClient.post("/auth/resend-verification").catch(() => {
                const qs = searchParams.toString();
                navigate(qs ? `/profile?${qs}` : "/profile");
              });
            }}
          >
            Resend email
          </button>
        </div>
      )}

      <div className="w-full flex-1 flex flex-col justify-center items-center min-h-0 2xl:justify-start">
        <div className="w-full flex-1 flex flex-col justify-center min-h-0">
          {view === "week" && currentYear != null && currentWeekNumber != null ? (
            <WeekTasksView
              year={currentYear}
              week={currentWeekNumber}
              progress={progress}
              onProgressChange={() =>
                loadProgress(currentYear, currentWeekNumber)
              }
            />
          ) : (
            <Week week={week} animationDirection={animationDirection} />
          )}
        </div>
        {week && (
          <WeeksSwitch
            weekNumber={week.weekNumber}
            year={week.year}
            startDate={week.startDate}
            endDate={week.endDate}
            onPrev={handlePrev}
            onNext={handleNext}
            onBackToCurrent={
              currentWeekNumber !== getWeekNumber(new Date()).weekNumber &&
              currentYear == getWeekNumber(new Date()).year
                ? () => {
                    fetchWeek("current");
                    setAnimationDirection(0);
                  }
                : undefined
            }
          />
        )}
      </div>

      <a
        href="/privacy"
        target="_blank"
        className="mt-6 2xl:mt-4 shrink-0 text-xs text-gray-500 hover:text-gray-400"
      >
        Privacy Policy
      </a>
      {settingsOpened && (
        <div
          className="w-full h-full fixed inset-0 flex justify-center items-center backdrop-blur-lg z-[9999]"
          onClick={() => setSettingsOpened(false)}
        >
          <SettingsPopup onClose={() => setSettingsOpened(false)} />
        </div>
      )}

  
    </div>
  );
}
