export type AppView = "days" | "week" | "goals";

export const APP_VIEW_TABS: { id: AppView; label: string }[] = [
  { id: "days", label: "Days" },
  { id: "week", label: "Week" },
  { id: "goals", label: "Goals" },
];

interface ViewToggleProps {
  view: AppView;
  onChange: (view: AppView) => void;
}

const sliderShift: Record<AppView, string> = {
  days: "translate-x-0",
  week: "translate-x-full",
  goals: "translate-x-[200%]",
};

export default function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div
      className="relative grid grid-cols-3 w-[252px] 2xl:w-[294px] h-8 2xl:h-9 rounded-full bg-[#1B1B1B] border border-[#2a2a2a] p-[3px]"
      role="tablist"
      aria-label="View"
    >
      <span
        className={`absolute top-[3px] left-[3px] bottom-[3px] w-[calc((100%-6px)/3)] rounded-full bg-[#00FF26] transition-transform duration-300 ease-out ${sliderShift[view]}`}
      />
      {APP_VIEW_TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={view === tab.id}
          className={`relative z-10 text-[12px] 2xl:text-[13px] font-medium rounded-full cursor-pointer transition-colors duration-200 ${
            view === tab.id ? "text-[#151515]" : "text-[#888] hover:text-white"
          }`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
