import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

function createBrowserSupabaseClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        if (typeof document === "undefined") return [];
        return document.cookie
          .split("; ")
          .filter(Boolean)
          .map((cookie) => {
            const [name, value] = cookie.split("=");
            return { name, value: decodeURIComponent(value ?? "") };
          });
      },
      setAll(cookiesToSet) {
        if (typeof document === "undefined") return;
        cookiesToSet.forEach(({ name, value, options }) => {
          let cookie = `${name}=${encodeURIComponent(value)}`;
          if (options.path) cookie += `; path=${options.path}`;
          if (typeof options.maxAge === "number")
            cookie += `; max-age=${options.maxAge}`;
          if (options.domain) cookie += `; domain=${options.domain}`;
          if (options.sameSite) cookie += `; samesite=${options.sameSite}`;
          if (options.secure) cookie += `; secure`;
          if (options.httpOnly) cookie += `; httponly`;
          document.cookie = cookie;
        });
      },
    },
  });
}

export const supabase =
  supabaseUrl && supabaseAnonKey ? createBrowserSupabaseClient() : null;
