import { useState } from "react";
import Input from "../customElements/Input";
import Button from "../customElements/PrimaryButton";
import Select from "../customElements/Select";
import Alert from "../customElements/Alert";
import { AnimatePresence } from "framer-motion";
import { X, Pencil, Trash2 } from "lucide-react";
import type Task from "../../interfaces/Task";

interface TaskEditingProps {
  taskId: string;
  taskText: string;
  taskPriority: string;
  taskSubtasks?: Array<{ _id: string; text: string; completed: boolean }>;
  onClose?: () => void;
  onSuccess?: (task: Task) => void;
}

export default function TaskEditing({
  taskId,
  taskText,
  taskPriority,
  taskSubtasks,
  onClose,
  onSuccess,
}: TaskEditingProps) {
  const [newTaskText, setNewTaskText] = useState<string>(taskText);
  const [newTaskPriority, setNewTaskPriority] = useState<string>(taskPriority);

  const [alert, setAlert] = useState<{
    shown: boolean;
    type: "success" | "info" | "error";
    text: string;
  }>({ shown: false, type: "info", text: "" });

  function editTask() {
    try {
      const token = localStorage.getItem("token");
      fetch("http://localhost:5000/tasks/edit", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          id: taskId,
          text: newTaskText,
          priority: newTaskPriority,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          onSuccess?.(data.task);
        });
    } catch (err) {
      console.error("Error editing your task:", err);
    }
  }

  function closeAlert() {
    setAlert({ shown: false, text: "", type: "info" });
  }

  return (
    <div
      className="lg:w-[40%] bg-[#1F1F1F] rounded-md p-4 flex flex-col items-center relative"
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
      {taskSubtasks && (
        <p className="w-full mt-4 font-semibold text-[14px]">Subtasks:</p>
      )}
      {taskSubtasks?.map((subtask) => (
        <div
          className="w-full p-2 lg:px-4 bg-[#1a1a1a] rounded-lg mt-2 flex justify-between items-center"
          key={subtask._id}
        >
          <p>{subtask.text}</p>
          <div className="flex gap-x-2">
            <Pencil className="w-[18px] h-[16px] cursor-pointer hover:scale-[1.2] hover:text-blue-500 transition-all duration-300" />
            <Trash2 className="w-[18px] h-[16px] cursor-pointer hover:scale-[1.2] hover:text-red-500 transition-all duration-300" />
          </div>
        </div>
      ))}
      <Button
        onClick={() => editTask()}
        children="Confirm changes"
        className="mt-6"
      />
      <AnimatePresence>
        {alert.shown && (
          <Alert type={alert.type} text={alert.text} onClose={closeAlert} />
        )}
      </AnimatePresence>
    </div>
  );
}
