import { useState } from "react";
import { X } from "lucide-react";
import { SettingsNav } from "../customElements/SettingsNav";
import type { SettingSection } from "../customElements/SettingsNav";

interface settingsProps {
  onClose?: () => void;
}

export default function Settings({ onClose }: settingsProps) {
  const [activeSection, setActiveSection] = useState<SettingSection>("General");
  return (
    <div
      className="lg:w-[40%] bg-[#1F1F1F] rounded-md p-4 flex flex-col items-center relative"
      onClick={(e) => e.stopPropagation()}
    >
      <X
        className="w-[18px] h-[18px] absolute top-4 right-4 cursor-pointer"
        onClick={() => onClose?.()}
      />
      <h3 className="text-[20px] font-medium mb-4">Settings</h3>
      <SettingsNav activeSection={activeSection} onChange={setActiveSection} />
    </div>
  );
}
