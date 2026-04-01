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
        px-6 py-2.5 rounded-lg font-semibold text-[14px] uppercase
        bg-[#1B1B1B] text-[#00FF26] cursor-pointer
        border border-[#00FF26]
        transition-all duration-300 ease-in-out
        
        hover:bg-[#00FF26] hover:text-[#151515] hover:shadow-[0_0_16px_rgba(0,255,38,0.3)] hover:scale-98
        focus:outline-none focus:bg-[#00FF26] focus:text-[#151515] focus:shadow-[0_0_16px_rgba(0,255,38,0.3)]
        
        active:scale-90
        
        disabled:opacity-50 disabled:cursor-not-allowed 
        disabled:hover:bg-[#151515] disabled:hover:text-[#00FF26] disabled:hover:shadow-none 
        disabled:focus:bg-[#151515] disabled:focus:text-[#00FF26] disabled:focus:shadow-none
        disabled:active:scale-100
        
        flex justify-center items-center gap-2
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}