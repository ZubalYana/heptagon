import { useState } from "react";
import Input from "../../ui/Input";
import PrimaryButton from "../../ui/PrimaryButton";
import PasswordStrengthIndicator from "../../ui/PasswordStrengthIndicator";
import { isValidEmail } from "../../../helpers/isValidEmail";


interface SignupFormProps {
  onSubmit: (name: string, email: string, password: string) => void;
  onSwitchToLogin: () => void;
}

export default function SignupForm({ onSubmit, onSwitchToLogin }: SignupFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="w-full flex flex-col items-center">
      <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <div className="mt-3 w-full">
        <Input
          placeholder="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={
            email.length > 0 && !isValidEmail(email)
              ? "Enter a valid email address"
              : undefined
          }
        />
      </div>
      <div className="mt-3 w-full">
        <Input
          placeholder="Password"
          isSecret={true}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <PasswordStrengthIndicator value={password} />
      </div>
      <div className="w-full mt-5 flex flex-col items-center gap-3">
        <PrimaryButton
          className="w-full"
          onClick={() => onSubmit(name, email, password)}
          disabled={!name || !isValidEmail(email) || !password}
        >
          Sign up
        </PrimaryButton>
        <p
          className="text-[#707070] text-[12px] cursor-pointer hover:text-white transition-all duration-300"
          onClick={onSwitchToLogin}
        >
          Back to Log in
        </p>
      </div>
    </div>
  );
}