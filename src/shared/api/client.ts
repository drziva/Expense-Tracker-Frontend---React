import axios from "axios";
import { emitApiError } from "@/shared/api/errorEmitter";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config)=>{
  const token = localStorage.getItem("token");
  if(token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if(!navigator.onLine) {
    return Promise.reject(new Error("Network error: Please check your internet connection."));
  }

  return config;
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response.status;
    const message = error.response.data?.message || "Unexpected error occurred.";

    if(status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      emitApiError("Your token is no longer valid, please sign in again.")
    } 

    if(status >=500) {
      emitApiError(message);
    }
  
    return Promise.reject(error);
  }
)