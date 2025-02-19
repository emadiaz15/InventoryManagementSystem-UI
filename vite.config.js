import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5174, // Asegura que el frontend corre en el puerto 5174
    strictPort: true, // Evita cambiar de puerto automáticamente si está ocupado
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // Cambia este puerto si tu backend está en otro
        changeOrigin: true,
        secure: false, // Permite peticiones a HTTP sin SSL en desarrollo
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  preview: {
    port: 4174, // Puerto para el modo preview
    strictPort: true, // Evita cambiar de puerto automáticamente si está ocupado
  },
});
