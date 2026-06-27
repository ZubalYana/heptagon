import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Input from "../customElements/Input";
import PrimaryButton from "../customElements/PrimaryButton";
import Alert from "../customElements/Alert";
import { useNavigate } from "react-router-dom";
import type User from "../../interfaces/User";
import PasswordStrengthIndicator, {
  getPasswordLevel,
} from "../PasswordStrengthIndicator";
import apiClient from "../../helpers/apiClient";

interface AuthPageProps {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}
export default function AuthPage({ setUser }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [alert, setAlert] = useState<{
    shown: boolean;
    type: "success" | "info" | "error";
    text: string;
  }>({ shown: false, type: "info", text: "" });

  const closeAlert = () => setAlert((prev) => ({ ...prev, shown: false }));
  const navigate = useNavigate();

  const signup = () => {
    if (!name || !email || !password) {
      setAlert({ shown: true, type: "error", text: "Fill in all the fields." });
      return;
    }
    if (getPasswordLevel(password) === 0) {
      setAlert({ shown: true, type: "error", text: "Password is too weak." });
      return;
    }
    apiClient
      .post("/auth/register", { name, email, password })
      .then(({ data }) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        navigate("/app");
      })
      .catch((err) => {
        setAlert({
          shown: true,
          type: "error",
          text: err.response?.data?.message || err.message,
        });
      });
  };

  const login = () => {
    if (!email || !password) {
      setAlert({ shown: true, type: "error", text: "Fill in all the fields." });
      return;
    }
    apiClient
      .post("/auth/login", { email, password })
      .then(({ data }) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        navigate("/app");
      })
      .catch((err) => {
        setAlert({
          shown: true,
          type: "error",
          text: err.response?.data?.message || err.message,
        });
      });
  };

  return (
    <div className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden bg-[#151515] text-white p-[20px] lg:p-[40px]">
      <div className="absolute inset-0">
        <div className="absolute top-[-10%] left-[-15%] w-[380px] h-[380px] lg:w-[560px] lg:h-[560px] rounded-full bg-[#00FF26]/[0.07] blur-[100px] lg:blur-[130px]" />
        <div className="absolute bottom-[-15%] right-[-15%] w-[380px] h-[380px] lg:w-[560px] lg:h-[560px] rounded-full bg-[#00FF26]/[0.05] blur-[100px] lg:blur-[130px]" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>
      <AnimatePresence>
        {alert.shown && (
          <Alert type={alert.type} text={alert.text} onClose={closeAlert} />
        )}
      </AnimatePresence>
      <h1 className="relative z-10 text-[24px] font-medium lg:text-[32px]">
        Strike the 100% every day.
      </h1>
      <p className="relative z-10 text-[14px] font-light lg:text-[16px] text-gray-400 mt-2 text-center">
        Heptagon - set up your week from all 7 perspectives.
      </p>
      <div className="relative z-10 w-full h-auto p-[15px] mt-[20px] lg:w-[400px] lg:mt-[30px] lg:p-[20px] bg-[#1B1B1B] border border-[#2a2a2a] rounded-xl shadow-lg">
        <AnimatePresence mode="wait">
          {mode === "login" ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full flex flex-col items-center"
            >
              <Input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="mt-4 w-full">
                <Input
                  placeholder="Password"
                  isSecret={true}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="w-full mt-8 flex flex-col items-center gap-3">
                <PrimaryButton
                  className="w-full lg:w-[60%]"
                  onClick={login}
                  disabled={!email || !password ? true : false}
                >
                  Log in
                </PrimaryButton>
                <p
                  className="text-[#707070] font-semibold text-[14px] cursor-pointer hover:text-white transition-all duration-300"
                  onClick={() => setMode("signup")}
                >
                  Sign up instead
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full flex flex-col items-center"
            >
              <Input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <div className="mt-4 w-full">
                <Input
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mt-4 w-full">
                <Input
                  placeholder="Password"
                  isSecret={true}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <PasswordStrengthIndicator value={password} />
              </div>
              <div className="w-full mt-8 flex flex-col items-center gap-3">
                <PrimaryButton
                  className="w-full lg:w-[60%]"
                  onClick={signup}
                  disabled={!name || !email || !password ? true : false}
                >
                  Sign up
                </PrimaryButton>
                <p
                  className="text-[#707070] font-semibold text-[14px] cursor-pointer hover:text-white transition-all duration-300"
                  onClick={() => setMode("login")}
                >
                  Back to Log in
                </p>
              </div>
            </motion.div>
          )}
          <a
            href="/privacy"
            className="text-[10px] text-gray-500 hover:text-gray-400 w-full flex justify-center mt-4"
          >
            Privacy Policy
          </a>
        </AnimatePresence>
      </div>
    </div>
  );
}
