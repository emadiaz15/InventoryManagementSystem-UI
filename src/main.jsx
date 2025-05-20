import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

// 🛡️ Contextos
import { AuthProvider } from './context/AuthProvider';
import { DataPrefetchProvider } from './context/DataPrefetchContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DataPrefetchProvider>
          <App />
        </DataPrefetchProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
