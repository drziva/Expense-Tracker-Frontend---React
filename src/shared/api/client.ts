import axios from "axios";
import { emitApiError, emitAuthError } from "@/shared/api/errorEmitter";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

api.interceptors.request.use((config)=>{
  if(!navigator.onLine) {
    return Promise.reject(new Error("Network error: Please check your internet connection."));
  }

  return config;
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response.status;
    const message = error.response.data?.message || "Unexpected error occurred.";

    if(originalRequest.url.includes("/auth/refresh")) {
      emitAuthError("Session expired. Please log in again.");
      return Promise.reject(error);
    }

    if(
      status === 401 &&
      originalRequest.url !== "/auth/login" &&
      originalRequest.url !== "/auth/signup" &&
      originalRequest.url !== "/auth/google"
    ) {
      if(originalRequest._retry) {
        emitAuthError(message);
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        await api.post("/auth/refresh");
        return api(originalRequest);
      } catch (error){
        emitAuthError("Session expired. Please log in again.");
        return Promise.reject(error);
      }
    }

    if(status >=500) {
      emitApiError(message);
    }
  
    return Promise.reject(error);
  }
)