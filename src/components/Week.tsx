import { useState, useEffect } from 'react';
import apiClient from '../helpers/apiClient';
import type Task from '../interfaces/Task';
import type Week from "../interfaces/Week";
import Loader from "./customElements/Loader";
import WeekDay from "./WeekDay";
import { motion, AnimatePresence } from "framer-motion";

interface WeekProps {
  week: Week | null;
  animationDirection: number;
}

export default function Week({ week, animationDirection }: WeekProps) {
  const [tasksByDay, setTasksByDay] = useState<Record<string, Task[]>>({});

  useEffect(() => {
    if (!week) return;

    Promise.all(
      week.days.map((day) =>
        apiClient.get(`/tasks/dayTasks/${day._id}`).then(({ data }) => ({
          dayId: day._id,
          tasks: data as Task[],
        }))
      )
    )
      .then((results) => {
        const grouped: Record<string, Task[]> = {};
        results.forEach(({ dayId, tasks }) => {
          grouped[dayId] = tasks;
        });
        setTasksByDay(grouped);
      })
      .catch((err) => {
        console.error('Error fetching tasks in week:', err);
      });
  }, [week]);

  if (!week) {
    return (
      <div className="w-full h-full flex items-center justify-center absolute top-0 left-0">
        <Loader size="lg" label="Loading week..." />
      </div>
    );
  }

  const optionalIncluded = localStorage.getItem("optionalIncluded") === "true";

  return (
    <AnimatePresence mode="wait" custom={animationDirection}>
      <motion.div
        key={week._id}
        custom={animationDirection}
        initial={{ x: animationDirection * 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: animationDirection * -100, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-full"
      >
        <div className="w-full flex flex-wrap gap-x-2 justify-between items-center md:flex-row md:gap-x-0">
          {week.days.map((day) => {
            const dayTasks = tasksByDay[day._id] ?? [];

            let crucial = 0;
            let important = 0;
            let optional = 0;
            let completedCrucial = 0;
            let completedImportant = 0;
            let completedOptional = 0;

            const totalItems = dayTasks.reduce(
              (acc, task) => acc + 1 + (task.subtasks?.length ?? 0),
              0
            );
            const completedItems = dayTasks.reduce(
              (acc, task) =>
                acc +
                (task.completed ? 1 : 0) +
                (task.subtasks?.filter((s) => s.completed).length ?? 0),
              0
            );
            const totalItemsExeptOptional = dayTasks.reduce(
              (acc, task) =>
                task.priority !== "optional"
                  ? acc + 1 + (task.subtasks?.length ?? 0)
                  : acc,
              0
            );

            dayTasks.forEach((task) => {
              if (task.priority === "high") {
                crucial++;
                if (task.completed) completedCrucial++;
              } else if (task.priority === "medium") {
                important++;
                if (task.completed) completedImportant++;
              } else {
                optional++;
                if (task.completed) completedOptional++;
              }
            });

            const percentage =
              totalItems === 0
                ? 0
                : optionalIncluded
                ? Math.round((completedItems / totalItems) * 100)
                : totalItemsExeptOptional === 0
                ? 0
                : Math.round(
                    ((completedItems - completedOptional) / totalItemsExeptOptional) * 100
                  );

            return (
              <WeekDay
                day={day}
                percentage={percentage}
                key={day._id}
                allTasks={totalItems}
                completedTasks={completedItems}
                crucial={crucial}
                crucialCompleted={completedCrucial}
                important={important}
                importantCompleted={completedImportant}
                optional={optional}
                optionalCompleted={completedOptional}
              />
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}