import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { Database } from "@/types/database.types";

export async function middleware(request: NextRequest) {
  try {
    const supabaseResponse = NextResponse.next({
      request,
    });

    // Verificar sesión demo primero
    let user = null;
    const demoSessionCookie = request.cookies.get('demo_session');
    
    if (demoSessionCookie) {
      try {
        const demoSession = JSON.parse(demoSessionCookie.value);
        if (demoSession.expires_at && demoSession.expires_at > Date.now()) {
          user = demoSession.user;
        } else {
          // Sesión expirada, limpiar cookie
          supabaseResponse.cookies.set('demo_session', '', { 
            expires: new Date(0), 
            path: '/',
            sameSite: 'lax'
          });
        }
      } catch (error) {
        console.error("Error parsing demo session cookie:", error);
        // Cookie corrupta, limpiarla
        supabaseResponse.cookies.set('demo_session', '', { 
          expires: new Date(0), 
          path: '/',
          sameSite: 'lax'
        });
      }
    }

    // Si no hay usuario demo, verificar con Supabase (solo si está configurado)
    if (!user) {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (url && anonKey) {
        try {
          const supabase = createServerClient<Database>(
            url,
            anonKey,
            {
              cookies: {
                getAll() {
                  return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                  cookiesToSet.forEach(({ name, value }) =>
                    request.cookies.set(name, value),
                  );
                  cookiesToSet.forEach(({ name, value, options }) =>
                    supabaseResponse.cookies.set(name, value, options),
                  );
                },
              },
            },
          );

          const {
            data: { user: supabaseUser },
          } = await supabase.auth.getUser();
          user = supabaseUser;
        } catch (error) {
          console.error("Error checking Supabase user in middleware:", error);
          // Continue without user if Supabase fails
        }
      } else {
        console.warn('Supabase not configured in middleware, skipping auth check');
      }
    }

    // Redirigir a login si no está autenticado y trata de acceder al dashboard
    if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirectTo", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    // Permitir acceso libre a las páginas de auth
    return supabaseResponse;
  } catch (error) {
    console.error("Middleware error:", error);
    // En caso de error, permitir continuar sin autenticación
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};