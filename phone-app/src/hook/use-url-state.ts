"use client";
import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";


export function useUrlState() {
const params = useSearchParams();
const router = useRouter();
const pathname = usePathname();
const setParams = React.useCallback((next: Record<string, string | string[] | undefined>) => {
const sp = new URLSearchParams(params?.toString());
Object.entries(next).forEach(([k,v]) => {
if (v === undefined || (Array.isArray(v) && v.length === 0) || v === "") sp.delete(k);
else if (Array.isArray(v)) { sp.delete(k); v.forEach(val => sp.append(k, String(val))); }
else sp.set(k, String(v));
});
router.replace(`${pathname}?${sp.toString()}`);
}, [params, pathname, router]);
return { params, setParams } as const;
}