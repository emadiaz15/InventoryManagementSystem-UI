import React from "react";
import UserIndicator from "../UserIndicator";

const Navbar = () => {
  return (
    <nav className="fixed top-0 z-50 w-full bg-zinc-800">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <button
              data-drawer-target="logo-sidebar"
              data-drawer-toggle="logo-sidebar"
              aria-controls="logo-sidebar"
              type="button"
              className="inline-flex items-center p-2  rounded-lg sm:hidden "
            >
              <span className="sr-only">Open sidebar</span>
              <img src="/home-img.png" className="w-full" alt="Home" />
            </button>
            <a href="/" className="flex ms-2 md:me-24">
              <img
                src="/home-img.png"
                className="h-8 me-3"
                alt="Logo"
              />
              <span className="self-center font-sans text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                Sistema de gestión de stock
              </span>
            </a>
          </div>
          <UserIndicator />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
