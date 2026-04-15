import type {EventDateTime} from "../../interfaces/CalendarEvent";

const CALENDAR_COLORS: Record<string, { bg: string; text: string }> = {
  "1":  { bg: "#1a1f3a", text: "#7b9cff" }, 
  "2":  { bg: "#0f2a1e", text: "#00FF26" }, 
  "3":  { bg: "#1e1230", text: "#c084fc" }, 
  "4":  { bg: "#2e1215", text: "#f87171" }, 
  "5":  { bg: "#2a2000", text: "#facc15" },
  "6":  { bg: "#2e1800", text: "#fb923c" }, 
  "7":  { bg: "#0f2a2a", text: "#22d3ee" }, 
  "8":  { bg: "#1e1e1e", text: "#888888" },
  "9":  { bg: "#0f1e3a", text: "#60a5fa" }, 
  "10": { bg: "#0f2a10", text: "#4ade80" }, 
  "11": { bg: "#2e0f10", text: "#ef4444" }, 
};

const DEFAULT_COLOR = { bg: "#0f2a1e", text: "#00FF26" };

function formatTime(dateTime: string): string {
  return new Date(dateTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface EventBlockProps {
  summary: string;
  startTime?: EventDateTime;
  endTime?: EventDateTime;
  colorId?: string;
}

export default function EventBlock({
  summary,
  startTime,
  endTime,
  colorId,
}: EventBlockProps) {
  const color = colorId ? (CALENDAR_COLORS[colorId] ?? DEFAULT_COLOR) : DEFAULT_COLOR;

  return (
    <div
      className="w-full rounded-md p-3"
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