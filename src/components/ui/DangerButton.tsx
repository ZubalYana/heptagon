import type { ButtonHTMLAttributes, ReactNode } from "react";

interface DangerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "outlined" | "filled";
}

export default function DangerButton({
  children,
  className = "",
  variant = "outlined",
  disabled = false,
  ...props
}: DangerButtonProps) {
  const variantClasses =
    variant === "filled"
      ? [
          "bg-red-500 border-red-500 text-white",
          "hover:bg-red-600 hover:border-red-600 hover:shadow-[0_0_16px_rgba(239,68,68,0.3)] hover:-translate-y-px",
          "focus:bg-red-600 focus:border-red-600 focus:shadow-[0_0_16px_rgba(239,68,68,0.3)]",
        ]
      : [
          "bg-transparent border-red-500/30 text-red-500",
          "hover:bg-red-500/10 hover:border-red-500 hover:shadow-[0_0_12px_rgba(239,68,68,0.15)] hover:-translate-y-px",
          "focus:bg-red-500/10 focus:border-red-500 focus:shadow-[0_0_12px_rgba(239,68,68,0.15)]",
        ];

  return (
    <button
      disabled={disabled}
      className={[
        "flex justify-center items-center gap-2",
        "px-4 py-2 rounded-lg",
        "font-medium text-[14px]",
        "border transition-all duration-200 ease-in-out",
        "focus:outline-none focus:ring-2 focus:ring-red-500/40",
        "active:scale-[0.98] active:translate-y-0",
        disabled
          ? "border-red-500/20 text-red-500/30 cursor-not-allowed"
          : ["cursor-pointer", ...variantClasses].join(" "),
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}