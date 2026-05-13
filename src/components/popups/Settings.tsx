import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { SettingsNav } from "../customElements/SettingsNav";
import type { SettingSection } from "../customElements/SettingsNav";
import SettingSwitch from "../customElements/SettingsSwitch";
import type User from "../../interfaces/User";
import { LogOut, Send } from "lucide-react";
import TextArea from "../customElements/TextArea";
import Button from "../customElements/PrimaryButton";
import AppConnection from "../customElements/AppConnection";
import apiClient from "../../helpers/apiClient";
import Alert from "../customElements/Alert";

interface SettingsProps {
  onClose?: () => void;
  setUser: (user: User | null) => void;
}

export default function Settings({ onClose, setUser }: SettingsProps) {
  const [activeSection, setActiveSection] = useState<SettingSection>("General");
  const [optionalIncluded, setOptionalIncluded] = useState<boolean>(() => {
  const saved = localStorage.getItem("optionalIncluded");
  return saved !== null ? saved === "true" : false;
});
  const [calendarConnected, setCalendarConnected] = useState<boolean>(false);
  const [user, setLocalUser] = useState<User | null>(null);
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [alert, setAlert] = useState<{
    shown: boolean;
    text: string;
    type: "success" | "info" | "error";
  }>({ shown: false, text: "", type: "success" });

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setLocalUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${baseURL}/calendar/status`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setCalendarConnected(data.connected));
  }, []);

  useEffect(() => {
    localStorage.setItem("optionalIncluded", `${optionalIncluded}`);
  }, [optionalIncluded]);

  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLocalUser(null);
    setUser(null);
  };

  const baseURL = import.meta.env.DEV
    ? "http://localhost:5000"
    : import.meta.env.VITE_API_URL;

  const connectCalendar = async () => {
    const token = localStorage.getItem("token");

    if (calendarConnected) {
      await fetch(`${baseURL}/calendar/disconnect`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setCalendarConnected(false);
      return;
    }

    const response = await fetch(`${baseURL}/calendar/auth-url`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const { url } = await response.json();
    window.location.href = url;
  };

  const sendFeedback = async () => {
    try {
      await apiClient.post("/feedback/create", {
        userName: user?.name,
        userEmail: user?.email,
        feedbackText: feedbackText,
      });
      setAlert({
        shown: true,
        text: "Feedback sent successfully! Thanks!",
        type: "success",
      });
      setFeedbackText("");
    } catch (err) {
      setAlert({
        shown: true,
        text: "Error sending feedback. Please get in touch with us.",
        type: "error",
      });
    }
  };

  const onAlertClose = () => {
    setAlert({ shown: false, text: "", type: "success" });
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
            <AppConnection
              icon="./google-calendar-svgrepo-com.svg"
              name="Google Calendar"
              connected={calendarConnected}
              onChange={() => connectCalendar()}
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
            <h3 className="mb-4">
              Problems? Questions? Suggestions? Let us know!
            </h3>
            <TextArea
              placeholder="Leave your message here"
              value={feedbackText}
              onChange={(e) => {
                setFeedbackText(e.target.value);
              }}
            />
            <Button
              className="mt-6"
              onClick={() => {
                sendFeedback();
              }}
            >
              <div className="flex items-center gap-x-2">
                <Send size={18} /> Send
              </div>
            </Button>
          </div>
        )}
      </div>

      {alert.shown && (
        <Alert type={alert.type} text={alert.text} onClose={onAlertClose} />
      )}
    </div>
  );
}
