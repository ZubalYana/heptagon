import "./App.css";
import { useState, useEffect } from "react";
import WeekPage from "./components/pages/WeekPage";
import AuthPage from "./components/pages/AuthPage";
import DayFullPage from "./components/pages/DayFullPage";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import type User from "./interfaces/User";
import { setNavigator } from "./helpers/apiClient";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  setNavigator(navigate);

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
      <div className="w-full h-screen p-[20px] lg:p-[40px] flex justify-center items-center overflow-y-auto overflow-x-hidden">
        <Routes>
          <Route
            path="/auth"
            element={
              !user ? <AuthPage setUser={setUser} /> : <Navigate to="/" />
            }
          />

          <Route
            path="/"
            element={user ? <WeekPage /> : <Navigate to="/auth" />}
          />

          <Route
            path="/day/:dayId"
            element={user ? <DayFullPage /> : <Navigate to="/auth" />}
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
  );
}

export default App;
