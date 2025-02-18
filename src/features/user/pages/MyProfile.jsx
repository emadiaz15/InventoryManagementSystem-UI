import React, { useState, useEffect } from 'react';
import { getMyProfile } from '../services/getMyProfile';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/common/Navbar';
import Sidebar from '../../../components/common/Sidebar';
import Footer from '../../../components/common/Footer';
import ProfileImage from '../components/ProfileImage';
import UserInfoSection from '../components/UserInfoSection';
import SuccessMessage from '../../../components/common/SuccessMessage'; // Asegúrate de tener el componente importado
import ErrorMessage from '../../../components/common/ErrorMessage'; // Asegúrate de tener el componente importado

const MyProfile = () => {
  const [user, setUser] = useState({
    id: 0,
    username: '',
    email: '',
    name: '',
    last_name: '',
    dni: '',
    image: '',
    is_active: false,
    is_staff: false,
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getMyProfile();
        setUser(profile);
      } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
        navigate('/');
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // Recargar los datos del usuario después de mostrar el mensaje
  const handleMessageClose = () => {
    setShowSuccess(false);
    setShowError(false);
    // Recargar los datos nuevamente
    fetchUserProfile();
  };

  return (
    <div className="flex flex-col min-h-screen font-sans mt-12 bg-background-100">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar className="w-64" />
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto bg-neutral-500 rounded-lg shadow-sm p-6 text-center text-primary-500">
            <ProfileImage image={user.image} />
            <h2 className="mt-4 text-2xl font-bold text-primary-500">
              {user.name} {user.last_name}
            </h2>
            <UserInfoSection
              user={user}
              setUser={setUser}
              setShowSuccess={setShowSuccess}
              setShowError={setShowError}
            />
          </div>
        </div>
      </div>
      <Footer />
      {showSuccess && <SuccessMessage message="¡Perfil actualizado correctamente!" onClose={() => setShowSuccess(false)} shouldReload={true} />}
      {showError && <ErrorMessage message="Error al actualizar el perfil." shouldReload={true} />}
    </div>
  );
};

export default MyProfile;
