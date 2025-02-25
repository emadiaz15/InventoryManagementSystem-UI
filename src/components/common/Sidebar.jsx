import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';

// Importar los íconos que necesites
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
  const { logout } = useAuth();

  // Arreglo de ítems para el sidebar
  const sidebarItems = [
    {
      label: 'Inicio',
      icon: HomeIcon,
      onClick: () => navigate('/dashboard'),
      bgClass: 'bg-primary-700 hover:bg-primary-600'
    },
    {
      label: 'Mi Perfil',
      icon: UserIcon,
      onClick: () => navigate('/my-profile'),
      bgClass: 'bg-primary-700 hover:bg-primary-600'
    },
    {
      label: 'Productos',
      icon: CubeIcon,
      onClick: () => navigate('/product-list'),
      bgClass: 'bg-primary-700 hover:bg-primary-600'
    },
    {
      label: 'Órdenes de Corte',
      icon: ClipboardDocumentListIcon,
      onClick: () => navigate('/cutting-orders'),
      bgClass: 'bg-primary-700 hover:bg-primary-600'
    },
    {
      label: 'Usuarios',
      icon: UsersIcon,
      onClick: () => navigate('/users-list'),
      bgClass: 'bg-primary-700 hover:bg-primary-600'
    },
    {
      label: 'Comentarios',
      icon: ChatBubbleLeftEllipsisIcon,
      onClick: () => navigate('/comments'),
      bgClass: 'bg-primary-700 hover:bg-primary-600'
    },
    {
      label: 'Categorías',
      icon: Squares2X2Icon,
      onClick: () => navigate('/categories'),
      bgClass: 'bg-primary-700 hover:bg-primary-600'
    },
    {
      label: 'Tipos',
      icon: TagIcon,
      onClick: () => navigate('/types'),
      bgClass: 'bg-primary-700 hover:bg-primary-600'
    }
  ];

  // Función para logout
  const handleLogout = async () => {
    logout();
  };

  return (
    <aside className="w-64 h-full bg-primary-500 text-neutral-50 p-2 font-sans overflow-y-auto fixed top-14 left-0">
      {/* Renderiza dinámicamente los items */}
      {sidebarItems.map((item, index) => (
        <button
          key={index}
          onClick={item.onClick}
          className={`w-full text-left flex items-center py-2 px-4 mb-4 rounded transition-all ${item.bgClass}`}
        >
          <item.icon className="h-5 w-5 mr-3" />
          {item.label}
        </button>
      ))}

      {/* Botón de logout al final */}
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
