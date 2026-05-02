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
          relative shrink-0 w-[42px] h-[24px] rounded-full border transition-all duration-300 ease-in-out cursor-pointer
          focus:outline-none
          ${value
            ? "bg-[#00FF26]/10 border-[#00FF26] shadow-[0_0_10px_rgba(0,255,38,0.2)]"
            : "bg-[#151515] border-[#333]"
          }
        `}
      >
        <span
          className={`
            absolute top-[3px] w-[16px] h-[16px] rounded-full transition-all duration-300 ease-in-out
            ${value
              ? "left-[22px] bg-[#00FF26] shadow-[0_0_6px_rgba(0,255,38,0.6)]"
              : "left-[3px] bg-[#444]"
            }
          `}
        />
      </button>
    </div>
  );
}