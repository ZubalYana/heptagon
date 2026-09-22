import { useEffect } from "react";
import {
  CalendarDays,
  Flag,
  ListTodo,
  Menu,
  Settings,
  UserCircle,
  X,
} from "lucide-react";
import { APP_VIEW_TABS, type AppView } from "./ViewToggle";

const VIEW_ICONS: Record<AppView, typeof CalendarDays> = {
  days: CalendarDays,
  week: ListTodo,
  goals: Flag,
};

interface AppNavMenuProps {
  view: AppView;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChangeView: (view: AppView) => void;
  onProfile: () => void;
  onSettings: () => void;
}

export default function AppNavMenu({
  view,
  open,
  onOpenChange,
  onChangeView,
  onProfile,
  onSettings,
}: AppNavMenuProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="p-2 rounded-md text-[#ccc] hover:text-white hover:bg-[#1B1B1B] cursor-pointer transition-colors"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => onOpenChange(true)}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <Menu size={24} strokeWidth={2.25} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[200] flex justify-end"
          onClick={() => onOpenChange(false)}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="relative h-full w-[min(22rem,90vw)] bg-[#1B1B1B] border-l border-[#2a2a2a] p-5 flex flex-col shadow-[-12px_0_32px_rgba(0,0,0,0.45)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <p className="text-[13px] uppercase tracking-wide text-[#888]">
                Menu
              </p>
              <button
                type="button"
                className="p-1 rounded-md text-[#888] hover:text-white cursor-pointer"
                aria-label="Close menu"
                onClick={() => onOpenChange(false)}
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex flex-col gap-1" aria-label="Views">
              {APP_VIEW_TABS.map((tab) => {
                const Icon = VIEW_ICONS[tab.id];
                const active = view === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      onChangeView(tab.id);
                      onOpenChange(false);
                    }}
                    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[15px] text-left cursor-pointer transition-colors ${
                      active
                        ? "bg-[#00FF26]/15 text-[#00FF26]"
                        : "text-[#c8c8c8] hover:bg-[#272727] hover:text-white"
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            <div className="h-px bg-[#2a2a2a] my-4" />

            <button
              type="button"
              onClick={() => {
                onOpenChange(false);
                onProfile();
              }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[15px] text-[#c8c8c8] hover:bg-[#272727] hover:text-white text-left cursor-pointer transition-colors"
            >
              <UserCircle size={18} />
              Profile
            </button>
            <button
              type="button"
              onClick={() => {
                onOpenChange(false);
                onSettings();
              }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[15px] text-[#c8c8c8] hover:bg-[#272727] hover:text-white text-left cursor-pointer transition-colors"
            >
              <Settings size={18} />
              Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
