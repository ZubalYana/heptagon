import { AnimatePresence, motion } from "framer-motion";
import Input from "./Input";
import Select from "./Select";
import type { Repetition } from "../../interfaces/Task";

const WEEKDAYS = [
  { label: "S", value: 0 },
  { label: "M", value: 1 },
  { label: "T", value: 2 },
  { label: "W", value: 3 },
  { label: "T", value: 4 },
  { label: "F", value: 5 },
  { label: "S", value: 6 },
];

const DEFAULT_REPETITION: Repetition = {
  frequency: "daily",
  interval: 1,
  daysOfWeek: [],
  startDate: new Date(),
  endDate: null,
};

interface RepetitionFieldsProps {
  value: Repetition | null | undefined;
  onChange: (repetition: Repetition) => void;
}

export default function RepetitionFields({ value, onChange }: RepetitionFieldsProps) {
  const repetition = value ?? DEFAULT_REPETITION;

  function update(patch: Partial<Repetition>) {
    onChange({ ...repetition, ...patch });
  }

  function toggleDayOfWeek(dayValue: number) {
    const daysOfWeek = repetition.daysOfWeek.includes(dayValue)
      ? repetition.daysOfWeek.filter((d) => d !== dayValue)
      : [...repetition.daysOfWeek, dayValue];
    update({ daysOfWeek });
  }

  return (
    <div className="w-full flex flex-col gap-3 mt-3">
      <div className="grid grid-cols-4 gap-2 items-end relative z-50">
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
            onChange={(freq) => update({ frequency: freq as Repetition["frequency"] })}
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

      <div className="w-full grid grid-cols-2 gap-2 mt-1 relative z-30">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Start date</label>
          <Input
            type="date"
            value={repetition.startDate ? new Date(repetition.startDate).toISOString().split("T")[0] : ""}
            onChange={(e) =>
              update({ startDate: e.target.value ? new Date(e.target.value) : new Date() })
            }
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">End date</label>
          <Input
            type="date"
            value={repetition.endDate ? new Date(repetition.endDate).toISOString().split("T")[0] : ""}
            onChange={(e) =>
              update({ endDate: e.target.value ? new Date(e.target.value) : null })
            }
          />
        </div>
      </div>
    </div>
  );
}