import { useState, type InputHTMLAttributes } from "react";
import { ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react";

interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  isSecret?: boolean;
}

export default function Input({
  label,
  error,
  className = "",
  placeholder = "Type here...",
  id,
  isSecret = false,
  type,
  value,
  min,
  max,
  step,
  onChange,
  disabled,
  ...props
}: CustomInputProps) {
  const [showSecret, setShowSecret] = useState(false);
  const isNumber = type === "number";

  const inputType = isSecret
    ? showSecret
      ? "text"
      : "password"
    : type || "text";

  function emit(next: number) {
    onChange?.({
      target: { value: String(next) },
    } as React.ChangeEvent<HTMLInputElement>);
  }

  function nudge(direction: 1 | -1) {
    const stepVal = step != null && step !== "" ? Number(step) : 1;
    const current = Number(value ?? 0);
    const base = Number.isFinite(current) ? current : 0;
    let next = base + direction * (Number.isFinite(stepVal) ? stepVal : 1);
    if (min != null && min !== "" && next < Number(min)) next = Number(min);
    if (max != null && max !== "" && next > Number(max)) next = Number(max);
    emit(next);
  }

  return (
    <div className="flex flex-col gap-1.5 w-full font-sans group">
      {label && (
        <label
          htmlFor={id}
          className={`text-sm font-medium transition-colors duration-300 ${
            error
              ? "text-red-500"
              : "text-gray-400 group-focus-within:text-[#00FF26]"
          }`}
        >
          {label}
        </label>
      )}

      <div className="relative w-full">
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full px-4 py-2.5 rounded-lg
            bg-[#1a1a1a] text-white 
            border border-[#2a2a2a]
            placeholder:text-[#555555] placeholder:font-light
            outline-none transition-all duration-300 ease-in-out
            hover:border-gray-500
            focus:bg-[#151515] focus:border-[#00FF26] focus:ring-1 focus:ring-[#00FF26] focus:shadow-[0_0_12px_rgba(0,255,38,0.15)]
            disabled:opacity-50 disabled:cursor-not-allowed
            ${isNumber ? "pr-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" : ""}
            
            [&:-webkit-autofill]:shadow-[0_0_0_1000px_#1a1a1a_inset]
            [&:-webkit-autofill]:[-webkit-text-fill-color:white]
            [&:-webkit-autofill]:focus:shadow-[0_0_0_1000px_#151515_inset,0_0_12px_rgba(0,255,38,0.15)]
            
            ${
              error
                ? "!border-red-500 focus:!ring-red-500 focus:!shadow-[0_0_12px_rgba(239,68,68,0.15)] [&:-webkit-autofill]:focus:shadow-[0_0_0_1000px_#151515_inset,0_0_12px_rgba(239,68,68,0.15)]"
                : ""
            }
            ${className}
          `}
          {...props}
        />

        {isNumber && (
          <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex flex-col">
            <button
              type="button"
              tabIndex={-1}
              disabled={disabled}
              onClick={() => nudge(1)}
              className="h-[14px] w-7 flex items-center justify-center text-[#555555] hover:text-[#00FF26] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors duration-200 outline-none"
              aria-label="Increase"
            >
              <ChevronUp size={14} strokeWidth={2.5} />
            </button>
            <button
              type="button"
              tabIndex={-1}
              disabled={disabled}
              onClick={() => nudge(-1)}
              className="h-[14px] w-7 flex items-center justify-center text-[#555555] hover:text-[#00FF26] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors duration-200 outline-none"
              aria-label="Decrease"
            >
              <ChevronDown size={14} strokeWidth={2.5} />
            </button>
          </div>
        )}

        {isSecret && (
          <button
            type="button"
            onClick={() => setShowSecret(!showSecret)}
            className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#00FF26] transition-colors duration-300 outline-none"
            aria-label={showSecret ? "Hide secret" : "Show secret"}
          >
            {showSecret ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
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
