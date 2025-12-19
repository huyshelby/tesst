export async function fetchApi(
  path: string,
  opts: RequestInit = {},
  { retryOn401 = true }: { retryOn401?: boolean } = {}
) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const headers = new Headers(opts.headers || {});
  const token = (await import("./token")).getAccessToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  // Attach anonymous cart session id for cart APIs
  try {
    const { getOrCreateSessionId } = await import("./cart-session");
    const sid = getOrCreateSessionId();
    if (sid) headers.set("x-session-id", sid);
  } catch {}
  headers.set(
    "Content-Type",
    headers.get("Content-Type") ?? "application/json"
  );

  const res = await fetch(`${base}${path}`, {
    ...opts,
    headers,
    credentials: "include", // gửi cookie refresh khi gọi /auth/refresh
  });

  if (res.status === 401 && retryOn401) {
    // thử refresh
    const ok = await tryRefresh();
    if (ok) {
      return fetchApi(path, opts, { retryOn401: false });
    }
  }

  return res;
}

async function tryRefresh(): Promise<boolean> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const res = await fetch(`${base}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) return false;

  const data = await res.json().catch(() => ({}));
  if (data?.accessToken) {
    (await import("./token")).setAccessToken(data.accessToken);
    return true;
  }
  return false;
}
