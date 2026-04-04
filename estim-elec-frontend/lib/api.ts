const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function buildApiUrl(path: string): string {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }

  const normalizedBaseUrl = API_BASE_URL.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${normalizedBaseUrl}${normalizedPath}`;
}

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const errorBody = await response.json();

    if (
      errorBody &&
      typeof errorBody === "object" &&
      "error" in errorBody &&
      errorBody.error &&
      typeof errorBody.error === "object" &&
      "message" in errorBody.error &&
      typeof errorBody.error.message === "string" &&
      errorBody.error.message.trim() !== ""
    ) {
      return errorBody.error.message;
    }

    if (
      errorBody &&
      typeof errorBody === "object" &&
      "message" in errorBody &&
      typeof errorBody.message === "string" &&
      errorBody.message.trim() !== ""
    ) {
      return errorBody.message;
    }
  } catch {
    // Ignore JSON parse errors and fallback to text/default message.
  }

  try {
    const text = await response.text();

    if (text.trim() !== "") {
      return text;
    }
  } catch {
    // Ignore text parse errors and fallback to status message.
  }

  return `HTTP ${response.status} ${response.statusText}`;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T | null> {
  const method = (options.method ?? "GET").toUpperCase();
  const isGetRequest = method === "GET";

  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(buildApiUrl(path), {
    ...options,
    method,
    headers,
    cache: isGetRequest ? (options.cache ?? "no-store") : options.cache,
  });

  if (!response.ok) {
    const message = await parseErrorMessage(response);
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("Content-Type") ?? "";

  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }

  const text = await response.text();
  return (text as T) ?? null;
}