import { useState } from "react";

type Priority = "high" | "medium" | "optional";

interface TaskProps {
  text: string;
  priority?: Priority;
  initialDone?: boolean;
  onToggle?: (done: boolean) => void;
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
  text,
  priority,
  initialDone = false,
  onToggle,
}: TaskProps) {
  const [done, setDone] = useState(initialDone);

  function handleToggle() {
    const next = !done;
    setDone(next);
    onToggle?.(next);
  }

  return (
    <div
      onClick={handleToggle}
      className="flex items-start gap-3 px-2 py-2.5 rounded-lg cursor-pointer hover:bg-[#1a1a1a] transition-colors duration-200 select-none"
    >
      <div
        className={`
          flex-shrink-0 mt-[2px] w-[22px] h-[22px] rounded-full border-2
          flex items-center justify-center
          transition-all duration-250
          ${done ? "border-[#00FF26] bg-[#00FF26]" : "border-[#3a3a3a]"}
        `}
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
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-1">
        {priority && (
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded-full w-fit tracking-wide transition-opacity duration-250 ${
              priorityConfig[priority].classes
            } ${done ? "opacity-35" : ""}`}
          >
            <span
              className={`w-[5px] h-[5px] rounded-full flex-shrink-0 ${dotColor[priority]}`}
            />
            {priorityConfig[priority].label}
          </span>
        )}
        <div className="relative">
          <span
            className={`text-sm leading-relaxed transition-colors duration-250 ${
              done
                ? "text-[#555555] line-through decoration-[#555555]"
                : "text-[#e5e5e5]"
            }`}
          >
            {text}
          </span>
        </div>
      </div>
    </div>
  );
}
