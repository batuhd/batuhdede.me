import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Next.js 16.3.0: root proxy.ts Turbopack'te tanınmıyor (GH #93328).
// Kullanıcının onayladığı "mevcut auth akışını koru" gereği root
// middleware.ts (deprecated ama desteklenen) konvansiyonu kullanılır.

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Case-insensitive protection for /admin routes (not /admin/login)
  const path = pathname.toLowerCase();
  if (!path.startsWith("/admin") || path === "/admin/login") {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({ name, value, ...options });
        response = NextResponse.next({
          request: { headers: request.headers },
        });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({ name, value: "", ...options });
        response = NextResponse.next({
          request: { headers: request.headers },
        });
        response.cookies.set({ name, value: "", ...options });
      },
    },
    cookieOptions: {
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  });

  // getUser() verifies the session against the Auth server.
  // getSession() only parses the cookie locally and does not verify
  // the JWT signature, so it must not be used for authorization.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return response;
}

export const config = {
  // Next.js matchers are case-sensitive, but /Admin resolves to a 404 in
  // production (routes are not matched case-insensitively), so the lowercase
  // matcher is sufficient. The pathname is additionally lowercased inside
  // the middleware as defense-in-depth.
  matcher: ["/admin/:path*"],
};