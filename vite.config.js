import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    // El puerto es configurado por Railway en la variable de entorno PORT
    port: process.env.VITE_PORT || 5173, // Usa el puerto de Railway, o 3000 por defecto
    strictPort: true, // Evita cambiar de puerto automáticamente si está ocupado
    proxy: {
      '/api': {
        // Usa la variable de entorno VITE_API_URL o localhost en desarrollo
        target: process.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1",
        changeOrigin: true,
        secure: false, // Permite peticiones a HTTP sin SSL en desarrollo
        rewrite: (path) => path.replace(/^\/api/, ''), // Reescribe la ruta del proxy

      },
    },
  },
  preview: {
    // Puerto para el modo preview
    port: 4174,
    strictPort: true, // Evita cambiar de puerto automáticamente si está ocupado
  },
});
