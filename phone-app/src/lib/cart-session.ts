const KEY = "cart_session_id";

function uuid(): string {
  if (typeof crypto !== "undefined" && (crypto as any).randomUUID) {
    return (crypto as any).randomUUID();
  }
  const rnd = (n: number) => Math.floor(Math.random() * n).toString(16).padStart(4, "0");
  return `${rnd(0x10000)}${rnd(0x10000)}-${rnd(0x10000)}-${rnd(0x10000)}-${rnd(0x10000)}-${rnd(0x10000)}${rnd(0x10000)}${rnd(0x10000)}`;
}

export function getOrCreateSessionId(): string | null {
  if (typeof window === "undefined") return null;
  let v = localStorage.getItem(KEY);
  if (!v) {
    v = uuid();
    localStorage.setItem(KEY, v);
  }
  return v;
}

