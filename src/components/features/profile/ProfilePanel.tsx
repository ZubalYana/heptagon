import { useState, useEffect } from "react";
import type User from "../../../interfaces/User";
import { LogOut, Trash2, CircleCheck } from "lucide-react";
import Button from "../../ui/PrimaryButton";
import DangerButton from "../../ui/DangerButton";
import apiClient from "../../../helpers/apiClient";
import Alert from "../../ui/Alert";
import { clearSession } from "../../../helpers/session";
import ActionConfirmation from "../../modals/ActionConfirmation";

interface ProfilePanelProps {
  user: User;
  setUser: (user: User | null) => void;
}

export default function ProfilePanel({ user, setUser }: ProfilePanelProps) {
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);
  const [localUser, setLocalUser] = useState<User>(user);
  const [alert, setAlert] = useState<{
    shown: boolean;
    text: string;
    type: "success" | "info" | "error";
  }>({ shown: false, text: "", type: "success" });

  useEffect(() => {
    setLocalUser(user);
  }, [user]);

  const logOut = () => {
    const refreshToken = localStorage.getItem("refreshToken");
    apiClient.post("/auth/logout", { refreshToken }).finally(() => {
      clearSession();
      setUser(null);
    });
  };

  function deleteAccount() {
    apiClient
      .delete(`/auth/delete/${localUser.id}`)
      .then(() => {
        clearSession();
        setUser(null);
      })
      .catch(() => {
        setAlert({
          shown: true,
          text: "Error deleting account. Please try again.",
          type: "error",
        });
      });
  }

  return (
    <div className="w-full max-w-xl rounded-xl bg-[#1B1B1B] border border-[#2a2a2a] p-5 lg:p-6 shadow-lg">
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-1 pb-4 border-b border-white/5">
          <p className="text-[11px] uppercase tracking-wide text-[#00FF26]/70">
            Name
          </p>
          <p className="text-[15px] text-[#F5F5F5]">{localUser.name}</p>
        </div>
        <div className="flex flex-col gap-y-1">
          <p className="text-[11px] uppercase tracking-wide text-[#00FF26]/70">
            Email
          </p>
          <p className="text-[15px] text-[#F5F5F5]">{localUser.email}</p>
        </div>
      </div>

      {localUser.emailVerified === false && (
        <div className="mt-5 pt-5 border-t border-white/5">
          <p className="text-[14px] text-[#F5F5F5]/50 leading-relaxed mb-4">
            This address is not verified yet. Check your inbox, or resend the
            link. If you cannot find it, look in spam or promotions.
          </p>
          <Button
            className="w-full sm:w-auto"
            onClick={() => {
              apiClient
                .post("/auth/resend-verification")
                .then(() =>
                  setAlert({
                    shown: true,
                    type: "success",
                    text: "Verification email sent.",
                  })
                )
                .catch((err) =>
                  setAlert({
                    shown: true,
                    type: "error",
                    text:
                      err.response?.data?.error ||
                      "Could not send verification email.",
                  })
                );
            }}
          >
            Resend verification email
          </Button>
        </div>
      )}
      {localUser.emailVerified === true && (
        <p className="mt-5 pt-5 border-t border-white/5 text-[13px] text-[#00FF26]/80 flex items-center gap-1.5">
          <CircleCheck size={16} strokeWidth={2} />
          Email verified
        </p>
      )}

      <div className="mt-6 pt-5 border-t border-white/5 flex flex-wrap gap-3 items-center">
        <DangerButton onClick={() => setConfirmDeleteAccount(true)}>
          <Trash2 size={16} />
          Delete account
        </DangerButton>
        <button
          type="button"
          className={[
            "flex justify-center items-center gap-2",
            "px-4 py-2 rounded-lg",
            "font-medium text-[14px]",
            "bg-transparent border transition-all duration-200 ease-in-out",
            "border-white/30 text-white/70 cursor-pointer",
            "hover:bg-white/10 hover:border-white hover:text-white hover:-translate-y-px",
            "focus:outline-none focus:ring-2 focus:ring-white/40",
            "active:scale-[0.98] active:translate-y-0",
          ].join(" ")}
          onClick={() => logOut()}
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>

      {alert.shown && (
        <Alert
          type={alert.type}
          text={alert.text}
          onClose={() => setAlert({ shown: false, text: "", type: "success" })}
        />
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
