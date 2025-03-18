import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate(); // Hook para manejar la navegación

  return (
    <section className="h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center bg-white p-8 rounded shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Bienvenido</h1>
        <p className="mb-6">Sistema de gestión de stock</p>
        <button
          onClick={() => navigate('/login')} // Redirige a la página de login
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ir a Login
        </button>
      </div>
    </section>
  );
};

export default Home;
