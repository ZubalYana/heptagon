import { useState } from "react";
import Input from "../../ui/Input";
import Select from "../../ui/Select";
import TextArea from "../../ui/TextArea";
import Button from "../../ui/PrimaryButton";
import { X } from "lucide-react";
import type Goal from "../../../interfaces/Goal";
import type { GoalPayload, GoalUnit } from "../../../interfaces/Goal";
import { GOAL_UNIT_OPTIONS } from "../../../interfaces/Goal";

interface GoalCreateFormProps {
  goal?: Goal;
  onClose: () => void;
  onSave: (data: GoalPayload) => Promise<void>;
}

function toDateInput(value?: string) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

export default function GoalCreateForm({
  goal,
  onClose,
  onSave,
}: GoalCreateFormProps) {
  const isEdit = Boolean(goal);
  const [name, setName] = useState(goal?.name ?? "");
  const [description, setDescription] = useState(goal?.description ?? "");
  const [targetValue, setTargetValue] = useState(goal?.targetValue ?? 1);
  const [unit, setUnit] = useState<string>(goal?.unit ?? "");
  const [deadline, setDeadline] = useState(toDateInput(goal?.deadline));
  const [saving, setSaving] = useState(false);

  async function save() {
    const trimmed = name.trim();
    if (saving || !trimmed || !deadline) return;
    setSaving(true);
    try {
      await onSave({
        name: trimmed,
        description: description.trim() || undefined,
        targetValue: Math.max(1, Number(targetValue) || 1),
        unit: (unit as GoalUnit) || "",
        deadline,
      });
      onClose();
    } finally {
      setSaving(false);
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
      <h3 className="text-[20px] font-medium mb-4">
        {isEdit ? "Edit goal" : "Create a goal"}
      </h3>

      <Input
        placeholder="Goal name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="w-full mt-3">
        <TextArea
          placeholder="Description (optional)"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="w-full mt-3 flex flex-col gap-1.5 font-sans">
        <label
          htmlFor="goal-target"
          className="text-xs font-medium transition-colors duration-300 text-gray-400"
        >
          Target
        </label>
        <Input
          id="goal-target"
          type="number"
          min={1}
          value={targetValue}
          onChange={(e) => setTargetValue(Number(e.target.value))}
        />
      </div>

      <Select
        options={GOAL_UNIT_OPTIONS}
        value={unit}
        placeholder="Select unit (optional)"
        onChange={(value) => setUnit(value)}
        className="mt-2"
      />

      <div className="w-full mt-3 flex flex-col gap-1.5 font-sans">
        <label
          htmlFor="goal-deadline"
          className="text-xs font-medium transition-colors duration-300 text-gray-400"
        >
          Deadline
        </label>
        <Input
          id="goal-deadline"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
      </div>

      <Button
        onClick={save}
        className="mt-4"
        disabled={saving || !name.trim() || !deadline}
      >
        {saving ? (isEdit ? "Saving..." : "Creating...") : isEdit ? "Save" : "Create goal"}
      </Button>
    </div>
  );
}
