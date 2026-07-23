"use client";

import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

/* ── Singleton event bus ── */
let _listeners: ((t: ToastItem) => void)[] = [];
let _counter = 0;

export function toast(message: string, type: ToastType = "success") {
  const item: ToastItem = { id: ++_counter, message, type };
  _listeners.forEach((fn) => fn(item));
}

const ICONS: Record<ToastType, React.ReactNode> = {
  success: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M5 12.5l4.5 4.5L19 7" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M6 18L18 6M6 6l12 12" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"/>
    </svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="1.8"/>
      <path d="M12 8v4M12 15.5v.5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
};

const BG: Record<ToastType, string> = {
  success: "#1D9E75",
  error:   "#D85A30",
  info:    "#2563EB",
};

function ToastBubble({ item, onDone }: { item: ToastItem; onDone: (id: number) => void }) {
  useEffect(() => {
    const t = setTimeout(() => onDone(item.id), 3500);
    return () => clearTimeout(t);
  }, [item.id, onDone]);

  return (
    <div
      className="flex items-center gap-3 rounded-[12px] px-4 py-3 animate-mgFade shadow-lg"
      style={{ background: BG[item.type], minWidth: 240, maxWidth: 360, pointerEvents: "auto" }}
    >
      <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,.22)" }}>
        {ICONS[item.type]}
      </span>
      <span className="text-white font-semibold text-[13.5px] flex-1 leading-snug">{item.message}</span>
      <button
        onClick={() => onDone(item.id)}
        className="flex-shrink-0 text-white opacity-70 hover:opacity-100 bg-transparent border-0 cursor-pointer text-[18px] leading-none p-0"
      >
        ✕
      </button>
    </div>
  );
}

export function ToastContainer() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    const fn = (t: ToastItem) => setItems((prev) => [...prev, t]);
    _listeners.push(fn);
    return () => { _listeners = _listeners.filter((l) => l !== fn); };
  }, []);

  function remove(id: number) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  if (items.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 items-center"
      style={{ pointerEvents: "none" }}
    >
      {items.map((item) => (
        <ToastBubble key={item.id} item={item} onDone={remove} />
      ))}
    </div>
  );
}
