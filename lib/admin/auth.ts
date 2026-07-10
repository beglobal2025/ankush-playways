import { redirect } from "next/navigation";
import type { JwtPayload } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export interface CurrentAdmin {
  email: string;
  id: string;
  name: string;
}

export function isAdminClaims(claims: JwtPayload | undefined | null): claims is JwtPayload {
  return claims?.app_metadata?.role === "admin";
}

export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();
    const claims = data?.claims;

    if (error || !isAdminClaims(claims) || !claims.sub) {
      return null;
    }

    const email = typeof claims.email === "string" ? claims.email : "";
    const metadata = claims.user_metadata as Record<string, unknown> | undefined;
    const metadataName = metadata?.full_name ?? metadata?.name;
    const name =
      typeof metadataName === "string" && metadataName.trim()
        ? metadataName.trim()
        : email.split("@")[0] || "Admin";

    return { email, id: claims.sub, name };
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return admin;
}

export async function signInAdmin(email: string, password: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error || !data.session) {
      return false;
    }

    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(
      data.session.access_token,
    );

    if (claimsError || !isAdminClaims(claimsData?.claims)) {
      await supabase.auth.signOut();
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export async function signOutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
