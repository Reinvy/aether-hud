/**
 * api-client.ts — the single mutation/read path for dashboard views.
 *
 * Every fetch that writes previously ignored `res.ok`, so a 401, a 503 in
 * static-data mode or a validation error was swallowed into `console.error`
 * and the UI silently showed stale data. `apiRequest`/`apiGet` surface the
 * server's `{ error }` message as an `ApiError`, and a lost session sends the
 * operator back to the login screen instead of failing quietly.
 */

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const JSON_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
} as const;

/** Server `{ error }` payload when present, else a status-derived message. */
async function errorMessage(res: Response): Promise<string> {
  try {
    const body: unknown = await res.json();
    if (typeof body === "object" && body !== null && "error" in body) {
      const { error } = body as { error?: unknown };
      if (typeof error === "string" && error.length > 0) return error;
    }
  } catch {
    // Non-JSON error bodies (proxy pages, timeouts) fall through.
  }
  return `Request failed (HTTP ${res.status})`;
}

async function unwrap<T>(res: Response): Promise<T> {
  if (res.status === 401) {
    const message = await errorMessage(res);
    if (typeof window !== "undefined") window.location.assign("/login");
    throw new ApiError(message, 401);
  }
  if (!res.ok) throw new ApiError(await errorMessage(res), res.status);
  return (await res.json()) as T;
}

export async function apiGet<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  return unwrap<T>(res);
}

export async function apiRequest<T>(
  url: string,
  init: { method: "POST" | "PUT" | "DELETE"; body?: unknown }
): Promise<T> {
  const res = await fetch(url, {
    method: init.method,
    headers: JSON_HEADERS,
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
  return unwrap<T>(res);
}
