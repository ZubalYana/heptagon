import { useState } from "react";
import Input from "../../ui/Input";
import Button from "../../ui/PrimaryButton";
import PasswordStrengthIndicator, {
  getPasswordLevel,
} from "../../ui/PasswordStrengthIndicator";
import apiClient from "../../../helpers/apiClient";

interface ChangePasswordFormProps {
  onAlert: (alert: {
    shown: boolean;
    text: string;
    type: "success" | "info" | "error";
  }) => void;
}

export default function ChangePasswordForm({ onAlert }: ChangePasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const mismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;
  const tooWeak = newPassword.length > 0 && getPasswordLevel(newPassword) === 0;
  const canSubmit =
    currentPassword &&
    newPassword &&
    confirmPassword &&
    !mismatch &&
    !tooWeak &&
    !loading;

  function submit() {
    if (!canSubmit) return;
    setLoading(true);
    apiClient
      .post("/auth/change-password", { currentPassword, newPassword })
      .then(() => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        onAlert({
          shown: true,
          type: "success",
          text: "Check your email to confirm the new password. Your current password still works until then.",
        });
      })
      .catch((err) => {
        onAlert({
          shown: true,
          type: "error",
          text:
            err.response?.data?.error ||
            "Could not start the password change.",
        });
      })
      .finally(() => setLoading(false));
  }

  return (
    <div className="mt-6 pt-5 border-t border-white/5">
      <p className="text-[11px] uppercase tracking-wide text-[#00FF26]/70 mb-3">
        Password
      </p>
      <p className="text-[14px] text-[#F5F5F5]/50 leading-relaxed mb-4">
        We will email a confirmation link. The new password is applied only after
        you confirm it.
      </p>
      <div className="flex flex-col gap-y-3">
        <Input
          placeholder="Current password"
          isSecret
          autoComplete="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <div>
          <Input
            placeholder="New password"
            isSecret
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={tooWeak ? "Password is too weak" : undefined}
          />
          <PasswordStrengthIndicator value={newPassword} />
        </div>
        <Input
          placeholder="Confirm new password"
          isSecret
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={mismatch ? "Passwords do not match" : undefined}
        />
        <Button
          className="w-full sm:w-auto"
          disabled={!canSubmit}
          loading={loading}
          onClick={() => submit()}
        >
          Send confirmation email
        </Button>
      </div>
    </div>
  );
}
