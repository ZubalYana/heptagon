import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loader from "../ui/Loader";
import apiClient from "../../helpers/apiClient";
import { clearSession } from "../../helpers/session";

interface ConfirmPasswordPageProps {
  setUser: (user: null) => void;
}

export default function ConfirmPasswordPage({ setUser }: ConfirmPasswordPageProps) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"working" | "ok" | "error">("working");
  const [message, setMessage] = useState("Confirming your password change...");

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setStatus("error");
      setMessage("This confirmation link is missing a token.");
      return;
    }

    apiClient
      .post("/auth/confirm-password-change", { token })
      .then(() => {
        clearSession();
        setUser(null);
        setStatus("ok");
        setMessage("Password updated. Sign in with your new password.");
        setTimeout(() => navigate("/auth", { replace: true }), 1800);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(
          err.response?.data?.error ||
            err.response?.data?.message ||
            "This confirmation link is invalid or expired."
        );
      });
  }, [params, setUser, navigate]);

  return (
    <div className="w-full min-h-dvh flex flex-col items-center justify-center p-6 text-center">
      {status === "working" ? (
        <Loader size="lg" label={message} />
      ) : (
        <p className={status === "ok" ? "text-[#00FF26]" : "text-red-400"}>{message}</p>
      )}
    </div>
  );
}
