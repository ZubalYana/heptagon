import type Week from "../interfaces/Week";
import WeekDay from "./WeekDay";
import { motion, AnimatePresence } from "framer-motion";

interface WeekProps {
  week: Week | null;
  animationDirection: number;
}
export default function Week({ week, animationDirection }: WeekProps) {
  if (!week) {
    return <div>Loading your week...</div>;
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
        <div
          className="w-full flex flex-wrap gap-x-2 justify-between items-center 
          md:flex-row md:gap-x-0"
        >
          {week.days.map((day) => {
            const allTasks = day.tasks;
            let crucial = 0;
            let important = 0;
            let optional = 0;

            let completedCrucial = 0;
            let completedImportant = 0;
            let completedOptional = 0;
            const totalItems = allTasks.reduce(
              (acc, task) => acc + 1 + (task.subtasks?.length ?? 0),
              0
            );
            const completedItems = allTasks.reduce(
              (acc, task) =>
                acc +
                (task.completed ? 1 : 0) +
                (task.subtasks?.filter((s) => s.completed).length ?? 0),
              0
            );

            const totalItemsExeptOptional = allTasks.reduce(
              (acc, task) =>
                task.priority !== "optional"
                  ? acc + 1 + (task.subtasks?.length ?? 0)
                  : acc,
              0
            );

            allTasks.forEach((task) => {
              if (task.priority === "high") {
                crucial++;
                task.completed === true ? completedCrucial++ : completedCrucial;
              } else if (task.priority === "medium") {
                important++;
                task.completed === true
                  ? completedImportant++
                  : completedImportant;
              } else {
                optional++;
                task.completed === true
                  ? completedOptional++
                  : completedOptional;
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
                    ((completedItems - completedOptional) /
                      totalItemsExeptOptional) *
                      100
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
