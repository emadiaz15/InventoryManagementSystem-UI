import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirigir al usuario
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import DashboardCard from "../components/DashboardCard";
import Footer from "../components/common/Footer"; // Asegúrate de importar el Footer
import { useAuth } from '../hooks/useAuth'; // Importar el hook de autenticación

const Dashboard = () => {
  const { isAuthenticated } = useAuth(); // Extraemos el estado de autenticación
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) { // Usamos isAuthenticated como un valor booleano
      navigate('/dashboard'); // Si no está autenticado, redirigir al Home
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar en la parte superior, ocupa todo el ancho */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar a la izquierda */}
        <div className="w-64">
          <Sidebar />
        </div>

        {/* Contenido principal a la derecha */}
        <div className="flex-1 p-4">
          <div className="p-4 border-gray-200 rounded-lg dark:border-gray-700 mt-14">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {/* Ejemplo de tarjetas del dashboard */}
              <DashboardCard icon={<svg className="w-6 h-6" aria-hidden="true"><path d="M9 1v16M1 9h16" /></svg>} title="Card 1" />
              <DashboardCard icon={<svg className="w-6 h-6" aria-hidden="true"><path d="M9 1v16M1 9h16" /></svg>} title="Card 2" />
              <DashboardCard icon={<svg className="w-6 h-6" aria-hidden="true"><path d="M9 1v16M1 9h16" /></svg>} title="Card 3" />
            </div>

            {/* Tarjeta grande centrada */}
            <div className="flex items-center justify-center h-48 mb-4 rounded bg-gray-50 dark:bg-gray-800">
              <p className="text-2xl text-gray-400 dark:text-gray-500">Big Card</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer en la parte inferior */}
      <Footer />
    </div>
  );
};

export default Dashboard;
