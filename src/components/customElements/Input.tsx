import { useState, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  isSecret?: boolean;
}

export default function Input({ 
  label, 
  error, 
  className = '', 
  placeholder = 'Type here...', 
  id,
  isSecret = false,
  ...props 
}: CustomInputProps) {
  const [showSecret, setShowSecret] = useState(false);

  const inputType = isSecret 
    ? (showSecret ? 'text' : 'password') 
    : (props.type || 'text');

  return (
    <div className="flex flex-col gap-1.5 w-full font-sans group">
      {label && (
        <label
          htmlFor={id}
          className={`text-sm font-medium transition-colors duration-300 ${
            error ? 'text-red-500' : 'text-gray-400 group-focus-within:text-[#00FF26]'
          }`}
        >
          {label}
        </label>
      )}
      
      <div className="relative w-full">
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          className={`
            w-full pl-4 pr-11 py-2.5 rounded-lg
            bg-[#1a1a1a] text-white 
            border border-[#2a2a2a]
            placeholder:text-[#555555] placeholder:font-light
            outline-none transition-all duration-300 ease-in-out
            hover:border-gray-500
            focus:bg-[#151515] focus:border-[#00FF26] focus:ring-1 focus:ring-[#00FF26] focus:shadow-[0_0_12px_rgba(0,255,38,0.15)]
            disabled:opacity-50 disabled:cursor-not-allowed
            
            /* --- AUTOFILL OVERRIDES --- */
            [&:-webkit-autofill]:shadow-[0_0_0_1000px_#1a1a1a_inset]
            [&:-webkit-autofill]:[-webkit-text-fill-color:white]
            [&:-webkit-autofill]:focus:shadow-[0_0_0_1000px_#151515_inset,0_0_12px_rgba(0,255,38,0.15)]
            
            ${
              error
                ? '!border-red-500 focus:!ring-red-500 focus:!shadow-[0_0_12px_rgba(239,68,68,0.15)] [&:-webkit-autofill]:focus:shadow-[0_0_0_1000px_#151515_inset,0_0_12px_rgba(239,68,68,0.15)]'
                : ''
            }
            ${className}
          `}
          {...props}
        />

        {isSecret && (
          <button
            type="button" 
            onClick={() => setShowSecret(!showSecret)}
            className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#00FF26] transition-colors duration-300 outline-none"
            aria-label={showSecret ? "Hide secret" : "Show secret"}
          >
            {showSecret ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && (
        <span className="text-xs text-red-500 transition-opacity duration-300">
          {error}
        </span>
      )}
    </div>
  );
}