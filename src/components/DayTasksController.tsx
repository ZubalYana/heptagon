import { useState } from "react";
import type Task from "../interfaces/Task";
import Button from "./customElements/PrimaryButton";
import TaskCreation from "./popups/TaskCreation";
import Alert from "./customElements/Alert";
import { AnimatePresence } from "framer-motion";

interface dayTasksControllerProps {
  tasks: [Task] | [];
  day: string;
  dayId: string;
}

export default function DayTasksController({
  tasks,
  day,
  dayId
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
    <div className="w-full h-full flex flex-col justify-center items-center bg-[#121212] mt-4 rounded-lg">
      {tasks.length == 0 && (
        <>
          <p className="mb-4 text-[#ccc] text-[16px]">
            No tasks so far for this day.
          </p>
          <Button
            children="Create the first!"
            onClick={() => setTaskCreationMode(true)}
          />
        </>
      )}

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
