import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface SelectOption {
  label: string;
  value: string;
}

interface CustomSelectProps {
  label?: string;
  error?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export default function Select({
  label,
  error,
  placeholder = "Select an option...",
  options,
  value,
  onChange,
  className = "",
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className={`flex flex-col gap-1.5 w-full font-sans group ${className}`}>
      {label && (
        <label
          className={`text-sm font-medium transition-colors duration-300 ${
            error
              ? "text-red-500"
              : selected || open
              ? "text-[#00FF26]"
              : "text-gray-400"
          }`}
        >
          {label}
        </label>
      )}

      <div className="relative w-full">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`
            w-full pl-4 pr-11 py-2.5 rounded-lg text-left
            bg-[#1a1a1a] border border-[#2a2a2a]
            outline-none transition-all duration-300 ease-in-out
            hover:border-gray-500 flex items-center justify-between
            ${selected ? "text-white" : "text-[#555555] font-light"}
            ${open
              ? "bg-[#151515] border-[#00FF26] ring-1 ring-[#00FF26] shadow-[0_0_12px_rgba(0,255,38,0.15)]"
              : ""}
            ${error
              ? "!border-red-500 focus:!ring-red-500 focus:!shadow-[0_0_12px_rgba(239,68,68,0.15)]"
              : ""}
          `}
        >
          <span>{selected ? selected.label : placeholder}</span>
          <ChevronDown
            size={16}
            className={`absolute right-3 top-1/2 -translate-y-1/2 transition-all duration-300
              ${open ? "rotate-180 text-[#00FF26]" : "text-[#555555]"}`}
          />
        </button>

        {open && (
          <div className="absolute top-[calc(100%+6px)] left-0 right-0 z-50 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange?.(option.value);
                  setOpen(false);
                }}
                className={`
                  w-full px-4 py-2.5 text-left text-sm flex items-center justify-between
                  transition-colors duration-150 cursor-pointer
                  ${value === option.value
                    ? "text-[#00FF26] bg-[#1e2a1e]"
                    : "text-gray-300 hover:bg-[#242424] hover:text-white"}
                `}
              >
                {option.label}
                {value === option.value && <Check size={14} className="text-[#00FF26]" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <span className="text-xs text-red-500 transition-opacity duration-300">
          {error}
        </span>
      )}
    </div>
  );
}