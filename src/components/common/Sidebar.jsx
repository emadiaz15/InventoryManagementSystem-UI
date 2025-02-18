import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../features/user/services/auth/logoutUser';
import {
  HomeIcon,
  UserIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  ChatBubbleLeftEllipsisIcon,
  TagIcon,
  Squares2X2Icon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/'); // Redirigir al login
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const goToProfile = () => navigate('/my-profile');
  const goToHome = () => navigate('/dashboard');
  const goToProducts = () => navigate('/product-list');
  const goToOrders = () => navigate('/cutting-orders');
  const goToUsers = () => navigate('/users-list');
  const goToComments = () => navigate('/comments');
  const goToCategories = () => navigate('/categories');
  const goToTypes = () => navigate('/types');

  return (
    <aside className="w-64 h-full bg-primary-500 text-neutral-50 p-2 font-sans overflow-y-auto fixed top-14 left-0">
      <button 
        onClick={goToHome} 
        className="w-full text-left flex items-center py-2 px-4 mb-4 bg-primary-700 rounded hover:bg-primary-600 transition-all"
      >
        <HomeIcon className="h-5 w-5 mr-3" />
        Inicio
      </button>
      <button 
        onClick={goToProfile} 
        className="w-full text-left flex items-center py-2 px-4 mb-4 bg-primary-700 rounded hover:bg-primary-600 transition-all"
      >
        <UserIcon className="h-5 w-5 mr-3" />
        Mi Perfil
      </button>
      <button 
        onClick={goToProducts} 
        className="w-full text-left flex items-center py-2 px-4 mb-4 bg-primary-700 rounded hover:bg-primary-600 transition-all"
      >
        <CubeIcon className="h-5 w-5 mr-3" />
        Productos
      </button>
      <button 
        onClick={goToOrders} 
        className="w-full text-left flex items-center py-2 px-4 mb-4 bg-primary-700 rounded hover:bg-primary-600 transition-all"
      >
        <ClipboardDocumentListIcon className="h-5 w-5 mr-3" />
        Órdenes de Corte
      </button>
      <button 
        onClick={goToUsers} 
        className="w-full text-left flex items-center py-2 px-4 mb-4 bg-primary-700 rounded hover:bg-primary-600 transition-all"
      >
        <UsersIcon className="h-5 w-5 mr-3" />
        Usuarios
      </button>
      <button 
        onClick={goToComments} 
        className="w-full text-left flex items-center py-2 px-4 mb-4 bg-primary-700 rounded hover:bg-primary-600 transition-all"
      >
        <ChatBubbleLeftEllipsisIcon className="h-5 w-5 mr-3" />
        Comentarios
      </button>
      
      <button 
        onClick={goToCategories} 
        className="w-full text-left flex items-center py-2 px-4 mb-4 bg-primary-700 rounded hover:bg-primary-600 transition-all"
      >
        <Squares2X2Icon className="h-5 w-5 mr-3" />
        Categorías
      </button>
      <button 
        onClick={goToTypes} 
        className="w-full text-left flex items-center py-2 px-4 mb-4 bg-primary-700 rounded hover:bg-primary-600 transition-all"
      >
        <TagIcon className="h-5 w-5 mr-3" />
        Tipos
      </button>

      <button 
        onClick={handleLogout} 
        className="w-full text-left flex items-center py-2 px-4 bg-accent-500 rounded hover:bg-accent-400 transition-all"
      >
        <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
        Cerrar Sesión
      </button>
    </aside>
  );
};

export default Sidebar;
