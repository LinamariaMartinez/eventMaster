"use client";

import { getSupabaseBrowser } from "./supabase";
import { User, AuthError } from "@supabase/supabase-js";

export type AuthUser = User;

export const signUp = async (email: string, password: string, name: string) => {
  const supabase = getSupabaseBrowser();

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          full_name: name,
        },
      },
    });

    if (error) {
      console.error("SignUp error:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("SignUp failed:", error);
    throw error;
  }
};

// Credenciales demo hardcodeadas
const DEMO_CREDENTIALS = [
  { email: "admin@catalinalezama.com", password: "demo123", name: "Catalina Lezama", role: "admin" },
  { email: "equipo@catalinalezama.com", password: "equipo123", name: "Equipo ED", role: "team" },
  { email: "demo@demo.com", password: "demo123", name: "Usuario Demo", role: "demo" }
];

export const signIn = async (email: string, password: string) => {
  // Verificar credenciales demo primero
  const demoUser = DEMO_CREDENTIALS.find(
    cred => cred.email.toLowerCase() === email.toLowerCase() && cred.password === password
  );

  if (demoUser) {
    // Simular respuesta de Supabase para usuario demo
    const mockUser = {
      id: `demo-${demoUser.role}-${Date.now()}`,
      email: demoUser.email,
      user_metadata: {
        name: demoUser.name,
        role: demoUser.role
      }
    };

    // Guardar en localStorage y cookies para persistencia
    const sessionData = {
      user: mockUser,
      access_token: 'demo-token',
      expires_at: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
    };
    
    localStorage.setItem('demo_user', JSON.stringify(mockUser));
    localStorage.setItem('demo_session', JSON.stringify(sessionData));
    
    // Crear cookie para que el middleware pueda leerla
    document.cookie = `demo_session=${JSON.stringify(sessionData)}; path=/; max-age=86400; SameSite=Lax`;

    return { 
      user: mockUser,
      session: {
        user: mockUser,
        access_token: 'demo-token'
      }
    };
  }

  // Si no es usuario demo, intentar con Supabase
  const supabase = getSupabaseBrowser();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("SignIn error:", error);
      throw error;
    }

    if (!data.user) {
      throw new Error("No user data received after login");
    }

    return data;
  } catch (error) {
    console.error("SignIn failed:", error);
    throw error;
  }
};

// Función para limpiar completamente la sesión demo
export const cleanDemoSession = () => {
  if (typeof window === 'undefined') return;
  
  // Limpiar localStorage
  localStorage.removeItem('demo_user');
  localStorage.removeItem('demo_session');
  
  // Limpiar cookie demo
  document.cookie = 'demo_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
};

// Función para verificar si hay sesión demo válida
export const hasDemoSession = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const demoSession = localStorage.getItem('demo_session');
  if (!demoSession) return false;
  
  try {
    const session = JSON.parse(demoSession);
    return session.expires_at && session.expires_at > Date.now();
  } catch (error) {
    console.error("Error checking demo session:", error);
    cleanDemoSession();
    return false;
  }
};

// Función para depurar todas las sesiones
export const debugSessions = () => {
  if (typeof window === 'undefined') return { error: "No window object" };
  
  const localStorage_demo_user = localStorage.getItem('demo_user');
  const localStorage_demo_session = localStorage.getItem('demo_session');
  const cookies = document.cookie;
  
  return {
    localStorage: {
      demo_user: localStorage_demo_user,
      demo_session: localStorage_demo_session ? JSON.parse(localStorage_demo_session) : null
    },
    cookies: cookies,
    hasDemoSession: hasDemoSession()
  };
};

export const signOut = async () => {
  // Limpiar completamente la sesión demo
  cleanDemoSession();
  
  const supabase = getSupabaseBrowser();

  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("SignOut error:", error);
      throw error;
    }
  } catch (error) {
    console.error("SignOut failed:", error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  // Verificar si hay usuario demo en localStorage
  const demoSession = localStorage.getItem('demo_session');
  if (demoSession) {
    try {
      const session = JSON.parse(demoSession);
      if (session.expires_at && session.expires_at > Date.now()) {
        return session.user as AuthUser;
      } else {
        // Sesión expirada o inválida, limpiar todo
        cleanDemoSession();
      }
    } catch (error) {
      console.error("Error parsing demo session:", error);
      cleanDemoSession();
    }
  }

  const supabase = getSupabaseBrowser();

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("Get user error:", error);
      return null;
    }

    return user;
  } catch (error) {
    console.error("Get current user failed:", error);
    return null;
  }
};

export const getSession = async () => {
  // Verificar sesión demo primero
  const demoSession = localStorage.getItem('demo_session');
  if (demoSession) {
    try {
      const session = JSON.parse(demoSession);
      if (session.expires_at && session.expires_at > Date.now()) {
        return session;
      } else {
        cleanDemoSession();
      }
    } catch (error) {
      console.error("Error parsing demo session:", error);
      cleanDemoSession();
    }
  }

  const supabase = getSupabaseBrowser();

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Get session error:", error);
      return null;
    }

    return session;
  } catch (error) {
    console.error("Get session failed:", error);
    return null;
  }
};

export const onAuthStateChange = (
  callback: (user: AuthUser | null) => void,
) => {
  const supabase = getSupabaseBrowser();

  return supabase.auth.onAuthStateChange((event, session) => {
    console.log("Auth state changed:", event, session?.user?.id);
    callback(session?.user ?? null);
  });
};

export const refreshSession = async () => {
  const supabase = getSupabaseBrowser();

  try {
    const { data, error } = await supabase.auth.refreshSession();

    if (error) {
      console.error("Refresh session error:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Refresh session failed:", error);
    throw error;
  }
};

// Función para verificar si el usuario está autenticado
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const user = await getCurrentUser();
    return !!user;
  } catch (error) {
    console.error("Authentication check failed:", error);
    return false;
  }
};

// Función para obtener el perfil del usuario con información adicional
export const getUserProfile = async (): Promise<AuthUser | null> => {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    // Aquí podrías obtener información adicional del perfil desde tu tabla de usuarios
    // const { data: profile } = await supabase
    //   .from('profiles')
    //   .select('*')
    //   .eq('id', user.id)
    //   .single()

    return user;
  } catch (error) {
    console.error("Get user profile failed:", error);
    return null;
  }
};

// Función para manejar errores de autenticación de forma consistente
export const getAuthErrorMessage = (
  error: Error | AuthError | unknown,
): string => {
  if (!error || typeof error !== "object") {
    return "Ocurrió un error inesperado";
  }

  const errorMessage =
    "message" in error && typeof error.message === "string"
      ? error.message
      : "Ocurrió un error inesperado";

  const message = errorMessage.toLowerCase();

  if (
    message.includes("invalid login credentials") ||
    message.includes("invalid credentials")
  ) {
    return "Credenciales incorrectas. Verifica tu email y contraseña.";
  }

  if (message.includes("email not confirmed")) {
    return "Por favor confirma tu email antes de iniciar sesión.";
  }

  if (message.includes("user already registered")) {
    return "Este email ya está registrado. ¿Intentas iniciar sesión?";
  }

  if (message.includes("password should be at least")) {
    return "La contraseña debe tener al menos 6 caracteres.";
  }

  if (message.includes("invalid email")) {
    return "El formato del email no es válido.";
  }

  if (message.includes("weak password")) {
    return "La contraseña es muy débil. Usa al menos 6 caracteres.";
  }

  if (message.includes("signup disabled")) {
    return "El registro de nuevos usuarios está temporalmente deshabilitado.";
  }

  if (message.includes("email rate limit exceeded")) {
    return "Has enviado demasiados emails. Espera unos minutos antes de intentar de nuevo.";
  }

  // Si no coincide con ningún error conocido, devolver el mensaje original
  return errorMessage;
};
