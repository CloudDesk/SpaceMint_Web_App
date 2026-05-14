export type ApiResponse<T> = {
  data?: T;
  details?: string;
  message?: string;
  success?: boolean;
};

export function getApiRoot() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");

  if (!apiBaseUrl) {
    return "";
  }

  return apiBaseUrl.endsWith("/v1") ? apiBaseUrl : `${apiBaseUrl}/v1`;
}

export function getApiErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

export async function postApi<T>(path: string, body: unknown): Promise<T> {
  const apiRoot = getApiRoot();
  if (!apiRoot) throw new Error("API base URL is not configured.");

  const response = await fetch(`${apiRoot}${path}`, {
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || payload.success === false || !payload.data) {
    throw new Error(payload.details || payload.message || "Request failed.");
  }

  return payload.data;
}

export async function authenticatedApi<T>(
  path: string,
  token: string,
  options: {
    body?: unknown;
    method: "DELETE" | "GET" | "POST" | "PUT";
  },
): Promise<T> {
  const apiRoot = getApiRoot();
  if (!apiRoot) throw new Error("API base URL is not configured.");

  const response = await fetch(`${apiRoot}${path}`, {
    body: options.body ? JSON.stringify(options.body) : undefined,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
    method: options.method,
  });
  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || payload.success === false || !payload.data) {
    throw new Error(payload.details || payload.message || "Request failed.");
  }

  return payload.data;
}
