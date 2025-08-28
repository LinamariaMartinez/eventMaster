"use client";

import React, { Suspense } from "react";
import { AuthForm } from "./auth-form";

interface AuthFormWrapperProps {
  redirectTo?: string;
}

function AuthFormSkeleton() {
  return (
    <div className="flex flex-col bg-white min-h-screen">
      <div
        className="self-stretch h-screen"
        style={{
          background: "linear-gradient(135deg, #8B4B6B 0%, #F5F1E8 100%)",
        }}
      >
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="w-full max-w-md">
            <div className="flex flex-col bg-white py-12 px-8 rounded-[40px] shadow-2xl">
              {/* Logo */}
              <div className="text-center mb-8">
                <h1 className="text-[#8B4B6B] text-4xl font-bold font-['Playfair_Display'] mb-2">
                  Catalina Lezama ED
                </h1>
                <p className="text-[#8B8680] text-sm">
                  Acceso del Equipo
                </p>
              </div>

              {/* Loading skeleton */}
              <div className="mb-8">
                <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
              </div>

              {/* Form skeleton */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
                  <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>

                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
                  <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>

                <div className="h-12 bg-gray-300 rounded-[25px] animate-pulse"></div>
              </div>

              {/* Loading indicator */}
              <div className="flex justify-center mt-8">
                <div className="w-6 h-6 border-2 border-[#8B4B6B] border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthFormWrapper({ redirectTo }: AuthFormWrapperProps) {
  return (
    <Suspense fallback={<AuthFormSkeleton />}>
      <AuthForm redirectTo={redirectTo} />
    </Suspense>
  );
}
