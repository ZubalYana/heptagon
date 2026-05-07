import type User from "../../interfaces/User";

interface UsersListProps {
  users: User[] | null;
}

export default function UsersList({ users }: UsersListProps) {
  if (!users || users.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-10">
        <p className="text-[13px] text-[#444] tracking-widest uppercase">
          No users found
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-y-2">
      <div className="w-full flex items-center gap-4">
        <span className="text-[11px] tracking-widest uppercase text-[#444] w-6">#</span>
        <span className="text-[11px] tracking-widest uppercase text-[#444] flex-1">Name</span>
        <span className="text-[11px] tracking-widest uppercase text-[#444] flex-1">Email</span>
      </div>

      {users.map((user, index) => (
        <div
          key={user.id}
          className="w-full px-4 py-3 flex items-center gap-4 rounded-lg border border-[#2a2a2a] bg-[#1B1B1B] hover:border-[#39FF14]/40 hover:bg-[#1f1f1f] transition-all duration-200 group"
        >
          <span className="text-[12px] text-[#333] w-6 font-mono group-hover:text-[#39FF14]/50 transition-colors duration-200">
            {String(index + 1).padStart(2, "0")}
          </span>

          <h3 className="flex-1 text-[14px] font-medium text-white truncate">
            {user.name}
          </h3>

          <div className="w-px h-4 bg-[#2a2a2a] group-hover:bg-[#39FF14]/20 transition-colors duration-200" />

          <p className="flex-1 text-[13px] text-[#888] truncate font-light">
            {user.email}
          </p>

          <div className="w-1.5 h-1.5 rounded-full bg-[#39FF14]/0 group-hover:bg-[#39FF14] transition-all duration-200 shadow-[0_0_6px_#39FF14]" />
        </div>
      ))}

      <p className="text-[11px] text-[#333] tracking-widest uppercase px-4 pt-2">
        {users.length} user{users.length !== 1 ? "s" : ""} total
      </p>
    </div>
  );
}