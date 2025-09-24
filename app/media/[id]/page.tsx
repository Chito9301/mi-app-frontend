// app/media/[id]/page.tsx
import { Metadata } from "next";
import { fetchMediaById, fetchCommentsByMediaId } from "@/lib/api-backend";
import type { Comment } from "@/lib/api-backend";
import type { MediaItem } from "@/lib/media-service";
import ClientMediaDetail from "./ClientMediaDetail";

interface PageProps {
  params: { id: string };
}

// Generar metadatos dinámicos para SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const media = await fetchMediaById(params.id);
  return {
    title: media ? `${media.title} | Mi App` : "Contenido no encontrado | Mi App",
    description: media?.description ?? "Detalle del contenido multimedia",
  };
}

export default async function MediaDetailPage({ params }: PageProps) {
  try {
    const { id } = params;

    // Obtener media desde el backend
    const media: MediaItem | null = await fetchMediaById(id);

    if (!media) {
      return (
        <div className="min-h-screen flex items-center justify-center text-gray-300 bg-gray-900">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Contenido no encontrado</h1>
            <p className="text-gray-400">El archivo que buscas no existe o fue eliminado.</p>
          </div>
        </div>
      );
    }

    // Obtener comentarios
    const comments: Comment[] = await fetchCommentsByMediaId(id);

    return (
      <main className="min-h-screen bg-gray-950 text-white p-4">
        <ClientMediaDetail
          initialMedia={media}
          initialComments={comments}
          mediaId={id}
        />
      </main>
    );
  } catch (error) {
    console.error("Error cargando detalle de media:", error);
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 bg-black">
        <p>Error al cargar el contenido. Inténtalo de nuevo más tarde.</p>
      </div>
    );
  }
}
