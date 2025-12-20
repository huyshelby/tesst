"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  href: string;
  emptyMessage: string;
  emptyCtaLabel?: string;
  emptyCtaHref?: string;
  color?: string;
  className?: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  href,
  emptyMessage,
  emptyCtaLabel,
  emptyCtaHref,
  color = "text-gray-900",
  className,
}: StatCardProps) {
  const hasValue = value > 0;
  const linkTarget = hasValue ? href : (emptyCtaHref || href);

  return (
    <Link href={linkTarget} aria-label={`${label} - ${hasValue ? 'xem chi tiết' : (emptyCtaLabel || emptyMessage)}`}>
      <div
        className={cn(
          "group bg-white rounded-xl p-6 h-full",
          "border border-gray-100",
          "transition-all duration-300",
          "hover:shadow-xl hover:-translate-y-1 hover:border-gray-200",
          className
        )}
      >
        <div className="flex flex-col items-center text-center h-full justify-between min-h-[160px]">
          {/* Icon */}
          <div className="mb-4">
            <Icon
              className={cn(
                "w-10 h-10 transition-transform duration-300 group-hover:scale-110",
                color
              )}
              strokeWidth={1.5}
            />
          </div>

          {/* Value or Empty State */}
          <div className="flex-grow flex flex-col items-center justify-center gap-2 mb-3">
            {hasValue ? (
              <p className={cn("text-4xl font-semibold tracking-tight", color)}>
                {value}
              </p>
            ) : (
              <>
                <div className="px-4 py-2 bg-gray-50 rounded-full text-sm text-gray-500 font-medium group-hover:bg-gray-100 transition-colors">
                  {emptyMessage}
                </div>
                {emptyCtaLabel && (
                  <span className="text-xs font-medium text-blue-600 group-hover:underline">
                    {emptyCtaLabel}
                  </span>
                )}
              </>
            )}
          </div>

          {/* Label */}
          <p className="text-sm text-gray-600 font-medium">
            {label}
          </p>
        </div>
      </div>
    </Link>
  );
}
