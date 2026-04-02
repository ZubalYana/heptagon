import "./App.css";
import { useState, useEffect } from "react";
import WeekPage from "./components/pages/WeekPage";
import AuthPage from "./components/pages/AuthPage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import type User from "./interfaces/User";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
    <BrowserRouter>
    <div className="w-full h-full p-[20px] lg:p-[40px] flex justify-center items-center">
      <Routes>
        <Route
          path="/auth"
          element={!user? <AuthPage setUser={setUser} /> : <Navigate to='/'/>}
        />

        <Route
          path="/"
          element={user? <WeekPage/> : <Navigate to='/auth'/>}
        />

        <Route path="*" element={<Navigate to="/"/>}/>
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
