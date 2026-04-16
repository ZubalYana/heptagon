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
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={`
        px-6 py-2.5 rounded-lg font-semibold text-[14px] uppercase
        bg-[#1B1B1B] text-[#00FF26] cursor-pointer
        border border-[#00FF26]
        transition-all duration-300 ease-in-out
        hover:bg-[#00FF26] hover:text-[#151515] hover:shadow-[0_0_16px_rgba(0,255,38,0.3)] hover:scale-98
        focus:outline-none focus:bg-[#00FF26] focus:text-[#151515] focus:shadow-[0_0_16px_rgba(0,255,38,0.3)]
        active:scale-90
        disabled:cursor-not-allowed
        disabled:hover:scale-100 disabled:hover:shadow-none
        disabled:focus:shadow-none
        disabled:active:scale-100
        flex justify-center items-center gap-2
        relative overflow-hidden
        ${loading
          ? 'border-[#00FF26]/40 text-[#00FF26]/40 hover:bg-[#1B1B1B] hover:text-[#00FF26]/40 focus:bg-[#1B1B1B] focus:text-[#00FF26]/40'
          : disabled
          ? 'border-[#00FF26]/25 text-[#00FF26]/25 bg-[#151515] hover:bg-[#151515] hover:text-[#00FF26]/25 focus:bg-[#151515] focus:text-[#00FF26]/25'
          : ''
        }
        ${className}
      `}
      {...props}
    >
      {loading && (
        <Loader2
          size={15}
          className="animate-spin shrink-0 text-[#00FF26]/50"
        />
      )}
      <span className={loading ? 'opacity-50' : ''}>
        {children}
      </span>
    </button>
  );
}