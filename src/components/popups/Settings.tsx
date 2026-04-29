import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { SettingsNav } from "../customElements/SettingsNav";
import type { SettingSection } from "../customElements/SettingsNav";
import SettingSwitch from "../customElements/SettingsSwitch";
import type User from "../../interfaces/User";
import { LogOut, Send } from "lucide-react";
import TextArea from "../customElements/TextArea";
import GhostButton from "../customElements/SecondaryButton";

interface SettingsProps {
  onClose?: () => void;
  setUser: (user: User | null) => void;
}

export default function Settings({ onClose, setUser }: SettingsProps) {
  const [activeSection, setActiveSection] = useState<SettingSection>("General");
  const [optionalIncluded, setOptionalIncluded] = useState<boolean>(false);

    const [user, setLocalUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setLocalUser(JSON.parse(stored));
    }
  }, []);

  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLocalUser(null);
    setUser(null); 
  };

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
            <button
              className={[
                "flex justify-center items-center gap-2 mt-4",
                "px-4 py-2 rounded-lg",
                "font-medium text-[14px]",
                "bg-transparent border transition-all duration-200 ease-in-out",
                "border-red-500/30 text-red-500 cursor-pointer",
                "hover:bg-red-500/10 hover:border-red-500 hover:shadow-[0_0_12px_rgba(239,68,68,0.15)] hover:-translate-y-px",
                "focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:bg-red-500/10",
                "active:scale-[0.98] active:translate-y-0",
              ].join(" ")}
              onClick={() => logOut()}
            >
              <LogOut size={18} />
              Log Out
            </button>
          </div>
        )}
        {activeSection == "Help" && (
          <div className="flex flex-col items-center">
            <h3 className="mb-4">Problems? Questions? Suggestions? Let us know!</h3>
            <TextArea
             placeholder="Leave your message here" 
            />
            <GhostButton className="mt-2">
              <Send/> Send
            </GhostButton>
          </div>
        )}
      </div>
    </div>
  );
}
