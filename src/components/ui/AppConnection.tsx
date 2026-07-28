interface AppConnectionProps {
  icon: string;
  name: string;
  connected: boolean;
  onChange: () => void;
}

export default function AppConnection({
  icon,
  name,
  connected,
  onChange,
}: AppConnectionProps) {
  return (
    <div className="flex items-center w-full justify-between">
        <div className="flex items-center">
      <div className="w-[25px] h-[25px]">
        <img src={icon} alt={`${name}`} />
      </div>
      <h3 className="text-[14px] font-normal ml-2">{name}</h3>
      </div>
      <button
        role="switch"
        aria-checked={connected}
        onClick={() => onChange()}
        className={`
          relative shrink-0 w-[42px] h-[24px] rounded-full border transition-all duration-300 ease-in-out cursor-pointer
          focus:outline-none
          ${
            connected
              ? "bg-[#00FF26]/10 border-[#00FF26] shadow-[0_0_10px_rgba(0,255,38,0.2)]"
              : "bg-[#151515] border-[#333]"
          }
        `}
      >
        <span
          className={`
            absolute top-[3px] w-[16px] h-[16px] rounded-full transition-all duration-300 ease-in-out
            ${
              connected
                ? "left-[22px] bg-[#00FF26] shadow-[0_0_6px_rgba(0,255,38,0.6)]"
                : "left-[3px] bg-[#444]"
            }
          `}
        />
      </button>
    </div>
  );
}
