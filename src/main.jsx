import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from './lib/queryClient'
import { AuthProvider } from './context/AuthProvider'
import { DataPrefetchProvider } from './context/DataPrefetchContext'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <DataPrefetchProvider>
            <App />
          </DataPrefetchProvider>
        </AuthProvider>

        {import.meta.env.DEV && (
          <ReactQueryDevtools
            initialIsOpen={true}
            buttonPosition="bottom-left"  // posición del botón
            position="bottom"             // posición del panel
          />
        )}

      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
)
