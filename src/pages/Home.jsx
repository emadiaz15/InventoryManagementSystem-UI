import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundCanvas from '../components/BackgroundCanvas';
import PageWrapper from '../components/PageWrapper';

const Home = () => {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <section className="relative h-screen overflow-hidden bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-sans">
        <BackgroundCanvas />

        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <div className="text-center bg-white/10 backdrop-blur-md p-8 sm:p-10 rounded-4xl shadow-md max-w-md w-full border border-white/20 text-white">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Bienvenido</h1>
            <p className="mb-6 text-base sm:text-lg text-text-white">
              Sistema de gestión comercial ERP Seryon. Aquí podrás gestionar tu inventario, ventas y más.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full rounded-md bg-primary-500 px-4 py-2 font-semibold text-white shadow-md transition-colors hover:bg-primary-600 focus:outline-none"
            >
              Ir a Login
            </button>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};

export default Home;
