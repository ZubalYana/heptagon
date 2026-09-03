import { useState } from "react";
import Input from "../../ui/Input";
import Select from "../../ui/Select";
import Button from "../../ui/PrimaryButton";
import type { WeeklyPriority } from "../../../interfaces/WeeklyTask";

interface WeekTaskCreateFormProps {
  onCreate: (data: {
    title: string;
    priority: WeeklyPriority;
    targetCount: number;
  }) => Promise<void>;
}

export default function WeekTaskCreateForm({
  onCreate,
}: WeekTaskCreateFormProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<WeeklyPriority>("important");
  const [targetCount, setTargetCount] = useState(1);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    setLoading(true);
    try {
      await onCreate({
        title: trimmed,
        priority,
        targetCount: Math.max(1, Math.floor(targetCount) || 1),
      });
      setTitle("");
      setTargetCount(1);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full mt-4 flex flex-col gap-3 lg:flex-row lg:items-end"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Weekly task"
      />
      <Select
        label="Priority"
        value={priority}
        onChange={(value) => setPriority(value as WeeklyPriority)}
        options={[
          { label: "Crucial", value: "crucial" },
          { label: "Important", value: "important" },
          { label: "Optional", value: "optional" },
        ]}
        className="lg:max-w-[200px]"
      />
      <Input
        label="Target"
        type="number"
        min={1}
        value={targetCount}
        onChange={(e) => setTargetCount(Number(e.target.value))}
        className="lg:max-w-[120px]"
      />
      <Button type="submit" loading={loading} disabled={!title.trim()}>
        Add
      </Button>
    </form>
  );
}
