import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AuthBackground from "../features/auth/AuthBackground";
import AuthCard from "../features/auth/AuthCard";
import Alert from "../ui/Alert";
import type User from "../../interfaces/User";
import { getPasswordLevel } from "../ui/PasswordStrengthIndicator";
import { isValidEmail } from "../../helpers/isValidEmail";
import apiClient from "../../helpers/apiClient";
import { persistSession } from "../../helpers/session";

interface AuthPageProps {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export default function AuthPage({ setUser }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [alert, setAlert] = useState<{
    shown: boolean;
    type: "success" | "info" | "error";
    text: string;
  }>({ shown: false, type: "info", text: "" });

  const closeAlert = () => setAlert((prev) => ({ ...prev, shown: false }));
  const navigate = useNavigate();

  const handleAuthSuccess = (data: { token: string; refreshToken: string; user: User }) => {
    persistSession(data.token, data.refreshToken, data.user);
    setUser(data.user);
    navigate("/app");
  };

  const handleAuthError = (err: any) => {
    setAlert({
      shown: true,
      type: "error",
      text: err.response?.data?.error || err.response?.data?.message || err.message,
    });
  };

  const handleSignup = (name: string, email: string, password: string) => {
    if (!name || !email || !password) {
      setAlert({ shown: true, type: "error", text: "Fill in all the fields." });
      return;
    }
    if (getPasswordLevel(password) === 0) {
      setAlert({ shown: true, type: "error", text: "Password is too weak." });
      return;
    }
    if (!isValidEmail(email)) {
      setAlert({ shown: true, type: "error", text: "Enter a valid email address." });
      return;
    }
    apiClient
      .post("/auth/register", { name, email: email.trim(), password })
      .then(({ data }) => handleAuthSuccess(data))
      .catch(handleAuthError);
  };

  const handleLogin = (email: string, password: string) => {
    if (!email || !password) {
      setAlert({ shown: true, type: "error", text: "Fill in all the fields." });
      return;
    }
    apiClient
      .post("/auth/login", { email, password })
      .then(({ data }) => handleAuthSuccess(data))
      .catch(handleAuthError);
  };

  return (
    <div className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden bg-[#151515] text-white p-[20px] lg:p-[40px]">
      <AuthBackground />
      <AnimatePresence>
        {alert.shown && <Alert type={alert.type} text={alert.text} onClose={closeAlert} />}
      </AnimatePresence>
      <h1 className="relative z-10 text-[24px] font-medium lg:text-[32px]">
        Strike the 100% every day.
      </h1>
      <p className="relative z-10 text-[14px] font-light lg:text-[16px] text-gray-400 mt-2 text-center">
        Heptagon - set up your week from all 7 perspectives.
      </p>
      <AuthCard mode={mode} onSwitchMode={setMode} onLogin={handleLogin} onSignup={handleSignup} />
      <a
        href="/privacy"
        className="text-[10px] z-10 text-gray-500 hover:text-gray-400 w-full flex justify-center absolute bottom-[20px]"
      >
        Privacy Policy
      </a>
    </div>
  );
}