"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  getStoredUser,
  setStoredUser,
  removeStoredUser,
  logout as authLogout,
} from "@/lib/auth";
import type { AuthUser } from "@/types/auth";

// ─── External store ───────────────────────────────────────────────────────────
// Module-level cache: same reference until auth changes → no infinite loop.

const authListeners = new Set<() => void>();

// Initialize from localStorage once on client (module load).
// On server this stays null → server snapshot matches → no hydration mismatch.
let cachedUser: AuthUser | null =
  typeof window !== "undefined" ? getStoredUser() : null;

function subscribeToAuth(cb: () => void): () => void {
  authListeners.add(cb);
  return () => authListeners.delete(cb);
}

function getSnapshot(): AuthUser | null {
  return cachedUser;
}

function getServerSnapshot(): null {
  return null;
}

function updateCache(next: AuthUser | null): void {
  cachedUser = next;
  authListeners.forEach((cb) => cb());
}

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

  const user = useSyncExternalStore(
    subscribeToAuth,
    getSnapshot,
    getServerSnapshot,
  );

  // Guard: redirect to /login when not authenticated.
  useEffect(() => {
    if (user !== null) return;
    if (!PUBLIC_PATHS.includes(pathname) && !getStoredUser()) {
      router.push("/login");
    }
  }, [user, pathname, router]);

  const setUser = useCallback((next: AuthUser | null) => {
    if (next) {
      setStoredUser(next);
    } else {
      removeStoredUser();
    }
    updateCache(next);
  }, []);

  const logout = useCallback(() => {
    authLogout();
    updateCache(null);
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

