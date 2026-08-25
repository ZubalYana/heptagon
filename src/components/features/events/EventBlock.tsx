import type {EventDateTime} from "../../../interfaces/CalendarEvent";

function formatTime(dateTime: string): string {
  return new Date(dateTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

import { muteColor } from "../../../helpers/colorTheme";

const DEFAULT_COLOR = muteColor("#00FF26"); 
interface EventBlockProps {
  summary: string;
  startTime?: EventDateTime;
  endTime?: EventDateTime;
  colorHex?: string;
}

export default function EventBlock({ summary, startTime, endTime, colorHex }: EventBlockProps) {
  const color = colorHex ? muteColor(colorHex) : DEFAULT_COLOR;

  return (
    <div
      className="w-full rounded-md p-3 relative z-10"
      style={{ backgroundColor: color.bg, color: color.text }}
    >
      <h5 className="font-semibold text-[14px]">{summary}</h5>
      {startTime?.dateTime && endTime?.dateTime && (
        <p className="text-[12px] mt-1 opacity-80">
          {formatTime(startTime.dateTime)} – {formatTime(endTime.dateTime)}
        </p>
      )}
    </div>
  );
}