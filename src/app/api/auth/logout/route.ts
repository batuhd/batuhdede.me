import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const response = NextResponse.json({ success: true });
  const cookieHeader = request.headers.get("cookie") || "";

  // Clear legacy admin_session cookie (backward compatibility)
  response.cookies.set("admin_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  // Clear all Supabase auth cookies (e.g. sb-<project-ref>-auth-token)
  const cookies = cookieHeader.split(";").map((c) => c.trim().split("=")[0]);
  for (const name of cookies) {
    if (name.startsWith("sb-")) {
      response.cookies.set(name, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });
    }
  }

  return response;
}
