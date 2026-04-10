import { useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { MoreVertical } from "lucide-react";

interface TaskMenuProps {
  onAddSubtask?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function TaskMenu({ onAddSubtask, onEdit, onDelete }: TaskMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="flex-shrink-0 p-1 mt-[2px] rounded-md cursor-pointer text-[#555555] opacity-50 group-hover:opacity-100 hover:text-[#e5e5e5] hover:bg-[#2a2a2a] transition-all duration-200 focus:outline-none"
        aria-label="Task options"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <MoreVertical size={16} />
      </button>

      <div
        className={`
          absolute top-[calc(100%+4px)] right-0 z-50
          w-44 bg-[#1e1e1e] border border-[#2a2a2a] rounded-[10px] p-1
          shadow-[0_8px_32px_rgba(0,0,0,0.55),0_2px_8px_rgba(0,0,0,0.35)]
          origin-top-right
          transition-all duration-[180ms] ease-[cubic-bezier(0.16,1,0.3,1)]
          ${open
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-90 -translate-y-1.5 pointer-events-none"
          }
        `}
        role="menu"
      >
        <MenuItem
          icon={<Plus size={14} />}
          label="Add subtask"
          onClick={() => { onAddSubtask?.(); setOpen(false); }}
          delay="delay-[40ms]"
          visible={open}
        />

        <div className="h-px bg-[#282828] my-1" />

        <MenuItem
          icon={<Pencil size={14} />}
          label="Edit"
          onClick={() => { onEdit?.(); setOpen(false); }}
          delay="delay-[80ms]"
          visible={open}
        />

        <div className="h-px bg-[#282828] my-1" />

        <MenuItem
          icon={<Trash2 size={14} />}
          label="Delete"
          onClick={() => { onDelete?.(); setOpen(false); }}
          delay="delay-[120ms]"
          visible={open}
          danger
        />
      </div>
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  visible,
  delay = "",
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  visible: boolean;
  delay?: string;
  danger?: boolean;
}) {
  return (
    <button
      role="menuitem"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`
        flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-[7px]
        text-[13px] font-[450] tracking-[0.01em] text-left
        transition-all duration-[140ms] ease-out cursor-pointer
        ${danger
          ? "text-red-400 hover:bg-[#2a1414] hover:text-red-300"
          : "text-[#c8c8c8] hover:bg-[#272727] hover:text-[#f0f0f0]"
        }
        ${visible ? `opacity-100 translate-x-0 ${delay}` : "opacity-0 translate-x-1.5"}
      `}
    >
      <span className="opacity-75">{icon}</span>
      {label}
    </button>
  );
}