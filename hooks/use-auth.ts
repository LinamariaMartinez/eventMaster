"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { getCurrentUser } from "@/lib/auth";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  refresh: () => Promise<void>;
  redirectToLogin: () => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const redirectToLogin = useCallback(() => {
    console.log('[use-auth] Redirecting to login page');
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const redirectTo = currentPath !== '/login' ? currentPath : '/dashboard';
      router.push(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
    }
  }, [router]);

  const refresh = useCallback(async () => {
    if (!mounted) return;
    
    try {
      console.log('[use-auth] Starting auth refresh...');
      setLoading(true);
      
      const currentUser = await getCurrentUser();
      console.log('[use-auth] Auth refresh result:', {
        hasUser: !!currentUser,
        userId: currentUser?.id,
        userEmail: currentUser?.email
      });
      
      setUser(currentUser);
      
      // If no user is authenticated, redirect to login
      if (!currentUser) {
        console.log('[use-auth] No authenticated user found, will redirect to login');
        // Don't redirect immediately to avoid infinite loops, let components handle it
      }
    } catch (error) {
      console.error('[use-auth] Error refreshing auth:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        fullError: error
      });
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [mounted]);

  useEffect(() => {
    console.log('[use-auth] Component mounting...');
    setMounted(true);
    
    // Clear any demo data on first mount
    if (typeof window !== 'undefined') {
      try {
        Object.keys(localStorage).forEach(key => {
          if (key.includes('demo') || key.includes('fake')) {
            localStorage.removeItem(key);
          }
        });
      } catch (error) {
        console.error('[use-auth] Error clearing demo data on mount:', error);
      }
    }
    
    // Initial auth check only after component is mounted
    refresh();

    // Set up auth state listener for Supabase changes
    const supabase = createClient();
    console.log('[use-auth] Setting up auth state change listener...');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[use-auth] Auth state changed:', {
          event,
          hasSession: !!session,
          userId: session?.user?.id,
          userEmail: session?.user?.email
        });
        
        // Only handle real Supabase sessions - ignore any fake/demo data
        if (event === 'SIGNED_OUT') {
          console.log('[use-auth] User signed out');
          setUser(null);
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          console.log('[use-auth] User signed in or token refreshed');
          // Validate that this is a real session with proper UUID
          if (session?.user?.id && session.user.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
            setUser(session.user);
          } else {
            console.warn('[use-auth] Invalid user ID format, ignoring session:', session?.user?.id);
            setUser(null);
          }
        } else if (event === 'INITIAL_SESSION') {
          console.log('[use-auth] Initial session loaded');
          // Validate that this is a real session with proper UUID
          if (session?.user?.id && session.user.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
            setUser(session.user);
          } else {
            console.warn('[use-auth] Invalid user ID format in initial session, ignoring:', session?.user?.id);
            setUser(null);
          }
        }
      }
    );

    return () => {
      console.log('[use-auth] Cleaning up auth subscription...');
      subscription.unsubscribe();
    };
  }, [refresh, mounted]);

  // Prevent hydration mismatch by showing loading until mounted
  if (!mounted) {
    console.log('[use-auth] Component not mounted yet, showing loading state');
    return {
      user: null,
      loading: true,
      isAuthenticated: false,
      refresh,
      redirectToLogin
    };
  }

  const isAuthenticated = !!user;
  
  console.log('[use-auth] Current auth state:', {
    isAuthenticated,
    hasUser: !!user,
    userId: user?.id,
    loading
  });

  return {
    user,
    loading,
    isAuthenticated,
    refresh,
    redirectToLogin
  };
}