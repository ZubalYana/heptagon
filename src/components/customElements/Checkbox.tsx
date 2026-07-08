import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CheckboxProps {
  text: string;
  value: boolean;
  onChange: (checked: boolean) => void;
}

export default function Checkbox({ text, value, onChange }: CheckboxProps) {
  return (
    <div
      className="flex items-center gap-x-2.5 w-full justify-start mt-3 cursor-pointer group select-none"
      onClick={() => onChange(!value)}
    >
      <div
        className={`
          w-[16px] h-[16px] rounded-[4px] border flex items-center justify-center
          transition-all duration-200 ease-in-out
          ${value
            ? "bg-[#00FF26] border-[#00FF26] shadow-[0_0_8px_rgba(0,255,38,0.35)]"
            : "bg-transparent border-[#555555] group-hover:border-gray-300"}
        `}
      >
        <AnimatePresence>
          {value && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <Check size={11} strokeWidth={3} className="text-[#121212]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p className="text-[#ccc] text-[14px] transition-colors duration-200 group-hover:text-white">
        {text}
      </p>
    </div>
  );
}