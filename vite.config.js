import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: parseInt(process.env.VITE_PORT) || 5173, // Usa el puerto de Railway o 5173 por defecto
    strictPort: true, // Evita cambiar de puerto si está ocupado
    host: true, // Permite acceso desde la red de Docker
    watch: {
      usePolling: true, // Necesario para que Docker detecte cambios en archivos
    },
    proxy: {
      "/api": {
        target: process.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1",
        changeOrigin: true,
        secure: false, // Permite peticiones a HTTP sin SSL en desarrollo
        rewrite: (path) => path.replace(/^\/api/, ""), // Reescribe la ruta del proxy
      },
    },
  },
  preview: {
    port: 4174,
    strictPort: true,
  },
});
