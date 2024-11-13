import React, { useState, useEffect } from 'react';
import {getUserProfileLogged} from '../services/auth/getUserProfileLogged'; // Importa el método de authService.js
import { useNavigate } from 'react-router-dom'; // Para redirigir al usuario
import Navbar from '../../../components/common/Navbar';
import Sidebar from '../../../components/common/Sidebar';
import Footer from '../../../components/common/Footer';

const MyProfile = () => {
  const [user, setUser] = useState({
    id: 0,
    username: '',
    email: '',
    name: '',
    last_name: '',
    dni: '',
    image: '',
    is_active: false,
    is_staff: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate(); // Hook para redirigir al usuario

  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem('access_token'); // Verificamos si hay un token guardado
      if (!token) {
        navigate('/'); // Redirigimos al home si no hay token
      }
    };

    checkAuthentication();

    const fetchUserProfile = async () => {
      try {
        const profile = await getUserProfileLogged(); // Usar el método de authService.js para obtener el perfil
        setUser(profile); // Establecer los datos del perfil
      } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
        navigate('/'); // Redirigimos al home en caso de error
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Aquí puedes usar el método de authService para actualizar el perfil si tienes un endpoint para ello
      alert('Perfil actualizado exitosamente');
      setIsEditing(false);
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      alert('Error al actualizar el perfil');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar a la izquierda */}
        <div className="w-64">
          <Sidebar />
        </div>

        {/* Contenido principal a la derecha con padding ajustado */}
        <div className="flex-1 mt-14 rounded-lg ">
          <div className="p-2 border-gray-200 rounded-lg dark:border-gray-700">

            {isEditing ? (
              <form onSubmit={handleSubmit}>
                {/* Campos de edición de perfil */}
                <div className="mb-4 ">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nombre de usuario</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={user.username}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={user.name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Apellido</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={user.last_name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="dni" className="block text-sm font-medium text-gray-700">DNI</label>
                  <input
                    type="text"
                    id="dni"
                    name="dni"
                    value={user.dni}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div className="flex space-x-4">
                  <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                    Guardar Cambios
                  </button>
                  <button type="button" className="bg-gray-500 text-white py-2 px-4 rounded" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 rounded-lg">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 rounded-lg">
                  <tr>
                    <th className="px-6 py-3 ">Datos de mi perfil</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4">Nombre de usuario</td>
                    <td className="px-6 py-4">{user.username}</td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4">Nombre</td>
                    <td className="px-6 py-4">{user.name}</td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4">Apellido</td>
                    <td className="px-6 py-4">{user.last_name}</td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4">DNI</td>
                    <td className="px-6 py-4">{user.dni}</td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4">Correo Electrónico</td>
                    <td className="px-6 py-4">{user.email}</td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4">Activo</td>
                    <td className="px-6 py-4">{user.is_active ? 'Sí' : 'No'}</td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4">Administrador</td>
                    <td className="px-6 py-4">{user.is_staff ? 'Sí' : 'No'}</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MyProfile;
