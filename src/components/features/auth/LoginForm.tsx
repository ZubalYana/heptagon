import { useState } from "react";
import Input from "../../ui/Input";
import PrimaryButton from "../../ui/PrimaryButton";
import { isValidEmail } from "../../../helpers/isValidEmail";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  onSwitchToSignup: () => void;
}

export default function LoginForm({ onSubmit, onSwitchToSignup }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="w-full flex flex-col items-center">
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={
          email.length > 0 && !isValidEmail(email)
            ? "Enter a valid email address"
            : undefined
        }
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
          onClick={() => onSubmit(email, password)}
          disabled={!email || !password || !isValidEmail(email)}
        >
          Log in
        </PrimaryButton>
        <p
          className="text-[#707070] font-semibold text-[14px] cursor-pointer hover:text-white transition-all duration-300"
          onClick={onSwitchToSignup}
        >
          Sign up instead
        </p>
      </div>
    </div>
  );
}