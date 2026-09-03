interface ViewToggleProps {
  view: "days" | "week";
  onChange: (view: "days" | "week") => void;
}

export default function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div
      className="relative grid grid-cols-2 w-[168px] h-8 rounded-full bg-[#1B1B1B] border border-[#2a2a2a] p-[3px]"
      role="tablist"
      aria-label="View"
    >
      <span
        className={`absolute top-[3px] left-[3px] bottom-[3px] w-[calc(50%-3px)] rounded-full bg-[#00FF26] transition-transform duration-300 ease-out ${
          view === "week" ? "translate-x-full" : "translate-x-0"
        }`}
      />
      <button
        type="button"
        role="tab"
        aria-selected={view === "days"}
        className={`relative z-10 text-[12px] font-medium rounded-full cursor-pointer transition-colors duration-200 ${
          view === "days" ? "text-[#151515]" : "text-[#888] hover:text-white"
        }`}
        onClick={() => onChange("days")}
      >
        Days
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={view === "week"}
        className={`relative z-10 text-[12px] font-medium rounded-full cursor-pointer transition-colors duration-200 ${
          view === "week" ? "text-[#151515]" : "text-[#888] hover:text-white"
        }`}
        onClick={() => onChange("week")}
      >
        Week
      </button>
    </div>
  );
}
