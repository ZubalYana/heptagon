import { AnimatePresence, motion } from "framer-motion";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

interface AuthCardProps {
  mode: "login" | "signup";
  onSwitchMode: (mode: "login" | "signup") => void;
  onLogin: (email: string, password: string) => void;
  onSignup: (name: string, email: string, password: string) => void;
}

export default function AuthCard({ mode, onSwitchMode, onLogin, onSignup }: AuthCardProps) {
  return (
    <div className="relative z-10 w-full h-auto p-[15px] mt-[20px] lg:w-[400px] lg:mt-[30px] lg:p-[20px] bg-[#1B1B1B] border border-[#2a2a2a] rounded-xl shadow-lg">
      <AnimatePresence mode="wait">
        {mode === "login" ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            <LoginForm onSubmit={onLogin} onSwitchToSignup={() => onSwitchMode("signup")} />
          </motion.div>
        ) : (
          <motion.div
            key="signup"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <SignupForm onSubmit={onSignup} onSwitchToLogin={() => onSwitchMode("login")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}