import { useState } from "react";
import TaskMenu from "../TaskMenu";

type Priority = "high" | "medium" | "optional";

interface Subtask {
  _id: string;
  text: string;
  completed: boolean;
}

interface TaskProps {
  text: string;
  priority?: Priority;
  done?: boolean;
  subtasks?: Subtask[];
  onToggle?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onSubmitSubtask?: (subtaskText: string) => void;
  onToggleSubtask?: (subtaskId: string) => void; 
}

const priorityConfig: Record<Priority, { label: string; classes: string }> = {
  high: { label: "High", classes: "bg-red-950 text-red-400" },
  medium: { label: "Medium", classes: "bg-yellow-950 text-yellow-400" },
  optional: { label: "Optional", classes: "bg-[#151a15] text-gray-500" },
};
const dotColor: Record<Priority, string> = {
  high: "bg-red-400",
  medium: "bg-yellow-400",
  optional: "bg-gray-500",
};

export default function Task({
  text, priority, done = false, subtasks = [],
  onToggle, onEdit, onDelete, onSubmitSubtask, onToggleSubtask 
}: TaskProps) {
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [newSubtaskText, setNewSubtaskText] = useState("");

  const handleSave = () => {
    if (newSubtaskText.trim()) onSubmitSubtask?.(newSubtaskText.trim());
    setNewSubtaskText("");
    setIsAddingSubtask(false);
  };

  const handleCancel = () => {
    setNewSubtaskText("");
    setIsAddingSubtask(false);
  };

  return (
    <div className="w-full flex flex-col">
      <div
        onClick={onToggle}
        className="group w-full flex items-start gap-3 px-2 py-2 rounded-lg cursor-pointer hover:bg-[#1a1a1a] transition-colors duration-200 select-none"
      >
        <div
          className={`flex-shrink-0 mt-[2px] w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center transition-all duration-250 ${
            done ? "border-[#00FF26] bg-[#00FF26]" : "border-[#3a3a3a]"
          }`}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
            className={`transition-all duration-200 ${done ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
          >
            <path d="M2 6l3 3 5-5" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-1">
          {priority && (
            <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded-full w-fit tracking-wide transition-opacity duration-250 ${priorityConfig[priority].classes} ${done ? "opacity-35" : ""}`}>
              <span className={`w-[5px] h-[5px] rounded-full flex-shrink-0 ${dotColor[priority]}`} />
              {priorityConfig[priority].label}
            </span>
          )}
          <div className="relative">
            <span className={`text-sm leading-relaxed transition-colors duration-250 break-words ${done ? "text-[#555555] line-through decoration-[#555555]" : "text-[#e5e5e5]"}`}>
              {text}
            </span>
          </div>
        </div>

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
              className="flex items-center gap-2 py-1 px-2 rounded-md group cursor-pointer w-fit hover:bg-[#1a1a1a] transition-colors duration-200"
              onClick={(e) => {
                e.stopPropagation(); 
                onToggleSubtask?.(subtask._id);
              }}
            >
              <div
                className={`flex-shrink-0 w-[16px] h-[16px] rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  subtask.completed ? "border-[#00FF26] bg-[#00FF26]" : "border-[#3a3a3a] group-hover:border-[#555]"
                }`}
              >
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none"
                  className={`transition-all duration-200 ${subtask.completed ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
                >
                  <path d="M2 6l3 3 5-5" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className={`text-[12px] leading-relaxed select-none transition-colors duration-200 ${subtask.completed ? "line-through text-[#555]" : "text-[#888]"}`}>
                {subtask.text}
              </span>
            </div>
          ))}
        </div>
      )}

      {isAddingSubtask && (
        <div
          className="ml-9 pr-2 pb-2 mt-0.5 animate-in fade-in slide-in-from-top-2 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            autoFocus
            type="text"
            value={newSubtaskText}
            onChange={(e) => setNewSubtaskText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
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