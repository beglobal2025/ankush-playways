import type { ReactNode } from "react";
import AdminNotification from "@/components/admin/AdminNotification";
import { getAdminNotification } from "@/lib/admin/notifications";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const notification = await getAdminNotification();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AdminNotification notification={notification} />
      {children}
    </div>
  );
}
