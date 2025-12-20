"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function maskPhone(phone: string): string {
  const cleaned = (phone || "").replace(/\D/g, "");
  if (cleaned.length <= 4) return cleaned;
  const first = cleaned.slice(0, 2);
  const last = cleaned.slice(-2);
  return `${first}${"*".repeat(Math.max(0, cleaned.length - 4))}${last}`;
}

export default function NewAddressPage() {
  const router = useRouter();
  const [recipient, setRecipient] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [ward, setWard] = useState("");
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!recipient.trim() || !phone.trim() || !line1.trim()) {
      setError("Vui lòng nhập đầy đủ: người nhận, SĐT và địa chỉ");
      return;
    }

    // Client-only mock submit
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setSuccessMsg("Đã lưu (mock) – sẽ kết nối API sau");
      setTimeout(() => router.push("/account"), 700);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F5F7] py-8 md:py-12">
      <div className="content-container max-w-[800px]">
        <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
          <h1 className="text-xl md:text-2xl font-semibold mb-6">Thêm địa chỉ</h1>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="recipient">Người nhận</Label>
              <Input id="recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required inputMode="tel" />
              {phone ? (
                <p className="text-xs text-gray-500">Hiển thị: {maskPhone(phone)}</p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="line1">Địa chỉ</Label>
              <Input id="line1" value={line1} onChange={(e) => setLine1(e.target.value)} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="ward">Phường/Xã</Label>
                <Input id="ward" value={ward} onChange={(e) => setWard(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="district">Quận/Huyện</Label>
                <Input id="district" value={district} onChange={(e) => setDistrict(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="province">Tỉnh/Thành</Label>
                <Input id="province" value={province} onChange={(e) => setProvince(e.target.value)} />
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {successMsg && <p className="text-sm text-green-600">{successMsg}</p>}

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Đang lưu..." : "Lưu"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/account")}>Hủy</Button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

