import { motion } from "framer-motion";
import { Settings2, UserCircle, Headset } from "lucide-react";

const settingsSections = [
  { icon: <Settings2 size={16} />, text: "General" },
  { icon: <UserCircle size={16} />, text: "Profile" },
  { icon: <Headset size={16} />, text: "Help" },
] as const;

// Exporting the type so the parent component can use it for state
export type SettingSection = (typeof settingsSections)[number]["text"];

interface SettingsNavProps {
  activeSection: SettingSection;
  onChange: (section: SettingSection) => void;
}

export const SettingsNav = ({ activeSection, onChange }: SettingsNavProps) => {
  return (
    <div className="flex w-full rounded-xl bg-[#151515] p-1.5 gap-x-1 mb-4">
      {settingsSections.map((section) => {
        const isActive = section.text === activeSection;

        return (
          <button
            key={section.text}
            onClick={() => onChange(section.text)}
            className={`
              relative flex-1 flex justify-center items-center px-4 py-2 text-[14px] font-medium cursor-pointer transition-colors duration-200 rounded-lg
              ${isActive ? "text-[#F5F5F5]" : "text-gray-400 hover:text-gray-300"}
            `}
          >
            {isActive && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-[#2a2c2f] rounded-lg shadow-sm"
                transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                style={{ zIndex: 0 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-x-2">
              {section.icon}
              {section.text}
            </span>
          </button>
        );
      })}
    </div>
  );
};