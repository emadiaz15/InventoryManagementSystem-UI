import React, { useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import ErrorMessage from '../components/common/ErrorMessage';
import InputField from '../components/ui/form/InputField';
import Spinner from '../components/ui/Spinner';
import PageWrapper from '../components/PageWrapper';
import BackgroundCanvas from '../components/BackgroundCanvas';

const Login = () => {
  const { login, error, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      console.log('Debe completar ambos campos');
      return;
    }

    const credentials = { username, password };
    console.log('Datos enviados al backend:', credentials);

    await login(credentials);
  };

  return (
    <PageWrapper>
      <section className="relative h-screen overflow-hidden bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-sans">
        <BackgroundCanvas />

        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-5xl gap-6">
            {/* Logo / imagen lateral */}
            <div className="hidden lg:block lg:w-1/2">
              <img src="/home-img.png" alt="Home" className="w-full" />
            </div>

            {/* Formulario */}
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-4xl shadow-md w-full max-w-md border border-white/20 text-white">
              <h2 className="text-2xl font-bold mb-6 text-center text-white">
                Gestión de Almacén
              </h2>

              <form onSubmit={handleLogin} className="space-y-4">
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

                {error && <ErrorMessage message={error} />}

                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full rounded-md bg-primary-500 px-4 py-2 font-semibold text-white shadow-md transition-colors hover:bg-primary-600 focus:outline-none"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Spinner size="5" color="text-white" />
                        <span className="text-sm">Validando credenciales...</span>
                      </div>
                    ) : (
                      'Ingresar'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};

export default Login;
