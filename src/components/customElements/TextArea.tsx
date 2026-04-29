import { type TextareaHTMLAttributes } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export default function TextArea({
  label,
  error,
  className = "",
  placeholder = "Type here...",
  id,
  ...props
}: TextAreaProps) {
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
      <textarea
        id={id}
        placeholder={placeholder}
        className={`
          w-full px-4 py-2.5 rounded-lg
          bg-[#1a1a1a] text-white
          border border-[#2a2a2a]
          placeholder:text-[#555555] placeholder:font-light
          outline-none transition-all duration-300 ease-in-out
          hover:border-gray-500
          focus:bg-[#151515] focus:border-[#00FF26] focus:ring-1 focus:ring-[#00FF26] focus:shadow-[0_0_12px_rgba(0,255,38,0.15)]
          disabled:opacity-50 disabled:cursor-not-allowed
          resize-none
          ${
            error
              ? "!border-red-500 focus:!ring-red-500 focus:!shadow-[0_0_12px_rgba(239,68,68,0.15)]"
              : ""
          }
          ${className}
        `}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-500 transition-opacity duration-300">
          {error}
        </span>
      )}
    </div>
  );
}