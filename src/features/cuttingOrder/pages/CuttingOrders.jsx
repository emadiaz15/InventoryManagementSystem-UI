import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirigir si no está autenticado
import axios from 'axios';
import { useAuth } from '../../../context/AuthProvider';
import Navbar from '../../../components/common/Navbar';  // Importa el componente Navbar
import Sidebar from '../../../components/common/Sidebar';  // Importa el componente Sidebar
import Footer from '../../../components/common/Footer';  // Importa el componente Footer

const CuttingOrders = () => {
  const { isAuthenticated, getToken } = useAuth();  // Usamos el hook para la autenticación y obtener el token
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    if (!isAuthenticated()) {
      navigate('/'); // Si no está autenticado, redirige al home o login
      return;
    }

    // Obtener las órdenes de corte
    const fetchCuttingOrders = async () => {
      try {
        const token = getToken();  // Obtener el token del hook

        if (!token) {
          navigate('/'); // Si no hay token, redirige
          return;
        }

        // Realizar la solicitud con el token en los headers
        const response = await axios.get('/api/v1/cutting/orders/', {
          headers: {
            Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
          },
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching cutting orders:', error);
        setError(error);
      }
    };

    fetchCuttingOrders();
  }, [isAuthenticated, getToken, navigate]);

  if (error) {
    return <p>Error cargando órdenes de corte: {error.message}</p>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64">
          <Sidebar />
        </div>

        {/* Contenido principal */}
        <div className="flex-1 p-6 sm:p-10 mt-14">
          <div className="p-6 sm:p-10 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
            <h1 className="text-2xl font-semibold mb-4">Órdenes de Corte</h1>
            {orders.length > 0 ? (
              <ul className="list-disc pl-5">
                {orders.map(order => (
                  <li key={order.id} className="mb-2">
                    Orden #{order.id} - Estado: {order.status}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay órdenes disponibles</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CuttingOrders;
