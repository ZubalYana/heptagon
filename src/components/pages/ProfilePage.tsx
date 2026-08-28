import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import type User from "../../interfaces/User";
import ProfilePanel from "../features/profile/ProfilePanel";
import AuthBackground from "../features/auth/AuthBackground";

interface ProfilePageProps {
  user: User;
  setUser: (user: User | null) => void;
}

export default function ProfilePage({ user, setUser }: ProfilePageProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="relative w-full min-h-dvh flex flex-col overflow-hidden">
      <AuthBackground />
      <div className="relative z-10 w-full flex flex-col p-[20px] lg:p-[40px]">
        <p
          className="flex items-center gap-x-1 text-[12px] text-[#888] hover:text-white transition-colors duration-200 cursor-pointer w-fit"
          onClick={() => navigate(`/app${location.search}`)}
        >
          <ArrowLeft className="w-3.75 h-3.75" />
          Back
        </p>
        <h1 className="text-[24px] lg:text-[32px] font-medium mt-2 mb-6">
          Profile
        </h1>
        <ProfilePanel user={user} setUser={setUser} />
      </div>
    </div>
  );
}
