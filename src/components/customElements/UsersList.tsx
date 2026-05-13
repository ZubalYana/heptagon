import type User from "../../interfaces/User";
import { Trash2 } from "lucide-react";
import ActionConfirmation from "../popups/ActionConfirmation";
import { useState } from "react";
import apiClient from "../../helpers/apiClient";
import Alert from "./Alert";

interface UsersListProps {
  users: User[] | null;
  onUserDeleted: (userId: string) => void;
}

export default function UsersList({ users, onUserDeleted }: UsersListProps) {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false);
  const [deletingUserEmail, setDeletingUserEmail] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [alert, setAlert] = useState<{
    shown: boolean;
    type: "success" | "info" | "error";
    text: string;
  }>({ shown: false, type: "success", text: "" });

  function onAlertClose() {
    setAlert({ shown: false, type: "success", text: "" });
  }

  if (!users || users.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-10">
        <p className="text-[13px] text-[#444] tracking-widest uppercase">
          No users found
        </p>
      </div>
    );
  }

  function onDeleteUser() {
    apiClient
      .delete("admin/delete-user", { data: { userId } })
      .then(() => {
        setIsConfirmationOpen(false);
        onUserDeleted(userId);
        setDeletingUserEmail("");
        setUserId("");
        setAlert({
          shown: true,
          type: "success",
          text: "User deleted successfully!",
        });
      })
      .catch((err) => {
        setAlert({
          shown: true,
          type: "error",
          text: "Failed to delete user. See error in console.",
        });
        console.log(err.message);
      });
  }

  return (
    <div className="w-full flex flex-col gap-y-2">
      <div className="w-full flex items-center gap-4">
        <span className="text-[11px] tracking-widest uppercase text-[#444] w-6">
          #
        </span>
        <span className="text-[11px] tracking-widest uppercase text-[#444] w-[100px]">
          Name
        </span>
        <span className="text-[11px] tracking-widest uppercase text-[#444] flex-1">
          Email
        </span>
      </div>

      {users.map((user, index) => (
        <div
          key={user._id}
          className="w-full px-4 py-3 flex items-center gap-4 rounded-lg border border-[#2a2a2a] bg-[#1B1B1B] hover:border-[#39FF14]/40 hover:bg-[#1f1f1f] transition-all duration-200 group"
        >
          <span className="text-[12px] text-[#333] w-6 font-mono group-hover:text-[#39FF14]/50 transition-colors duration-200">
            {String(index + 1).padStart(2, "0")}
          </span>

          <h3 className="w-[100px] text-[14px] font-medium text-white truncate">
            {user.name}
          </h3>

          <div className="w-px h-4 bg-[#2a2a2a] group-hover:bg-[#39FF14]/20 transition-colors duration-200" />

          <p className="flex-1 text-[13px] text-[#888] truncate font-light">
            {user.email}
          </p>

          <Trash2
            className="text-red-400 w-[15px] h-[15px] hover:scale-[1.2] hover:shadow cursor-pointer transition-all duration-300"
            strokeWidth={1.5}
            onClick={() => {
              setDeletingUserEmail(user.email);
              setUserId(user._id);
              console.log(user._id);
              setIsConfirmationOpen(true);
            }}
          />
        </div>
      ))}

      <p className="text-[11px] text-[#333] tracking-widest uppercase px-4 pt-2">
        {users.length} user{users.length !== 1 ? "s" : ""} total
      </p>

      {isConfirmationOpen && (
        <div
          className="w-full h-full fixed inset-0 flex justify-center items-center backdrop-blur-lg z-[9999]"
          onClick={() => setIsConfirmationOpen(false)}
        >
          <ActionConfirmation
            confirmationText={`Are you sure you want to delete user ${deletingUserEmail}?`}
            onClose={() => setIsConfirmationOpen(false)}
            buttonText={"Delete permanently"}
            onConfirm={() => onDeleteUser()}
          />
        </div>
      )}

      {alert.shown && (
        <Alert
          type={alert.type}
          text={alert.text}
          onClose={() => onAlertClose()}
        />
      )}
    </div>
  );
}
