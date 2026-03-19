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
  (error) => {
    const status = error.response.status;
    const message = error.response.data?.message || "Unexpected error occurred.";

    if(status === 401) emitAuthError("Unauthorized: Please log in again.");

    if(status >=500) {
      emitApiError(message);
    }
  
    return Promise.reject(error);
  }
)