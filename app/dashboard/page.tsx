// app/dashboard/page.tsx

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login"); // redirige si no está autenticado
    }
  }, [user, loading, router]);

  if (loading) return <p>Cargando...</p>;
  if (!user) return null; // mientras redirige

  return (
    <div className="p-4">
      <h1 className="text-3xl mb-4">
        Bienvenido, {user.username || user.email}
      </h1>
      <p>Este es tu dashboard protegido.</p>
    </div>
  );
}
