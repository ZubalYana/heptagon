import { useRef, useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/PrimaryButton";
import Select from "../ui/Select";
import Alert from "../ui/Alert";
import { AnimatePresence } from "framer-motion";
import RepetitionFields from "../features/tasks/RepetitionFields";
import { X } from "lucide-react";
import type Task from "../../interfaces/Task";
import apiClient from "../../helpers/apiClient";
import Checkbox from "../ui/Checkbox";
import type { Repetition } from "../../interfaces/Task";
import { todayCalendarDate } from "../../helpers/calendarDate";

interface TaskCreationProps {
  day: string;
  dayId: string;
  onClose?: () => void;
  onSuccess?: (task: Task) => void;
}

export default function TaskCreation({
  day,
  dayId,
  onClose,
  onSuccess,
}: TaskCreationProps) {
  const [text, setText] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  const [regular, setRegular] = useState<boolean>(false);
  const [repetition, setRepetition] = useState<Repetition>({
    frequency: 'daily',
    interval: 1,
    daysOfWeek: [],
    dayOfMonth: null,
    monthOfYear: null,
    startDate: todayCalendarDate(),
    endDate: null
  });
  const [alert, setAlert] = useState<{
    shown: boolean;
    type: "success" | "info" | "error";
    text: string;
  }>({ shown: false, type: "info", text: "" });
  const [isCreating, setIsCreating] = useState(false);
  const creationInProgress = useRef(false);

  function createTask() {
    if (creationInProgress.current || !text || !priority) {
      if (!text || !priority) {
        setAlert({
          shown: true,
          type: "info",
          text: "Text and priority are required.",
        });
      }
      return;
    }

    creationInProgress.current = true;
    setIsCreating(true);

    const payload = regular
      ? { text, priority, dayId, regular, ...repetition }
      : { text, priority, dayId };

    apiClient
      .post("/tasks/create", payload)
      .then(({ data }) => {
        onSuccess?.(data);
      })
      .catch((err) => {
        console.error("Error creating task:", err);
        setAlert({
          shown: true,
          type: "error",
          text: err.response?.data?.message || "Error creating task",
        });
      })
      .finally(() => {
        creationInProgress.current = false;
        setIsCreating(false);
      });
  }

  function closeAlert() {
    setAlert({ shown: false, text: "", type: "info" });
  }

  return (
    <div
      className="w-[90%] lg:w-[40%] max-h-[90vh] overflow-y-auto bg-[#1F1F1F] rounded-md p-4 flex flex-col items-center relative"
      onClick={(e) => e.stopPropagation()}
    >
      <X
        className="w-4.5 h-4.5 absolute top-4 right-4 cursor-pointer"
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
        className="mt-2"
      />

      <Checkbox
        text="Create as a regular task"
        value={regular}
        onChange={(newValue) => setRegular(newValue)}
      />

      <AnimatePresence>
        {regular && (
          <RepetitionFields
  value={repetition}
  onChange={setRepetition}
/>
        )}
      </AnimatePresence>

      <Button
        onClick={createTask}
        className="mt-4"
        disabled={isCreating || !text || !priority}
      >
        {isCreating ? "Creating..." : "Create task"}
      </Button>

      <AnimatePresence>
        {alert.shown && (
          <Alert type={alert.type} text={alert.text} onClose={closeAlert} />
        )}
      </AnimatePresence>
    </div>
  );
}