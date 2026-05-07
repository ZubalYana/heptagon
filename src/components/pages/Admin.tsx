import { AnimatePresence } from "framer-motion";
import Alert from "../customElements/Alert";
import { useState, useEffect } from "react";
import type User from "../../interfaces/User";
import UsersList from "../customElements/UsersList";
export default function Admin() {
  const [alert, setAlert] = useState<{
    shown: boolean;
    type: "success" | "info" | "error";
    text: string;
  }>({ shown: false, type: "info", text: "" });
  const [users, setUsers] = useState<User[] | null>(null);

  const closeAlert = () => setAlert((prev) => ({ ...prev, shown: false }));

  const baseBackendURL = import.meta.env.DEV
    ? "http://localhost:5000"
    : import.meta.env.VITE_API_URL;

  const getUsers = async () => {
    const adminToken = localStorage.getItem("adminToken");
    const res = await fetch(`${baseBackendURL}/admin/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer: ${adminToken}`,
        "Content-type": "application/json",
      },
    });
    const data = await res.json();
    console.log(data);
    setUsers(data);
  };

  useEffect(() => {
    getUsers();
  }, []);
  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-[#151515] text-white p-4">
      <AnimatePresence>
        {alert.shown && (
          <Alert type={alert.type} text={alert.text} onClose={closeAlert} />
        )}
      </AnimatePresence>
      <UsersList users={users}/>
    </div>
  );
}
