"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import SubirMultimedia from "@/components/SubirMultimedia";
import FeedRetos from "@/components/FeedRetos";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) return <p className="p-4">Cargando...</p>;
  if (!user) return null;

  return (
    <main className="min-h-screen bg-black text-white p-4">
      <h1 className="text-3xl font-bold mb-6">
        Bienvenido, {user.username || user.email}
      </h1>

      {/* Componente para subir multimedia */}
      <section className="mb-8">
        <SubirMultimedia />
      </section>

      {/* Componente para mostrar feed de retos */}
      <section>
        <FeedRetos userId={user.id} />
      </section>
    </main>
  );
}