import { motion } from "framer-motion";

interface CircularProgressbarProps {
  percentage: number;
}

export default function CircularProgressbar({ percentage }: CircularProgressbarProps) {
  const size = 90;
  const strokeWidth = 8;
  const shadowPadding = 16; 
  const svgSize = size + shadowPadding * 2; 
  
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-[90px] h-[90px] flex items-center justify-center">
      <svg width={svgSize} height={svgSize} className="rotate-[-90deg] absolute">
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="#151515"
          stroke="#1a1a1a"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="transparent"
          stroke="#00FF26"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            filter: "drop-shadow(0 0 8px rgba(0,255,38,0.8))"
          }}
        />
      </svg>
      <span className="absolute text-[14px] font-semibold text-white">
        {percentage}%
      </span>
    </div>
  );
}