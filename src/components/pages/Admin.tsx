import { AnimatePresence } from "framer-motion";
import Alert from "../customElements/Alert";
import { useState, useEffect } from "react";
import type User from "../../interfaces/User";
import UsersList from "../customElements/UsersList";
import apiClient from "../../helpers/apiClient";
import FeedbacksList from "../customElements/FeedbackList";
import type Feedback from "../../interfaces/Feedback";

export default function Admin() {
  const [alert, setAlert] = useState<{
    shown: boolean;
    type: "success" | "info" | "error";
    text: string;
  }>({ shown: false, type: "info", text: "" });
  const [users, setUsers] = useState<User[] | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[] | null>(null);

  const closeAlert = () => setAlert((prev) => ({ ...prev, shown: false }));
  const getUsers = async () => {
    const res = await apiClient.get("/admin/users");
    setUsers(res.data);
  };

  const getFeedbacks = async () => {
    const res = await apiClient.get("/feedback/all");
    setFeedbacks(res.data);
  }

  useEffect(() => {
    getUsers();
    getFeedbacks();
  }, []);
  return (
    <div className="w-full h-full flex flex-col items-center bg-[#151515] text-white p-[20px] lg:p-[40px]">
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

      <div className="w-full flex-col flex gap-x-6 lg:flex-row">
        <div className="w-full lg:w-[35%]">
          <h3 className="mb-4">Registered Users:</h3>
          <UsersList users={users} onUserDeleted={(id)=> setUsers(prev => prev?.filter(u => u._id != id) ?? null)} />
        </div>
        <div className="w-full lg:w-[65%]">
          <h3 className="mb-4">Received Feedback:</h3>
          <FeedbacksList feedbacks={feedbacks}/>
        </div>
      </div>
    </div>
  );
}
