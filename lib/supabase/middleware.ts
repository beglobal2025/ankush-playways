import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminClaims } from "@/lib/admin/auth";
import { getSupabaseEnvironment } from "./env";

function copySessionResponse(source: NextResponse, target: NextResponse) {
  source.cookies.getAll().forEach((cookie) => target.cookies.set(cookie));

  for (const header of ["cache-control", "expires", "pragma"]) {
    const value = source.headers.get(header);
    if (value) target.headers.set(header, value);
  }

  return target;
}

export async function updateAdminSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { publishableKey, url } = getSupabaseEnvironment();

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, options, value }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
        Object.entries(headers).forEach(([name, value]) => response.headers.set(name, value));
      },
    },
  });

  let isAdmin = false;

  try {
    const { data, error } = await supabase.auth.getClaims();
    isAdmin = !error && isAdminClaims(data?.claims);
  } catch {
    // Treat unavailable or invalid auth state as unauthenticated. This keeps
    // the login route reachable when Supabase cannot validate a session.
  }
  const isLoginPage = request.nextUrl.pathname === "/admin/login";

  if (!isAdmin && !isLoginPage) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.search = "";
    return copySessionResponse(response, NextResponse.redirect(loginUrl));
  }

  if (isAdmin && isLoginPage) {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = "/admin";
    adminUrl.search = "";
    return copySessionResponse(response, NextResponse.redirect(adminUrl));
  }

  return response;
}
