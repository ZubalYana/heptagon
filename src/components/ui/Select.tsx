import { useState, useRef, useEffect, useLayoutEffect, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";

interface SelectOption {
  label: string;
  value: string;
}

interface CustomSelectProps {
  label?: string;
  error?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export default function Select({
  label,
  error,
  placeholder = "Select an option...",
  options,
  value,
  onChange,
  className = "",
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({});
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  function updateMenuPosition() {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const gap = 6;
    const maxMenu = 240;
    const spaceBelow = window.innerHeight - rect.bottom - gap;
    const spaceAbove = rect.top - gap;
    const openUp = spaceBelow < 160 && spaceAbove > spaceBelow;
    const maxHeight = Math.min(
      maxMenu,
      Math.max(132, openUp ? spaceAbove : spaceBelow)
    );

    setMenuStyle({
      position: "fixed",
      left: rect.left,
      width: rect.width,
      zIndex: 10050,
      maxHeight,
      overflowY: "auto",
      ...(openUp
        ? { bottom: window.innerHeight - rect.top + gap, top: "auto" }
        : { top: rect.bottom + gap, bottom: "auto" }),
    });
  }

  useLayoutEffect(() => {
    if (!open) return;
    updateMenuPosition();
    const onWin = () => updateMenuPosition();
    window.addEventListener("resize", onWin);
    window.addEventListener("scroll", onWin, true);
    return () => {
      window.removeEventListener("resize", onWin);
      window.removeEventListener("scroll", onWin, true);
    };
  }, [open, options.length]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={rootRef} className={`flex flex-col gap-1.5 w-full font-sans group ${className}`}>
      {label && (
        <label
          className={`text-sm font-medium transition-colors duration-300 ${
            error
              ? "text-red-500"
              : selected || open
              ? "text-[#00FF26]"
              : "text-gray-400"
          }`}
        >
          {label}
        </label>
      )}

      <div className="relative w-full">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`
            w-full pl-4 pr-11 py-2.5 rounded-lg text-left
            bg-[#1a1a1a] border border-[#2a2a2a]
            outline-none transition-all duration-300 ease-in-out
            hover:border-gray-500 flex items-center justify-between
            ${selected ? "text-white" : "text-[#555555] font-light"}
            ${open
              ? "bg-[#151515] border-[#00FF26] ring-1 ring-[#00FF26] shadow-[0_0_12px_rgba(0,255,38,0.15)]"
              : ""}
            ${error
              ? "!border-red-500 focus:!ring-red-500 focus:!shadow-[0_0_12px_rgba(239,68,68,0.15)]"
              : ""}
          `}
        >
          <span>{selected ? selected.label : placeholder}</span>
          <ChevronDown
            size={16}
            className={`absolute right-3 top-1/2 -translate-y-1/2 transition-all duration-300
              ${open ? "rotate-180 text-[#00FF26]" : "text-[#555555]"}`}
          />
        </button>
      </div>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={menuStyle}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.45)] overscroll-contain"
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange?.(option.value);
                  setOpen(false);
                }}
                className={`
                  w-full px-4 py-2.5 text-left text-sm flex items-center justify-between
                  transition-colors duration-150 cursor-pointer
                  ${value === option.value
                    ? "text-[#00FF26] bg-[#1e2a1e]"
                    : "text-gray-300 hover:bg-[#242424] hover:text-white"}
                `}
              >
                {option.label}
                {value === option.value && <Check size={14} className="text-[#00FF26]" />}
              </button>
            ))}
          </div>,
          document.body
        )}

      {error && (
        <span className="text-xs text-red-500 transition-opacity duration-300">
          {error}
        </span>
      )}
    </div>
  );
}
