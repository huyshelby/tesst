"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

/**
 * Empty State Component
 * Apple-like minimal empty state design
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-gray-400" strokeWidth={1.5} />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2 tracking-tight">
        {title}
      </h3>

      {/* Description */}
      <p className="text-[15px] text-gray-500 max-w-md mb-8 leading-relaxed">
        {description}
      </p>

      {/* Action Button */}
      {(actionLabel && actionHref) || onAction ? (
        actionHref ? (
          <Link href={actionHref}>
            <Button className="rounded-full bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white px-6">
              {actionLabel}
            </Button>
          </Link>
        ) : (
          <Button
            onClick={onAction}
            className="rounded-full bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white px-6"
          >
            {actionLabel}
          </Button>
        )
      ) : null}
    </div>
  );
}
