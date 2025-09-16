"use client";

import { ArrowLeft, Edit, Settings, AlertTriangle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import type { User } from "@/app/types/user";
import ProtectedRoute from "@/components/protected-route";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth-context";
import { getUserMedia, type MediaItem } from "@/lib/media-service";
import UploadForm from "./UploadForm";

/**
 * Página de perfil de usuario
 * Permite visualizar el perfil propio o de otro usuario,
 * mostrando sus medios (retos), con pestañas para diferentes categorías.
 */
export default function ProfilePage() {
  const { user } = useAuth();
  const typedUser = user as unknown as User | undefined;
  const searchParams = useSearchParams();
  const profileUserId = searchParams.get("userId");
  const isOwnProfile = !profileUserId || profileUserId === typedUser?._id;

  const [userMedia, setUserMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserMedia() {
      if (typedUser?._id) {
        try {
          setLoading(true);
          const media = await getUserMedia(profileUserId || typedUser._id);
          setUserMedia(media);
        } catch (error) {
          console.error("Error fetching user media:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchUserMedia();
  }, [typedUser, profileUserId]);

  const handleReportUser = () => {
    if (confirm("¿Quieres reportar este perfil?")) {
      alert(
        "Reporte de perfil enviado. Gracias por ayudarnos a mantener la comunidad segura.",
      );
      // Aquí puedes implementar llamada al backend para reportar realmente
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-black text-white">
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-black/80 backdrop-blur-md border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-400"
                aria-label="Volver a inicio"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">
              {isOwnProfile ? "Mi Perfil" : "Perfil de Usuario"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {isOwnProfile ? (
              <>
                <Link href="/profile/edit" aria-label="Editar perfil">
                  <Button variant="ghost" size="icon" className="text-zinc-400">
                    <Edit className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/profile/settings" aria-label="Configuración">
                  <Button variant="ghost" size="icon" className="text-zinc-400">
                    <Settings className="h-5 w-5" />
                  </Button>
                </Link>
              </>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                onClick={handleReportUser}
                aria-label="Reportar perfil"
              >
                <AlertTriangle className="h-5 w-5" />
              </Button>
            )}
          </div>
        </header>

        <main className="flex-1 pt-16 pb-20">
          <div className="p-4">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-20 w-20 border-4 border-purple-500">
                <AvatarImage
                  src={
                    typedUser?.photoURL ?? `/placeholder.svg?height=80&width=80`
                  }
                  alt={typedUser?.username ?? "@user"}
                />
                <AvatarFallback>
                  {typedUser?.username?.charAt(0) ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">
                    {typedUser?.username ?? "Usuario"}
                  </h2>
                </div>
                <p className="text-zinc-400">{typedUser?.email}</p>
                <p className="text-sm mt-1">
                  Amante de los retos y la creatividad 🚀
                </p>
              </div>
            </div>

            <div className="flex justify-between mb-6 text-center">
              <div className="flex-1">
                <p className="text-xl font-bold">{userMedia.length}</p>
                <p className="text-xs text-zinc-400">Retos</p>
              </div>
              <div className="flex-1">
                <p className="text-xl font-bold">0</p>
                <p className="text-xs text-zinc-400">Seguidores</p>
              </div>
              <div className="flex-1">
                <p className="text-xl font-bold">0</p>
                <p className="text-xs text-zinc-400">Siguiendo</p>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              {isOwnProfile ? (
                <>
                  <Link
                    href="/profile/edit"
                    className="flex-1"
                    aria-label="Editar perfil"
                  >
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      Editar perfil
                    </Button>
                  </Link>
                  <Link
                    href="/profile/settings"
                    className="flex-1"
                    aria-label="Configuración de perfil"
                  >
                    <Button
                      variant="outline"
                      className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 bg-transparent"
                    >
                      Configuración
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Button
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    aria-label="Seguir usuario"
                  >
                    Seguir
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800 bg-transparent"
                    aria-label="Enviar mensaje"
                  >
                    Mensaje
                  </Button>
                </>
              )}
            </div>

            <Tabs defaultValue="challenges" className="w-full">
              <TabsList className="w-full bg-zinc-900 border-b border-zinc-800 rounded-none h-12">
                <TabsTrigger
                  value="challenges"
                  className="flex-1 data-[state=active]:bg-black data-[state=active]:text-white"
                >
                  {isOwnProfile ? "Mis Retos" : "Retos"}
                </TabsTrigger>
                <TabsTrigger
                  value="created"
                  className="flex-1 data-[state=active]:bg-black data-[state=active]:text-white"
                >
                  Creados
                </TabsTrigger>
                <TabsTrigger
                  value="saved"
                  className="flex-1 data-[state=active]:bg-black data-[state=active]:text-white"
                >
                  Guardados
                </TabsTrigger>
              </TabsList>

              <TabsContent value="challenges" className="mt-4">
                {loading ? (
                  <div className="grid grid-cols-3 gap-1">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                      <Skeleton
                        key={item}
                        className="aspect-square bg-zinc-800"
                      />
                    ))}
                  </div>
                ) : userMedia.length > 0 ? (
                  <div className="grid grid-cols-3 gap-1">
                    {userMedia.map((item) => (
                      <div key={item.id} className="aspect-square relative">
                        <Image
                          src={
                            item.type === "image"
                              ? (item.mediaUrl ??
                                `/placeholder.svg?height=150&width=150`)
                              : (item.thumbnailUrl ??
                                `/placeholder.svg?height=150&width=150`)
                          }
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-1 right-1">
                          <Badge className="text-[10px] py-0 h-4 bg-black/60 backdrop-blur-sm">
                            {item.likes}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-zinc-400">
                      {isOwnProfile
                        ? "Aún no has participado en ningún reto."
                        : "Este usuario aún no ha participado en ningún reto."}
                    </p>
                    {isOwnProfile && (
                      <Link href="/">
                        <Button className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                          Explorar Retos
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="created" className="mt-4">
                <div className="text-center py-8">
                  <p className="text-zinc-400">
                    {isOwnProfile
                      ? "Aún no has creado ningún reto."
                      : "Este usuario aún no ha creado ningún reto."}
                  </p>
                  {isOwnProfile && (
                    <Link href="/crear-reto">
                      <Button className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        Crear Reto
                      </Button>
                    </Link>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="saved" className="mt-4">
                <div className="text-center py-8">
                  <p className="text-zinc-400">
                    {isOwnProfile
                      ? "Aún no has guardado ningún reto."
                      : "Los retos guardados son privados."}
                  </p>
                  {isOwnProfile && (
                    <Link href="/explorar">
                      <Button className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        Explorar
                      </Button>
                    </Link>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <UploadForm />
        </main>
      </div>
    </ProtectedRoute>
  );
}
