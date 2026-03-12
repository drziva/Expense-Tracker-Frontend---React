import { createContext, useContext, useEffect, useState } from "react";
import { useMe } from "@/features/auth/hooks/useMe";

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
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const hasToken = !!localStorage.getItem("token");
  const { data, isError } = useMe(hasToken);

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data]);

  useEffect(() => {
    if (isError) {
      localStorage.removeItem("token");
      setUser(null);
    }
  }, [isError]);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login"
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isPremium: !!user?.premium,
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
