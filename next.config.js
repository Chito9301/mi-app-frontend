const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // No optimiza imágenes, útil si usas CDN
  },
  allowedDevOrigins: ["http://10.127.84.98", "http://localhost:3000"],
  typescript: {
    ignoreBuildErrors: false, // Detener build si hay errores TS
  },
  eslint: {
    dirs: ["pages", "components", "lib", "hooks"], // Carpetas donde correr ESLint
    ignoreDuringBuilds: true, // Ignorar errores ESLint para que build no falle
  },
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname, "frontend"),
    };
    return config;
  },

  // ⚡ FIX para monorepo y lockfiles
  outputFileTracingRoot: path.join(__dirname, ".."),
};

module.exports = nextConfig;
