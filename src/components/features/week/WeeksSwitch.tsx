import { ChevronLeft, ChevronRight } from "lucide-react";

interface WeeksProps {
  weekNumber: number;
  year: number;
  startDate: string;
  endDate: string;
  onPrev: () => void;
  onNext: () => void;
  onBackToCurrent?: () => void;
}

export default function WeeksSwitch({
  weekNumber,
  year,
  onPrev,
  onNext,
  onBackToCurrent,
}: WeeksProps) {
  return (
    <div className="mt-8 lg:mt-10 flex flex-col items-center select-none shrink-0">
      <div className="flex items-center gap-x-2">
        <button
          type="button"
          onClick={onPrev}
          className="w-8 h-8 rounded-full flex items-center justify-center text-[#888] hover:text-white hover:bg-white/5 cursor-pointer transition-colors duration-200"
          aria-label="Previous week"
        >
          <ChevronLeft size={20} />
        </button>
        <h4 className="text-[16px] lg:text-[18px] font-medium text-white min-w-[11rem] text-center">
          Week {weekNumber} of {year}
        </h4>
        {/* <p className="text-[14px] font-normal">
        {formatDate(startDate)} - {formatDate(endDate)}
      </p> */}
        <button
          type="button"
          onClick={onNext}
          className="w-8 h-8 rounded-full flex items-center justify-center text-[#888] hover:text-white hover:bg-white/5 cursor-pointer transition-colors duration-200"
          aria-label="Next week"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      {onBackToCurrent && (
        <button
          type="button"
          onClick={onBackToCurrent}
          className="mt-1 text-[12px] text-[#888] hover:text-white cursor-pointer transition-colors duration-200"
        >
          Back to this week
        </button>
      )}
    </div>
  );
}
