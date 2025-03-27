import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundCanvas from '../components/BackgroundCanvas';
import PageWrapper from '../components/PageWrapper';

const Home = () => {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <section className="relative h-screen overflow-hidden bg-gradient-to-r from-cyan-900 to-blue-700 text-white">
        <BackgroundCanvas />

        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <div className="text-center bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-md max-w-md w-full border border-white/20">
            <h1 className="text-2xl font-bold mb-4">Bienvenido</h1>
            <p className="mb-6">Sistema de gestión de stock</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors"
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
