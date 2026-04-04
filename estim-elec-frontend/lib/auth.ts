import { apiFetch } from "@/lib/api";
import type { AuthUser, LoginResponse } from "@/types/auth";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

// ─── Token helpers ───────────────────────────────────────────────────────────

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// ─── Stored user helpers ──────────────────────────────────────────────────────

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function removeStoredUser(): void {
  localStorage.removeItem(USER_KEY);
}

// ─── Auth actions ─────────────────────────────────────────────────────────────

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await apiFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!response) {
    throw new Error("Réponse vide du serveur.");
  }

  setToken(response.accessToken);
  setStoredUser(response.user);

  return response;
}

export function logout(): void {
  removeToken();
  removeStoredUser();
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  return apiFetch<AuthUser>("/api/auth/me");
}
