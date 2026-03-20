import { createContext, useContext, useEffect, useState } from "react";
import { useMe } from "@/features/auth/hooks/useMe";
import { useLogout } from "../hooks/useLogout";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  premium: boolean;
  notifications: boolean;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isPremium: boolean;
  isLoading: boolean;
  isError: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const queryClient = useQueryClient();

  const { data, isError, isLoading } = useMe();

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data]);

  useEffect(() => {
    if (isError) {
      setUser(null);
    }
  }, [isError]);

  const logout = () => {
    queryClient.invalidateQueries({queryKey: [QUERY_KEYS.ME]});
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isPremium: !!user?.premium,
        isError,
        isLoading,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
