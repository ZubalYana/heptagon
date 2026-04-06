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
          {week.days.map((day) => (
            <WeekDay
              day={day}
              percentage={0}
              key={day._id}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
