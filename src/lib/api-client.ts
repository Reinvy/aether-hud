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
  /** Per-field messages from a rejected write body (`400 { error, fields }`). */
  readonly fields: Record<string, string>;

  constructor(message: string, status: number, fields: Record<string, string> = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fields = fields;
  }
}

const JSON_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
} as const;

interface ErrorBody {
  message: string;
  fields: Record<string, string>;
}

/** Server `{ error, fields }` payload when present, else a status-derived message. */
async function errorBody(res: Response): Promise<ErrorBody> {
  try {
    const body: unknown = await res.json();
    if (typeof body === "object" && body !== null && "error" in body) {
      const { error, fields } = body as { error?: unknown; fields?: unknown };
      const message =
        typeof error === "string" && error.length > 0
          ? error
          : `Request failed (HTTP ${res.status})`;
      return {
        message,
        fields: typeof fields === "object" && fields !== null
          ? (fields as Record<string, string>)
          : {},
      };
    }
  } catch {
    // Non-JSON error bodies (proxy pages, timeouts) fall through.
  }
  return { message: `Request failed (HTTP ${res.status})`, fields: {} };
}

async function unwrap<T>(res: Response, redirectOn401: boolean): Promise<T> {
  if (res.status === 401) {
    const { message } = await errorBody(res);
    if (redirectOn401 && typeof window !== "undefined") window.location.assign("/login");
    throw new ApiError(message, 401);
  }
  if (!res.ok) {
    const { message, fields } = await errorBody(res);
    throw new ApiError(message, res.status, fields);
  }
  return (await res.json()) as T;
}

/**
 * Authenticated GET. `redirectOn401` defaults to true: a lost session bounces
 * the operator to the sign-in screen. The login request itself passes `false`
 * so a wrong password renders inline instead of reloading the page away.
 */
export async function apiGet<T>(
  url: string,
  options?: { redirectOn401?: boolean }
): Promise<T> {
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  return unwrap<T>(res, options?.redirectOn401 ?? true);
}

export async function apiRequest<T>(
  url: string,
  init: {
    method: "POST" | "PUT" | "DELETE";
    body?: unknown;
    redirectOn401?: boolean;
  }
): Promise<T> {
  const res = await fetch(url, {
    method: init.method,
    headers: JSON_HEADERS,
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    cache: "no-store",
  });
  return unwrap<T>(res, init.redirectOn401 ?? true);
}
