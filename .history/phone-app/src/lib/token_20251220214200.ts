let accessToken: string | null = null;
const KEY = "access_token";

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (typeof window !== "undefined") {
    try {
      if (token) localStorage.setItem(KEY, token);
      else localStorage.removeItem(KEY);
    } catch {}
  }
}

export function getAccessToken(): string | null {
  if (accessToken) return accessToken;
  if (typeof window !== "undefined") {
    try {
      const t = localStorage.getItem(KEY);
      accessToken = t;
      return t;
    } catch {}
  }
  return null;
}

export function clearAccessToken() {
  setAccessToken(null);
}
