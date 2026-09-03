import { useEffect, useState } from "react";
import apiClient from "../../../helpers/apiClient";
import type WeeklyTask from "../../../interfaces/WeeklyTask";
import type { WeeklyPriority } from "../../../interfaces/WeeklyTask";
import CircularProgressbar from "../../ui/CircularProgressbar";
import WeekTaskRow from "./WeekTaskRow";
import WeekTaskCreateForm from "./WeekTaskCreateForm";
import Loader from "../../ui/Loader";
import Button from "../../ui/PrimaryButton";
import SecondaryButton from "../../ui/SecondaryButton";
import { Plus } from "lucide-react";
import { progressPercent, type WeekProgress } from "../../../helpers/weekProgress";

interface WeekTasksViewProps {
  year: number;
  week: number;
  progress: WeekProgress;
  onProgressChange: () => void;
}

const GROUPS: { key: WeeklyPriority; label: string; className: string }[] = [
  { key: "crucial", label: "Crucial:", className: "text-red-500" },
  { key: "important", label: "Important:", className: "text-orange-500" },
  { key: "optional", label: "Optional:", className: "text-blue-500" },
];

export default function WeekTasksView({
  year,
  week,
  progress,
  onProgressChange,
}: WeekTasksViewProps) {
  const [tasks, setTasks] = useState<WeeklyTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    setLoading(true);
    apiClient
      .get(`/weeks/${year}/${week}/tasks`)
      .then(({ data }) => setTasks(data))
      .finally(() => setLoading(false));
  }, [year, week]);

  function replaceTask(updated: WeeklyTask) {
    setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
    onProgressChange();
  }

  async function onDelta(id: string, delta: 1 | -1) {
    const { data } = await apiClient.patch(
      `/weeks/${year}/${week}/tasks/${id}/count`,
      { delta }
    );
    replaceTask(data);
  }

  async function onDelete(id: string) {
    await apiClient.delete(`/weeks/${year}/${week}/tasks/${id}`);
    setTasks((prev) => prev.filter((t) => t._id !== id));
    onProgressChange();
  }

  async function onCreate(payload: {
    title: string;
    priority: WeeklyPriority;
    targetCount: number;
  }) {
    const { data } = await apiClient.post(
      `/weeks/${year}/${week}/tasks`,
      payload
    );
    setTasks((prev) => [...prev, data]);
    onProgressChange();
  }

  if (loading) {
    return (
      <div className="w-full flex justify-center py-16">
        <Loader size="lg" label="Loading weekly tasks..." />
      </div>
    );
  }

  const remaining = Math.max(0, progress.total - progress.completed);

  return (
    <>
    <div
      className="w-full flex flex-col lg:flex-row lg:items-stretch gap-6"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="w-full lg:flex-1 flex flex-col min-h-0">
        <div className="flex gap-x-4 items-center mb-2">
          <h2 className="text-[18px]">Your weekly tasks:</h2>
          <SecondaryButton onClick={() => setCreating(true)}>
            <Plus size={16} />
            Create new task
          </SecondaryButton>
        </div>
        <div className="w-full flex-1 flex flex-col bg-[#121212] p-4 rounded-lg min-h-0">
        {tasks.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-8">
            <p className="mb-4 text-[#ccc] text-[16px]">
              No weekly tasks for this week.
            </p>
            <Button onClick={() => setCreating(true)}>Create the first!</Button>
          </div>
        ) : (
          <div className="w-full flex flex-col md:flex-row md:gap-6 gap-4">
            {GROUPS.map((group) => (
              <div key={group.key} className="flex-1 w-full flex flex-col min-w-0">
                <h3 className={`lg:text-[16px] font-medium mb-2 ${group.className}`}>
                  {group.label}
                </h3>
                {tasks
                  .filter((task) => task.priority === group.key)
                  .map((task) => (
                    <WeekTaskRow
                      key={task._id}
                      task={task}
                      onDelta={(delta) => onDelta(task._id, delta)}
                      onDelete={() => onDelete(task._id)}
                    />
                  ))}
              </div>
            ))}
          </div>
        )}
        </div>
      </div>

      <div className="w-full lg:w-[280px] shrink-0 flex flex-col items-center justify-center gap-4 bg-[#121212] rounded-lg p-6">
        <CircularProgressbar
          percentage={progressPercent(progress)}
          size="lg"
        />
        <div className="w-full flex flex-col gap-2 text-[13px] text-[#ccc]">
          <div className="flex justify-between">
            <span className="text-[#888]">Completed</span>
            <span className="text-white">{progress.completed}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#888]">Remaining</span>
            <span className="text-white">{remaining}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#888]">Total</span>
            <span className="text-white">{progress.total}</span>
          </div>
        </div>
      </div>
    </div>
    {creating && (
      <div
        className="w-full h-full fixed inset-0 flex justify-center items-center backdrop-blur-lg z-[9999]"
        onClick={() => setCreating(false)}
      >
        <WeekTaskCreateForm
          onClose={() => setCreating(false)}
          onCreate={onCreate}
        />
      </div>
    )}
    </>
  );
}
