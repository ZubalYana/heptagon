import { useState } from "react";
import type Task from "../interfaces/Task";
import Button from "./customElements/PrimaryButton";
import TaskCreation from "./popups/TaskCreation";
import Alert from "./customElements/Alert";
import { AnimatePresence } from "framer-motion";
import TaskComponent from "./customElements/Task";
import SecondaryButton from "./customElements/SecondaryButton";
import { Plus } from "lucide-react";

interface dayTasksControllerProps {
  tasks: [Task] | [];
  day: string;
  dayId: string;
}

export default function DayTasksController({
  tasks,
  day,
  dayId,
}: dayTasksControllerProps) {
  const [taskCreationMode, setTaskCreationMode] = useState(false);
  const [alert, setAlert] = useState<{
    shown: boolean;
    type: "success" | "info" | "error";
    text: string;
  }>({ shown: false, type: "info", text: "" });

  function closeAlert() {
    setAlert({ shown: false, text: "", type: "info" });
  }

  return (
    <div className="w-full h-full mt-4">
      <div className="flex gap-x-4 items-center">
        <h2 className="text-[18px]">Your tasks:</h2>
        <SecondaryButton onClick={() => setTaskCreationMode(true)}>
          <Plus size={16} />
          Create new task
        </SecondaryButton>
      </div>

      <div className="w-full h-[80%] flex flex-col bg-[#121212] mt-2 p-4 rounded-lg">
        {tasks.length == 0 && (
          <div>
            <p className="mb-4 text-[#ccc] text-[16px] w-full h-full flex flex-col justify-center items-center">
              No tasks so far for this day.
            </p>
            <Button
              children="Create the first!"
              onClick={() => setTaskCreationMode(true)}
            />
          </div>
        )}
        <div className="w-full">
          {tasks.map((task) => (
            <TaskComponent key={task._id} text={task.text} />
          ))}
        </div>
      </div>

      {taskCreationMode && (
        <div
          className="w-full h-full absolute top-0 left-0 flex justify-center items-center backdrop-blur-lg"
          onClick={() => setTaskCreationMode(false)}
        >
          <TaskCreation
            day={day}
            dayId={dayId}
            onClose={() => setTaskCreationMode(false)}
            onSuccess={() => {
              setTaskCreationMode(false);
              setAlert({
                shown: true,
                type: "success",
                text: "Task created successfully!",
              });
            }}
          />
        </div>
      )}
      <AnimatePresence>
        {alert.shown && (
          <Alert type={alert.type} text={alert.text} onClose={closeAlert} />
        )}
      </AnimatePresence>
    </div>
  );
}
