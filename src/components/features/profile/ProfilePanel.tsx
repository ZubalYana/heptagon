import { useState, useEffect } from "react";
import type User from "../../../interfaces/User";
import { LogOut, Trash2, CircleCheck, Pencil } from "lucide-react";
import Button from "../../ui/PrimaryButton";
import DangerButton from "../../ui/DangerButton";
import apiClient from "../../../helpers/apiClient";
import Alert from "../../ui/Alert";
import { clearSession } from "../../../helpers/session";
import ActionConfirmation from "../../modals/ActionConfirmation";
import EditProfile from "../../modals/EditProfile";
import UserAvatar from "./UserAvatar";

interface ProfilePanelProps {
  user: User;
  setUser: (user: User | null) => void;
}

export default function ProfilePanel({ user, setUser }: ProfilePanelProps) {
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
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
      .delete("/auth/delete")
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
    <div className="w-full max-w-xl rounded-xl bg-[#1B1B1B] border border-[#2a2a2a] p-5 lg:p-6 shadow-lg relative">
      <button
        type="button"
        aria-label="Edit profile"
        className="absolute top-5 right-5 text-[#888] hover:text-[#00FF26] transition-colors cursor-pointer"
        onClick={() => setEditOpen(true)}
      >
        <Pencil size={18} strokeWidth={1.75} />
      </button>

      <div className="flex items-center gap-4 pr-8">
        <UserAvatar
          name={localUser.name}
          avatarUrl={localUser.avatarUrl}
          size={80}
        />
        <div className="min-w-0 flex-1">
          <p className="text-[18px] font-medium text-[#F5F5F5] truncate">
            {localUser.name}
          </p>
          <p className="text-[14px] text-[#888] truncate mt-0.5">
            {localUser.email}
          </p>
          {localUser.emailVerified === true && (
            <p className="text-[13px] text-[#00FF26]/80 mt-2 flex items-center gap-1.5">
              <CircleCheck size={16} strokeWidth={2} />
              Email verified
            </p>
          )}
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
      {editOpen && (
        <div
          className="w-full h-full fixed inset-0 flex justify-center items-center backdrop-blur-lg z-[9999]"
          onClick={() => setEditOpen(false)}
        >
          <EditProfile
            user={localUser}
            setUser={setUser}
            onClose={() => setEditOpen(false)}
          />
        </div>
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
