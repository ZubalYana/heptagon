import axios from "axios";
import type { NavigateFunction } from "react-router-dom";

let navigator: NavigateFunction;
let navigatorReady = false;
let isRedirecting = false;
let clearUser: (() => void) | null = null;
let clearAdmin: (() => void) | null = null;

const PUBLIC_401_ROUTES = ["/calendar/events", "/calendar/status"];

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

const apiClient = axios.create({
  baseURL: import.meta.env.DEV
    ? "http://localhost:5000"
    : import.meta.env.VITE_API_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const is401 = error.response?.status === 401;
    const isPublicRoute = PUBLIC_401_ROUTES.some((route) =>
      error.config?.url?.includes(route)
    );

    if (is401 && !isPublicRoute && !isRedirecting) {
      isRedirecting = true;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      clearUser?.();

      if (navigatorReady && navigator) {
        setTimeout(() => {
          isRedirecting = false;
        }, 500);
        navigator("/auth", { replace: true });
      } else {
        window.location.replace("/auth");
      }

      return new Promise(() => {});
    }

    if (error.response?.status === 403 && !isRedirecting) {
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
