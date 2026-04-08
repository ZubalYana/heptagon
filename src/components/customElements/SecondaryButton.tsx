import React, { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ 
  children, 
  className = '', 
  ...props 
}: ButtonProps) {
  return (
    <button
      className={`
        px-4 py-2 rounded-lg font-medium text-[14px]
        bg-transparent text-[#00FF26] cursor-pointer
        border border-[#00FF26]/30
        transition-all duration-200 ease-in-out
        
        /* Subtle tinted hover instead of solid fill */
        hover:bg-[#00FF26]/10 hover:border-[#00FF26] hover:shadow-[0_0_12px_rgba(0,255,38,0.15)] 
        hover:-translate-y-px
        
        focus:outline-none focus:ring-2 focus:ring-[#00FF26]/40 focus:bg-[#00FF26]/10
        
        /* Softer active scale */
        active:scale-[0.98] active:translate-y-0
        
        disabled:opacity-40 disabled:cursor-not-allowed 
        disabled:hover:bg-transparent disabled:hover:border-[#00FF26]/30 disabled:hover:shadow-none 
        disabled:hover:translate-y-0
        
        flex justify-center items-center gap-2
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}