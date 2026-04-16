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
        "flex justify-center items-center gap-2",
        "px-4 py-2 rounded-lg",
        "font-medium text-[14px]",
        "bg-transparent border transition-all duration-200 ease-in-out",
        loading
          ? "border-[#00FF26]/30 text-[#00FF26]/60 bg-[#00FF26]/5 cursor-wait"
          : disabled
          ? "border-[#00FF26]/20 text-[#00FF26]/40 cursor-not-allowed"
          : "border-[#00FF26]/30 text-[#00FF26] cursor-pointer hover:bg-[#00FF26]/10 hover:border-[#00FF26] hover:shadow-[0_0_12px_rgba(0,255,38,0.15)] hover:-translate-y-px focus:outline-none focus:ring-2 focus:ring-[#00FF26]/40 focus:bg-[#00FF26]/10 active:scale-[0.98] active:translate-y-0",
        className
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {loading && (
        <Loader2 size={16} className="animate-spin shrink-0 text-current" />
      )}
      {children}
    </button>
  );
}