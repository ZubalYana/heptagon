import { useState } from "react";
import type Task from "../interfaces/Task";
import Button from "./customElements/PrimaryButton";
import TaskCreation from "./popups/TaskCreation";
import TaskEditing from "./popups/TaskEditing";
import Alert from "./customElements/Alert";
import { AnimatePresence } from "framer-motion";
import TaskComponent from "./customElements/Task";
import SecondaryButton from "./customElements/SecondaryButton";
import { Plus } from "lucide-react";
import apiClient from "../helpers/apiClient";

interface dayTasksControllerProps {
  tasks: Task[] | [];
  day: string;
  dayId: string;
}

export default function DayTasksController({
  tasks,
  day,
  dayId,
}: dayTasksControllerProps) {
  const [taskCreationMode, setTaskCreationMode] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [alert, setAlert] = useState<{
    shown: boolean;
    type: "success" | "info" | "error";
    text: string;
  }>({ shown: false, type: "info", text: "" });
  const [localTasks, setLocalTasks] = useState(tasks);

  function closeAlert() {
    setAlert({ shown: false, text: "", type: "info" });
  }

  function onToggle(id: string) {
    apiClient.put("/tasks/complete", { id }).then(({ data }) => {
      setLocalTasks((prev) =>
        prev.map((task) =>
          task._id === id
            ? {
                ...task,
                completed: data.task.completed,
                subtasks: data.task.subtasks,
              }
            : task
        )
      );
    });
  }

  function onToggleSubtask(taskId: string, subtaskId: string) {
    apiClient
      .patch("/tasks/complete-subtask", { taskId, subtaskId })
      .then(({ data }) => {
        setLocalTasks((prev) =>
          prev.map((task) => (task._id === taskId ? data.task : task))
        );
      });
  }

  function onDelete(id: string) {
    apiClient
      .delete("/tasks/delete", { data: { id } })
      .then(() => {
        setLocalTasks((prev) => prev.filter((t) => t._id !== id));
        setAlert({
          shown: true,
          type: "success",
          text: "Task deleted successfully",
        });
      })
      .catch((err) => {
        console.error("Error deleting task:", err);
        setAlert({ shown: true, type: "error", text: "Error deleting task" });
      });
  }

  function onAddSubtask(id: string, text: string) {
    apiClient
      .patch("/tasks/add-subtask", { id, text })
      .then(({ data }) => {
        setLocalTasks((prev) =>
          prev.map((task) => (task._id === id ? data.task : task))
        );
        setAlert({ shown: true, type: "success", text: "Subtask added!" });
      })
      .catch((err) => {
        console.error("Error adding subtask:", err);
        setAlert({ shown: true, type: "error", text: "Error adding subtask" });
      });
  }

  if (localTasks.length == 0) {
  }
  return (
    <div className="w-full h-full">
      <div className="flex gap-x-4 items-center">
        <h2 className="text-[18px]">Your tasks:</h2>
        <SecondaryButton onClick={() => setTaskCreationMode(true)}>
          <Plus size={16} />
          Create new task
        </SecondaryButton>
      </div>

      <div className="w-full min-h-[90%] flex flex-col bg-[#121212] mt-2 p-4 rounded-lg">
        {localTasks.length == 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <p className="mb-4 text-[#ccc] text-[16px]">
              No tasks so far for this day.
            </p>
            <Button
              children="Create the first!"
              onClick={() => setTaskCreationMode(true)}
            />
          </div>
        ) : (
          <div className="w-full flex flex-col lg:flex-row lg:gap-6 gap-4">
            <div className="flex-1 w-full flex flex-col">
              <h3 className="lg:text-[16px] font-medium text-red-500 mb-2">
                Crucial:
              </h3>
              {localTasks
                .filter((task) => task.priority === "high")
                .map((task) => (
                  <TaskComponent
                    key={task._id}
                    text={task.text}
                    done={task.completed}
                    subtasks={task.subtasks}
                    onToggle={() => onToggle(task._id)}
                    onEdit={() => setEditingTask(task)}
                    onDelete={() => onDelete(task._id)}
                    onSubmitSubtask={(subtaskText) =>
                      onAddSubtask(task._id, subtaskText)
                    }
                    onToggleSubtask={(subtaskId) =>
                      onToggleSubtask(task._id, subtaskId)
                    }
                  />
                ))}
            </div>
            <div className="flex-1 w-full flex flex-col">
              <h3 className="lg:text-[16px] font-medium text-orange-500 mb-2">
                Important:
              </h3>
              {localTasks
                .filter((task) => task.priority === "medium")
                .map((task) => (
                  <TaskComponent
                    key={task._id}
                    text={task.text}
                    done={task.completed}
                    subtasks={task.subtasks}
                    onToggle={() => onToggle(task._id)}
                    onEdit={() => setEditingTask(task)}
                    onDelete={() => onDelete(task._id)}
                    onSubmitSubtask={(subtaskText) =>
                      onAddSubtask(task._id, subtaskText)
                    }
                    onToggleSubtask={(subtaskId) =>
                      onToggleSubtask(task._id, subtaskId)
                    }
                  />
                ))}
            </div>
            <div className="flex-1 w-full flex flex-col">
              <h3 className="lg:text-[16px] font-medium text-blue-500 mb-2">
                Optional:
              </h3>
              {localTasks
                .filter((task) => task.priority === "optional")
                .map((task) => (
                  <TaskComponent
                    key={task._id}
                    text={task.text}
                    done={task.completed}
                    subtasks={task.subtasks}
                    onToggle={() => onToggle(task._id)}
                    onEdit={() => setEditingTask(task)}
                    onDelete={() => onDelete(task._id)}
                    onSubmitSubtask={(subtaskText) =>
                      onAddSubtask(task._id, subtaskText)
                    }
                    onToggleSubtask={(subtaskId) =>
                      onToggleSubtask(task._id, subtaskId)
                    }
                  />
                ))}
            </div>
          </div>
        )}
      </div>

      {taskCreationMode && (
        <div
          className="w-full h-full absolute top-0 left-0 flex justify-center items-center backdrop-blur-lg z-9999"
          onClick={() => setTaskCreationMode(false)}
        >
          <TaskCreation
            day={day}
            dayId={dayId}
            onClose={() => setTaskCreationMode(false)}
            onSuccess={(newTask) => {
              setTaskCreationMode(false);
              setLocalTasks((prev) => [...prev, newTask]);
              setAlert({
                shown: true,
                type: "success",
                text: "Task created successfully!",
              });
            }}
          />
        </div>
      )}
      {editingTask && (
        <div
          className="w-full h-full absolute top-0 left-0 flex justify-center items-center backdrop-blur-lg z-9999"
          onClick={() => setEditingTask(null)}
        >
          <TaskEditing
            taskId={editingTask._id}
            taskText={editingTask.text}
            taskPriority={editingTask.priority}
            taskSubtasks={editingTask.subtasks}
            onClose={() => setEditingTask(null)}
            onSubtaskChange={(taskId, updatedSubtasks) => {
              setLocalTasks((prev) =>
                prev.map((t) =>
                  t._id === taskId ? { ...t, subtasks: updatedSubtasks } : t
                )
              );
            }}
            onSuccess={(updatedTask) => {
              setLocalTasks((prev) =>
                prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
              );
              setEditingTask(null);
              setAlert({ shown: true, type: "success", text: "Task updated!" });
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
