import type User from "../../interfaces/User";
interface UsersListProps {
  users: User[] | null;
}
export default function UsersList({ users }: UsersListProps) {
  return (
    <div className="w-full flex flex-col gap-y-2">
      {users != null
        ? users.map((user) => (
            <div key={user.id} className="w-full px-4 py-2">
              <h3>{user.name}</h3>|<p>{user.email}</p>
            </div>
          ))
        : ""}
    </div>
  );
}
