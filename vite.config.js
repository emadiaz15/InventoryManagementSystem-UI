import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: parseInt(process.env.VITE_PORT) || 5173, // Usa el puerto de Railway o 5173 por defecto
    strictPort: true, // Evita cambiar de puerto si está ocupado
    host: "0.0.0.0", // Permite acceso desde cualquier IP dentro de Docker
    watch: {
      usePolling: true, // Permite detectar cambios dentro del contenedor Docker
    },
    hmr: {
      host: "localhost", // Evita problemas con Hot Module Replacement
      protocol: "ws", // Asegura que Vite use WebSockets para el reload
    },
    proxy: {
      "/api": {
        target: process.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1",
        changeOrigin: true,
        secure: false, // Permite peticiones sin HTTPS en desarrollo
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  preview: {
    port: 4174,
    strictPort: true,
  },
});
