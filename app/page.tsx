"use client";

import {
  Heart,
  MessageCircle,
  Plus,
  Search,
  Share2,
  ChevronUp,
  Music,
  Eye,
  TrendingUp,
  Bookmark,
  MessageSquare,
  Bell,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState, useEffect } from "react";
import { AppIcon } from "@/components/app-icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { getTrendingMedia, type MediaItem } from "@/lib/media-service";

interface InteractiveButtonProps {
  icon: React.ElementType;
  count: string | number;
  isActive: boolean;
  onClick: () => void;
  activeColor?: string;
}

function InteractiveButton({
  icon: Icon,
  count,
  isActive,
  onClick,
  activeColor = "text-purple-500",
}: InteractiveButtonProps) {
  return (
    <div className="flex flex-col items-center">
      <Button
        variant="ghost"
        size="icon"
        className={`rounded-full bg-black/40 backdrop-blur-md h-9 w-9 transition-all duration-200 hover:scale-110 ${
          isActive ? activeColor : "text-white"
        }`}
        onClick={onClick}
        type="button"
        aria-pressed={isActive ? "true" : "false"}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
      </Button>
      <span
        className="text-xs mt-1 text-center leading-tight max-w-[50px] truncate"
        aria-label={typeof count === "number" ? `${count} interactions` : count}
      >
        {count}
      </span>
    </div>
  );
}

export default function Home() {
  const { user, isConfigured } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"challenge" | "feed">("challenge");
  const [trendingMedia, setTrendingMedia] = useState<MediaItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Carga listado de media trending por vistas, máximo 10
  useEffect(() => {
    async function fetchTrendingMedia() {
      try {
        setLoading(true);
        const media = await getTrendingMedia("views", 10);
        setTrendingMedia(media);
      } catch (error) {
        console.error("Error fetching trending media:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTrendingMedia();
  }, []);

  const currentMedia = trendingMedia[currentIndex];
  const usernameFallback =
    currentMedia?.username?.charAt(0).toUpperCase() ?? "?";

  // Cambia índice al siguiente contenido trending, con wrap-around
  const handleSwipeUp = () => {
    if (trendingMedia.length > 0)
      setCurrentIndex((prev) => (prev + 1) % trendingMedia.length);
  };

  // Cambia índice al previo contenido trending, con wrap-around
  const handleSwipeDown = () => {
    if (trendingMedia.length > 0)
      setCurrentIndex(
        (prev) => (prev - 1 + trendingMedia.length) % trendingMedia.length,
      );
  };

  // Maneja click en botón crear nuevo contenido con control de auth y configuración
  const handleCreateClick = () => {
    if (!isConfigured) router.push("/env-setup");
    else if (!user) router.push("/auth/login");
    else router.push("/create");
  };

  // Maneja click en perfil con control similar
  const handleProfileClick = () => {
    if (!isConfigured) router.push("/env-setup");
    else if (!user) router.push("/auth/login");
    else router.push("/profile");
  };

  // Click en chat - funcionalidad pendiente
  // Chat button handler: Navega a la página de chat si el usuario está autenticado y configurado
  // Si no, redirige a configuración o login según corresponda
  const handleChatClick = () => {
    if (!isConfigured) router.push("/env-setup");
    else if (!user) router.push("/auth/login");
    else router.push("/chat");
  };

  // **Nuevo**: Maneja click en alertas con lógica de autenticación
  const handleAlertsClick = () => {
    if (!isConfigured) router.push("/env-setup");
    else if (!user) router.push("/auth/login");
    else router.push("/alertas");
  };

  // Comentamos esta condición para que no retorne nada y permita el render aunque currentMedia sea undefined
  // if (!loading && trendingMedia.length > 0 && !currentMedia) {
  //   return null;
  // }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header (igual que antes, por brevedad no se repite aquí) */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-transparent">
        <div className="flex items-center gap-2">
          <AppIcon size={32} />
          <p className="text-sm font-medium">
            Desafía tu rutina. Reta tu mundo.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!isConfigured && (
            <Link href="/env-setup">
              <Button
                variant="ghost"
                size="sm"
                className="text-amber-400 bg-amber-400/10 backdrop-blur-md rounded-full"
                type="button"
              >
                Configurar
              </Button>
            </Link>
          )}
          <Link href="/explorar">
            <Button
              variant="ghost"
              size="icon"
              className="text-white bg-black/30 backdrop-blur-md rounded-full"
              type="button"
              aria-label="Explorar contenido"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </header>

      {/* MongoDB Configuration Warning */}
      {!isConfigured && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-amber-900/20 border-b border-amber-900 p-3">
          <div className="text-center">
            <p className="text-amber-300 text-sm">
              ⚠️ Modo Demo - MongoDB no configurado.{" "}
              <Link
                href="/env-setup"
                className="underline hover:text-amber-200"
              >
                Configurar ahora
              </Link>
            </p>
          </div>
        </div>
      )}

      {/* Tab Selector */}
      <div
        className={`fixed ${!isConfigured ? "top-28" : "top-16"} left-0 right-0 z-50 flex justify-center`}
      >
        <div className="flex bg-black/40 backdrop-blur-md rounded-full p-1">
          <button
            type="button"
            onClick={() => setActiveTab("challenge")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              activeTab === "challenge"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                : "text-zinc-400"
            }`}
            aria-pressed={activeTab === "challenge"}
          >
            Reto Diario
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("feed")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              activeTab === "feed"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                : "text-zinc-400"
            }`}
            aria-pressed={activeTab === "feed"}
          >
            Feed Social
          </button>
        </div>
      </div>

      {/* Contenido fijo de prueba para asegurar que se renderiza */}
      <div style={{ color: "white", padding: "12px", textAlign: "center" }}>
        Aquí debería mostrarse el contenido principal...
      </div>

      {/* Main Content - TikTok Style */}
      <main className="flex-1 relative pb-28" onClick={handleSwipeUp}>
        {/* Full Screen Video Background */}
        <div className="absolute inset-0 bg-zinc-900">
          {loading || trendingMedia.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin-slow mb-4">
                  <AppIcon size={64} />
                </div>
                <p className="text-zinc-400">
                  {!isConfigured
                    ? "Modo Demo - Configurar MongoDB para contenido real"
                    : "Cargando contenido..."}
                </p>
              </div>
            </div>
          ) : (
            <div className="relative h-full w-full">
              {currentMedia?.type === "image" ? (
                <Image
                  src={currentMedia.mediaUrl || "/placeholder.svg"}
                  alt={currentMedia.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : currentMedia?.type === "video" ? (
                <div className="relative h-full w-full">
                  <Image
                    src={currentMedia.mediaUrl || "/placeholder.svg"}
                    alt={currentMedia.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* Play icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/60 rounded-full p-4">
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-white"
                        aria-hidden="true"
                      >
                        <polygon points="5,3 19,12 5,21" fill="currentColor" />
                      </svg>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full bg-gradient-to-b from-purple-900/20 to-black">
                  <div className="text-center">
                    <Music
                      className="h-16 w-16 text-purple-400 mx-auto mb-4"
                      aria-hidden="true"
                    />
                    <p className="text-xl font-bold">
                      {currentMedia?.title ?? "Audio no disponible"}
                    </p>
                    <div className="mt-4 bg-zinc-800 rounded-lg p-4">
                      <p className="text-sm text-zinc-400">
                        Audio no disponible en modo demo
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
            </div>
          )}
        </div>

        {/* Right Side Controls */}
        <div className="absolute right-3 bottom-36 sm:bottom-40 z-10 flex flex-col items-center gap-3">
          <InteractiveButton
            icon={Heart}
            count={currentMedia?.likes || 0}
            isActive={false}
            onClick={() => console.log("Like clicked")}
            activeColor="text-red-500"
          />
          <InteractiveButton
            icon={MessageCircle}
            count={currentMedia?.comments || 0}
            isActive={false}
            onClick={() => console.log("Comments clicked")}
          />
          <InteractiveButton
            icon={Eye}
            count={currentMedia?.views || 0}
            isActive={false}
            onClick={() => console.log("Views clicked")}
            activeColor="text-blue-500"
          />
          <InteractiveButton
            icon={Bookmark}
            count="Guardar"
            isActive={false}
            onClick={() => console.log("Save clicked")}
            activeColor="text-yellow-500"
          />
          <InteractiveButton
            icon={Share2}
            count="Compartir"
            isActive={false}
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: "Challz",
                  text: "Mira este increíble reto en Challz",
                  url: window.location.href,
                });
              } else {
                console.log("Share clicked");
              }
            }}
          />
          <InteractiveButton
            icon={TrendingUp}
            count="Tendencias"
            isActive={false}
            onClick={() => router.push("/trending")}
            activeColor="text-orange-500"
          />
        </div>

        {/* Bottom Content Info */}
        <div className="absolute bottom-24 sm:bottom-28 left-0 right-12 p-4 z-10">
          {activeTab === "challenge" ? (
            <div>
              <Badge className="mb-2 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30">
                RETO DEL DÍA
              </Badge>
              <h2 className="text-xl font-bold mb-2">
                Crea un video bailando con tu canción favorita de los 90s
              </h2>
              <div className="flex items-center gap-2 mb-3">
                <Avatar className="h-8 w-8 border-2 border-purple-500">
                  <AvatarImage
                    src="/placeholder.svg?height=32&width=32"
                    alt="@challz"
                  />
                  <AvatarFallback>CH</AvatarFallback>
                </Avatar>
                <p className="font-medium">@challz</p>
                <Button
                  size="sm"
                  variant="secondary"
                  className="ml-2 text-xs bg-purple-600 hover:bg-purple-700 text-white"
                  type="button"
                >
                  Seguir
                </Button>
              </div>
              <p className="text-sm text-zinc-300 mb-3">
                Muestra tus mejores pasos de baile con una canción nostálgica.
                ¡Sorprende a todos con tu creatividad!
              </p>
              <div className="flex items-center gap-2 mb-3">
                <Music className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                <p className="text-sm text-zinc-400">
                  Música de los 90s - Challz Mix
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleCreateClick}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  type="button"
                >
                  {!isConfigured ? "Configurar Firebase" : "Aceptar Reto"}
                </Button>
                <Link href="/reto/1">
                  <Button
                    variant="outline"
                    className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 bg-transparent"
                    type="button"
                  >
                    Ver Respuestas
                  </Button>
                </Link>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
                <span>Quedan 14 horas</span>
                <span className="w-1 h-1 rounded-full bg-zinc-500"></span>
                <span>238 participantes</span>
              </div>
            </div>
          ) : (
            <div>
              {currentMedia && (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-8 w-8 border-2 border-purple-500">
                      <AvatarImage
                        src={
                          currentMedia.userPhotoURL ||
                          "/placeholder.svg?height=32&width=32"
                        }
                        alt={currentMedia.username}
                      />
                      <AvatarFallback>{usernameFallback}</AvatarFallback>
                    </Avatar>
                    <p className="font-medium">{currentMedia.username}</p>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="ml-auto text-xs bg-purple-600 hover:bg-purple-700 text-white"
                      type="button"
                    >
                      Seguir
                    </Button>
                  </div>
                  <p className="text-sm mb-2">
                    {currentMedia.description || currentMedia.title}
                  </p>
                  {currentMedia.hashtags &&
                    currentMedia.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {currentMedia.hashtags.map((tag, index) => (
                          <Badge
                            key={index}
                            className="bg-zinc-800 hover:bg-zinc-700 text-white border-none text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Swipe Up Indicator */}
        <div className="absolute bottom-32 sm:bottom-36 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center animate-bounce">
          <p className="text-xs text-zinc-400 mb-1">Desliza hacia arriba</p>
          <ChevronUp className="h-4 w-4 text-zinc-400" aria-hidden="true" />
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-t border-zinc-800">
        <div className="flex items-center justify-around p-3 pb-6 sm:pb-3">
          {/* Home Button */}
          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1 h-auto py-2"
            type="button"
            aria-label="Inicio"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-xs">Inicio</span>
          </Button>

          {/* Profile Button */}
          <Button
            onClick={handleProfileClick}
            variant="ghost"
            className="flex flex-col items-center gap-1 h-auto py-2 text-zinc-500"
            type="button"
            aria-label="Perfil"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-xs">Perfil</span>
          </Button>

          {/* Create Button */}
          <Button
            variant="ghost"
            size="icon"
            className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full h-14 w-14 flex items-center justify-center shadow-lg"
            onClick={handleCreateClick}
            type="button"
            aria-label="Crear contenido"
          >
            <Plus className="h-7 w-7" aria-hidden="true" />
          </Button>

          {/* Chat Button */}
          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1 h-auto py-2 text-zinc-500"
            onClick={handleChatClick}
            type="button"
            aria-label="Chat"
          >
            <MessageSquare className="h-5 w-5" aria-hidden="true" />
            <span className="text-xs">Chat</span>
          </Button>

          {/* Alerts Button (modificado para validar sesión antes de redirigir) */}
          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1 h-auto py-2 text-zinc-500"
            onClick={handleAlertsClick} // Se usa handler en lugar de Link anidado
            type="button"
            aria-label="Alertas"
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="text-xs">Alertas</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}
