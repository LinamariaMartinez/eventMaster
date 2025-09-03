"use client";

import { createClient } from "./supabase/client";
import { User, AuthError } from "@supabase/supabase-js";

export type AuthUser = User;

export const signIn = async (email: string, password: string) => {
  console.log('[auth] Starting signIn for:', email);
  
  const supabase = createClient();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('[auth] SignIn error:', {
        name: error.name,
        message: error.message,
        status: error.status,
        fullError: error
      });
      throw error;
    }

    if (!data.user) {
      const errorMsg = "No user data received after login";
      console.error('[auth] SignIn failed:', errorMsg);
      throw new Error(errorMsg);
    }

    console.log('[auth] SignIn successful:', {
      userId: data.user.id,
      userEmail: data.user.email,
      hasSession: !!data.session
    });

    return data;
  } catch (error) {
    console.error('[auth] SignIn failed with exception:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      fullError: error
    });
    throw error;
  }
};

export const signOut = async () => {
  console.log('[auth] Starting signOut...');
  
  const supabase = createClient();

  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('[auth] SignOut error:', {
        name: error.name,
        message: error.message,
        status: error.status,
        fullError: error
      });
      throw error;
    }
    
    console.log('[auth] SignOut successful');
    
    // Clear any demo session data that might exist
    clearDemoData();
    
    // Force a page reload to ensure all state is cleared
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  } catch (error) {
    console.error('[auth] SignOut failed:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      fullError: error
    });
    
    // Even if there's an error, clear demo data and redirect
    clearDemoData();
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
    throw error;
  }
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  console.log('[auth] Starting getCurrentUser...');
  
  try {
    const supabase = createClient();
    console.log('[auth] Supabase client created successfully');

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    console.log('[auth] Supabase getUser result:', {
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
      hasError: !!error,
      errorMessage: error?.message
    });

    if (error) {
      console.error('[auth] getCurrentUser error:', {
        name: error.name,
        message: error.message,
        status: error.status,
        fullError: error
      });
      return null;
    }

    // Validate user has proper UUID format (reject demo users like "demo-admin-1756782584500")
    if (user && user.id && !user.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      console.warn('[auth] Invalid user ID format, rejecting user:', user.id);
      // Clear any demo data that might exist
      clearDemoData();
      return null;
    }

    return user;
  } catch (error) {
    console.error('[auth] getCurrentUser failed with exception:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      fullError: error
    });
    return null;
  }
};

export const getSession = async () => {
  console.log('[auth] Starting getSession...');
  
  try {
    const supabase = createClient();
    console.log('[auth] Supabase client created for session check');

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    console.log('[auth] Supabase getSession result:', {
      hasSession: !!session,
      sessionUserId: session?.user?.id,
      sessionUserEmail: session?.user?.email,
      hasError: !!error,
      errorMessage: error?.message
    });

    if (error) {
      console.error('[auth] getSession error:', {
        name: error.name,
        message: error.message,
        status: error.status,
        fullError: error
      });
      return null;
    }

    return session;
  } catch (error) {
    console.error('[auth] getSession failed with exception:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      fullError: error
    });
    return null;
  }
};

export const onAuthStateChange = (
  callback: (user: AuthUser | null) => void,
) => {
  console.log('[auth] Setting up auth state change listener');
  const supabase = createClient();

  return supabase.auth.onAuthStateChange((event, session) => {
    console.log('[auth] Auth state changed:', {
      event,
      hasSession: !!session,
      userId: session?.user?.id,
      userEmail: session?.user?.email
    });
    callback(session?.user ?? null);
  });
};

export const refreshSession = async () => {
  console.log('[auth] Starting session refresh...');
  
  const supabase = createClient();

  try {
    const { data, error } = await supabase.auth.refreshSession();

    if (error) {
      console.error('[auth] Refresh session error:', {
        name: error.name,
        message: error.message,
        status: error.status,
        fullError: error
      });
      throw error;
    }

    console.log('[auth] Session refreshed successfully:', {
      hasSession: !!data.session,
      userId: data.session?.user?.id,
      userEmail: data.session?.user?.email
    });

    return data;
  } catch (error) {
    console.error('[auth] Refresh session failed:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      fullError: error
    });
    throw error;
  }
};

// Función para verificar si el usuario está autenticado
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const user = await getCurrentUser();
    const isAuth = !!user;
    console.log('[auth] Authentication check:', { isAuthenticated: isAuth, userId: user?.id });
    return isAuth;
  } catch (error) {
    console.error('[auth] Authentication check failed:', error);
    return false;
  }
};

// Función para obtener el perfil del usuario con información adicional
export const getUserProfile = async (): Promise<AuthUser | null> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      console.log('[auth] No user found for profile');
      return null;
    }

    console.log('[auth] User profile retrieved:', {
      userId: user.id,
      userEmail: user.email,
      hasMetadata: !!user.user_metadata
    });

    return user;
  } catch (error) {
    console.error('[auth] Get user profile failed:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      fullError: error
    });
    return null;
  }
};

// Clear any demo session data that might exist in localStorage
export const clearDemoData = () => {
  if (typeof window === 'undefined') return;
  
  try {
    // Remove demo session data
    const demoKeys = ['demo_session', 'demo_user', 'demo_token'];
    demoKeys.forEach(key => {
      localStorage.removeItem(key);
      // Also clear any prefixed versions
      Object.keys(localStorage).forEach(storageKey => {
        if (storageKey.includes('demo') || storageKey.includes('fake')) {
          localStorage.removeItem(storageKey);
        }
      });
    });
    
    console.log('[auth] Demo data cleared from localStorage');
  } catch (error) {
    console.error('[auth] Error clearing demo data:', error);
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

  if (message.includes("password should be at least")) {
    return "La contraseña debe tener al menos 6 caracteres.";
  }

  if (message.includes("invalid email")) {
    return "El formato del email no es válido.";
  }

  if (message.includes("email rate limit exceeded")) {
    return "Has enviado demasiados emails. Espera unos minutos antes de intentar de nuevo.";
  }

  // Si no coincide con ningún error conocido, devolver el mensaje original
  return errorMessage;
};