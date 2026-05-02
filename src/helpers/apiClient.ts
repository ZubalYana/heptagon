import axios from "axios";
import type { NavigateFunction } from "react-router-dom";

let navigator: NavigateFunction;
let navigatorReady = false;
let isRedirecting = false;
const PUBLIC_401_ROUTES = ['/calendar/events', '/calendar/status'];

export const setNavigator = (nav: NavigateFunction) => {
  navigator = nav;
  navigatorReady = true;
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
    if (
  error.response?.status === 401 &&
  !isRedirecting &&
  !PUBLIC_401_ROUTES.some(route => error.config?.url?.includes(route))
) {
  isRedirecting = true;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigator("/auth", { replace: true });
}
    return Promise.reject(error);
  }
);

export default apiClient;
