// ─── Query Client ────────────────────────────────────────────
/** src/lib/queryClient.js
  * Configuración del cliente de React Query para manejar el estado de las consultas. 
  * Incluye opciones predeterminadas como tiempo de caducidad y reintentos.
  */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      cacheTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});