import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import type { NavigateFunction } from "react-router-dom";
import { clearSession, persistSession } from "./session";

let navigator: NavigateFunction;
let navigatorReady = false;
let isRedirecting = false;
let clearUser: (() => void) | null = null;
let clearAdmin: (() => void) | null = null;
let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const PUBLIC_401_ROUTES = ["/calendar/events", "/calendar/status"];
const AUTH_SKIP_REFRESH = ["/auth/login", "/auth/register", "/auth/refresh", "/auth/google", "/auth/verify-email"];

export const setNavigator = (nav: NavigateFunction) => {
  navigator = nav;
  navigatorReady = true;
};

export const setClearUser = (fn: () => void) => {
  clearUser = fn;
};

export const setClearAdmin = (fn: () => void) => {
  clearAdmin = fn;
};

const baseURL = import.meta.env.DEV
  ? "http://localhost:5000"
  : import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL,
});

function isSkipRefresh(url?: string) {
  if (!url) return false;
  return AUTH_SKIP_REFRESH.some((route) => url.includes(route));
}

function isPublic401(url?: string) {
  if (!url) return false;
  return PUBLIC_401_ROUTES.some((route) => url.includes(route));
}

function forceLogout() {
  if (isRedirecting) return;
  isRedirecting = true;
  const refreshToken = localStorage.getItem("refreshToken");
  if (refreshToken) {
    axios.post(`${baseURL}/auth/logout`, { refreshToken }).catch(() => {});
  }
  clearSession();
  clearUser?.();

  if (navigatorReady && navigator) {
    setTimeout(() => {
      isRedirecting = false;
    }, 500);
    navigator("/auth", { replace: true });
  } else {
    window.location.replace("/auth");
  }
}

function processRefreshQueue(error: unknown, token: string | null) {
  refreshQueue.forEach((pending) => {
    if (error || !token) pending.reject(error);
    else pending.resolve(token);
  });
  refreshQueue = [];
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    throw new Error("No refresh token");
  }

  const { data } = await axios.post(`${baseURL}/auth/refresh`, { refreshToken });
  persistSession(data.token, data.refreshToken);
  return data.token as string;
}

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const status = error.response?.status;
    const url = originalRequest?.url;
    const expired =
      status === 401 &&
      (error.response?.data as { code?: string; message?: string } | undefined)
        ?.code === "TOKEN_EXPIRED";

    if (
      expired &&
      originalRequest &&
      !originalRequest._retry &&
      !isSkipRefresh(url)
    ) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const token = await refreshAccessToken();
        processRefreshQueue(null, token);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processRefreshQueue(refreshError, null);
        if (!isPublic401(url)) {
          forceLogout();
          return new Promise(() => {});
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const is401 = status === 401;
    if (is401 && !isPublic401(url) && !isSkipRefresh(url) && !isRedirecting) {
      forceLogout();
      return new Promise(() => {});
    }

    if (
      error.response?.status === 403 &&
      !isRedirecting &&
      clearAdmin &&
      error.config?.url?.includes("/admin")
    ) {
      isRedirecting = true;
      localStorage.removeItem("adminToken");
      clearAdmin?.();
      navigator("/admin-auth", { replace: true });
      setTimeout(() => {
        isRedirecting = false;
      }, 500);
      return new Promise(() => {});
    }

    return Promise.reject(error);
  }
);

export default apiClient;
