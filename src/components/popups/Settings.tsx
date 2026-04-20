import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { SettingsNav } from "../customElements/SettingsNav";
import type { SettingSection } from "../customElements/SettingsNav";
import SettingSwitch from "../customElements/SettingsSwitch";
import type User from "../../interfaces/User";

interface SettingsProps {
  onClose?: () => void;
}

export default function Settings({ onClose }: SettingsProps) {
  const [activeSection, setActiveSection] = useState<SettingSection>("General");
  const [optionalIncluded, setOptionalIncluded] = useState<boolean>(false);

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

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
        {activeSection == "General" && (
          <div>
            <SettingSwitch
              label="Include optional settings in percentage calculation"
              value={optionalIncluded}
              onChange={() => setOptionalIncluded(!optionalIncluded)}
            />
          </div>
        )}
        {activeSection == "Profile" && (
          <div>
            <p className="text-[14px] text-white mb-2">
              Name: <span className="font-semibold">{user?.name}</span>
            </p>
            <p className="text-[14px] text-white mb-2">
              Email: <span className="font-semibold">{user?.email}</span>
            </p>
            
          </div>
        )}
      </div>
    </div>
  );
}
