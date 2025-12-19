"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  notes: string;
}

interface CustomerInfoFormProps {
  value: CustomerInfo;
  onChange: (info: CustomerInfo) => void;
  errors?: Partial<Record<keyof CustomerInfo, string>>;
}

export function CustomerInfoForm({
  value,
  onChange,
  errors = {},
}: CustomerInfoFormProps) {
  const handleChange = (field: keyof CustomerInfo, val: string) => {
    onChange({ ...value, [field]: val });
  };

  return (
    <div className="bg-white rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Thông tin khách hàng
      </h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">
              Họ và tên <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Nguyễn Văn A"
              className="mt-1"
              value={value.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <Label htmlFor="phone">
              Số điện thoại <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              placeholder="0901234567"
              className="mt-1"
              value={value.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="email@example.com"
            className="mt-1"
            value={value.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="city">
              Tỉnh/Thành phố <span className="text-red-500">*</span>
            </Label>
            <Input
              id="city"
              placeholder="Hồ Chí Minh"
              className="mt-1"
              value={value.city}
              onChange={(e) => handleChange("city", e.target.value)}
            />
            {errors.city && (
              <p className="text-sm text-red-500 mt-1">{errors.city}</p>
            )}
          </div>
          <div>
            <Label htmlFor="district">Quận/Huyện</Label>
            <Input
              id="district"
              placeholder="Quận 1"
              className="mt-1"
              value={value.district}
              onChange={(e) => handleChange("district", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="ward">Phường/Xã</Label>
            <Input
              id="ward"
              placeholder="Phường Bến Nghé"
              className="mt-1"
              value={value.ward}
              onChange={(e) => handleChange("ward", e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="address">
            Địa chỉ giao hàng <span className="text-red-500">*</span>
          </Label>
          <Input
            id="address"
            placeholder="Số nhà, tên đường"
            className="mt-1"
            value={value.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />
          {errors.address && (
            <p className="text-sm text-red-500 mt-1">{errors.address}</p>
          )}
        </div>

        <div>
          <Label htmlFor="notes">Ghi chú đơn hàng (không bắt buộc)</Label>
          <textarea
            id="notes"
            placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay địa điểm giao hàng chi tiết hơn."
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[80px]"
            value={value.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

// Validation function
export function validateCustomerInfo(info: CustomerInfo): {
  isValid: boolean;
  errors: Partial<Record<keyof CustomerInfo, string>>;
} {
  const errors: Partial<Record<keyof CustomerInfo, string>> = {};

  if (!info.name.trim()) {
    errors.name = "Vui lòng nhập họ tên";
  }

  if (!info.email.trim()) {
    errors.email = "Vui lòng nhập email";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) {
    errors.email = "Email không hợp lệ";
  }

  if (!info.phone.trim()) {
    errors.phone = "Vui lòng nhập số điện thoại";
  } else if (!/^[0-9]{10,11}$/.test(info.phone.replace(/\s/g, ""))) {
    errors.phone = "Số điện thoại không hợp lệ (10-11 số)";
  }

  if (!info.city.trim()) {
    errors.city = "Vui lòng nhập tỉnh/thành phố";
  }

  if (!info.address.trim()) {
    errors.address = "Vui lòng nhập địa chỉ giao hàng";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
