import { AnimatePresence, motion } from "framer-motion";
import Input from "../../ui/Input";
import Select from "../../ui/Select";
import type { Repetition } from "../../../interfaces/Task";
import {
  calendarParts,
  toCalendarDate,
  todayCalendarDate,
} from "../../../helpers/calendarDate";

const WEEKDAYS = [
  { label: "M", value: 0 },
  { label: "T", value: 1 },
  { label: "W", value: 2 },
  { label: "T", value: 3 },
  { label: "F", value: 4 },
  { label: "S", value: 5 },
  { label: "S", value: 6 },
];

const MONTHS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const DAYS_OF_MONTH = Array.from({ length: 31 }, (_, i) => {
  const day = String(i + 1);
  return { value: day, label: day };
});

const DEFAULT_REPETITION: Repetition = {
  frequency: "daily",
  interval: 1,
  daysOfWeek: [],
  dayOfMonth: null,
  monthOfYear: null,
  startDate: todayCalendarDate(),
  endDate: null,
};

interface RepetitionFieldsProps {
  value: Repetition | null | undefined;
  onChange: (repetition: Repetition) => void;
}

export default function RepetitionFields({ value, onChange }: RepetitionFieldsProps) {
  const repetition = value ?? DEFAULT_REPETITION;
  const startParts = calendarParts(repetition.startDate || todayCalendarDate());

  function update(patch: Partial<Repetition>) {
    onChange({ ...repetition, ...patch });
  }

  function setFrequency(frequency: Repetition["frequency"]) {
    update({
      frequency,
      dayOfMonth: repetition.dayOfMonth ?? startParts.day,
      monthOfYear: repetition.monthOfYear ?? startParts.month,
    });
  }

  function toggleDayOfWeek(dayValue: number) {
    const daysOfWeek = repetition.daysOfWeek.includes(dayValue)
      ? repetition.daysOfWeek.filter((d) => d !== dayValue)
      : [...repetition.daysOfWeek, dayValue];
    update({ daysOfWeek });
  }

  const dayOfMonth = repetition.dayOfMonth ?? startParts.day;
  const monthOfYear = repetition.monthOfYear ?? startParts.month;

  return (
    <div className="w-full flex flex-col gap-3 mt-3">
      <div className="grid grid-cols-4 gap-2 items-end">
        <div className="col-span-3">
          <label className="text-xs text-gray-400 mb-1 block">Frequency</label>
          <Select
            options={[
              { value: "daily", label: "Daily" },
              { value: "weekly", label: "Weekly" },
              { value: "monthly", label: "Monthly" },
              { value: "yearly", label: "Yearly" },
            ]}
            value={repetition.frequency}
            placeholder="Frequency"
            onChange={(freq) => setFrequency(freq as Repetition["frequency"])}
          />
        </div>

        <div className="col-span-1 [&_input]:[appearance:textfield] [&_input::-webkit-outer-spin-button]:appearance-none [&_input::-webkit-inner-spin-button]:appearance-none">
          <label className="text-xs text-gray-400 mb-1 block truncate">Every (x)</label>
          <Input
            type="number"
            min={1}
            placeholder="1"
            value={repetition.interval}
            onChange={(e) => update({ interval: Math.max(1, Number(e.target.value)) })}
          />
        </div>
      </div>

      <AnimatePresence>
        {repetition.frequency === "weekly" && (
          <motion.div
            initial={{ height: 0, opacity: 0, overflow: "hidden" }}
            animate={{ height: "auto", opacity: 1, transitionEnd: { overflow: "visible" } }}
            exit={{ height: 0, opacity: 0, overflow: "hidden" }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="relative z-40"
          >
            <p className="text-sm font-medium text-gray-400 mb-1.5 mt-1">Repeat on</p>
            <div className="flex gap-1.5">
              {WEEKDAYS.map(({ label, value: dayValue }) => {
                const active = repetition.daysOfWeek.includes(dayValue);
                return (
                  <button
                    key={dayValue}
                    type="button"
                    onClick={() => toggleDayOfWeek(dayValue)}
                    className={`
                      w-8 h-8 rounded-full text-xs font-medium
                      flex items-center justify-center
                      border transition-all duration-200 ease-in-out cursor-pointer
                      ${active
                        ? "bg-[#00FF26] border-[#00FF26] text-[#121212] shadow-[0_0_10px_rgba(0,255,38,0.3)]"
                        : "bg-[#1a1a1a] border-[#2a2a2a] text-gray-400 hover:border-gray-500 hover:text-white"}
                    `}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {repetition.frequency === "monthly" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="relative"
          >
            <label className="text-xs text-gray-400 mb-1 block">Day of month</label>
            <Select
              options={DAYS_OF_MONTH}
              value={String(dayOfMonth)}
              placeholder="Day"
              onChange={(day) => update({ dayOfMonth: Number(day) })}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {repetition.frequency === "yearly" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="relative grid grid-cols-2 gap-2"
          >
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Month</label>
              <Select
                options={MONTHS}
                value={String(monthOfYear)}
                placeholder="Month"
                onChange={(month) => update({ monthOfYear: Number(month) })}
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Day</label>
              <Select
                options={DAYS_OF_MONTH}
                value={String(dayOfMonth)}
                placeholder="Day"
                onChange={(day) => update({ dayOfMonth: Number(day) })}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full grid grid-cols-2 gap-2 mt-1">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Start date</label>
          <Input
            type="date"
            value={repetition.startDate ? toCalendarDate(repetition.startDate) : ""}
            onChange={(e) =>
              update({ startDate: e.target.value || todayCalendarDate() })
            }
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">End date</label>
          <Input
            type="date"
            value={repetition.endDate ? toCalendarDate(repetition.endDate) : ""}
            onChange={(e) =>
              update({ endDate: e.target.value || null })
            }
          />
        </div>
      </div>
    </div>
  );
}
