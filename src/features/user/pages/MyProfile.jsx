
import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthProvider';
import Layout from '../../../pages/Layout';
import ProfileImage from '../components/ProfileImage';
import UserInfoSection from '../components/UserInfoSection';
import SuccessMessage from '../../../components/common/SuccessMessage';
import ErrorMessage from '../../../components/common/ErrorMessage';

const MyProfile = () => {
  const { user, profileImage } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleUserUpdate = (updatedUser) => {
    setShowSuccess(true);
  };

  return (
    <>
      <Layout>
        <div className="flex-1 pt-20 px-4 py-10 sm:px-6 lg:px-20 bg-background-100 min-h-screen">
          <div className="max-w-5xl mx-auto bg-background-200 border border-gray-200 dark:border-primary-500 rounded-4xl shadow-md p-6 flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-6">
            {user && (
              <>
                <div className="sm:w-64 w-full flex justify-center sm:justify-start">
                  <ProfileImage image={profileImage} />
                </div>
                <div className="flex-1">
                  <h2 className="mb-4 text-3xl font-bold text-text-primary">
                    {user.name} {user.last_name}
                  </h2>
                  <p className="mb-6 text-text-secondary text-base">
                    Puedes ver tus datos personales
                  </p>
                  <UserInfoSection user={user} setUser={handleUserUpdate} />
                </div>
              </>
            )}
          </div>
        </div>
      </Layout>

      {showSuccess && (
        <SuccessMessage
          message="¡Perfil actualizado correctamente!"
          onClose={() => setShowSuccess(false)}
        />
      )}
      {showError && <ErrorMessage message="Error al actualizar el perfil." />}
    </>
  );
};

export default MyProfile;