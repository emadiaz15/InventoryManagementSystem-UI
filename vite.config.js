import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command, mode }) => {
  return {
    base: mode === "production" ? "https://inventarioweb.up.railway.app/" : "/",
    plugins: [react()],
    server: {
      port: parseInt(process.env.VITE_PORT) || 5173,
      strictPort: true,
      host: "0.0.0.0",
      watch: {
        usePolling: true,
      },
      hmr: {
        host: "localhost",
        protocol: "ws",
      },
      proxy: {
        "/api": {
          target: process.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    preview: {
      port: 4174,
      strictPort: true,
    },
  };
});
