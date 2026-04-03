import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Input from "../customElements/Input";
import PrimaryButton from "../customElements/PrimaryButton";
import Alert from "../customElements/Alert";
import { useNavigate } from "react-router-dom";
import type User from "../../interfaces/User";

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
    }
    fetch("http://localhost:5000/auth/register", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        setAlert({ shown: true, type: "error", text: err.message });
      });
  };

  const login = () => {
    if (!email || !password) {
      setAlert({ shown: true, type: "error", text: "Fill in all the fields." });
    }

    fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        setAlert({ shown: true, type: "error", text: err.message });
      });
  };

  return (
    <div className="w-full h-full min-h-screen flex flex-col justify-center items-center bg-[#151515] text-white p-4">
      <AnimatePresence>
        {alert.shown && (
          <Alert type={alert.type} text={alert.text} onClose={closeAlert} />
        )}
      </AnimatePresence>

      <h1 className="text-[18px] font-medium lg:text-[32px]">
        Strike the 100% every day.
      </h1>
      <p className="text-[14px] font-light lg:text-[16px] text-gray-400 mt-2">
        Heptagon - set up your week from all 7 perspectives.
      </p>

      <div className="w-full h-auto p-[15px] mt-[20px] lg:w-[400px] lg:mt-[30px] lg:p-[20px] bg-[#1B1B1B] border border-[#2a2a2a] rounded-xl shadow-lg">
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
                <PrimaryButton className="w-full lg:w-[60%]" onClick={login}>
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
              </div>
              <div className="w-full mt-8 flex flex-col items-center gap-3">
                <PrimaryButton className="w-full lg:w-[60%]" onClick={signup}>
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
        </AnimatePresence>
      </div>
    </div>
  );
}
