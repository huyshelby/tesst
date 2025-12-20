"use client";

import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  type: ToastType;
  message: string;
  description?: string;
  className?: string;
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    iconColor: "text-green-600",
    textColor: "text-green-900",
  },
  error: {
    icon: XCircle,
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    iconColor: "text-red-600",
    textColor: "text-red-900",
  },
  warning: {
    icon: AlertCircle,
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    iconColor: "text-amber-600",
    textColor: "text-amber-900",
  },
  info: {
    icon: Info,
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    iconColor: "text-blue-600",
    textColor: "text-blue-900",
  },
};

/**
 * Toast Notification Component
 * Minimal Apple-like toast design
 */
export function Toast({ type, message, description, className }: ToastProps) {
  const config = toastConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm",
        "animate-in slide-in-from-top-2 duration-300",
        config.bgColor,
        config.borderColor,
        className
      )}
    >
      <Icon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", config.iconColor)} strokeWidth={2} />
      
      <div className="flex-grow min-w-0">
        <p className={cn("text-sm font-semibold", config.textColor)}>
          {message}
        </p>
        {description && (
          <p className={cn("text-xs mt-1 opacity-80", config.textColor)}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Usage Example:
 * 
 * <Toast
 *   type="success"
 *   message="Avatar đã được cập nhật"
 *   description="Ảnh đại diện mới của bạn đã được lưu thành công"
 * />
 */
