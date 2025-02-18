import React, { useState, useEffect } from 'react';
import { getMyProfile } from '../services/getMyProfile';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/common/Navbar';
import Sidebar from '../../../components/common/Sidebar';
import Footer from '../../../components/common/Footer';
import ProfileImage from '../components/ProfileImage';
import UserInfoSection from '../components/UserInfoSection';
import SuccessMessage from '../../../components/common/SuccessMessage';
import ErrorMessage from '../../../components/common/ErrorMessage';

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    try {
      const profile = await getMyProfile();
      setUser(profile);
    } catch (error) {
      console.error('Error al obtener el perfil del usuario:', error);
      navigate('/');
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleUserUpdate = (updatedUser) => {
    setUser((prevUser) => ({ ...prevUser, ...updatedUser }));
    setShowSuccess(true);
  };

  return (
    <div className="flex flex-col min-h-screen font-sans mt-12 bg-background-100">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar className="w-64" />
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto bg-neutral-500 rounded-lg shadow-sm p-6 text-center text-primary-500">
            {user && (
              <>
                <ProfileImage image={user.image} />
                <h2 className="mt-4 text-2xl font-bold text-primary-500">
                  {user.name} {user.last_name}
                </h2>
                <UserInfoSection user={user} setUser={handleUserUpdate} />
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
      {showSuccess && <SuccessMessage message="¡Perfil actualizado correctamente!" onClose={() => setShowSuccess(false)} />}
      {showError && <ErrorMessage message="Error al actualizar el perfil." />}
    </div>
  );
};

export default MyProfile;
