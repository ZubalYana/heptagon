import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loader from "../ui/Loader";
import type User from "../../interfaces/User";
import { persistSession } from "../../helpers/session";
import apiClient from "../../helpers/apiClient";

interface GoogleAuthCallbackProps {
  setUser: Dispatch<SetStateAction<User | null>>;
}

export default function GoogleAuthCallback({ setUser }: GoogleAuthCallbackProps) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const error = params.get("error");
    if (error) {
      navigate(`/auth?error=${encodeURIComponent(error)}`, { replace: true });
      return;
    }

    const code = params.get("code");
    if (!code) {
      navigate("/auth?error=Google%20sign-in%20failed", { replace: true });
      return;
    }

    apiClient
      .post("/auth/google/exchange", { code })
      .then(({ data }) => {
        persistSession(data.token, data.refreshToken, data.user);
        setUser(data.user);
        navigate("/app", { replace: true });
      })
      .catch((err) => {
        const text =
          err.response?.data?.error || "Google sign-in failed";
        navigate(`/auth?error=${encodeURIComponent(text)}`, { replace: true });
      });
  }, [navigate, params, setUser]);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Loader size="lg" label="Signing you in..." />
    </div>
  );
}
