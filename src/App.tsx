import "./App.css";
import { useState, useEffect } from "react";
import WeekPage from "./components/pages/WeekPage";
import AuthPage from "./components/pages/AuthPage";
import DayFullPage from "./components/pages/DayFullPage";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import type User from "./interfaces/User";
import { setNavigator, setClearUser } from "./helpers/apiClient";
import { normalizeUser } from "./helpers/session";
import Privacy from "./components/pages/Privacy";
import Terms from "./components/pages/Terms";
import Admin from "./components/pages/Admin";
import AdminAuth from "./components/pages/AdminAuth";
import { setClearAdmin } from "./helpers/apiClient";
import Loader from "./components/ui/Loader";
import Landing from "./components/pages/landing/Landing";
import GoogleAuthCallback from "./components/pages/GoogleAuthCallback";
import VerifyEmailPage from "./components/pages/VerifyEmailPage";
import ProfilePage from "./components/pages/ProfilePage";
import ConfirmPasswordPage from "./components/pages/ConfirmPasswordPage";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem("adminToken"));
  const navigate = useNavigate();

  useEffect(() => {
    setNavigator(navigate);
    setClearUser(() => setUser(null));
    setClearAdmin(() => setIsAdmin(false));
  }, [navigate]);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const next = normalizeUser(JSON.parse(savedUser));
      if (next) {
        localStorage.setItem("user", JSON.stringify(next));
        setUser(next);
      }
    }
    setLoading(false);
  }, []);

  if (loading)
    return (
      <div className="w-full h-screen flex items-center justify-center absolute top-0 left-0">
        <Loader size="lg" label="Loading application..." />
      </div>
    );

  return (
    <div className="w-full min-h-dvh flex justify-center">
      <Routes>
        <Route
          path="/confirm-password"
          element={<ConfirmPasswordPage setUser={setUser} />}
        />
        <Route
          path="/verify-email"
          element={<VerifyEmailPage user={user} setUser={setUser} />}
        />
        <Route
          path="/auth/callback"
          element={<GoogleAuthCallback setUser={setUser} />}
        />
        <Route
          path="/auth"
          element={
            !user ? <AuthPage setUser={setUser} /> : <Navigate to="/app" />
          }
        />
        <Route
          path="/app"
          element={
            user ? <WeekPage user={user} /> : <Navigate to="/auth" />
          }
        />
        <Route
          path="/profile"
          element={
            user ? (
              <ProfilePage user={user} setUser={setUser} />
            ) : (
              <Navigate to="/auth" />
            )
          }
        />
        <Route
          path="/day/:dayId"
          element={user ? <DayFullPage /> : <Navigate to="/auth" />}
        />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/admin-auth" element={<AdminAuth setIsAdmin={setIsAdmin} />} />
        <Route path="/" element={<Landing/>}/>
        <Route
          path="/admin"
          element={isAdmin ? <Admin /> : <Navigate to="/admin-auth" />}
        />
        <Route path="*" element={<Navigate to="/app" />} />
      </Routes>
    </div>
  );
}

export default App;
