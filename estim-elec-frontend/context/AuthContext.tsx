"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { getStoredUser, setStoredUser, logout as authLogout } from "@/lib/auth";
import type { AuthUser } from "@/types/auth";

// ─── Context type ─────────────────────────────────────────────────────────────

type AuthContextValue = {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

const PUBLIC_PATHS = ["/login"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Lazy initializer: reads localStorage once on first client render.
  const [user, setUserState] = useState<AuthUser | null>(() => getStoredUser());

  // Guard: redirect to /login if not authenticated.
  useEffect(() => {
    if (!user && !PUBLIC_PATHS.includes(pathname)) {
      router.push("/login");
    }
  }, [user, pathname, router]);

  const setUser = useCallback((next: AuthUser | null) => {
    if (next) {
      setStoredUser(next);
    }
    setUserState(next);
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setUserState(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
