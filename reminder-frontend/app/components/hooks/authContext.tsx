import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "../../lib/types/users";



type AuthContextType = {
  user: User | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
        credentials: "include",
      });

      if (!res.ok) {
       
        setUser(null);
        return;
      }

      const data = await res.json();
      setUser(data.user);
    } finally {
      setLoading(false);
     console.log("refresh() called");
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return {
     
    user: ctx.user,
    loading: ctx.loading,
    refresh: ctx.refresh,
    isLoggedIn: !!ctx.user,
  
  };
}
