import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

// Singleton instances
let browserClient: ReturnType<typeof createBrowserClient<Database>> | null =
  null;
let adminClient: ReturnType<typeof createClient<Database>> | null = null;

// Browser client singleton (for client-side use)
export const getSupabaseBrowser = () => {
  if (typeof window === "undefined") {
    throw new Error(
      "getSupabaseBrowser should only be called on the client side",
    );
  }

  if (!browserClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase environment variables");
    }

    browserClient = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
  }

  return browserClient;
};

// Server client (for server-side use)
export const getSupabaseServer = async () => {
  // Import cookies only when needed in server context
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  });
};

// Admin client singleton (for server-side admin operations)
export const getSupabaseAdmin = () => {
  if (!adminClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Missing Supabase environment variables");
    }

    adminClient = createClient<Database>(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return adminClient;
};

// Legacy compatibility functions
export const getSupabase = () => {
  if (typeof window !== "undefined") {
    return getSupabaseBrowser();
  }
  throw new Error(
    "getSupabase() called on server side. Use getSupabaseServer() instead.",
  );
};

// Middleware client (special case for middleware)
export const createMiddlewareClient = (
  request: Request,
  response: Response,
) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        // For middleware, we need to handle cookies differently
        const cookies = request.headers.get("cookie");
        if (!cookies) return [];

        return cookies.split("; ").map((cookie) => {
          const [name, value] = cookie.split("=");
          return { name, value };
        });
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.headers.append(
            "Set-Cookie",
            `${name}=${value}; Path=${options?.path || "/"}; HttpOnly=${options?.httpOnly !== false}; SameSite=${options?.sameSite || "Lax"}; Secure=${options?.secure !== false}`,
          );
        });
      },
    },
  });
};

// Export for backwards compatibility
export const supabase =
  typeof window !== "undefined" ? getSupabaseBrowser() : null;
