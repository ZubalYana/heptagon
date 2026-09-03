import { useState } from "react";
import Input from "../../ui/Input";
import Select from "../../ui/Select";
import Button from "../../ui/PrimaryButton";
import { X } from "lucide-react";
import type { WeeklyPriority } from "../../../interfaces/WeeklyTask";

interface WeekTaskCreateFormProps {
  onClose: () => void;
  onCreate: (data: {
    title: string;
    priority: WeeklyPriority;
    targetCount: number;
  }) => Promise<void>;
}

export default function WeekTaskCreateForm({
  onClose,
  onCreate,
}: WeekTaskCreateFormProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<string>("");
  const [targetCount, setTargetCount] = useState(1);
  const [isCreating, setIsCreating] = useState(false);

  async function createTask() {
    const trimmed = title.trim();
    if (isCreating || !trimmed || !priority) return;
    setIsCreating(true);
    try {
      await onCreate({
        title: trimmed,
        priority: priority as WeeklyPriority,
        targetCount: Math.max(1, Math.floor(targetCount) || 1),
      });
      onClose();
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div
      className="w-[90%] lg:w-[40%] max-h-[90vh] overflow-y-auto bg-[#1F1F1F] rounded-md p-4 flex flex-col items-center relative"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <X
        className="w-4.5 h-4.5 absolute top-4 right-4 cursor-pointer"
        onClick={onClose}
      />
      <h3 className="text-[20px] font-medium mb-4">Create a weekly task</h3>

      <Input
        placeholder="Task title"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      />

      <Select
        options={[
          { value: "crucial", label: "Crucial" },
          { value: "important", label: "Important" },
          { value: "optional", label: "Optional" },
        ]}
        value={priority}
        placeholder="Select task priority"
        onChange={(value) => setPriority(value)}
        className="mt-2"
      />

      <div className="w-full mt-3 flex flex-col gap-1.5 font-sans">
        <label
          htmlFor="weekly-task-target"
          className="text-xs font-medium transition-colors duration-300 text-gray-400"
        >
          Target
        </label>
        <Input
          id="weekly-task-target"
          type="number"
          min={1}
          value={targetCount}
          onChange={(e) => setTargetCount(Number(e.target.value))}
        />
      </div>

      <Button
        onClick={createTask}
        className="mt-4"
        disabled={isCreating || !title.trim() || !priority}
      >
        {isCreating ? "Creating..." : "Create task"}
      </Button>
    </div>
  );
}
