"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";

import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isConfigured } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isConfigured) {
      // If Firebase is not configured, redirect to setup page
      router.push("/env-setup");
      return;
    }

    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, isConfigured, router]);

  if (!isConfigured) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-white">Redirigiendo a configuración...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  return user ? <>{children}</> : null;
}
