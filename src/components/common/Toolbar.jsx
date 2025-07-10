import React from 'react';
import {
  PlusCircleIcon,
  Cog6ToothIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/solid';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { useAuth } from '../../context/AuthProvider';

const Toolbar = ({
  title,
  buttonText = 'Nuevo',
  onButtonClick,
  configItems = [],
  onBackClick,
}) => {
  const { user } = useAuth();

  const canShowButton = typeof onButtonClick === 'function' && user?.is_staff;
  const canShowConfig =
    Array.isArray(configItems) && configItems.length > 0 && user?.is_staff;

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center space-x-3">
        {onBackClick && (
          <button
            onClick={onBackClick}
            type="button"
            title="Volver"
            className="flex items-center bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600 focus:outline-none focus:ring-4 focus:ring-primary-500 transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
        )}
        <h1 className="text-xl font-bold text-text-primary">{title}</h1>
      </div>

      <div className="flex items-center space-x-2">
        {canShowConfig && (
          <Menu as="div" className="relative">
            <MenuButton
              type="button"
              title="Configuración"
              className="flex items-center bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600 focus:outline-none focus:ring-4 focus:ring-primary-500 transition-colors"
            >
              <Cog6ToothIcon className="w-5 h-5" />
            </MenuButton>
            <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-neutral-100 py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
              {configItems.map(({ label, onClick }) => (
                <MenuItem key={label}>
                  {({ active }) => (
                    <button
                      onClick={onClick}
                      className={`block w-full text-left px-4 py-2 text-sm text-neutral-700 ${active ? 'bg-neutral-200' : ''
                        }`}
                    >
                      {label}
                    </button>
                  )}
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
        )}

        {canShowButton && (
          <button
            onClick={onButtonClick}
            type="button"
            className="flex items-center bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600 focus:outline-none focus:ring-4 focus:ring-primary-500 transition-colors"
          >
            <span className="mr-2">{buttonText}</span>
            <PlusCircleIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Toolbar;
