import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { Database } from "@/types/database.types";

// Singleton middleware client
let middlewareClient: ReturnType<typeof createServerClient<Database>> | null =
  null;

const getMiddlewareSupabase = (
  request: NextRequest,
  supabaseResponse: NextResponse,
) => {
  if (!middlewareClient) {
    middlewareClient = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
  }
  return middlewareClient;
};

export async function middleware(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = getMiddlewareSupabase(request, supabaseResponse);

  // Verificar sesión demo primero
  let user = null;
  const demoSessionCookie = request.cookies.get('demo_session');
  
  if (demoSessionCookie) {
    try {
      const demoSession = JSON.parse(demoSessionCookie.value);
      if (demoSession.expires_at && demoSession.expires_at > Date.now()) {
        user = demoSession.user;
      } else {
        // Sesión expirada, crear respuesta que limpia la cookie
        const response = NextResponse.next({ request });
        response.cookies.set('demo_session', '', { 
          expires: new Date(0), 
          path: '/',
          sameSite: 'lax'
        });
        // No establecer user para que no sea considerado autenticado
      }
    } catch (error) {
      console.error("Error parsing demo session cookie:", error);
      // Cookie corrupta, limpiarla
      const response = NextResponse.next({ request });
      response.cookies.set('demo_session', '', { 
        expires: new Date(0), 
        path: '/',
        sameSite: 'lax'
      });
    }
  }

  // Si no hay usuario demo, verificar con Supabase
  if (!user) {
    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser();
    user = supabaseUser;
  }

  // Redirigir a login si no está autenticado y trata de acceder al dashboard
  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // REMOVIDO: No redirigir automáticamente desde login/register
  // Permitir acceso libre a las páginas de auth

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
