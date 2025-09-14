// ================================
// API Backend Client
// ================================

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://backedn-pro.vercel.app";

if (!API_URL) {
  throw new Error(
    "Falta la variable de entorno NEXT_PUBLIC_API_URL (ruta base del backend)",
  );
}

const TOKEN_KEY = "auth_token";

// ================================
// Helpers de Token
// ================================

/** Guarda token JWT en almacenamiento local */
export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

/** Obtiene el token JWT guardado */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/** Elimina el token, p. ej. al hacer logout */
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// ================================
// apiFetch: función central
// ================================

/**
 * Función central para hacer peticiones al backend.
 * Añade token si la ruta requiere autenticación.
 * Lanza error con mensaje adecuado si la respuesta no es OK.
 */
export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {},
  authRequired: boolean = false,
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  let headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (authRequired) {
    const token = getToken();
    if (!token) throw new Error("No autenticado");
    headers = {
      ...headers,
      Authorization: `Bearer ${token}`,
    };
  }

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    let errorMsg = "Error desconocido";
    try {
      const data = await res.json();
      errorMsg = data.error || data.message || errorMsg;
    } catch {
      // No JSON válido en error
    }
    throw new Error(errorMsg);
  }

  if (res.status === 204) {
    return null as T;
  }

  return res.json() as Promise<T>;
}

// ================================
// Tipos exportados
// ================================

export interface Comment {
  id: string;
  userId: string;
  username: string;
  userPhotoURL?: string;
  text: string;
  createdAt: string;
}

// ================================
// Funciones específicas
// ================================

/** 🔹 Login de usuario */
// Modificado: la ruta ahora es /api/auth/login para apuntar al backend Express
export async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  return apiFetch<{
    token: string;
    user: { id: string; username: string; email: string };
  }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

/** Registro de usuario nuevo */
// Modificado: la ruta ahora es /api/auth/signup para apuntar al backend Express
export async function registerUser(user: {
  username: string;
  email: string;
  password: string;
}) {
  return apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(user),
  });
}

/** Logout del usuario (si backend lo soporta) */
// Modificado: la ruta ahora es /api/auth/logout para apuntar al backend Express
export async function logout() {
  return apiFetch("/api/auth/logout", { method: "POST" }, true);
}

/** Obtiene perfil del usuario autenticado */
export async function getUserProfile() {
  return apiFetch("/user/profile", { method: "GET" }, true);
}

/** Obtiene media por id */
export async function fetchMediaById(id: string) {
  return apiFetch(`/api/media/${id}`, { method: "GET" }, false);
}

/** Obtiene comentarios de media específico */
export async function fetchCommentsByMediaId(mediaId: string) {
  return apiFetch(`/api/media/${mediaId}/comments`, { method: "GET" }, false);
}

/** Añade comentario a un medio */
export async function postComment(
  mediaId: string,
  comment: {
    userId: string;
    username: string;
    userPhotoURL?: string;
    text: string;
    createdAt: string;
  },
) {
  return apiFetch(
    `/api/media/${mediaId}/comments`,
    {
      method: "POST",
      body: JSON.stringify(comment),
    },
    true,
  );
}

/** Obtiene medios de un usuario */
export async function getUserMedia(userId: string) {
  return apiFetch(`/users/${userId}/media`, { method: "GET" }, false);
}

/** Obtiene media trending */
export async function getTrendingMedia() {
  return apiFetch(`/api/media/trending`, { method: "GET" }, false);
}
// Comentarios agregados en cada función modificada para mayor claridad