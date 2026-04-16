import { useState } from "react";
import { X, Settings2, UserCircle, Headset } from "lucide-react";
import { motion } from "framer-motion";

const settingsSections = [
  { icon: <Settings2 size={16} />, text: "General" },
  { icon: <UserCircle size={16} />, text: "Profile" },
  { icon: <Headset size={16} />, text: "Help" },
] as const;

export type SettingSection = (typeof settingsSections)[number]["text"];

interface SettingsProps {
  onClose?: () => void;
}

export default function Settings({ onClose }: SettingsProps) {
  const [activeSection, setActiveSection] = useState<SettingSection>("General");

  return (
    <div
      className="w-[90%] md:w-[60%] lg:w-[40%] min-h-[400px] bg-[#1F1F1F] rounded-xl p-5 flex flex-col relative shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <X
        className="w-[18px] h-[18px] absolute top-5 right-5 text-gray-400 hover:text-white transition-colors cursor-pointer"
        onClick={() => onClose?.()}
      />
      <h3 className="text-[20px] font-medium mb-6 text-white">Settings</h3>
      
      <SettingsNav activeSection={activeSection} onChange={setActiveSection} />
      
      <div className="flex-1 rounded-lg bg-[#151515]/50 p-4 mt-2 border border-white/5">
        <p className="text-gray-400 text-sm">Now viewing: {activeSection}</p>
      </div>
    </div>
  );
}

interface SettingsNavProps {
  activeSection: SettingSection;
  onChange: (section: SettingSection) => void;
}

export const SettingsNav = ({ activeSection, onChange }: SettingsNavProps) => {
  return (
    <div className="flex w-full rounded-xl bg-[#151515] p-1.5 gap-x-1">
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