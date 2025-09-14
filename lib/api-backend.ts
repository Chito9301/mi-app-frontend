const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://backedn-express.vercel.app/api";

if (!API_URL) {
  throw new Error(
    "Falta la variable de entorno NEXT_PUBLIC_API_URL (ruta base del backend)"
  );
}

const TOKEN_KEY = "auth_token";

// --- Manejo del token ---
export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// --- Función central ---
export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {},
  authRequired: boolean = false
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  let headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (authRequired) {
    const token = getToken();
    if (!token) throw new Error("No autenticado");
    headers = { ...headers, Authorization: `Bearer ${token}` };
  }

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    let errorMsg = "Error desconocido";
    try {
      const data = await res.json();
      errorMsg = data.error || data.message || errorMsg;
    } catch {
      // No JSON válido
    }
    throw new Error(errorMsg);
  }

  if (res.status === 204) return null as T;

  return res.json() as Promise<T>;
}

// --- Funciones específicas ---

// 🔹 Login
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
  }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// 🔹 Registro
export async function registerUser(user: {
  username: string;
  email: string;
  password: string;
}) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(user),
  });
}

// 🔹 Perfil usuario
export async function getUserProfile() {
  return apiFetch("/users/profile", { method: "GET" }, true);
}

// 🔹 Media por ID
export async function fetchMediaById(id: string) {
  return apiFetch(`/media/${id}`, { method: "GET" }, false);
}

// 🔹 Trending
export async function getTrendingMedia() {
  return apiFetch(`/media/trending`, { method: "GET" }, false);
}
