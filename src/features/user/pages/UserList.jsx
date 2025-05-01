import React, { useState, useCallback } from "react";
import Toolbar from "../../../components/common/Toolbar";
import SuccessMessage from "../../../components/common/SuccessMessage";
import ErrorMessage from "../../../components/common/ErrorMessage";
import Layout from "../../../pages/Layout";
import Spinner from "../../../components/ui/Spinner";
import UserTable from "../components/UserTable";
import UserModals from "../components/UserModals";
import UserFilters from "../components/UserFilters";

// Servicios API
import { registerUser } from "../services/registerUser";
import { updateUser } from "../services/updateUser";
import { resetUserPassword } from "../services/resetUserPassword";
import { deleteUser } from "../services/deleteUser";

// Hook useUsers
import useUsers from "../hooks/useUsers";

const UserList = () => {
  const [filters, setFilters] = useState({
    full_name: "",
    dni: "",
    is_active: "true",
    is_staff: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [modalState, setModalState] = useState({ type: null, userData: null });
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionError, setActionError] = useState(null);

  const {
    users,
    loadingUsers,
    error: fetchError,
    nextPageUrl,
    previousPageUrl,
    fetchUsers,
    next: goToNextPage,
    previous: goToPreviousPage,
    currentUrl: currentUsersUrl,
  } = useUsers(filters);

  const openCreateModal = useCallback(() => {
    setModalState({ type: "create", userData: null });
  }, []);

  const openEditModal = useCallback((user) => {
    setModalState({ type: "edit", userData: user });
  }, []);

  const openViewModal = useCallback((user) => {
    setModalState({ type: "view", userData: user });
  }, []);

  const openDeleteConfirmModal = useCallback((user) => {
    setModalState({ type: "deleteConfirm", userData: user });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({ type: null, userData: null });
    setActionError(null);
  }, []);

  const handleActionSuccess = useCallback(
    (message) => {
      setSuccessMessage(message);
      setShowSuccess(true);
      closeModal();
      fetchUsers(currentUsersUrl);
      setTimeout(() => setShowSuccess(false), 3000);
    },
    [closeModal, fetchUsers, currentUsersUrl]
  );

  const handleregisterUser = useCallback(async (newUserData) => {
    setIsProcessing(true);
    setActionError(null);
    try {
      await registerUser(newUserData);
      handleActionSuccess("Usuario creado exitosamente.");
    } catch (err) {
      console.error("Error creating user (UserList):", err);
      const errorMsg = err.response?.data?.detail || err.message || "Error al crear el usuario.";
      setActionError({ message: errorMsg });
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [handleActionSuccess]);

  const handleUpdateUser = useCallback(async (userId, updatedData) => {
    setIsProcessing(true);
    setActionError(null);
    try {
      const updatedResponse = await updateUser(userId, updatedData);
      const username = updatedResponse?.username || updatedResponse?.user?.username || "desconocido";
      handleActionSuccess(`Usuario "${username}" actualizado.`);
    } catch (err) {
      console.error("Error updating user (UserList):", err);
      const errorMsg = err.response?.data?.detail || err.message || "Error al actualizar el usuario.";
      setActionError({ message: errorMsg });
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [handleActionSuccess]);

  const handlePasswordReset = useCallback(async (userId, passwordData) => {
    setIsProcessing(true);
    setActionError(null);
    try {
      await resetUserPassword(userId, passwordData);
      handleActionSuccess(`Contraseña actualizada para el usuario ID ${userId}.`);
    } catch (err) {
      console.error("Error resetting password (UserList):", err);
      const errorMsg = err.response?.data?.detail || err.message || "Error al cambiar contraseña.";
      setActionError({ message: errorMsg });
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [handleActionSuccess]);

  const handleDeleteUser = useCallback(async (userToDelete) => {
    if (!userToDelete) return;
    setIsProcessing(true);
    setActionError(null);
    try {
      await deleteUser(userToDelete.id);
      handleActionSuccess(`Usuario "${userToDelete.username}" eliminado (soft).`);
    } catch (err) {
      console.error("Error deactivating user (UserList):", err);
      const errorMsg = err.response?.data?.detail || err.message || "Error al desactivar el usuario.";
      setActionError({ message: errorMsg });
    } finally {
      setIsProcessing(false);
    }
  }, [handleActionSuccess]);

  if (loadingUsers && users.length === 0) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <Spinner />
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Layout>
        {showSuccess && (
          <div className="fixed top-20 right-5 z-[10000]">
            <SuccessMessage
              message={successMessage}
              onClose={() => setShowSuccess(false)}
            />
          </div>
        )}
        <div className="p-3 md:p-4 lg:p-6 mt-6">
          <Toolbar
            title="Lista de Usuarios"
            onButtonClick={openCreateModal}
            buttonText="Crear Usuario"
          />
          <UserFilters filters={filters} onChange={setFilters} />

          {fetchError && !loadingUsers && (
            <div className="my-4">
              <ErrorMessage
                message={fetchError.message || "Error al cargar datos."}
                onClose={() => setActionError(null)}
              />
            </div>
          )}

          {loadingUsers && (
            <div className="my-4 flex justify-center">
              <Spinner />
            </div>
          )}

          {!loadingUsers && users.length > 0 && (
            <UserTable
              users={users}
              openViewModal={openViewModal}
              openEditModal={openEditModal}
              openDeleteConfirmModal={openDeleteConfirmModal}
              goToNextPage={nextPageUrl ? goToNextPage : null}
              goToPreviousPage={previousPageUrl ? goToPreviousPage : null}
              nextPageUrl={nextPageUrl}
              previousPageUrl={previousPageUrl}
            />
          )}

          {!loadingUsers && users.length === 0 && (
            <div className="text-center py-10 px-4 mt-4 bg-white rounded-lg shadow">
              <p className="text-gray-500">No se encontraron usuarios.</p>
            </div>
          )}
        </div>
      </Layout>

      <UserModals
        modalState={modalState}
        closeModal={closeModal}
        onregisterUser={handleregisterUser}
        onUpdateUser={handleUpdateUser}
        onDeleteUser={handleDeleteUser}
        onPasswordReset={handlePasswordReset}
        handleActionSuccess={handleActionSuccess}
        isProcessing={isProcessing}
        actionError={actionError}
      />
    </>
  );
};

export default UserList;