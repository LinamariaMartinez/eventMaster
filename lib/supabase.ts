// lib/supabase.ts - Versión robusta para producción

import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { Database } from "@/types/database.types";

// Función para validar variables de entorno
const validateSupabaseConfig = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    console.error("❌ Supabase Config Error:", {
      url: url ? "✅ OK" : "❌ Missing NEXT_PUBLIC_SUPABASE_URL",
      anonKey: anonKey ? "✅ OK" : "❌ Missing NEXT_PUBLIC_SUPABASE_ANON_KEY",
      env: process.env.NODE_ENV,
    });

    throw new Error(
      `Missing Supabase environment variables. Required: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY`,
    );
  }

  return { url, anonKey };
};

// Cliente para el navegador
export const getSupabaseBrowser = () => {
  const { url, anonKey } = validateSupabaseConfig();

  return createBrowserClient<Database>(url, anonKey);
};

// Cliente para el servidor
export const getSupabaseServer = async () => {
  const { url, anonKey } = validateSupabaseConfig();
  const cookieStore = await cookies();

  return createServerClient<Database>(url, anonKey, {
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
          // En algunos contextos server no se pueden setear cookies
        }
      },
    },
  });
};

// Cliente simple para casos especiales
export const createSimpleSupabaseClient = () => {
  const { url, anonKey } = validateSupabaseConfig();

  return createSupabaseClient<Database>(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

// Middleware client con manejo de errores mejorado
export const createMiddlewareClient = (
  request: Request,
  response: Response,
) => {
  try {
    const { url, anonKey } = validateSupabaseConfig();

    return createServerClient<Database>(url, anonKey, {
      cookies: {
        getAll() {
          try {
            const cookies = request.headers.get("cookie");
            if (!cookies) return [];

            return cookies.split("; ").map((cookie) => {
              const [name, value] = cookie.split("=");
              return { name, value: value || "" };
            });
          } catch (error) {
            console.error("Error parsing cookies:", error);
            return [];
          }
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              const cookieOptions = [
                `${name}=${value}`,
                `Path=${options?.path || "/"}`,
                options?.httpOnly !== false ? "HttpOnly" : "",
                `SameSite=${options?.sameSite || "Lax"}`,
                options?.secure !== false ? "Secure" : "",
              ]
                .filter(Boolean)
                .join("; ");

              response.headers.append("Set-Cookie", cookieOptions);
            });
          } catch (error) {
            console.error("Error setting cookies:", error);
          }
        },
      },
    });
  } catch (error) {
    console.error("Failed to create middleware client:", error);
    throw error;
  }
};

// Export por compatibilidad
export const supabase =
  typeof window !== "undefined" ? getSupabaseBrowser() : null;
