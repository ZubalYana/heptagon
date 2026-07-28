const RULES = [
  (v: string) => v.length >= 8,
  (v: string) => /[A-Z]/.test(v),
  (v: string) => /[a-z]/.test(v),
  (v: string) => /[0-9]/.test(v),
  (v: string) => /[^A-Za-z0-9]/.test(v),
];

const COLORS = ["#FF3B3B", "#FF7A00", "#FFD700", "#00FF26"];
const LABELS = ["Weak", "Fair", "Good", "Strong"];

function getLevel(score: number) {
  if (score <= 2) return 0;
  if (score <= 3) return 1;
  if (score <= 4) return 2;
  return 3;
}

export function getPasswordLevel(value: string) {
  const score = RULES.filter(r => r(value)).length;
  return getLevel(score);
}

export default function PasswordStrengthIndicator({ value }: { value: string }) {
  if (!value.length) return null;

  const score  = RULES.filter(r => r(value)).length;
  const level  = getLevel(score);
  const color  = COLORS[level];

  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="flex gap-[4px] flex-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-[3px] rounded-full transition-all duration-300"
            style={{ background: i <= level ? color : "#2a2a2a" }}
          />
        ))}
      </div>
      <span
        className="text-[11px] font-semibold tracking-wider w-[42px] text-right transition-colors duration-300"
        style={{ color }}
      >
        {LABELS[level]}
      </span>
    </div>
  );
}