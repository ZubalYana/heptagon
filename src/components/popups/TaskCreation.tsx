import { useState } from "react";
import Input from "../customElements/Input";
import Button from "../customElements/PrimaryButton";
import Select from "../customElements/Select";
import Alert from "../customElements/Alert";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type Task from "../../interfaces/Task";
import apiClient from "../../helpers/apiClient";
import Checkbox from "../customElements/Checkbox";

interface TaskCreationProps {
  day: string;
  dayId: string;
  onClose?: () => void;
  onSuccess?: (task: Task) => void;
}

const WEEKDAYS = [
  { label: "S", value: 0 },
  { label: "M", value: 1 },
  { label: "T", value: 2 },
  { label: "W", value: 3 },
  { label: "T", value: 4 },
  { label: "F", value: 5 },
  { label: "S", value: 6 },
];

export default function TaskCreation({
  day,
  dayId,
  onClose,
  onSuccess,
}: TaskCreationProps) {
  const [text, setText] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  const [regular, setRegular] = useState<boolean>(false);
  const [repetition, setRepetition] = useState<{
    frequency: string;
    interval: number;
    daysOfWeek: number[];
    startDate: Date | null;
    endDate: Date | null;
  }>({
    frequency: 'daily',
    interval: 1,
    daysOfWeek: [],
    startDate: null,
    endDate: null
  });
  const [alert, setAlert] = useState<{
    shown: boolean;
    type: "success" | "info" | "error";
    text: string;
  }>({ shown: false, type: "info", text: "" });

  function toggleDayOfWeek(dayValue: number) {
    setRepetition((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(dayValue)
        ? prev.daysOfWeek.filter((d) => d !== dayValue)
        : [...prev.daysOfWeek, dayValue],
    }));
  }

  function createTask() {
    if (!text || !priority) {
      setAlert({ shown: true, type: "info", text: "Text and priority are required." });
      return;
    }

    const payload = regular
      ? { text, priority, dayId, regular, ...repetition }
      : { text, priority, dayId };

    apiClient.post("/tasks/", payload)
      .then(({ data }) => {
        onSuccess?.(data);
      })
      .catch((err) => {
        console.error("Error creating task:", err);
        setAlert({ shown: true, type: "error", text: err.response?.data?.message || "Error creating task" });
      });
  }

  function closeAlert() {
    setAlert({ shown: false, text: "", type: "info" });
  }

  return (
    <div
      className="w-[90%] lg:w-[40%] bg-[#1F1F1F] rounded-md p-4 flex flex-col items-center relative"
      onClick={(e) => e.stopPropagation()}
    >
      <X
        className="w-[18px] h-[18px] absolute top-4 right-4 cursor-pointer"
        onClick={() => onClose?.()}
      />
      <h3 className="text-[20px] font-medium mb-4">Create a task for {day}</h3>

      <Input
        placeholder="Task text"
        onChange={(e) => setText(e.target.value)}
        value={text}
      />

      <Select
        options={[
          { value: "high", label: "High" },
          { value: "medium", label: "Medium" },
          { value: "optional", label: "Optional" },
        ]}
        value={priority}
        placeholder="Select task priority"
        onChange={(value) => setPriority(value)}
        className="mt-2 relative z-[60]"
      />

      <Checkbox
        text="Create as a regular task"
        value={regular}
        onChange={(newValue) => setRegular(newValue)}
      />

      <AnimatePresence>
        {regular && (
          <motion.div
            initial={{ height: 0, opacity: 0, overflow: "hidden" }}
            animate={{ height: "auto", opacity: 1, transitionEnd: { overflow: "visible" } }}
            exit={{ height: 0, opacity: 0, overflow: "hidden" }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="w-full"
          >
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
                    onChange={(value) => setRepetition({ ...repetition, frequency: value })}
                  />
                </div>

                <div className="col-span-1 [&_input]:[appearance:textfield] [&_input::-webkit-outer-spin-button]:appearance-none [&_input::-webkit-inner-spin-button]:appearance-none">
                  <label className="text-xs text-gray-400 mb-1 block truncate">Every (x)</label>
                  <Input
                    type="number"
                    min={1}
                    placeholder="1"
                    value={repetition.interval}
                    onChange={(e) =>
                      setRepetition({ ...repetition, interval: Math.max(1, Number(e.target.value)) })
                    }
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
                    <p className="text-sm font-medium text-gray-400 mb-1.5 mt-1">
                      Repeat on
                    </p>
                    <div className="flex gap-1.5">
                      {WEEKDAYS.map(({ label, value }) => {
                        const active = repetition.daysOfWeek.includes(value);
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => toggleDayOfWeek(value)}
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
                    value={repetition.startDate ? repetition.startDate.toISOString().split("T")[0] : ""}
                    onChange={(e) =>
                      setRepetition({
                        ...repetition,
                        startDate: e.target.value ? new Date(e.target.value) : null,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 mb-1 block">End date</label>
                  <Input
                    type="date"
                    value={repetition.endDate ? repetition.endDate.toISOString().split("T")[0] : ""}
                    onChange={(e) =>
                      setRepetition({
                        ...repetition,
                        endDate: e.target.value ? new Date(e.target.value) : null,
                      })
                    }
                  />
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => createTask()}
        className="mt-4"
        disabled={!text || !priority}
      >
        Create task
      </Button>

      <AnimatePresence>
        {alert.shown && (
          <Alert type={alert.type} text={alert.text} onClose={closeAlert} />
        )}
      </AnimatePresence>
    </div>
  );
}