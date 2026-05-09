import "./App.css";
import { useState, useEffect } from "react";
import WeekPage from "./components/pages/WeekPage";
import AuthPage from "./components/pages/AuthPage";
import DayFullPage from "./components/pages/DayFullPage";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import type User from "./interfaces/User";
import { setNavigator, setClearUser } from "./helpers/apiClient";
import Privacy from "./components/pages/Privacy";
import Terms from "./components/pages/Terms";
// import Admin from "./components/pages/Admin";
// import AdminAuth from "./components/pages/AdminAuth";
// import { setClearAdmin } from "./helpers/apiClient";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem("adminToken"));
  const navigate = useNavigate();

  useEffect(() => {
    setNavigator(navigate);
    setClearUser(() => setUser(null));
    // setClearAdmin(() => setIsAdmin(false));
  }, [navigate]);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  //To be replaced with a proper loader later
  if (loading) return <div>Loading...</div>;

  return (
    <div className="w-full p-[20px] lg:p-[40px] flex justify-center md:items-center md:overflow-y-auto">
      <Routes>
        <Route
          path="/auth"
          element={!user ? <AuthPage setUser={setUser} /> : <Navigate to="/" />}
        />
        <Route
          path="/"
          element={
            user ? <WeekPage setUser={setUser} /> : <Navigate to="/auth" />
          }
        />
        <Route
          path="/day/:dayId"
          element={user ? <DayFullPage /> : <Navigate to="/auth" />}
        />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        {/* <Route path="/admin-auth" element={<AdminAuth />} />
        <Route
          path="/admin"
          element={isAdmin ? <Admin /> : <Navigate to="/admin-auth" />}
        /> */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
