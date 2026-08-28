import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loader from "../ui/Loader";
import type User from "../../interfaces/User";
import apiClient from "../../helpers/apiClient";

interface VerifyEmailPageProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

export default function VerifyEmailPage({ user, setUser }: VerifyEmailPageProps) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"working" | "ok" | "error">("working");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setStatus("error");
      setMessage("This verification link is missing a token.");
      return;
    }

    apiClient
      .post("/auth/verify-email", { token })
      .then(({ data }) => {
        if (user && data.user) {
          const next = { ...user, emailVerified: true };
          localStorage.setItem("user", JSON.stringify(next));
          setUser(next);
        }
        setStatus("ok");
        setMessage("Email verified. You can use Google sign-in with this address now.");
        setTimeout(() => navigate(user ? "/app" : "/auth", { replace: true }), 1500);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(
          err.response?.data?.error ||
            err.response?.data?.message ||
            "This verification link is invalid or expired."
        );
      });
  }, [params, user, setUser, navigate]);

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
