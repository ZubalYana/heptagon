import { useEffect, type Dispatch, type SetStateAction } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loader from "../ui/Loader";
import type User from "../../interfaces/User";
import { persistSession } from "../../helpers/session";

interface GoogleAuthCallbackProps {
  setUser: Dispatch<SetStateAction<User | null>>;
}

export default function GoogleAuthCallback({ setUser }: GoogleAuthCallbackProps) {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const error = params.get("error");
    if (error) {
      navigate(`/auth?error=${encodeURIComponent(error)}`, { replace: true });
      return;
    }

    const token = params.get("token");
    const refreshToken = params.get("refreshToken");
    const userRaw = params.get("user");

    if (!token || !refreshToken || !userRaw) {
      navigate("/auth?error=Google%20sign-in%20failed", { replace: true });
      return;
    }

    try {
      const user = JSON.parse(userRaw) as User;
      persistSession(token, refreshToken, user);
      setUser(user);
      navigate("/app", { replace: true });
    } catch {
      navigate("/auth?error=Google%20sign-in%20failed", { replace: true });
    }
  }, [navigate, params, setUser]);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Loader size="lg" label="Signing you in..." />
    </div>
  );
}
