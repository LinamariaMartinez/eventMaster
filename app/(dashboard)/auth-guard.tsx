"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, loading: authLoading, redirectToLogin } = useAuth();
  
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      console.log('[AuthGuard] User not authenticated, redirecting to login');
      redirectToLogin();
    }
  }, [authLoading, isAuthenticated, redirectToLogin]);
  
  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-burgundy border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }
  
  // Don't render children if not authenticated (redirect is happening)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-burgundy border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Redirigiendo a login...</p>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}