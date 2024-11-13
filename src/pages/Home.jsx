import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth'; // Importa el hook personalizado

const Home = () => {
  const { login, error, loading } = useAuth(); // Extraemos la función de login, error y estado de carga desde el hook
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    const credentials = { username, password };

    // Verifica que los datos se capturan correctamente antes de enviarlos
    console.log('Datos enviados al backend:', credentials);

    // Ejecuta la función de login desde el hook
    await login(credentials);
  };

  return (
    <section className="h-screen bg-gradient-to-r from-cyan-900 to-blue-700">
      <div className="h-full flex items-center justify-center">
        <div className="flex h-full items-center justify-center lg:justify-between w-full max-w-5xl">
          <div className="hidden lg:block lg:w-1/2">
            <img src="/home-img.png" className="w-full" alt="Home" />
          </div>

          <div className="bg-neutral-light p-8 rounded-lg shadow-lg w-full max-w-md lg:w-1/2">
            <h2 className="text-black font-sans font-semibold pb-0.5 text-center">Sistema de gestión de stock</h2>
            <form onSubmit={handleLogin}>
              <div className="relative mb-4">
                <input
                  type="text"
                  className="peer block w-full px-3 py-2 rounded bg-gray-200 font-sans font-medium text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                  id="username"
                  placeholder="Ingrese su usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading} // Deshabilitar mientras carga
                />
              </div>

              <div className="relative mb-4">
                <input
                  type="password"
                  className="peer block w-full px-3 py-2 rounded bg-gray-200 font-sans font-medium text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                  id="password"
                  placeholder="Ingrese su contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading} // Deshabilitar mientras carga
                />
              </div>

              {/* Mostrar mensaje de error si ocurre */}
              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="text-center lg:text-left">
                <button
                  type="submit"
                  className="w-full rounded bg-accent-dark px-4 py-2 font-sans font-semibold text-white shadow-md transition duration-150 ease-in-out hover:bg-blue-700 focus:bg-blue-700 focus:outline-none"
                  disabled={loading} // Deshabilitar mientras carga
                >
                  {loading ? 'Cargando...' : 'Ingresar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
