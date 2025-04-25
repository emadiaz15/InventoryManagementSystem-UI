import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Cargar variables de entorno según el modo (development o production)
  const env = loadEnv(mode, process.cwd());

  // También cargar manualmente .env en Node (útil para server-side Node.js)
  dotenv.config({ path: `.env.${mode}` });

  const isDev = mode === 'development';
  const PORT = parseInt(env.VITE_PORT || '5173');
  const API_BASE_URL = "https://inventoryapi.up.railway.app/api/v1"
  return {
    plugins: [react()],
    server: {
      port: PORT,
      strictPort: true,
      proxy: isDev
        ? {
            '/api': {
              target: API_BASE_URL,
              changeOrigin: true,
              secure: false,
              rewrite: (path) => path.replace(/^\/api/, ''),
            },
          }
        : undefined,
    },
    preview: {
      port: 4174,
      strictPort: true,
    },
  };
});
