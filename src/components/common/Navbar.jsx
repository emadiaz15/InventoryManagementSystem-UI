import React, { useState, useEffect } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { BellIcon, UserIcon } from "@heroicons/react/24/outline";
import UserIndicator from "../UserIndicator";
import { useAuth } from "../../context/AuthProvider"; // Usa useAuth para obtener el usuario

const Navbar = () => {
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    if (user) {
      setProfileImage(user.image); // Asigna la imagen del perfil
    }
  }, [user]);

  return (
    <nav className="fixed top-0 z-50 w-full bg-primary-500">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          {/* Logo e Inicio */}
          <div className="flex items-center">
            <a href="/dashboard" className="flex items-center">
              <img src="/home-img.png" className="h-8 me-3" alt="Logo" />
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-neutral-50">
                Inventario Web
              </span>
            </a>
          </div>

          {/* Notificaciones y Usuario */}
          <div className="flex items-center space-x-4 relative">
            {/* Botón de Notificaciones */}
            <button
              type="button"
              className="relative rounded-full bg-primary-500 p-1 text-neutral-50 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-500 hover:bg-primary-600 transition-all"
            >
              <span className="sr-only">Ver notificaciones</span>
              <BellIcon className="size-6" aria-hidden="true" />
            </button>

            {/* Menú de Usuario */}
            <Menu as="div" className="relative flex items-center">
              <UserIndicator /> {/* ✅ Muestra nombre y apellido del usuario */}

              <MenuButton className="relative flex items-center space-x-2 rounded-full bg-primary-500 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-500 hover:bg-primary-600 transition-all">
                {profileImage ? (
                  <img
                    alt="User Profile"
                    src={profileImage}
                    className="size-8 rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="size-8 text-white p-1 bg-primary-600 rounded-full" />
                )}
              </MenuButton>

              <MenuItems className="absolute right-0 z-10 mt-40 w-48 origin-top-right rounded-md bg-neutral-100 py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                <MenuItem>
                  {({ active }) => (
                    <a
                      href="/my-profile"
                      className={`block px-4 py-2 text-sm text-neutral-700 ${active ? "bg-neutral-200" : ""
                        }`}
                    >
                      Mi Perfil
                    </a>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <a
                      href="/logout"
                      className={`block px-4 py-2 text-sm text-neutral-700 ${active ? "bg-neutral-200" : ""
                        }`}
                    >
                      Cerrar Sesión
                    </a>
                  )}
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
