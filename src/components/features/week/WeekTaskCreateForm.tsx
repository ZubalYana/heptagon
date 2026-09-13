import { useState } from "react";
import Input from "../../ui/Input";
import Select from "../../ui/Select";
import Button from "../../ui/PrimaryButton";
import { X, Pencil, Trash2, Check, X as XIcon } from "lucide-react";
import type WeeklyTask from "../../../interfaces/WeeklyTask";
import type { WeeklyPriority } from "../../../interfaces/WeeklyTask";
import apiClient from "../../../helpers/apiClient";
import Alert from "../../ui/Alert";
import { AnimatePresence } from "framer-motion";

interface WeekTaskCreateFormProps {
  year: number;
  week: number;
  task?: WeeklyTask;
  onClose: () => void;
  onCreate?: (data: {
    title: string;
    priority: WeeklyPriority;
    targetCount: number;
  }) => Promise<void>;
  onSave?: (data: {
    title: string;
    priority: WeeklyPriority;
    targetCount: number;
  }) => Promise<void>;
  onTaskChange?: (task: WeeklyTask) => void;
}

export default function WeekTaskCreateForm({
  year,
  week,
  task,
  onClose,
  onCreate,
  onSave,
  onTaskChange,
}: WeekTaskCreateFormProps) {
  const isEdit = Boolean(task);
  const [title, setTitle] = useState(task?.title ?? "");
  const [priority, setPriority] = useState<string>(task?.priority ?? "");
  const [targetCount, setTargetCount] = useState(task?.targetCount ?? 1);
  const [subtasks, setSubtasks] = useState(task?.subtasks ?? []);
  const [saving, setSaving] = useState(false);
  const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);
  const [editingSubtaskText, setEditingSubtaskText] = useState("");
  const [alert, setAlert] = useState<{
    shown: boolean;
    type: "success" | "info" | "error";
    text: string;
  }>({ shown: false, type: "info", text: "" });

  const hasChanges =
    !isEdit ||
    title.trim() !== (task?.title ?? "").trim() ||
    priority !== (task?.priority ?? "") ||
    targetCount !== (task?.targetCount ?? 1);

  async function submit() {
    const trimmed = title.trim();
    if (saving || !trimmed || !priority) return;
    setSaving(true);
    try {
      const payload = {
        title: trimmed,
        priority: priority as WeeklyPriority,
        targetCount: Math.max(1, Math.floor(targetCount) || 1),
      };
      if (isEdit) await onSave?.(payload);
      else await onCreate?.(payload);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  function confirmEditSubtask(subtaskId: string) {
    if (!task || !editingSubtaskText.trim()) return;
    apiClient
      .patch(
        `/weeks/${year}/${week}/tasks/${task._id}/subtasks/${subtaskId}`,
        { text: editingSubtaskText.trim() }
      )
      .then(({ data }) => {
        setSubtasks(data.subtasks ?? []);
        onTaskChange?.(data);
        setEditingSubtaskId(null);
        setEditingSubtaskText("");
        setAlert({ shown: true, type: "success", text: "Subtask updated" });
      })
      .catch(() =>
        setAlert({ shown: true, type: "error", text: "Failed to update subtask" })
      );
  }

  function deleteSubtask(subtaskId: string) {
    if (!task) return;
    apiClient
      .delete(`/weeks/${year}/${week}/tasks/${task._id}/subtasks/${subtaskId}`)
      .then(({ data }) => {
        setSubtasks(data.subtasks ?? []);
        onTaskChange?.(data);
        setAlert({ shown: true, type: "success", text: "Subtask deleted" });
      })
      .catch(() =>
        setAlert({ shown: true, type: "error", text: "Failed to delete subtask" })
      );
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
        {isEdit ? "Edit weekly task" : "Create a weekly task"}
      </h3>

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

      {isEdit && subtasks.length > 0 && (
        <p className="w-full mt-4 font-semibold text-[14px]">Subtasks:</p>
      )}

      {isEdit &&
        subtasks.map((subtask) => (
          <div
            key={subtask._id}
            className="w-full p-2 lg:px-4 bg-[#1a1a1a] rounded-lg mt-2 flex justify-between items-center gap-x-2"
          >
            {editingSubtaskId === subtask._id ? (
              <>
                <input
                  className="bg-transparent border-b border-gray-500 focus:outline-none flex-1 text-white text-sm"
                  value={editingSubtaskText}
                  onChange={(e) => setEditingSubtaskText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") confirmEditSubtask(subtask._id);
                    if (e.key === "Escape") {
                      setEditingSubtaskId(null);
                      setEditingSubtaskText("");
                    }
                  }}
                  autoFocus
                />
                <Check
                  className="w-4 h-4 cursor-pointer hover:text-green-400 transition-colors"
                  onClick={() => confirmEditSubtask(subtask._id)}
                />
                <XIcon
                  className="w-4 h-4 cursor-pointer hover:text-red-400 transition-colors"
                  onClick={() => {
                    setEditingSubtaskId(null);
                    setEditingSubtaskText("");
                  }}
                />
              </>
            ) : (
              <>
                <p className="flex-1 text-sm">{subtask.text}</p>
                <Pencil
                  className="w-4 h-4 cursor-pointer hover:scale-[1.2] hover:text-blue-500 transition-all duration-300"
                  onClick={() => {
                    setEditingSubtaskId(subtask._id);
                    setEditingSubtaskText(subtask.text);
                  }}
                />
                <Trash2
                  className="w-4 h-4 cursor-pointer hover:scale-[1.2] hover:text-red-500 transition-all duration-300"
                  onClick={() => deleteSubtask(subtask._id)}
                />
              </>
            )}
          </div>
        ))}

      <Button
        onClick={submit}
        className="mt-4"
        disabled={
          saving || !title.trim() || !priority || (isEdit && !hasChanges)
        }
      >
        {saving
          ? isEdit
            ? "Saving..."
            : "Creating..."
          : isEdit
            ? "Confirm changes"
            : "Create task"}
      </Button>

      <AnimatePresence>
        {alert.shown && (
          <Alert
            type={alert.type}
            text={alert.text}
            onClose={() => setAlert((prev) => ({ ...prev, shown: false }))}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
