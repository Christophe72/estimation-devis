const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type ValidationErrors = Record<string, string>;

export class ApiError extends Error {
  status: number;
  validationErrors?: ValidationErrors;

  constructor(message: string, status: number, validationErrors?: ValidationErrors) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.validationErrors = validationErrors;
  }
}

function buildApiUrl(path: string): string {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }

  const normalizedBaseUrl = API_BASE_URL.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${normalizedBaseUrl}${normalizedPath}`;
}

async function parseErrorResponse(
  response: Response,
): Promise<{ message: string; validationErrors?: ValidationErrors }> {
  try {
    const errorBody = await response.json();

    const validationErrors =
      errorBody &&
      typeof errorBody === "object" &&
      "validationErrors" in errorBody &&
      errorBody.validationErrors &&
      typeof errorBody.validationErrors === "object"
        ? (errorBody.validationErrors as ValidationErrors)
        : undefined;

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
      return { message: errorBody.error.message, validationErrors };
    }

    if (
      errorBody &&
      typeof errorBody === "object" &&
      "message" in errorBody &&
      typeof errorBody.message === "string" &&
      errorBody.message.trim() !== ""
    ) {
      return { message: errorBody.message, validationErrors };
    }

    if (validationErrors && Object.keys(validationErrors).length > 0) {
      return {
        message: "Erreur de validation.",
        validationErrors,
      };
    }
  } catch {
    // Ignore JSON parse errors and fallback to text/default message.
  }

  try {
    const text = await response.text();

    if (text.trim() !== "") {
      return { message: text };
    }
  } catch {
    // Ignore text parse errors and fallback to status message.
  }

  return { message: `HTTP ${response.status} ${response.statusText}` };
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
    const { message, validationErrors } = await parseErrorResponse(response);
    throw new ApiError(message, response.status, validationErrors);
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