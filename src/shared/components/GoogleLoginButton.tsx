import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useQueryClient } from "@tanstack/react-query";

export function GoogleLoginButton() {
  // const navigate = useNavigate();
  // const queryClient = useQueryClient();

  // console.log("GOOGLE CLIENT ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);

  // const handleCredentialResponse = async (response: any) => {
  //   try {
  //     await api.post("/auth/google", {
  //       credential: response.credential,
  //     });

  //     await queryClient.invalidateQueries({ queryKey: ["me"] });
  //     navigate("/");
  //   } catch (error) {
  //     console.error("Google login failed", error);
  //   }
  // };

  // useEffect(() => {
  //   const tryInitialize = () => {
  //     const google = window.google as any;

  //     if (!google?.accounts?.id) {
  //       return false;
  //     }

  //     google.accounts.id.initialize({
  //       client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  //       callback: handleCredentialResponse,
  //     });

  //     google.accounts.id.renderButton(
  //       document.getElementById("google-login-btn")!,
  //       {
  //         theme: "outline",
  //         size: "large",
  //         shape: "pill",
  //         text: "continue_with",
  //       }
  //     );

  //     return true;
  //   };

  //   if (tryInitialize()) return;

  //   const interval = setInterval(() => {
  //     if (tryInitialize()) {
  //       clearInterval(interval);
  //     }
  //   }, 100);

  //   return () => clearInterval(interval);
  // }, []);

  // return <div id="google-login-btn" />;
  return null;
}