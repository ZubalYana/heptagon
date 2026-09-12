import { Minus, Plus } from "lucide-react";
import type Goal from "../../../interfaces/Goal";
import TaskMenu from "../tasks/TaskMenu";
import LinearProgressbar from "../../ui/LinearProgressbar";

interface GoalRowProps {
  goal: Goal;
  onDelta: (delta: 1 | -1) => void;
  onEdit: () => void;
  onDelete: () => void;
}

function formatDeadline(value: string) {
  const [year, month, day] = String(value).slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isOverdue(value: string) {
  const [year, month, day] = String(value).slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return false;
  return new Date(year, month - 1, day, 23, 59, 59, 999).getTime() < Date.now();
}

export default function GoalRow({
  goal,
  onDelta,
  onEdit,
  onDelete,
}: GoalRowProps) {
  const done = goal.currentValue >= goal.targetValue;
  const overdue = !done && isOverdue(goal.deadline);
  const unitLabel = goal.unit ? ` ${goal.unit}` : "";
  const percentage =
    goal.targetValue <= 0
      ? 0
      : Math.round((goal.currentValue / goal.targetValue) * 100);

  return (
    <div className="group w-full flex items-start gap-3 px-2 py-2 rounded-lg hover:bg-[#1a1a1a] tselectransition-colors duration-200 -none">
      {goal.targetValue === 1 ? (
        <button
          type="button"
          onClick={() => onDelta(done ? -1 : 1)}
          className={`flex-shrink-0 cursor-pointer mt-[2px] w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center transition-all duration-250 ${
            done ? "border-[#00FF26] bg-[#00FF26]" : "border-[#3a3a3a]"
          }`}
          aria-label={done ? "Mark incomplete" : "Mark complete"}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className={`transition-all duration-200 ${
              done ? "opacity-100 scale-100" : "opacity-0 scale-50"
            }`}
          >
            <path
              d="M2 6l3 3 5-5"
              stroke="#151515"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ) : (
        <div className="flex flex-col items-stretch shrink-0 mt-[2px] gap-1 min-w-[4.5rem]">
          <div className="flex items-center justify-center">
            <button
              type="button"
              disabled={goal.currentValue <= 0}
              onClick={() => onDelta(-1)}
              className="w-[18px] h-[18px] rounded flex items-center justify-center text-[#666] hover:text-[#e5e5e5] hover:bg-[#2a2a2a] disabled:opacity-25 disabled:hover:bg-transparent disabled:cursor-not-allowed cursor-pointer transition-colors"
              aria-label="Decrease count"
            >
              <Minus size={11} />
            </button>
            <span className="text-[11px] leading-none text-[#e5e5e5] tabular-nums px-0.5 min-w-[1.6rem] text-center">
              {goal.currentValue}/{goal.targetValue}
            </span>
            <button
              type="button"
              disabled={done}
              onClick={() => onDelta(1)}
              className="w-[18px] h-[18px] rounded flex items-center justify-center text-[#666] hover:text-[#e5e5e5] hover:bg-[#2a2a2a] disabled:opacity-25 disabled:hover:bg-transparent disabled:cursor-not-allowed cursor-pointer transition-colors"
              aria-label="Increase count"
            >
              <Plus size={11} />
            </button>
          </div>
          <LinearProgressbar percentage={percentage} />
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <span
          className={`text-sm leading-relaxed break-words transition-colors duration-250 ${
            done
              ? "text-[#555555] line-through decoration-[#555555]"
              : "text-[#e5e5e5]"
          }`}
        >
          {goal.name}
          {goal.targetValue !== 1 && (
            <span className="text-[#888] font-normal">
              {unitLabel}
            </span>
          )}
        </span>
        {goal.description && (
          <span className="text-[12px] text-[#888] leading-relaxed break-words">
            {goal.description}
          </span>
        )}
        <span
          className={`text-[11px] ${
            overdue ? "text-red-400" : "text-[#666]"
          }`}
        >
          {done ? "Done" : `Due ${formatDeadline(goal.deadline)}`}
        </span>
      </div>

      <TaskMenu onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}
