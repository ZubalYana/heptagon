import { useState } from "react";
import Input from "../customElements/Input";
import Button from "../customElements/PrimaryButton";
import Select from "../customElements/Select";
import Alert from "../customElements/Alert";
import { AnimatePresence } from "framer-motion";

interface TaskCreationProps {
  day: string;
}

export default function TaskCreation({ day }: TaskCreationProps) {
  const [text, setText] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  const [alert, setAlert] = useState<{
    shown: boolean;
    type: "success" | "info" | "error";
    text: string;
  }>({ shown: false, type: "info", text: "" });

  function createTask() {
    try {
      const token = localStorage.getItem("token");
      if (!text && !priority) {
        setAlert({
          shown: true,
          type: "info",
          text: "Text and priority are required.",
        });
        return;
      }
      fetch("http://localhost:5000/tasks/", {
        method: "POST",
        headers: {
          Authorization: `Bearer: ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, priority }),
      }).then((res) => {
        console.log(res);
        if (!res.ok) {
          setAlert({
            shown: true,
            type: "error",
            text: "Server failed to create task.",
          });
          return;
        }
        setAlert({
          shown: true,
          type: "success",
          text: "Task created successfully!",
        });
      });
    } catch (err) {
      console.error("Error creating task:", err);
      setAlert({ shown: true, type: "error", text: "Error creating task" });
    }
  }

  function closeAlert() {
    setAlert({ shown: false, text: "", type: "info" });
  }

  return (
    <div
      className="lg:w-[40%] bg-[#1F1F1F] rounded-md p-4 flex flex-col items-center"
      onClick={(e) => e.stopPropagation()}
    >
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
      <Button
        onClick={() => createTask()}
        children="Create task"
        className="mt-4"
      />

      <AnimatePresence>
        {alert.shown && (
          <Alert type={alert.type} text={alert.text} onClose={closeAlert} />
        )}
      </AnimatePresence>
    </div>
  );
}
