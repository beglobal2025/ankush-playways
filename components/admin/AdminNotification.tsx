"use client";

import { useEffect, useState } from "react";
import type { AdminNotificationPayload } from "@/lib/admin/notifications";

interface AdminNotificationProps {
  notification: AdminNotificationPayload | null;
}

export default function AdminNotification({ notification }: AdminNotificationProps) {
  const [visible, setVisible] = useState(Boolean(notification));

  useEffect(() => {
    if (!notification) {
      setVisible(false);
      return;
    }

    setVisible(true);
    document.cookie = "ankush_admin_notification=; path=/admin; max-age=0; SameSite=Lax";

    const timer = window.setTimeout(() => setVisible(false), 5000);
    return () => window.clearTimeout(timer);
  }, [notification]);

  if (!notification || !visible) {
    return null;
  }

  const isSuccess = notification.tone === "success";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed right-4 top-4 z-[100] flex w-[min(420px,calc(100vw-2rem))] items-start gap-3 rounded-xl border p-4 shadow-2xl sm:right-6 sm:top-6 ${
        isSuccess
          ? "border-emerald-200 bg-emerald-50 text-emerald-950"
          : "border-red-200 bg-red-50 text-red-950"
      }`}
    >
      <span
        aria-hidden="true"
        className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-black text-white ${
          isSuccess ? "bg-emerald-500" : "bg-red-500"
        }`}
      >
        {isSuccess ? "✓" : "!"}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-black">{isSuccess ? "Action completed" : "Action failed"}</p>
        <p className="mt-1 text-sm font-semibold leading-5 opacity-80">{notification.message}</p>
      </div>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => setVisible(false)}
        className="grid size-8 shrink-0 place-items-center rounded-lg text-lg font-bold opacity-60 transition hover:bg-black/5 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
      >
        ×
      </button>
    </div>
  );
}
