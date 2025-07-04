import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

// 🛡️ Contextos
import { AuthProvider } from './context/AuthProvider';
import { DataPrefetchProvider } from './context/DataPrefetchContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';

const isDev = import.meta.env.DEV;

async function renderApp() {
  let Devtools = () => null;

  // Carga dinámica solo en desarrollo
  if (isDev) {
    const mod = await import('@tanstack/react-query-devtools');
    Devtools = mod.ReactQueryDevtools;
  }

  const root = ReactDOM.createRoot(document.getElementById('root'));

  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <DataPrefetchProvider>
              <App />
            </DataPrefetchProvider>
          </AuthProvider>
          {isDev && <Devtools initialIsOpen={false} />}
        </QueryClientProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

renderApp();
