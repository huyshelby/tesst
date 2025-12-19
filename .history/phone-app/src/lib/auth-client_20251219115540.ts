import { fetchApi } from "./api";
import { setAccessToken } from "./token";

export type User = {
  id: string;
  name?: string;
  email: string;
  role?: string;
  avatar?: string;
};

export async function login(email: string, password: string) {
  const res = await fetchApi(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
    { retryOn401: false }
  );

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Đăng nhập thất bại");

  // backend trả { accessToken, user }
  if (data.accessToken) setAccessToken(data.accessToken);
  return data as { accessToken: string; user: User };
}

export async function register(payload: {
  name?: string;
  email: string;
  password: string;
}) {
  const res = await fetchApi(
    "/auth/register",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    { retryOn401: false }
  );

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Đăng ký thất bại");
  return data;
}

export async function logout() {
  try {
    await fetchApi("/auth/logout", { method: "POST" }, { retryOn401: false });
  } finally {
    setAccessToken(null);
  }
}

export async function forgotPassword(email: string) {
  const res = await fetchApi(
    "/password/forgot",
    {
      method: "POST",
      body: JSON.stringify({ email }),
    },
    { retryOn401: false }
  );
  if (!res.ok) throw new Error("Gửi yêu cầu thất bại");
}

export async function resetPassword(token: string, password: string) {
  const res = await fetchApi(
    "/password/reset",
    {
      method: "POST",
      body: JSON.stringify({ token, password }),
    },
    { retryOn401: false }
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Không thể đặt lại mật khẩu");
}

export async function fetchMe(): Promise<User | null> {
  const res = await fetchApi("/auth/me", { method: "GET" });
  if (res.ok) return res.json();
  return null;
}

// React Hook for auth state
import { useState, useEffect } from "react";
import { getAccessToken } from "./token";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = getAccessToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await fetchMe();
        setUser(userData);
      } catch (err) {
        console.error("Failed to load user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return { user, loading, setUser };
}
