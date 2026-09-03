import { motion } from "framer-motion";

interface CircularProgressbarProps {
  percentage: number;
  size?: "header" | "sm" | "md" | "lg";
}

const SIZE = {
  header: { box: 36, stroke: 3.5, text: "text-[9px]", glow: 6 },
  sm: { box: 56, stroke: 6, text: "text-[11px]", glow: 10 },
  md: { box: 90, stroke: 8, text: "text-[14px]", glow: 16 },
  lg: { box: 140, stroke: 10, text: "text-[22px]", glow: 16 },
};

export default function CircularProgressbar({
  percentage,
  size = "md",
}: CircularProgressbarProps) {
  const { box, stroke, text, glow } = SIZE[size];
  const shadowPadding = glow;
  const svgSize = box + shadowPadding * 2;
  const radius = (box - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const filterId = `glow-${Math.random().toString(36).slice(2)}`;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: box, height: box }}
    >
      <svg
        width={svgSize}
        height={svgSize}
        className="rotate-[-90deg] absolute"
      >
        <defs>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="#151515"
          stroke="#1a1a1a"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="transparent"
          stroke="#00FF26"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          filter={`url(#${filterId})`}
        />
      </svg>
      <span className={`absolute font-semibold text-white ${text}`}>
        {percentage}%
      </span>
    </div>
  );
}
