"use client";
import * as React from "react";
export function useCountdown(seconds: number) {
  const [left, setLeft] = React.useState(seconds);
  React.useEffect(() => {
    const t = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(left / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((left % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(left % 60)
    .toString()
    .padStart(2, "0");
  return { left, display: `${h}:${m}:${s}` };
}
