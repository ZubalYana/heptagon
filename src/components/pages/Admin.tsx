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
    <div className="w-full h-full flex flex-col items-center bg-[#151515] text-white">
      <AnimatePresence>
        {alert.shown && (
          <Alert type={alert.type} text={alert.text} onClose={closeAlert} />
        )}
      </AnimatePresence>

      <div className="w-full flex items-center justify-between mb-6 lg:mb-12">
        <div className="flex gap-x-2 items-center">
          <img
            src="/heptagonLogo.svg"
            alt="Heptagon Logo"
            className="w-[35px] h-[35px]"
          />
          <h2 className="text-[20px] font-medium">Heptagon | Admin</h2>
        </div>
      </div>

      <div className="w-full flex-col flex gap-x-4 lg:flex-row">
        <div className="w-full lg:w-[50%]">
            <UsersList users={users}/>
        </div>
      </div>
      
    </div>
  );
}
