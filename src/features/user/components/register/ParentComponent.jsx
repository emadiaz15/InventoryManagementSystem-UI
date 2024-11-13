import React, { useState, useEffect } from 'react';
import UserRegisterModal from './UserRegisterModal';
import { listUsers } from '../../services/listUsers'; // Importa el servicio para cargar usuarios
import SuccessMessage from '../../../../components/common/SuccessMessage';

const ParentComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Función para cargar usuarios desde el servidor
  const fetchUsers = async () => {
    try {
      const data = await listUsers();
      setUsers(data.results); // Suponiendo que la respuesta contiene un array en `results`
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  useEffect(() => {
    fetchUsers(); // Cargar la lista de usuarios al montar el componente
  }, []);

  const handleSave = () => {
    fetchUsers(); // Recargar la lista de usuarios después de registrar un nuevo usuario
    setIsModalOpen(false); // Cerrar el modal
    showSuccessPrompt(); // Mostrar el mensaje de éxito
  };

  const showSuccessPrompt = () => {
    setSuccessMessage('¡Usuario registrado con éxito!');
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 4000);
  };

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>Registrar nuevo usuario</button>
      
      {/* Mostrar la lista de usuarios */}
      <div>
        {users.map((user) => (
          <div key={user.id}>{user.username} - {user.email}</div>
        ))}
      </div>

      {isModalOpen && (
        <UserRegisterModal onClose={() => setIsModalOpen(false)} onSave={handleSave} />
      )}

      {/* Mostrar el mensaje de éxito si está activo */}
      {showSuccess && (
        <SuccessMessage 
          message={successMessage} 
          onClose={() => setShowSuccess(false)} 
        />
      )}
    </>
  );
};

export default ParentComponent;
