import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthProvider';
import Layout from '../../../pages/Layout';
import ProfileImage from '../components/ProfileImage';
import UserInfoSection from '../components/UserInfoSection';
import SuccessMessage from '../../../components/common/SuccessMessage';
import ErrorMessage from '../../../components/common/ErrorMessage';

const MyProfile = () => {
  const { user } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleUserUpdate = (updatedUser) => {
    setShowSuccess(true);
  };

  return (
    <>
      <Layout>
        <div className="flex-1 p-12">
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
