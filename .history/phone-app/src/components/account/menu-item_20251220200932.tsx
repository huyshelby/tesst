"use client";

import Link from "next/link";
import { ChevronRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  badge?: string;
  disabled?: boolean;
}

export function MenuItem({
  icon: Icon,
  title,
  description,
  href,
  badge,
  disabled = false,
}: MenuItemProps) {
  const content = (
    <div
      className={cn(
        "group flex items-center gap-4 p-6 min-h-[88px]",
        "transition-all duration-200",
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-gray-50 cursor-pointer"
      )}
    >
      {/* Icon Container */}
      <div
        className={cn(
          "w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0",
          "transition-all duration-300",
          !disabled && "group-hover:bg-gray-100 group-hover:scale-105"
        )}
      >
        <Icon className="w-5 h-5 text-gray-700" strokeWidth={1.5} />
      </div>

      {/* Content */}
      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 text-[15px]">
            {title}
          </h3>
          {badge && (
            <span className="text-xs px-2.5 py-0.5 bg-amber-50 text-amber-700 rounded-full font-medium border border-amber-100">
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Arrow */}
      {!disabled && (
        <ChevronRight
          className={cn(
            "w-5 h-5 text-gray-300 flex-shrink-0",
            "transition-all duration-300",
            "group-hover:text-gray-600 group-hover:translate-x-1"
          )}
          strokeWidth={2}
        />
      )}
    </div>
  );

  if (disabled) {
    return <div>{content}</div>;
  }

  return (
    <Link href={href} className="block">
      {content}
    </Link>
  );
}
