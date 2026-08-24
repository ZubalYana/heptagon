import { useState, useEffect } from "react";
import { SettingsNav } from "../features/settings/SettingsNav";
import type { SettingSection } from "../features/settings/SettingsNav";
import SettingSwitch from "../features/settings/SettingsSwitch";
import type User from "../../interfaces/User";
import { LogOut, Send, X, Trash2 } from "lucide-react";
import TextArea from "../ui/TextArea";
import Button from "../ui/PrimaryButton";
import DangerButton from "../ui/DangerButton";
import AppConnection from "../ui/AppConnection";
import apiClient from "../../helpers/apiClient";
import Alert from "../ui/Alert";
import { clearSession } from "../../helpers/session";
import ActionConfirmation from "./ActionConfirmation"

interface SettingsProps {
  onClose?: () => void;
  setUser: (user: User | null) => void;
}

export default function Settings({ onClose, setUser }: SettingsProps) {
  const [activeSection, setActiveSection] = useState<SettingSection>("General");
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState<boolean>(false);
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
    apiClient
      .get("/calendar/status")
      .then(({ data }) => setCalendarConnected(data.connected))
      .catch(() => setCalendarConnected(false));
  }, []);

  useEffect(() => {
    localStorage.setItem("optionalIncluded", `${optionalIncluded}`);
  }, [optionalIncluded]);

  const logOut = () => {
    const refreshToken = localStorage.getItem("refreshToken");
    apiClient.post("/auth/logout", { refreshToken }).finally(() => {
      clearSession();
      setLocalUser(null);
      setUser(null);
    });
  };

  const connectCalendar = async () => {
    if (calendarConnected) {
      await apiClient.delete("/calendar/disconnect");
      setCalendarConnected(false);
      return;
    }

    const { data } = await apiClient.get("/calendar/auth-url");
    window.location.href = data.url;
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

  function deleteAccount(){}

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
            <div className="mt-4 flex gap-x-4 items-center">
              <DangerButton variant="filled" onClick={() => {
                setConfirmDeleteAccount(true);
              }}>
                <Trash2 size={18} />
                Delete Account
              </DangerButton>
              <DangerButton onClick={() => logOut()}>
                <LogOut size={18} />
                Log Out
              </DangerButton>
            </div>
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
              className="mt-6 w-[60%]"
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
      {confirmDeleteAccount && (
        <div 
                  className="w-full h-full fixed inset-0 flex justify-center items-center backdrop-blur-lg z-[9999]"
          onClick={() => setConfirmDeleteAccount(false)}
        >
        <ActionConfirmation
          buttonText="Delete Account"
          confirmationText="Are you sure you want to delete your account? This action cannot be undone."
          onConfirm={deleteAccount}
          onClose={() => setConfirmDeleteAccount(false)}
        />
        </div>
      )}
    </div>
  );
}
