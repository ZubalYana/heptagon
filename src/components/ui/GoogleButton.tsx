import { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export default function GoogleButton({ className = '', ...props }: ButtonProps) {
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
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
      </svg>
      Log in with Google
    </button>
  );
}