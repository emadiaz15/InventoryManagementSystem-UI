import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,  // Asegura que el frontend corre en el puerto 5173
    strictPort: true,  // Evita cambiar de puerto automáticamente si está ocupado
    host: '0.0.0.0',  // Permite que Vite acepte conexiones de cualquier red
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:8000',  // Usa la variable de entorno o un valor por defecto
        changeOrigin: true,
        secure: false,  // Permite peticiones a HTTP sin SSL en desarrollo
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  preview: {
    port: 4174,  // Puerto para el modo preview
    strictPort: true,  // Evita cambiar de puerto automáticamente si está ocupado
  },
});
