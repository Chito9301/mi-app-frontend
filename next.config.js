import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true, // útil si usas CDN o Cloudinary
  },
  allowedDevOrigins: ["http://localhost:3000"], // puedes agregar más si es necesario
  typescript: {
    ignoreBuildErrors: false, // detener build si hay errores TS
  },
  eslint: {
    dirs: ["pages", "components", "lib", "hooks"],
    ignoreDuringBuilds: true, // build no falla por ESLint
  },
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname, "frontend"), // alias para imports
    };
    return config;
  },
  experimental: {
    serverActions: true,
  },
  // ⚡ FIX monorepo o path root
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;