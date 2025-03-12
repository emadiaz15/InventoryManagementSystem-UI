// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    // El puerto es configurado por Railway en la variable de entorno PORT
    port: import.meta.env.PORT || 5174, // Si el entorno no define el puerto, usa 5174 por defecto
    strictPort: true, // Evita cambiar de puerto automáticamente si está ocupado
    proxy: {
      '/api': {
        target: import.meta.env.VITE_API_URL || 'http://localhost:8000', // Usa la variable de entorno VITE_API_URL o localhost en desarrollo
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
