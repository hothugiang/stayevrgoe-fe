import axios from "axios";
import { toast } from "sonner";

const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

service.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

service.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    if (err.response.status === 401) {
      if (err.response.data.message === "Session Expired") {
        localStorage.removeItem("token");
        // toast.error("Session expired");
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
        return;
      } else if (err.response.data.message === "No Authorization Header") {
        window.location.href = "/";
        return;
      }
    }
    // toast.error(err.response.data.message || err.response.data.error, {
    //   position: "top-center",
    // });
    return Promise.reject(err);
  },
);

export default service;
