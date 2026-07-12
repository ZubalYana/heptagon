import { useState } from "react";
import Input from "../customElements/Input";
import Button from "../customElements/PrimaryButton";
import Select from "../customElements/Select";
import Alert from "../customElements/Alert";
import { AnimatePresence } from "framer-motion";
import { X, Pencil, Trash2, Check, X as XIcon } from "lucide-react";
import type Task from "../../interfaces/Task";
import apiClient from "../../helpers/apiClient";

interface TaskEditingProps {
  editingTask: Task;
  onClose?: () => void;
  onSuccess?: (task: Task) => void;
  onSubtaskChange?: (taskId: string, subtasks: Array<{ _id: string; text: string; completed: boolean }>) => void;
}

export default function TaskEditing({
  editingTask,
  onClose,
  onSuccess,
  onSubtaskChange,
}: TaskEditingProps) {
  const [newTaskText, setNewTaskText] = useState(editingTask.text);
  const [newTaskPriority, setNewTaskPriority] = useState(editingTask.priority);
  const [subtasks, setSubtasks] = useState(editingTask.subtasks ?? []);

  const hasChanges =
    newTaskText.trim() !== editingTask.text.trim() ||
    newTaskPriority !== editingTask.priority;

  const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);
  const [editingSubtaskText, setEditingSubtaskText] = useState("");

  const [alert, setAlert] = useState<{
    shown: boolean;
    type: "success" | "info" | "error";
    text: string;
  }>({ shown: false, type: "info", text: "" });

  function showAlert(type: "success" | "error", text: string) {
    setAlert({ shown: true, type, text });
  }

  function closeAlert() {
    setAlert({ shown: false, text: "", type: "info" });
  }

  function editTask() {
    apiClient
      .patch("/tasks/edit", {
        id: editingTask._id,
        text: newTaskText,
        priority: newTaskPriority,
      })
      .then(({ data }) => onSuccess?.(data.task))
      .catch(() => showAlert("error", "Failed to edit task"));
  }

  function startEditingSubtask(id: string, currentText: string) {
    setEditingSubtaskId(id);
    setEditingSubtaskText(currentText);
  }

  function cancelEditingSubtask() {
    setEditingSubtaskId(null);
    setEditingSubtaskText("");
  }

  function confirmEditSubtask(subtaskId: string) {
    apiClient
      .patch("/tasks/edit-subtask", {
        taskId: editingTask._id,
        subtaskId,
        newText: editingSubtaskText,
      })
      .then(() => {
        const updated = subtasks.map((s) =>
          s._id === subtaskId ? { ...s, text: editingSubtaskText } : s
        );
        setSubtasks(updated);
        onSubtaskChange?.(editingTask._id, updated);
        cancelEditingSubtask();
        showAlert("success", "Subtask updated");
      })
      .catch(() => showAlert("error", "Failed to update subtask"));
  }

  function deleteSubtask(subtaskId: string) {
    apiClient
      .delete("/tasks/delete-subtask", { data: { taskId: editingTask._id, subtaskId } })
      .then(() => {
        const updated = subtasks.filter((s) => s._id !== subtaskId);
        setSubtasks(updated);
        onSubtaskChange?.(editingTask._id, updated);
        showAlert("success", "Subtask deleted");
      })
      .catch(() => showAlert("error", "Failed to delete subtask"));
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
      <h3 className="text-[20px] font-medium mb-4">Edit task</h3>

      <Input
        placeholder="Task text"
        onChange={(e) => setNewTaskText(e.target.value)}
        value={newTaskText}
      />
      <Select
        options={[
          { value: "high", label: "High" },
          { value: "medium", label: "Medium" },
          { value: "optional", label: "Optional" },
        ]}
        value={newTaskPriority}
        placeholder="Select task priority"
        onChange={(value) => setNewTaskPriority(value)}
        className="mt-2"
      />

      {}

      {subtasks.length > 0 && (
        <p className="w-full mt-4 font-semibold text-[14px]">Subtasks:</p>
      )}

      {subtasks.map((subtask) => (
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
                  if (e.key === "Escape") cancelEditingSubtask();
                }}
                autoFocus
              />
              <Check
                className="w-[16px] h-[16px] cursor-pointer hover:text-green-400 transition-colors"
                onClick={() => confirmEditSubtask(subtask._id)}
              />
              <XIcon
                className="w-[16px] h-[16px] cursor-pointer hover:text-red-400 transition-colors"
                onClick={cancelEditingSubtask}
              />
            </>
          ) : (
            <>
              <p className="flex-1 text-sm">{subtask.text}</p>
              <Pencil
                className="w-[16px] h-[16px] cursor-pointer hover:scale-[1.2] hover:text-blue-500 transition-all duration-300"
                onClick={() => startEditingSubtask(subtask._id, subtask.text)}
              />
              <Trash2
                className="w-[16px] h-[16px] cursor-pointer hover:scale-[1.2] hover:text-red-500 transition-all duration-300"
                onClick={() => deleteSubtask(subtask._id)}
              />
            </>
          )}
        </div>
      ))}

      <Button onClick={editTask} disabled={!hasChanges} className="mt-6">
        Confirm changes
      </Button>

      <AnimatePresence>
        {alert.shown && (
          <Alert type={alert.type} text={alert.text} onClose={closeAlert} />
        )}
      </AnimatePresence>
    </div>
  );
}