import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  const isDev = mode === 'development';
  const PORT = parseInt(env.PORT || '5173', 10);
  const API_BASE_URL = env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

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
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  };
});
