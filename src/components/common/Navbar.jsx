import React from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { BellIcon, UserIcon, ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import UserIndicator from "../UserIndicator";
import { useAuth } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, profileImage, logout } = useAuth();
  const navigate = useNavigate();

  const userFullName =
    user?.name || user?.last_name
      ? `${user?.name || ""} ${user?.last_name || ""}`.trim()
      : "";

  return (
    <nav className="fixed top-0 z-50 w-full bg-primary-500">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          {/* Logo e Inicio */}
          <div className="flex items-center">
            <a href="/dashboard" className="flex items-center">
              <img src="/home-img.png" className="h-8 me-3" alt="Logo" />
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-neutral-50">
                Sistema de Gestión Comercial
              </span>
            </a>
          </div>

          {/* Notificaciones, Órdenes de Corte y Usuario */}
          <div className="flex items-center space-x-4 relative">
            {/* Órdenes de Corte (icono de carrito) */}
            <button
              type="button"
              onClick={() => navigate("/cutting-cart")}
              className="relative rounded-full bg-primary-500 p-1 text-neutral-50 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-500 hover:bg-primary-600 transition-all"
            >
              <span className="sr-only">Ver Carrito de Corte</span>
              <ClipboardDocumentListIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            {/* Botón Notificaciones */}
            <button
              type="button"
              className="relative rounded-full bg-primary-500 p-1 text-neutral-50 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-500 hover:bg-primary-600 transition-all"            >
              <span className="sr-only">Ver notificaciones</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>



            {/* Menú de usuario */}
            <Menu as="div" className="relative flex items-center">
              <UserIndicator />

              <MenuButton className="ml-2">
                {profileImage && typeof profileImage === "string" ? (
                  <img
                    key={profileImage}
                    src={profileImage}
                    alt="User Profile"
                    className="h-8 w-8 rounded-full object-cover border border-white"
                  />
                ) : (
                  <UserIcon className="h-8 w-8 text-white p-1 bg-primary-600 rounded-full" />
                )}
              </MenuButton>

              <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-neutral-100 py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
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
                    <button
                      onClick={logout}
                      className={`block w-full text-left px-4 py-2 text-sm text-neutral-700 ${active ? "bg-neutral-200" : ""
                        }`}
                    >
                      Cerrar Sesión
                    </button>
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
