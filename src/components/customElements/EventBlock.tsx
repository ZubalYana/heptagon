import type {EventDateTime} from "../../interfaces/CalendarEvent";

const CALENDAR_COLORS: Record<string, { bg: string; text: string }> = {
  "1":  { bg: "#a4bdfc", text: "#1a1a2e" }, // lavender
  "2":  { bg: "#7ae7bf", text: "#1a2e26" }, // sage
  "3":  { bg: "#dbadff", text: "#2a1a3e" }, // grape
  "4":  { bg: "#ff887c", text: "#3e1a1a" }, // flamingo
  "5":  { bg: "#fbd75b", text: "#3e2e00" }, // banana
  "6":  { bg: "#ffb878", text: "#3e2200" }, // tangerine
  "7":  { bg: "#46d6db", text: "#1a2e2e" }, // peacock
  "8":  { bg: "#e1e1e1", text: "#1a1a1a" }, // graphite
  "9":  { bg: "#5484ed", text: "#ffffff" }, // blueberry
  "10": { bg: "#51b749", text: "#ffffff" }, // basil
  "11": { bg: "#dc2127", text: "#ffffff" }, // tomato
};

const DEFAULT_COLOR = { bg: "#3d3d3d", text: "#ffffff" };

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