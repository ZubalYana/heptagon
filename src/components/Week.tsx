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
        <div className="w-full flex justify-between items-center">
          {week.days.map((day) => {
            const allTasks = day.tasks;
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
            const percentage =
              totalItems === 0
                ? 0
                : Math.round((completedItems / totalItems) * 100);

            return (
              <WeekDay
                day={day}
                percentage={percentage}
                key={day._id}
                allTasks={totalItems}
                completedTasks={completedItems}
              />
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
