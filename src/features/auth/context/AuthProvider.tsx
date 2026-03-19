import { createContext, useContext, useEffect, useState } from "react";
import { useMe } from "@/features/auth/hooks/useMe";
import { useLogout } from "../hooks/useLogout";

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
  const [user, setUser] = useState<AuthUser | null>(null);
  const postLogout = useLogout().mutate;

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
    postLogout();
    setUser(null);
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
