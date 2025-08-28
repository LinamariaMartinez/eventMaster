"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

export function useAuthNavigation() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const navigateAfterAuth = useCallback(
    (redirectTo?: string, delay: number = 150) => {
      const finalRedirectTo =
        redirectTo || searchParams.get("redirectTo") || "/dashboard";

      // Usar setTimeout para permitir que la sesión se establezca
      setTimeout(() => {
        router.push(finalRedirectTo);
        router.refresh(); // Forzar actualización del estado de auth
      }, delay);
    },
    [router, searchParams],
  );

  const navigateToAuth = useCallback(
    (redirectTo?: string) => {
      const currentRedirectTo =
        redirectTo || searchParams.get("redirectTo") || "/dashboard";

      const redirectParam =
        currentRedirectTo !== "/dashboard"
          ? `?redirectTo=${encodeURIComponent(currentRedirectTo)}`
          : "";

      router.push(`/login${redirectParam}`);
    },
    [router, searchParams],
  );

  const navigateToHome = useCallback(() => {
    router.push("/");
  }, [router]);

  const navigateWithAuthCheck = useCallback(
    (path: string, requiresAuth: boolean = true) => {
      if (requiresAuth) {
        const redirectParam = `?redirectTo=${encodeURIComponent(path)}`;
        router.push(`/login${redirectParam}`);
      } else {
        router.push(path);
      }
    },
    [router],
  );

  const handleAuthError = useCallback((error: string) => {
    toast.error(error);
  }, []);

  const handleAuthSuccess = useCallback(
    (message: string, redirectTo?: string, delay?: number) => {
      toast.success(message);
      navigateAfterAuth(redirectTo, delay);
    },
    [navigateAfterAuth],
  );

  return {
    navigateAfterAuth,
    navigateToAuth,
    navigateToHome,
    navigateWithAuthCheck,
    handleAuthError,
    handleAuthSuccess,
  };
}
