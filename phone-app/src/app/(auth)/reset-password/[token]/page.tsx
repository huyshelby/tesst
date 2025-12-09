"use client";

import { resetPassword } from "@/lib/auth-client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    try {
      await resetPassword(token, password);
      setMsg("Đặt lại mật khẩu thành công. Đang chuyển về trang đăng nhập...");
      setTimeout(() => router.push("/login"), 1000);
    } catch (e: any) {
      setErr(e?.message || "Không thể đặt lại mật khẩu");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-4 border p-6 rounded-xl"
      >
        <h1 className="text-2xl font-semibold">Đặt lại mật khẩu</h1>
        {err && <p className="text-red-600 text-sm">{err}</p>}
        {msg && <p className="text-green-600 text-sm">{msg}</p>}
        <div>
          <label className="block text-sm mb-1">Mật khẩu mới</label>
          <input
            className="w-full border px-3 py-2 rounded"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="w-full bg-black text-white py-2 rounded">
          Cập nhật mật khẩu
        </button>
      </form>
    </main>
  );
}
