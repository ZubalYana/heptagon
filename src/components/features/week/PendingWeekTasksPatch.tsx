import { useEffect, useState } from "react";
import apiClient from "../../../helpers/apiClient";
import type WeeklyTask from "../../../interfaces/WeeklyTask";
import CircularProgressbar from "../../ui/CircularProgressbar";

interface PendingWeekTasksPatchProps {
  year: number;
  week: number;
  onOpenWeek: () => void;
}

function taskPercent(task: WeeklyTask) {
  if (task.targetCount <= 0) return 0;
  return Math.round((task.completedCount / task.targetCount) * 100);
}

function isPending(task: WeeklyTask) {
  return task.completedCount < task.targetCount;
}

export default function PendingWeekTasksPatch({
  year,
  week,
  onOpenWeek,
}: PendingWeekTasksPatchProps) {
  const [pending, setPending] = useState<WeeklyTask[]>([]);

  useEffect(() => {
    apiClient
      .get(`/weeks/${year}/${week}/tasks`)
      .then(({ data }) =>
        setPending((data as WeeklyTask[]).filter(isPending))
      )
      .catch(() => setPending([]));
  }, [year, week]);

  if (pending.length === 0) return null;

  return (
    <button
      type="button"
      onClick={onOpenWeek}
      onMouseDown={(e) => e.stopPropagation()}
      aria-label="Open week view"
      className="
        fixed bottom-5 right-5 lg:bottom-8 lg:right-8 z-40
        max-w-[min(90vw,28rem)]
        flex items-center gap-2 px-3 py-2.5
        bg-[#1B1B1B] border border-[#2a2a2a] rounded-xl
        shadow-[0_8px_32px_rgba(0,0,0,0.45)]
        cursor-pointer
        hover:border-[#00FF26]/40 hover:bg-[#1f1f1f]
        transition-colors duration-200
      "
    >
      <div className="flex items-center gap-2 flex-wrap justify-end">
        {pending.map((task) => (
          <div key={task._id} className="relative shrink-0 group/ring">
            <CircularProgressbar percentage={taskPercent(task)} size="header" />
            <span
              className="
                pointer-events-none absolute left-1/2 -top-1 -translate-x-1/2 -translate-y-full
                whitespace-nowrap max-w-[12rem] truncate
                px-2 py-1 rounded-md
                bg-[#151515] border border-[#2a2a2a]
                text-[11px] text-[#e5e5e5]
                opacity-0 group-hover/ring:opacity-100
                transition-opacity duration-150
                z-10
              "
            >
              {task.title}
            </span>
          </div>
        ))}
      </div>
    </button>
  );
}
