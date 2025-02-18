import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from "./router/Routes"; // Ajusta el path correctamente.

function App() {
  return (
    <Router>
      {/* Aquí simplemente cargamos las rutas de `AppRoutes` */}
      <AppRoutes />
    </Router>
  );
}

export default App;
