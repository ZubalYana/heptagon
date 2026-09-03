import { Minus, Plus, Trash2 } from "lucide-react";
import type WeeklyTask from "../../../interfaces/WeeklyTask";

interface WeekTaskRowProps {
  task: WeeklyTask;
  onDelta: (delta: 1 | -1) => void;
  onDelete: () => void;
}

export default function WeekTaskRow({
  task,
  onDelta,
  onDelete,
}: WeekTaskRowProps) {
  const done =
    task.targetCount === 1
      ? task.completedCount >= 1
      : task.completedCount >= task.targetCount;

  return (
    <div className="group w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#1a1a1a] transition-colors duration-200">
      {task.targetCount === 1 ? (
        <button
          type="button"
          onClick={() => onDelta(done ? -1 : 1)}
          className={`flex-shrink-0 cursor-pointer w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center transition-all duration-250 ${
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
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            disabled={task.completedCount <= 0}
            onClick={() => onDelta(-1)}
            className="w-7 h-7 rounded-md border border-[#2a2a2a] flex items-center justify-center text-[#ccc] hover:text-white hover:border-gray-500 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            aria-label="Decrease count"
          >
            <Minus size={14} />
          </button>
          <span className="text-[13px] text-[#e5e5e5] min-w-[3.2rem] text-center tabular-nums">
            {task.completedCount}/{task.targetCount}
          </span>
          <button
            type="button"
            disabled={task.completedCount >= task.targetCount}
            onClick={() => onDelta(1)}
            className="w-7 h-7 rounded-md border border-[#2a2a2a] flex items-center justify-center text-[#ccc] hover:text-white hover:border-gray-500 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            aria-label="Increase count"
          >
            <Plus size={14} />
          </button>
        </div>
      )}

      <span
        className={`flex-1 min-w-0 text-sm leading-relaxed break-words ${
          done
            ? "text-[#555555] line-through decoration-[#555555]"
            : "text-[#e5e5e5]"
        }`}
      >
        {task.title}
      </span>

      <button
        type="button"
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 text-[#888] hover:text-red-400 cursor-pointer transition-opacity"
        aria-label="Delete task"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
