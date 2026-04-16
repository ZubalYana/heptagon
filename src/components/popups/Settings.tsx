import { useState } from "react";
import { X } from "lucide-react";
import { SettingsNav } from "../customElements/SettingsNav";
import type { SettingSection } from "../customElements/SettingsNav";
import SettingSwitch from "../customElements/SettingsSwitch"

interface SettingsProps {
  onClose?: () => void;
}

export default function Settings({ onClose }: SettingsProps) {
  const [activeSection, setActiveSection] = useState<SettingSection>("General");
  const [optionalIncluded, setOptionalIncluded] = useState<boolean>(false)

  return (
    <div
      className="w-[90%] md:w-[60%] lg:w-[40%] bg-[#1F1F1F] rounded-xl p-5 flex flex-col relative shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <X
        className="w-[18px] h-[18px] absolute top-5 right-5 text-gray-400 hover:text-white transition-colors cursor-pointer"
        onClick={() => onClose?.()}
      />
      <h3 className="text-[20px] font-medium mb-6 text-white">Settings</h3>
      
      <SettingsNav activeSection={activeSection} onChange={setActiveSection} />
      
      <div className="flex-1 rounded-lg bg-[#151515]/50 p-4 border border-white/5">
        {activeSection == 'General' && (
            <div>
                <SettingSwitch
                label="Include optional settings in percentage calculation"
                value={optionalIncluded}
                onChange={()=>setOptionalIncluded(!optionalIncluded)}
                />
            </div>
        )}
      </div>
    </div>
  );
}