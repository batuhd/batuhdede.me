import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { z } from "zod";

// Input validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email format").max(255, "Email too long"),
  password: z.string().min(8, "Password must be at least 8 characters").max(128, "Password too long"),
  captchaToken: z.string().optional(),
});

type LoginInput = z.infer<typeof loginSchema>;

// In-memory rate limiting store (resets on cold start — acceptable for serverless)
const attempts = new Map<
  string,
  { count: number; firstAttempt: number; lockedUntil: number }
>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_MS = 30 * 60 * 1000; // 30 minute lockout after max failures

function getClientIP(headersList: Headers): string {
  return (
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    "unknown"
  );
}

function cleanupOldEntries() {
  const now = Date.now();
  for (const [ip, record] of attempts.entries()) {
    if (now - record.firstAttempt > WINDOW_MS && now > record.lockedUntil) {
      attempts.delete(ip);
    }
  }
}

export async function POST(request: Request) {
  // Periodic cleanup
  cleanupOldEntries();

  const headersList = await headers();
  const ip = getClientIP(headersList);

  // Check if IP is locked out
  const record = attempts.get(ip);
  if (record) {
    const now = Date.now();

    if (now < record.lockedUntil) {
      const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
      return NextResponse.json(
        {
          error: `Too many failed attempts. Try again in ${remainingSeconds} seconds.`,
          locked: true,
          remainingSeconds,
        },
        { status: 429 }
      );
    }

    // Reset if window has passed
    if (now - record.firstAttempt > WINDOW_MS && now > record.lockedUntil) {
      attempts.delete(ip);
    }
  }

  // Parse and validate request body
  let validatedData: LoginInput;

  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);
    
    if (!result.success) {
      const errors = result.error.errors.map(e => e.message).join(", ");
      return NextResponse.json(
        { error: `Validation failed: ${errors}` },
        { status: 400 }
      );
    }
    
    validatedData = result.data;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const { email, password, captchaToken } = validatedData;

  // Create a server-side Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { error: "Service unavailable." },
      { status: 503 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Attempt login
  const { data, error: authError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        captchaToken,
      },
    });

  if (authError) {
    // Log only in development, never in production
    if (process.env.NODE_ENV === "development") {
      console.error("Supabase Auth Error:", authError.message);
    }
    
    // Record failed attempt
    const existing = attempts.get(ip);
    const now = Date.now();

    if (existing) {
      existing.count += 1;
      if (existing.count >= MAX_ATTEMPTS) {
        existing.lockedUntil = now + LOCKOUT_MS;
      }
    } else {
      attempts.set(ip, {
        count: 1,
        firstAttempt: now,
        lockedUntil: 0,
      });
    }

    const currentCount = attempts.get(ip)!.count;
    const remaining = MAX_ATTEMPTS - currentCount;

    if (remaining <= 0) {
      return NextResponse.json(
        {
          error: "Too many failed attempts. Access locked for 30 minutes.",
          locked: true,
          remainingSeconds: LOCKOUT_MS / 1000,
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error: `${authError.message}. ${remaining} attempt(s) remaining.`,
        attemptsLeft: remaining,
      },
      { status: 401 }
    );
  }

  // Success — clear attempts for this IP
  attempts.delete(ip);

  const response = NextResponse.json({
    session: {
      access_token: data.session?.access_token,
      refresh_token: data.session?.refresh_token,
      expires_at: data.session?.expires_at,
    },
  });

  // Set HTTP-only cookie for middleware auth check
  response.cookies.set("admin_session", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60, // 1 hour (matches Supabase JWT expiry)
  });

  return response;
}
