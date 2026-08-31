import type User from "../interfaces/User";

export function normalizeUser(raw: unknown): User | null {
  if (!raw || typeof raw !== "object") return null;
  const u = raw as {
    id?: unknown;
    _id?: unknown;
    name?: string;
    email?: string;
    emailVerified?: boolean;
  };
  const id = u.id != null ? String(u.id) : u._id != null ? String(u._id) : "";
  if (!id || !u.name || !u.email) return null;
  return {
    id,
    name: u.name,
    email: u.email,
    emailVerified: u.emailVerified,
  };
}

export function persistSession(
  token: string,
  refreshToken: string,
  user?: User | null
) {
  localStorage.setItem("token", token);
  localStorage.setItem("refreshToken", refreshToken);
  if (user) {
    const next = normalizeUser(user);
    if (next) localStorage.setItem("user", JSON.stringify(next));
  }
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
}
