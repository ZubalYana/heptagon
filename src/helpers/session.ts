import type User from "../interfaces/User";

export function persistSession(
  token: string,
  refreshToken: string,
  user?: User | null
) {
  localStorage.setItem("token", token);
  localStorage.setItem("refreshToken", refreshToken);
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  }
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
}
