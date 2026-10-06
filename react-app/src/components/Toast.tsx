import { useEffect, useState } from "react";

let pushToast: (msg: string) => void = () => {};

/** Call from anywhere to show an honest toast (no fake functionality). */
export function toast(msg: string) {
  pushToast(msg);
}

export function Toast() {
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    pushToast = (m: string) => {
      setMsg(m);
      setTimeout(() => setMsg(null), 2500);
    };
  }, []);

  if (!msg) return null;
  return (
    <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 bg-gtext text-gbg text-sm px-4 py-2 rounded-full z-50 shadow-lg">
      {msg}
    </div>
  );
}
