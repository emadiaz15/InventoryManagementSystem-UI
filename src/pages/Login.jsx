import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import ErrorMessage from '../components/common/ErrorMessage';
import InputField from '../components/ui/form/InputField';
import Spinner from '../components/ui/Spinner'; // Corregido el path de la importación

const Home = () => {
  const { login, error, loading } = useAuth(); // Hook para login, error y loading
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validar campos antes de enviar
    if (!username || !password) {
      console.log('Debe completar ambos campos');
      return;
    }

    const credentials = { username, password };
    console.log('Datos enviados al backend:', credentials);

    // Ejecutar la función de login del hook
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
            <h2 className="text-black font-sans font-semibold pb-0.5 text-center">
              Sistema de gestión de stock
            </h2>
            <form onSubmit={handleLogin}>
              {/* Campo de entrada para el nombre de usuario */}
              <InputField
                label="Usuario"
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingrese su usuario"
                disabled={loading}
                aria-label="Usuario"
              />

              {/* Campo de entrada para la contraseña */}
              <InputField
                label="Contraseña"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingrese su contraseña"
                disabled={loading}
                aria-label="Contraseña"
              />

              {/* Mostrar mensaje de error si ocurre */}
              {error && <ErrorMessage message={error} />}

              <div className="text-center lg:text-left">
                <button
                  type="submit"
                  className="w-full rounded bg-accent-dark px-4 py-2 font-sans font-semibold text-white shadow-md transition duration-150 ease-in-out hover:bg-blue-700 focus:bg-blue-700 focus:outline-none"
                  disabled={loading}
                >
                  {loading ? <Spinner size="5" color="text-white" /> : 'Ingresar'}
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
