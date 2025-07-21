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

// Mostrar siempre el entorno DEV (logs para depuración)
console.log('import.meta.env.DEV =', import.meta.env.DEV)
console.log('process.env.NODE_ENV =', process.env.NODE_ENV)

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <DataPrefetchProvider>
            <App />
          </DataPrefetchProvider>
        </AuthProvider>

        {/* React Query Devtools siempre visible */}
        <ReactQueryDevtools
          initialIsOpen={true}
          position="bottom-right"
          toggleButtonProps={{ style: { bottom: '20px', right: '20px', opacity: 1 } }}
        />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
)