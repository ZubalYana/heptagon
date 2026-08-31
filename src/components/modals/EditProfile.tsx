import { useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import type User from "../../interfaces/User";
import Input from "../ui/Input";
import Button from "../ui/PrimaryButton";
import Alert from "../ui/Alert";
import apiClient from "../../helpers/apiClient";
import { persistUser } from "../../helpers/session";
import UserAvatar from "../features/profile/UserAvatar";
import ChangePasswordForm from "../features/profile/ChangePasswordForm";

interface EditProfileProps {
  user: User;
  setUser: (user: User | null) => void;
  onClose: () => void;
}

export default function EditProfile({ user, setUser, onClose }: EditProfileProps) {
  const [name, setName] = useState(user.name);
  const [savingName, setSavingName] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [alert, setAlert] = useState<{
    shown: boolean;
    text: string;
    type: "success" | "info" | "error";
  }>({ shown: false, text: "", type: "success" });

  function applyUser(next: User) {
    persistUser(next);
    setUser(next);
  }

  function saveName() {
    const trimmed = name.trim();
    if (!trimmed || trimmed === user.name) return;
    setSavingName(true);
    apiClient
      .patch("/auth/profile", { name: trimmed })
      .then(({ data }) => {
        applyUser(data.user);
        setAlert({ shown: true, type: "success", text: "Name updated." });
      })
      .catch((err) =>
        setAlert({
          shown: true,
          type: "error",
          text: err.response?.data?.error || "Could not update name.",
        })
      )
      .finally(() => setSavingName(false));
  }

  function onFile(file: File | undefined) {
    if (!file) return;
    const body = new FormData();
    body.append("avatar", file);
    setUploading(true);
    apiClient
      .post("/auth/avatar", body)
      .then(({ data }) => {
        applyUser(data.user);
        setAlert({ shown: true, type: "success", text: "Photo updated." });
      })
      .catch((err) =>
        setAlert({
          shown: true,
          type: "error",
          text: err.response?.data?.error || "Could not upload photo.",
        })
      )
      .finally(() => {
        setUploading(false);
        if (fileRef.current) fileRef.current.value = "";
      });
  }

  function removePhoto() {
    setUploading(true);
    apiClient
      .delete("/auth/avatar")
      .then(({ data }) => {
        applyUser(data.user);
        setAlert({
          shown: true,
          type: "success",
          text: "Photo removed.",
        });
      })
      .catch((err) =>
        setAlert({
          shown: true,
          type: "error",
          text: err.response?.data?.error || "Could not remove photo.",
        })
      )
      .finally(() => setUploading(false));
  }

  return (
    <div
      className="w-[90%] md:w-[60%] lg:w-[40%] max-h-[90dvh] overflow-y-auto bg-[#1F1F1F] rounded-xl p-5 flex flex-col relative shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <X
        className="w-[18px] h-[18px] absolute top-5 right-5 text-gray-400 hover:text-white transition-colors cursor-pointer"
        onClick={onClose}
      />
      <h3 className="text-[20px] font-medium mb-6 text-white">Edit profile</h3>

      <div className="flex flex-col items-center mb-6">
        <button
          type="button"
          className="relative group cursor-pointer"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          aria-label="Change photo"
        >
          <UserAvatar name={user.name} avatarUrl={user.avatarUrl} size={96} />
          <span className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Camera size={22} className="text-white" />
          </span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
        <p className="text-[12px] text-[#888] mt-2">
          {uploading ? "Uploading…" : "Click the photo to upload"}
        </p>
        {user.avatarUrl && (
          <button
            type="button"
            className="text-[12px] text-[#888] hover:text-white mt-1 cursor-pointer"
            onClick={removePhoto}
            disabled={uploading}
          >
            Remove photo
          </button>
        )}
      </div>

      <Input
        label="Name"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button
        className="mt-3 w-full sm:w-auto"
        loading={savingName}
        disabled={!name.trim() || name.trim() === user.name}
        onClick={() => saveName()}
      >
        Save name
      </Button>

      {user.hasPassword !== false && (
        <ChangePasswordForm onAlert={(next) => setAlert(next)} />
      )}

      {alert.shown && (
        <Alert
          type={alert.type}
          text={alert.text}
          onClose={() => setAlert({ shown: false, text: "", type: "success" })}
        />
      )}
    </div>
  );
}
