import { motion } from "framer-motion";

interface LinearProgressbarProps {
  percentage: number;
}

export default function LinearProgressbar({
  percentage,
}: LinearProgressbarProps) {
  const clamped = Math.min(100, Math.max(0, percentage));

  return (
    <div
      className="w-full h-[5px] rounded-full bg-[#1a1a1a] overflow-hidden"
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className="h-full rounded-full bg-[#00FF26]"
        style={{
          boxShadow: clamped > 0 ? "0 0 8px rgba(0,255,38,0.55)" : "none",
        }}
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
    </div>
  );
}
