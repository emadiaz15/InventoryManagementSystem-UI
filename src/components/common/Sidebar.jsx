import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';

import {
  HomeIcon,
  UserIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  TagIcon,
  Squares2X2Icon,
  ArrowRightOnRectangleIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';

const Sidebar = ({ onToggle }) => {
  const navigate = useNavigate();
  const { logout, isStaff } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const sidebarItems = [
    { label: 'Inicio', icon: HomeIcon, onClick: () => navigate('/dashboard') },
    { label: 'Mi Perfil', icon: UserIcon, onClick: () => navigate('/my-profile') },
    { label: 'Productos', icon: CubeIcon, onClick: () => navigate('/product-list') },
    { label: 'Órdenes de Corte', icon: ClipboardDocumentListIcon, onClick: () => navigate('/cutting-orders') },
    { label: 'Usuarios', icon: UsersIcon, onClick: () => navigate('/users-list'), adminOnly: true },
    { label: 'Tipos', icon: TagIcon, onClick: () => navigate('/types'), adminOnly: true },
    { label: 'Categorías', icon: Squares2X2Icon, onClick: () => navigate('/categories'), adminOnly: true },
    { label: 'Cerrar Sesión', icon: ArrowRightOnRectangleIcon, onClick: logout, isLogout: true }
  ];

  const toggleCollapsed = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    if (onToggle) onToggle(newState);
  };

  useEffect(() => {
    if (onToggle) onToggle(collapsed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cerrar sidebar automáticamente en pantallas pequeñas
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
        if (onToggle) onToggle(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [onToggle]);

  // Filtrar ítems según rol
  const visibleItems = sidebarItems.filter(item =>
    // siempre mostrar si no es adminOnly, o si lo es y el usuario sí es staff
    (!item.adminOnly || isStaff)
  );

  return (
    <aside
      className={`bg-primary-500 text-white h-screen fixed top-14 left-0 z-40 transition-all duration-300
        ${collapsed ? 'w-20' : 'w-64'} flex flex-col justify-between`}
    >
      <div>
        <div className="px-2 pt-4">
          <button
            onClick={toggleCollapsed}
            className="w-full flex items-center py-3 px-4 mb-2 rounded hover:bg-primary-600 transition-all"
          >
            <Bars3Icon className="h-5 w-5" />
            {!collapsed && <span className="ml-3 text-base">Menú</span>}
          </button>
        </div>

        <div className="flex flex-col px-2">
          {visibleItems.map(({ label, icon: Icon, onClick, isLogout }, idx) => (
            <button
              key={idx}
              onClick={onClick}
              className={`w-full flex items-center py-3 px-4 mb-2 rounded transition-all ${isLogout
                ? 'bg-accent-500 hover:bg-accent-400'
                : 'hover:bg-primary-600'
                }`}
            >
              <Icon className="h-5 w-5" />
              {!collapsed && <span className="ml-3 text-base">{label}</span>}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
