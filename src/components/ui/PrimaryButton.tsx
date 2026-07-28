import React, { type ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
}

export default function Button({
  children,
  className = '',
  loading = false,
  disabled = false,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  let stateClasses = '';

  if (disabled) {
    stateClasses = 'bg-[#151515] border-[#00FF26]/20 text-[#00FF26]/30 cursor-not-allowed';
  } else if (loading) {
    stateClasses = 'bg-[#1B1B1B] border-[#00FF26]/50 text-[#00FF26]/70 cursor-wait';
  } else {
    stateClasses = `
      bg-[#1B1B1B] border-[#00FF26] text-[#00FF26] cursor-pointer
      hover:bg-[#00FF26] hover:text-[#151515] hover:shadow-[0_0_16px_rgba(0,255,38,0.4)]
      focus:outline-none focus:bg-[#00FF26] focus:text-[#151515] focus:shadow-[0_0_16px_rgba(0,255,38,0.4)]
      active:scale-95
    `;
  }

  return (
    <button
      disabled={isDisabled}
      className={`
        px-6 py-2.5 rounded-lg font-semibold text-[14px] uppercase
        border transition-all duration-300 ease-in-out
        flex justify-center items-center gap-2
        relative overflow-hidden
        ${stateClasses}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <Loader2
          size={16}
          className="animate-spin shrink-0 text-current" 
        />
      )}
      <span>
        {children}
      </span>
    </button>
  );
}