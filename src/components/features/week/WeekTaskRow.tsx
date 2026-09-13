import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import type WeeklyTask from "../../../interfaces/WeeklyTask";
import TaskMenu from "../tasks/TaskMenu";

interface WeekTaskRowProps {
  task: WeeklyTask;
  onDelta: (delta: 1 | -1) => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddSubtask: (text: string) => void;
  onToggleSubtask: (subtaskId: string) => void;
}

export default function WeekTaskRow({
  task,
  onDelta,
  onEdit,
  onDelete,
  onAddSubtask,
  onToggleSubtask,
}: WeekTaskRowProps) {
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [newSubtaskText, setNewSubtaskText] = useState("");
  const subtasks = task.subtasks ?? [];
  const done =
    task.targetCount === 1
      ? task.completedCount >= 1
      : task.completedCount >= task.targetCount;

  function handleSave() {
    if (newSubtaskText.trim()) onAddSubtask(newSubtaskText.trim());
    setNewSubtaskText("");
    setIsAddingSubtask(false);
  }

  return (
    <div className="w-full flex flex-col">
      <div className="group w-full flex items-start gap-3 px-2 py-2 rounded-lg hover:bg-[#1a1a1a] tselectransition-colors duration-200 -none">
        {task.targetCount === 1 ? (
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
          <div className="flex items-center shrink-0 mt-[2px]">
            <button
              type="button"
              disabled={task.completedCount <= 0}
              onClick={() => onDelta(-1)}
              className="w-[18px] h-[18px] rounded flex items-center justify-center text-[#666] hover:text-[#e5e5e5] hover:bg-[#2a2a2a] disabled:opacity-25 disabled:hover:bg-transparent disabled:cursor-not-allowed cursor-pointer transition-colors"
              aria-label="Decrease count"
            >
              <Minus size={11} />
            </button>
            <span className="text-[11px] leading-none text-[#e5e5e5] tabular-nums px-0.5 min-w-[1.6rem] text-center">
              {task.completedCount}/{task.targetCount}
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
        )}

        <span
          className={`flex-1 min-w-0 text-sm leading-relaxed break-words transition-colors duration-250 ${
            done
              ? "text-[#555555] line-through decoration-[#555555]"
              : "text-[#e5e5e5]"
          }`}
        >
          {task.title}
        </span>

        <TaskMenu
          onAddSubtask={() => setIsAddingSubtask(true)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>

      {subtasks.length > 0 && (
        <div className="ml-9 pr-2 flex flex-col gap-0.5 mb-1">
          {subtasks.map((subtask) => (
            <div
              key={subtask._id}
              className="flex items-center gap-2 py-1 px-2 rounded-md group w-fit hover:bg-[#1a1a1a] transition-colors duration-200 cursor-pointer"
              onClick={() => onToggleSubtask(subtask._id)}
            >
              <div
                className={`flex-shrink-0 w-[16px] h-[16px] rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  subtask.completed
                    ? "border-[#00FF26] bg-[#00FF26]"
                    : "border-[#3a3a3a] group-hover:border-[#555]"
                }`}
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 12 12"
                  fill="none"
                  className={`transition-all duration-200 ${
                    subtask.completed
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-50"
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
              </div>
              <span
                className={`text-[12px] leading-relaxed transition-colors duration-200 ${
                  subtask.completed ? "line-through text-[#555]" : "text-[#888]"
                }`}
              >
                {subtask.text}
              </span>
            </div>
          ))}
        </div>
      )}

      {isAddingSubtask && (
        <div className="ml-9 pr-2 pb-2 mt-0.5">
          <input
            autoFocus
            type="text"
            value={newSubtaskText}
            onChange={(e) => setNewSubtaskText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") {
                setNewSubtaskText("");
                setIsAddingSubtask(false);
              }
            }}
            onBlur={handleSave}
            placeholder="Subtask name..."
            className="w-full bg-transparent text-[13px] text-[#e5e5e5] placeholder-[#444] border-b border-[#3a3a3a] focus:border-[#666] pb-1 focus:outline-none transition-colors duration-150"
          />
        </div>
      )}
    </div>
  );
}
