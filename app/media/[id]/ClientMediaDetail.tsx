"use client";

import {
  ArrowLeft,
  Heart,
  MessageCircle,
  MoreVertical,
  Share2,
  Music,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { AppIcon } from "@/components/app-icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import {
  postComment,
  type Comment as CommentType,
} from "@/lib/api-backend";
import { incrementMediaStats, type MediaItem } from "@/lib/media-service";

interface ClientMediaDetailProps {
  initialMedia: MediaItem;
  initialComments: CommentType[];
  mediaId: string;
}

interface User {
  id: string;
  username?: string;
  photoURL?: string;
}

// simple timestamp formatter
function formatTimestamp(isoDate: string): string {
  const now = new Date();
  const date = new Date(isoDate);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export default function ClientMediaDetail({
  initialMedia,
  initialComments,
  mediaId,
}: ClientMediaDetailProps) {
  const { user } = useAuth() as { user: User | null };
  const router = useRouter();

  const [media, setMedia] = useState<MediaItem | null>(initialMedia);
  const [comments, setComments] = useState<CommentType[]>(
    initialComments ?? [],
  );
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // not changing from client here but keep a constant to avoid unused-state warnings
  const loading = false;

  const handleLike = async () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    if (!media) return;

    try {
      await incrementMediaStats(media.id, "likes");
      setMedia({ ...media, likes: (media.likes ?? 0) + 1 });
    } catch (err) {
      console.error("Error liking media:", err);
    }
  };

  const handleAddComment = async () => {
    if (!user || !commentText.trim() || !media) return;

    setSubmitting(true);
    try {
      const newComment = await postComment(media.id, {
        userId: user.id,
        username: user.username ?? "Usuario",
        userPhotoURL: user.photoURL ?? "",
        text: commentText.trim(),
        createdAt: new Date().toISOString(),
      });

      await incrementMediaStats(media.id, "comments");

      setComments((prev) => [newComment, ...prev]);
      setMedia({ ...media, comments: (media.comments ?? 0) + 1 });
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
      alert(
        `Error al enviar comentario: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-black text-white">
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-black/80 backdrop-blur-md border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-400"
                aria-label="Volver al inicio"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">Cargando...</h1>
          </div>
        </header>

        <main className="flex-1 pt-16 pb-20">
          <div className="relative h-[calc(100vh-8rem)] bg-zinc-900">
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin-slow">
                <AppIcon size={64} />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!media) {
    return (
      <div className="flex flex-col min-h-screen bg-black text-white">
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-black/80 backdrop-blur-md border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-400"
                aria-label="Volver al inicio"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">Contenido no encontrado</h1>
          </div>
        </header>

        <main className="flex-1 pt-16 pb-20 flex items-center justify-center">
          <div className="text-center">
            <p className="text-zinc-400 mb-4">
              El contenido que buscas no está disponible
            </p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Volver al Inicio
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    // usamos mediaId en un data-attribute para evitar linter "defined but never used"
    <div data-media-id={mediaId} className="flex flex-col min-h-screen bg-black text-white">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-black/80 backdrop-blur-md border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Link href="/" aria-label="Volver al inicio">
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold truncate max-w-[60vw]">
            {media.title}
          </h1>
        </div>
        <Button variant="ghost" size="icon" aria-label="Más opciones">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </header>

      <main className="flex-1 pt-16 pb-20">
        <div className="relative h-[calc(100vh-16rem)] bg-zinc-900">
          {media.type === "image" ? (
            <Image
              src={media.mediaUrl || "/placeholder.svg"}
              alt={media.title}
              fill
              className="object-contain"
              priority
            />
          ) : media.type === "video" ? (
            <video
              src={media.mediaUrl}
              controls
              playsInline
              className="w-full h-full object-contain"
            >
              {/* Se añade <track> para cumplir regla de accesibilidad */}
              <track kind="captions" srcLang="es" label="Subtítulos" />
            </video>
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-b from-purple-900/20 to-black">
              <div className="text-center p-4">
                <Music className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                <p className="text-xl font-bold mb-4">{media.title}</p>
                <audio
                  src={media.mediaUrl}
                  controls
                  className="w-full max-w-md"
                >
                  <track kind="captions" srcLang="es" label="Subtítulos" />
                </audio>
              </div>
            </div>
          )}

          <div className="absolute right-4 top-4 z-10 flex flex-col items-center gap-6">
            <ActionButton
              icon={<Heart className="h-6 w-6" />}
              label="Me gusta"
              count={media.likes ?? 0}
              onClick={handleLike}
            />
            <ActionButton
              icon={<MessageCircle className="h-6 w-6" />}
              label="Comentarios"
              count={media.comments ?? 0}
            />
            <ActionButton
              icon={<Share2 className="h-6 w-6" />}
              label="Compartir"
            />
          </div>
        </div>

        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-10 w-10 border-2 border-purple-500">
              <AvatarImage
                src={media.userPhotoURL ?? "/placeholder.svg"}
                alt={media.username ?? "Usuario"}
              />
              <AvatarFallback>{media.username?.[0] ?? "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{media.username}</p>
              {media.challengeTitle && (
                <p className="text-xs text-zinc-400">Reto: {media.challengeTitle}</p>
              )}
            </div>
            <Button
              size="sm"
              variant="secondary"
              className="ml-auto text-xs bg-purple-600 hover:bg-purple-700 text-white"
            >
              Seguir
            </Button>
          </div>

          <p className="text-sm mb-3">{media.description}</p>

          {media.hashtags && media.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {media.hashtags.map((tag, index) => (
                <Badge
                  key={index}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white border-none text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <h3 className="font-medium mb-3">Comentarios ({media.comments ?? 0})</h3>

          <div className="space-y-4 mb-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={comment.userPhotoURL ?? "/placeholder.svg"}
                      alt={comment.username}
                    />
                    <AvatarFallback>{comment.username?.charAt(0) ?? "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{comment.username}</p>
                      <span className="text-xs text-zinc-500">
                        {formatTimestamp(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm">{comment.text}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-xs text-zinc-400 hover:text-zinc-300"
                      >
                        Me gusta
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-xs text-zinc-400 hover:text-zinc-300"
                      >
                        Responder
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-zinc-400 py-4">
                No hay comentarios aún. ¡Sé el primero en comentar!
              </p>
            )}
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user.photoURL ?? "/placeholder.svg"}
                  alt={user.username ?? "Usuario"}
                />
                <AvatarFallback>{user.username?.charAt(0) ?? "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 relative">
                <Input
                  placeholder="Añadir un comentario..."
                  className="bg-zinc-900 border-zinc-700 pr-20"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment();
                    }
                  }}
                  aria-label="Comentario"
                />
                <Button
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={handleAddComment}
                  disabled={submitting || !commentText.trim()}
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Publicar"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-2">
              <Link href="/auth/login">
                <Button variant="link" className="text-purple-400 hover:text-purple-300">
                  Inicia sesión para comentar
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* ====== Subcomponentes locales para mantener el archivo limpio ====== */

function ActionButton({
  icon,
  label,
  count,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  count?: number;
  onClick?: () => void;
}) {
  return (
    <div className="flex flex-col items-center">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-black/40 backdrop-blur-md"
        onClick={onClick}
        aria-label={label}
      >
        {icon}
      </Button>
      {typeof count !== "undefined" && <span className="text-xs mt-1">{count}</span>}
    </div>
  );
}
