"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { resetPassword } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Page({ params }: { params: { token?: string } }) {
  const router = useRouter();
  const q = useSearchParams();

  // Ưu tiên token từ [token] param; nếu không có, fallback sang query ?token=...
  const token = params?.token ?? q.get("token") ?? "";

  const [pw, setPw] = React.useState("");
  const [pw2, setPw2] = React.useState("");
  const [show1, setShow1] = React.useState(false);
  const [show2, setShow2] = React.useState(false);

  const [err, setErr] = React.useState("");
  const [ok, setOk] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || ok) return; // tránh double-submit
    setErr("");
    setOk(false);

    if (!token) {
      setErr("Token không hợp lệ hoặc đã hết hạn.");
      return;
    }
    if (pw.length < 6) {
      setErr("Mật khẩu phải từ 6 ký tự.");
      return;
    }
    if (pw !== pw2) {
      setErr("Mật khẩu nhập lại không khớp.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, pw);
      setOk(true);
      setTimeout(() => router.push("/login"), 1000);
    } catch (e: any) {
      setErr(e?.message || "Đặt lại mật khẩu thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid place-items-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Đặt lại mật khẩu</CardTitle>
          <CardDescription>
            Nhập mật khẩu mới cho tài khoản của bạn
          </CardDescription>
        </CardHeader>

        <CardContent>
          {err && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{err}</AlertDescription>
            </Alert>
          )}
          {ok && (
            <Alert className="mb-4">
              <AlertDescription>Đặt lại mật khẩu thành công!</AlertDescription>
            </Alert>
          )}

          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu mới</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={show1 ? "text" : "password"}
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  disabled={loading}
                  required
                  autoComplete="new-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShow1((v) => !v)}
                  className={cn(
                    "absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-ring"
                  )}
                  aria-label={show1 ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  tabIndex={-1}
                >
                  {show1 ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Tối thiểu 6 ký tự. Nên dùng chữ hoa, số và ký tự đặc biệt.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password2">Nhập lại mật khẩu</Label>
              <div className="relative">
                <Input
                  id="password2"
                  type={show2 ? "text" : "password"}
                  value={pw2}
                  onChange={(e) => setPw2(e.target.value)}
                  disabled={loading}
                  required
                  autoComplete="new-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShow2((v) => !v)}
                  className={cn(
                    "absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-ring"
                  )}
                  aria-label={show2 ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  tabIndex={-1}
                >
                  {show2 ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading || ok}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang cập
                  nhật...
                </>
              ) : (
                "Đổi mật khẩu"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            <Link
              href="/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              Quay lại đăng nhập
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
