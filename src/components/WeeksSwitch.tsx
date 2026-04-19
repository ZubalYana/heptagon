import { ChevronLeft, ChevronRight } from "lucide-react";
import formatDate from "../helpers/fotmatDate";

interface WeeksProps {
  weekNumber: number;
  year: number;
  startDate: Date | string;
  endDate: Date | string;
  onPrev: () => void;
  onNext: () => void;
}

export default function WeeksSwitch({
  weekNumber,
  year,
  startDate,
  endDate,
  onPrev,
  onNext
}: WeeksProps) {
  return (
    <div className="lg:mt-10 mt-6 flex gap-x-4 items-center select-none">
      <ChevronLeft
        className="cursor-pointer"
        onClick={onPrev}
      />
      <div className="flex flex-col items-center">
        <h4 className="text-[20px] font-medium">
          Week {weekNumber} of {year}
        </h4>
        <p className="text-[14px] font-normal">
          {formatDate(startDate)} - {formatDate(endDate)}
        </p>
      </div>
      <ChevronRight
        className="cursor-pointer"
        onClick={onNext}
      />
    </div>
  );
}
