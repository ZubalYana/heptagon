import React, { type ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
}

export default function OutlineButton({
  children,
  className = '',
  loading = false,
  disabled = false,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  let stateClasses = '';
  if (disabled) {
    stateClasses = 'border-white/20 text-white/30 cursor-not-allowed';
  } else if (loading) {
    stateClasses = 'border-white/50 text-white/70 cursor-wait';
  } else {
    stateClasses = `
      border-white text-white cursor-pointer
      hover:bg-white hover:text-[#151515]
      hover:shadow-[0_0_16px_rgba(255,255,255,0.25)]
      focus:outline-none focus:bg-white focus:text-[#151515]
      active:scale-95
    `;
  }

  return (
    <button
      disabled={isDisabled}
      className={`
        px-6 py-2.5 rounded-lg font-semibold text-[14px] uppercase
        border bg-transparent transition-all duration-300 ease-in-out
        flex justify-center items-center gap-2
        relative overflow-hidden
        ${stateClasses}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <Loader2 size={16} className="animate-spin shrink-0 text-current" />
      )}
      <span>{children}</span>
    </button>
  );
}