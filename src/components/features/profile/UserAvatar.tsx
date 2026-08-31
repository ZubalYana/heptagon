import { UserRound } from "lucide-react";

interface UserAvatarProps {
  name: string;
  avatarUrl?: string;
  size?: number;
  className?: string;
}

export default function UserAvatar({
  name,
  avatarUrl,
  size = 80,
  className = "",
}: UserAvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={`rounded-full object-cover bg-[#2a2a2a] ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`rounded-full bg-[#1B1B1B] border border-[#2a2a2a] flex items-center justify-center text-[#00FF26]/80 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {name.trim() ? (
        <span className="font-medium" style={{ fontSize: size * 0.38 }}>
          {initial}
        </span>
      ) : (
        <UserRound size={size * 0.45} strokeWidth={1.5} />
      )}
    </div>
  );
}
