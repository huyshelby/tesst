import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format image url to absolute backend origin using NEXT_PUBLIC_API_BASE_URL
export function formatImageUrl(url?: string | null): string {
  if (!url) return ""
  if (/^(https?:)?\/\//.test(url) || url.startsWith("data:") || url.startsWith("blob:")) {
    return url
  }
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api"
  let origin = raw
  try {
    const u = new URL(raw)
    origin = u.origin
  } catch {
    origin = raw.replace(/\/?api\/?$/, "")
  }
  return `${origin.replace(/\/$/, "")}/${url.replace(/^\//, "")}`
}
