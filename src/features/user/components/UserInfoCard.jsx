import React, { useState } from 'react';
import { updateUser } from '../services/updateUser';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import SuccessMessage from '../../../components/common/SuccessMessage';
import ErrorMessage from '../../../components/common/ErrorMessage';
import { PencilIcon } from '@heroicons/react/24/solid';

const UserInfoCard = ({ label, value, userId, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newValue, setNewValue] = useState(value);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    try {
      await updateUser(userId, { [label.toLowerCase()]: newValue });
      onUpdate();
      setIsEditing(false);
      setShowSuccess(true);
      setShowConfirm(false);
    } catch (error) {
      console.error('Error al actualizar el perfil:', error.message);
      setShowError(true);
      setShowConfirm(false);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setIsEditing(false);
    setNewValue(value);
  };

  return (
    <div className="p-2 bg-background-200 text-primary-500 font-sans rounded-lg shadow-sm flex items-start">
      <h7 className="text-lg font-semibold text-primary-50 mr-10 flex">{label}</h7>
      {isEditing ? (
        <div>
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="p-2 w-full border-gray-500 text-primary-500 rounded-md"
          />
          <div className="mt-4 flex justify-center space-x-4">
            <button
              className="px-4 py-2 bg-warning-500 text-white rounded-lg dark:hover:bg-warning-600 transition-all"
              onClick={handleCancel}
            >
              Cancelar
            </button>
            <button
              className="px-4 py-2 bg-success-500 text-white rounded-lg hover:bg-success-600 transition-all"
              onClick={handleSaveClick}
            >
              Guardar
            </button>
          </div>
        </div>
      ) : (
        <p className="text-primary-500 ml-auto">
          {label === "Contraseña" ? "*******" : value}
        </p>
      )}
      {!isEditing && (
        <button
          onClick={handleEditClick}
          className="mt-1 p-2 ml-auto bg-primary-500 shadow-md text-white rounded-full hover:bg-primary-600 transition-all"
        >
          <PencilIcon className="h-3 w-3" />
        </button>
      )}

      {showConfirm && (
        <ConfirmDialog
          message="¿Estás seguro de que deseas guardar los cambios?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}

      {showSuccess && <SuccessMessage message="¡Datos actualizados correctamente!" onClose={() => setShowSuccess(false)} />}

      {showError && <ErrorMessage message="Error al guardar los cambios" />}
    </div>
  );
};

export default UserInfoCard;
