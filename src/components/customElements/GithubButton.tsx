import { type ButtonHTMLAttributes } from 'react';
import { Flower } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export default function GithubButton({ className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`
        px-6 py-2.5 rounded-lg font-semibold text-[14px] uppercase w-full
        bg-[#1B1B1B] text-[#e5e5e5] cursor-pointer
        border border-[#333333]
        transition-all duration-300 ease-in-out
        
        hover:bg-[#e5e5e5] hover:text-[#151515] hover:border-[#e5e5e5] hover:shadow-[0_0_16px_rgba(229,229,229,0.2)] hover:scale-98
        focus:outline-none focus:bg-[#e5e5e5] focus:text-[#151515] focus:shadow-[0_0_16px_rgba(229,229,229,0.2)]
        
        active:scale-90
        
        disabled:opacity-50 disabled:cursor-not-allowed 
        disabled:hover:bg-[#1B1B1B] disabled:hover:text-[#e5e5e5] disabled:hover:border-[#333333] disabled:hover:shadow-none 
        disabled:active:scale-100
        
        flex justify-center items-center gap-3
        ${className}
      `}
      {...props}
    >
      <Flower size={18} strokeWidth={2.5} />
      Log in with Github
    </button>
  );
}