"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "@/lib/api-backend";

export interface User {
  id: string;
  username: string;
  email: string;
  photoURL?: string; // Para futuro uso
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: { username: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  uploadImage: (file: File) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
        setIsConfigured(true);
      }
    }
    fetchUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { user } = await loginUser({ email, password });
      setUser(user);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || "Error al iniciar sesión");
      } else {
        throw new Error("Error al iniciar sesión");
      }
    }
  };

  const signUp = async (data: { username: string; email: string; password: string }) => {
    try {
      const response = await registerUser(data);
      setUser(response.user);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || "Error al registrarse");
      } else {
        throw new Error("Error al registrarse");
      }
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Error al solicitar cambio de contraseña");
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
    );
    formData.append("folder", "tu_carpeta");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) throw new Error("Error al subir imagen a Cloudinary");

    const data = await res.json();
    return data.secure_url;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isConfigured,
        signIn,
        signUp,
        logout,
        resetPassword,
        uploadImage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};
