import type Task from "../interfaces/Task";
import Button from "./customElements/PrimaryButton";

interface dayTasksControllerProps {
  tasks: [Task] | [];
}

export default function DayTasksController({ tasks }: dayTasksControllerProps) {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-[#121212] mt-4 rounded-lg">
      {tasks.length == 0 && (
        <>
          <p className="mb-4 text-[#ccc] text-[16px]">No tasks so far for this day.</p>
          <Button children="Create the first!" />
        </>
      )}
    </div>
  );
}
