import { cookies } from "next/headers";

const ADMIN_NOTIFICATION_COOKIE = "ankush_admin_notification";

export interface AdminNotificationPayload {
  id: string;
  message: string;
  tone: "error" | "success";
}

export async function setAdminNotification(
  message: string,
  tone: AdminNotificationPayload["tone"] = "success",
) {
  const payload: AdminNotificationPayload = {
    id: crypto.randomUUID(),
    message,
    tone,
  };

  (await cookies()).set(ADMIN_NOTIFICATION_COOKIE, Buffer.from(JSON.stringify(payload)).toString("base64url"), {
    httpOnly: false,
    maxAge: 60,
    path: "/admin",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function getAdminNotification(): Promise<AdminNotificationPayload | null> {
  const encoded = (await cookies()).get(ADMIN_NOTIFICATION_COOKIE)?.value;

  if (!encoded) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as AdminNotificationPayload;
  } catch {
    return null;
  }
}
