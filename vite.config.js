export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',  // Cambia este puerto si tu backend está en otro
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
};