interface SettingSwitchProps {
  label: string;
  description?: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export default function SettingSwitch({
  label,
  description,
  value,
  onChange,
}: SettingSwitchProps) {
  return (
    <div className="w-full flex items-center justify-between gap-x-4 pb-3">
      <div className="flex flex-col">
        <span className="text-[13px] font-semibold tracking-wide text-white">
          {label}
        </span>
        {description && (
          <span className="text-[11px] text-[#666] mt-0.5">{description}</span>
        )}
      </div>

      <button
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`
          relative shrink-0 w-10.5 h-6 rounded-full border transition-all duration-300 ease-in-out cursor-pointer
          focus:outline-none
          ${value
            ? "bg-[#00FF26]/10 border-[#00FF26] shadow-[0_0_10px_rgba(0,255,38,0.2)]"
            : "bg-[#151515] border-[#333]"
          }
        `}
      >
        <span
          className={`
            absolute top-0.75 w-4 h-4 rounded-full transition-all duration-300 ease-in-out
            ${value
              ? "left-5.5 bg-[#00FF26] shadow-[0_0_6px_rgba(0,255,38,0.6)]"
              : "left-0.75 bg-[#444]"
            }
          `}
        />
      </button>
    </div>
  );
}