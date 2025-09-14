"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Bookmark,
  ChevronUp,
  Eye,
  Heart,
  MessageCircle,
  MessageSquare,
  Music,
  Plus,
  Search,
  Share2,
  TrendingUp,
} from "lucide-react";

// UI / componentes locales (de tu proyecto)
import { AppIcon } from "@/components/app-icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Contexto de auth + servicio de media (de tu proyecto)
import { useAuth } from "@/contexts/auth-context";
import { getTrendingMedia, type MediaItem } from "@/lib/media-service";

/* =========================================================
   Tipos auxiliares
========================================================= */
type TabKey = "challenge" | "feed";

type InteractiveButtonProps = {
  icon: React.ElementType;
  count: string | number;
  isActive?: boolean;
  onClick?: () => void;
  activeColor?: string;
  "aria-label"?: string;
};

type VideoProps = {
  src: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
};

/* =========================================================
   Utilidades
========================================================= */
function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Hook simple para manejar gestos de swipe (vertical) en móviles */
function useVerticalSwipe(onUp?: () => void, onDown?: () => void) {
  const touchStartY = React.useRef<number | null>(null);
  const touchEndY = React.useRef<number | null>(null);

  const minSwipeDistance = 50; // px

  const onTouchStart = React.useCallback((e: React.TouchEvent) => {
    touchEndY.current = null;
    touchStartY.current = e.targetTouches[0]?.clientY ?? null;
  }, []);

  const onTouchMove = React.useCallback((e: React.TouchEvent) => {
    touchEndY.current = e.targetTouches[0]?.clientY ?? null;
  }, []);

  const onTouchEnd = React.useCallback(() => {
    if (touchStartY.current == null || touchEndY.current == null) return;
    const distance = touchStartY.current - touchEndY.current;

    if (Math.abs(distance) < minSwipeDistance) return;

    if (distance > 0) onUp?.(); // swipe up
    else onDown?.(); // swipe down
  }, [onUp, onDown]);

  return { onTouchStart, onTouchMove, onTouchEnd };
}

/* =========================================================
   Subcomponentes
========================================================= */

function InteractiveButton({
  icon: Icon,
  count,
  isActive = false,
  onClick,
  activeColor = "text-purple-500",
  "aria-label": ariaLabel,
}: InteractiveButtonProps) {
  return (
    <div className="flex flex-col items-center">
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "rounded-full bg-black/40 backdrop-blur-md h-9 w-9 transition-all duration-200 hover:scale-110 text-white",
          isActive && activeColor
        )}
        onClick={onClick}
        type="button"
        aria-pressed={isActive ? "true" : "false"}
        aria-label={ariaLabel || (typeof count === "number" ? `${count}` : `${count}`)}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
      </Button>
      <span className="text-xs mt-1 text-center leading-tight max-w-[56px] truncate">
        {count}
      </span>
    </div>
  );
}

function SafeVideo({
  src,
  className,
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
}: VideoProps) {
  // safari/iOS suele requerir muted + playsInline para autoplay
  return (
    <video
      className={cn("w-full h-full object-cover", className)}
      src={src}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      controls={false}
      preload="metadata"
    />
  );
}

function TopBar({
  isConfigured,
}: {
  isConfigured: boolean;
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-transparent">
      <div className="flex items-center gap-2">
        <AppIcon size={32} />
        <p className="text-sm font-medium">Desafía tu rutina. Reta tu mundo.</p>
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
        <Link href="/explorar" aria-label="Explorar contenido">
          <Button
            variant="ghost"
            size="icon"
            className="text-white bg-black/30 backdrop-blur-md rounded-full"
            type="button"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
          </Button>
        </Link>
      </div>
    </header>
  );
}

function DemoWarning({ isConfigured }: { isConfigured: boolean }) {
  if (isConfigured) return null;
  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-amber-900/20 border-b border-amber-900 p-3">
      <div className="text-center">
        <p className="text-amber-300 text-sm">
          ⚠️ Modo Demo - MongoDB no configurado.{" "}
          <Link href="/env-setup" className="underline hover:text-amber-200">
            Configurar ahora
          </Link>
        </p>
      </div>
    </div>
  );
}

function TabSelector({
  active,
  setActive,
  offsetTop,
}: {
  active: TabKey;
  setActive: (t: TabKey) => void;
  offsetTop: "top-28" | "top-16";
}) {
  return (
    <div className={cn("fixed left-0 right-0 z-50 flex justify-center", offsetTop)}>
      <div className="flex bg-black/40 backdrop-blur-md rounded-full p-1">
        <button
          type="button"
          onClick={() => setActive("challenge")}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
            active === "challenge"
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              : "text-zinc-400 hover:text-zinc-200"
          )}
          aria-pressed={active === "challenge"}
        >
          Reto Diario
        </button>
        <button
          type="button"
          onClick={() => setActive("feed")}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
            active === "feed"
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              : "text-zinc-400 hover:text-zinc-200"
          )}
          aria-pressed={active === "feed"}
        >
          Feed Social
        </button>
      </div>
    </div>
  );
}

function RightControls({
  media,
  onLike,
  onComments,
  onShare,
  onTrending,
}: {
  media?: MediaItem;
  onLike?: () => void;
  onComments?: () => void;
  onShare?: () => void;
  onTrending?: () => void;
}) {
  return (
    <div className="absolute right-3 bottom-36 sm:bottom-40 z-10 flex flex-col items-center gap-3">
      <InteractiveButton
        icon={Heart}
        count={media?.likes ?? 0}
        onClick={onLike}
        activeColor="text-red-500"
        aria-label="Me gusta"
      />
      <InteractiveButton
        icon={MessageCircle}
        count={media?.comments ?? 0}
        onClick={onComments}
        aria-label="Comentarios"
      />
      <InteractiveButton
        icon={Eye}
        count={media?.views ?? 0}
        onClick={() => undefined}
        activeColor="text-blue-500"
        aria-label="Vistas"
      />
      <InteractiveButton
        icon={Bookmark}
        count="Guardar"
        onClick={() => undefined}
        activeColor="text-yellow-500"
        aria-label="Guardar"
      />
      <InteractiveButton
        icon={Share2}
        count="Compartir"
        onClick={onShare}
        aria-label="Compartir"
      />
      <InteractiveButton
        icon={TrendingUp}
        count="Tendencias"
        onClick={onTrending}
        activeColor="text-orange-500"
        aria-label="Tendencias"
      />
    </div>
  );
}

function BottomNav({
  onCreate,
  onProfile,
  onChat,
  onAlerts,
}: {
  onCreate: () => void;
  onProfile: () => void;
  onChat: () => void;
  onAlerts: () => void;
}) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-t border-zinc-800">
      <div className="flex items-center justify-around p-3 pb-6 sm:pb-3">
        {/* Home */}
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

        {/* Perfil */}
        <Button
          onClick={onProfile}
          variant="ghost"
          className="flex flex-col items-center gap-1 h-auto py-2 text-zinc-300"
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

        {/* Crear */}
        <Button
          variant="ghost"
          size="icon"
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full h-14 w-14 flex items-center justify-center shadow-lg"
          onClick={onCreate}
          type="button"
          aria-label="Crear contenido"
        >
          <Plus className="h-7 w-7" aria-hidden="true" />
        </Button>

        {/* Chat */}
        <Button
          variant="ghost"
          className="flex flex-col items-center gap-1 h-auto py-2 text-zinc-300"
          onClick={onChat}
          type="button"
          aria-label="Chat"
        >
          <MessageSquare className="h-5 w-5" aria-hidden="true" />
          <span className="text-xs">Chat</span>
        </Button>

        {/* Alertas */}
        <Button
          variant="ghost"
          className="flex flex-col items-center gap-1 h-auto py-2 text-zinc-300"
          onClick={onAlerts}
          type="button"
          aria-label="Alertas"
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
          <span className="text-xs">Alertas</span>
        </Button>
      </div>
    </nav>
  );
}

/* =========================================================
   Página principal
========================================================= */
export default function Home() {
  const router = useRouter();
  const { user, isConfigured } = useAuth();

  const [activeTab, setActiveTab] = React.useState<TabKey>("challenge");
  const [trendingMedia, setTrendingMedia] = React.useState<MediaItem[]>([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  // Cargar media trending
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const media = await getTrendingMedia("views", 10);
        if (mounted) setTrendingMedia(media || []);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Error fetching trending media:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const currentMedia = trendingMedia[currentIndex];
  const usernameFallback = (currentMedia?.username?.charAt(0) || "?").toUpperCase();

  // Navegación: arriba/abajo
  const goNext = React.useCallback(() => {
    setCurrentIndex((prev) =>
      trendingMedia.length > 0 ? (prev + 1) % trendingMedia.length : 0
    );
  }, [trendingMedia.length]);

  const goPrev = React.useCallback(() => {
    setCurrentIndex((prev) =>
      trendingMedia.length > 0 ? (prev - 1 + trendingMedia.length) % trendingMedia.length : 0
    );
  }, [trendingMedia.length]);

  // Gestos táctiles
  const swipeHandlers = useVerticalSwipe(goNext, goPrev);

  // Handlers de navegación con checks de auth + configuración
  const handleCreateClick = React.useCallback(() => {
    if (!isConfigured) router.push("/env-setup");
    else if (!user) router.push("/auth/login");
    else router.push("/create");
  }, [isConfigured, router, user]);

  const handleProfileClick = React.useCallback(() => {
    if (!isConfigured) router.push("/env-setup");
    else if (!user) router.push("/auth/login");
    else router.push("/profile");
  }, [isConfigured, router, user]);

  const handleChatClick = React.useCallback(() => {
    if (!isConfigured) router.push("/env-setup");
    else if (!user) router.push("/auth/login");
    else router.push("/chat");
  }, [isConfigured, router, user]);

  const handleAlertsClick = React.useCallback(() => {
    if (!isConfigured) router.push("/env-setup");
    else if (!user) router.push("/auth/login");
    else router.push("/alertas");
  }, [isConfigured, router, user]);

  // Compartir
  const handleShare = React.useCallback(() => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({
          title: "Challz",
          text: "Mira este increíble reto en Challz",
          url: typeof window !== "undefined" ? window.location.href : "/",
        })
        .catch(() => {
          /* silencioso */
        });
    } else {
      // fallback simple (podrías abrir un modal)
      // eslint-disable-next-line no-console
      console.log("Share API no disponible");
    }
  }, []);

  // Estados para layout en móviles (offset del Tab segun alerta demo)
  const tabOffsetTop: "top-28" | "top-16" = !isConfigured ? "top-28" : "top-16";

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Topbar */}
      <TopBar isConfigured={!!isConfigured} />

      {/* Aviso de configuración */}
      <DemoWarning isConfigured={!!isConfigured} />

      {/* Selector de pestañas */}
      <TabSelector active={activeTab} setActive={setActiveTab} offsetTop={tabOffsetTop} />

      {/* Contenido principal estilo TikTok */}
      <main
        className="flex-1 relative pb-28 select-none"
        role="main"
        aria-label="Contenido principal"
        onClick={goNext}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp") goPrev();
          if (e.key === "ArrowDown") goNext();
        }}
        tabIndex={0}
        {...swipeHandlers}
      >
        {/* Fondo/Media */}
        <div className="absolute inset-0 bg-zinc-900">
          {loading || trendingMedia.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-pulse mb-4">
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
              {currentMedia?.type === "image" && currentMedia.mediaUrl ? (
                <Image
                  src={currentMedia.mediaUrl}
                  alt={currentMedia.title || "Imagen"}
                  fill
                  className="object-cover"
                  priority
                />
              ) : currentMedia?.type === "video" && currentMedia.mediaUrl ? (
                <SafeVideo src={currentMedia.mediaUrl} className="absolute inset-0" />
              ) : (
                <div className="flex items-center justify-center h-full bg-gradient-to-b from-purple-900/20 to-black">
                  <div className="text-center">
                    <Music className="h-16 w-16 text-purple-400 mx-auto mb-4" aria-hidden="true" />
                    <p className="text-xl font-bold">
                      {currentMedia?.title ?? "Audio no disponible"}
                    </p>
                    <div className="mt-4 bg-zinc-800 rounded-lg p-4">
                      <p className="text-sm text-zinc-400">Audio no disponible en modo demo</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Overlay gradiente para legibilidad de textos */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
            </div>
          )}
        </div>

        {/* Controles laterales */}
        <RightControls
          media={currentMedia}
          onLike={() => undefined}
          onComments={() => undefined}
          onShare={handleShare}
          onTrending={() => router.push("/trending")}
        />

        {/* Información inferior del contenido */}
        <div className="absolute bottom-24 sm:bottom-28 left-0 right-12 p-4 z-10">
          {activeTab === "challenge" ? (
            <div>
              <Badge className="mb-2 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30">
                RETO DEL DÍA
              </Badge>

              <h2 className="text-lg sm:text-xl font-bold mb-2">
                Crea un video bailando con tu canción favorita de los 90s
              </h2>

              <div className="flex items-center gap-2 mb-3">
                <Avatar className="h-8 w-8 border-2 border-purple-500">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="@challz" />
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
                Muestra tus mejores pasos de baile con una canción nostálgica. ¡Sorprende a todos
                con tu creatividad!
              </p>

              <div className="flex items-center gap-2 mb-3">
                <Music className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                <p className="text-sm text-zinc-400">Música de los 90s - Challz Mix</p>
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
                <span className="w-1 h-1 rounded-full bg-zinc-500" />
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
                          currentMedia.userPhotoURL || "/placeholder.svg?height=32&width=32"
                        }
                        alt={currentMedia.username || "usuario"}
                      />
                      <AvatarFallback>{usernameFallback}</AvatarFallback>
                    </Avatar>

                    <p className="font-medium">{currentMedia.username || "Usuario"}</p>

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
                    {currentMedia.description || currentMedia.title || "Contenido"}
                  </p>

                  {Array.isArray(currentMedia.hashtags) && currentMedia.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {currentMedia.hashtags.map((tag, index) => (
                        <Badge
                          key={`${tag}-${index}`}
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

        {/* Indicador de swipe */}
        <div className="absolute bottom-32 sm:bottom-36 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center animate-bounce">
          <p className="text-xs text-zinc-400 mb-1">Desliza hacia arriba</p>
          <ChevronUp className="h-4 w-4 text-zinc-400" aria-hidden="true" />
        </div>
      </main>

      {/* Barra inferior */}
      <BottomNav
        onCreate={handleCreateClick}
        onProfile={handleProfileClick}
        onChat={handleChatClick}
        onAlerts={handleAlertsClick}
      />
    </div>
  );
}
