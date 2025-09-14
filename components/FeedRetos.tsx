import React, { useEffect, useState } from "react";

type Reto = {
  id: string;
  title: string;
  description: string;
  mediaUrl: string;
};

export default function FeedRetos({ userId }: { userId: string }) {
  const [retos, setRetos] = useState<Reto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRetos() {
      // Cambia esta URL por tu API real que devuelve retos para el usuario
      const response = await fetch(`/api/retos?user=${userId}`);
      const data = await response.json();
      setRetos(data || []);
      setLoading(false);
    }
    fetchRetos();
  }, [userId]);

  if (loading) return <p>Cargando retos...</p>;
  if (retos.length === 0) return <p>No tienes retos aun.</p>;

  return (
    <div className="space-y-4">
      {retos.map((reto) => (
        <div key={reto.id} className="p-4 rounded bg-zinc-900">
          <h3 className="font-bold text-xl mb-1">{reto.title}</h3>
          <p className="mb-2 text-zinc-400">{reto.description}</p>
          {reto.mediaUrl && (
            <img src={reto.mediaUrl} alt={reto.title} className="rounded" />
          )}
        </div>
      ))}
    </div>
  );
}