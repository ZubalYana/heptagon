import React, { type ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
}

export default function GhostButton({
  children,
  className = '',
  loading = false,
  disabled = false,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={[
        "relative flex justify-center items-center gap-2",
        "px-4 py-2 rounded-md",
        "text-[13px] font-medium tracking-wide uppercase",
        "transition-all duration-200 ease-in-out",
        "border-0 outline-none",
        loading
          ? "bg-[#00FF26]/5 text-[#00FF26]/50 cursor-wait"
          : disabled
          ? "bg-transparent text-[#00FF26]/30 cursor-not-allowed"
          : [
              "bg-transparent text-[#00FF26]/70 cursor-pointer",
              "after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2",
              "after:h-[1px] after:w-0 after:bg-[#00FF26]/60",
              "after:transition-all after:duration-200",
              "hover:text-[#00FF26] hover:after:w-full",
              "active:scale-95 active:text-[#00FF26]/50",
            ].join(' '),
        className,
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {loading && (
        <Loader2 size={14} className="animate-spin shrink-0 text-current" />
      )}
      {children}
    </button>
  );
}