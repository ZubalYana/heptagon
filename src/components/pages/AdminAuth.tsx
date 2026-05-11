import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Input from "../customElements/Input";
import PrimaryButton from "../customElements/PrimaryButton";
import Alert from "../customElements/Alert";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [alert, setAlert] = useState<{
    shown: boolean;
    type: "success" | "info" | "error";
    text: string;
  }>({ shown: false, type: "info", text: "" });
  const baseBackendURL = import.meta.env.DEV
    ? "http://localhost:5000"
    : import.meta.env.VITE_API_URL;

  const closeAlert = () => setAlert((prev) => ({ ...prev, shown: false }));
  const navigate = useNavigate();

  async function logAdminIn() {
    try {
      const res = await fetch(`${baseBackendURL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAlert({
          shown: true,
          type: "error",
          text: data.message ?? "Login failed.",
        });
        return;
      }

      localStorage.setItem("adminToken", data.adminToken); // <-- save it
      navigate("/admin");
    } catch (err) {
      console.error("Failed to log admin in:", err);
      setAlert({ shown: true, type: "error", text: "Something went wrong." });
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-[#151515] text-white p-4 p-[20px] lg:p-[40px]">
      <AnimatePresence>
        {alert.shown && (
          <Alert type={alert.type} text={alert.text} onClose={closeAlert} />
        )}
      </AnimatePresence>

      <h1 className="text-[24px] font-medium lg:text-[32px]">Hi, admin!</h1>
      <p className="text-[14px] font-light lg:text-[16px] text-gray-400 mt-2 text-center">
        But prove to be one.
      </p>

      <div className="w-full h-auto p-[15px] mt-[20px] lg:w-[400px] lg:mt-[30px] lg:p-[20px] bg-[#1B1B1B] border border-[#2a2a2a] rounded-xl shadow-lg">
        <AnimatePresence mode="wait">
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
                disabled={!email || !password ? true : false}
                onClick={logAdminIn}
              >
                Log in
              </PrimaryButton>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
