type LoaderVariant = "spinner" | "dots" | "bars" | "pulse";
type LoaderSize = "sm" | "md" | "lg";

interface LoaderProps {
  variant?: LoaderVariant;
  size?: LoaderSize;
  label?: string;
}

const sizeMap = {
  sm: "w-6 h-6 border-2",
  md: "w-10 h-10 border-2",
  lg: "w-14 h-14 border-[3px]",
};

export default function Loader({ variant = "spinner", size = "md", label }: LoaderProps) {
  const inner = {
    spinner: (
      <div
        className={`rounded-full border-[#1a2e1a] border-t-[#00FF26] animate-spin ${sizeMap[size]}`}
      />
    ),
    dots: (
      <div className="flex gap-2 items-center">
        {[0, 150, 300].map((delay) => (
          <div
            key={delay}
            className="w-2 h-2 rounded-full bg-[#00FF26] animate-bounce"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    ),
    bars: (
      <div className="flex gap-1 items-end h-7">
        {[0, 150, 300, 450].map((delay) => (
          <div
            key={delay}
            className="w-1 h-full rounded-sm bg-[#00FF26] origin-bottom animate-[bar_0.9s_ease-in-out_infinite]"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    ),
    pulse: (
      <div className={`rounded-full border-2 border-[#00FF26] animate-pulse ${sizeMap[size]}`} />
    ),
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {inner[variant]}
      {label && (
        <span className="text-[13px] text-[#00FF26] font-mono tracking-wide opacity-80">
          {label}
        </span>
      )}
    </div>
  );
}