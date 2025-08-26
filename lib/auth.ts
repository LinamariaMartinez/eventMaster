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

export const signIn = async (email: string, password: string) => {
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

export const signOut = async () => {
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
