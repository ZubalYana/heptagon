import { useState } from "react";
import type Task from "../interfaces/Task";
import Button from "./customElements/PrimaryButton";
import TaskCreation from "./popups/TaskCreation";

interface dayTasksControllerProps {
  tasks: [Task] | [];
  day: string;
}

export default function DayTasksController({
  tasks,
  day,
}: dayTasksControllerProps) {
  const [taskCreationMode, setTaskCreationMode] = useState(false);
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
          <TaskCreation day={day} />
        </div>
      )}
    </div>
  );
}
