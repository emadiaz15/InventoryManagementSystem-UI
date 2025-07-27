// src/hooks/useEntityModal.js
import { useState } from "react";

const useEntityModal = ({ onDelete }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [entityToDelete, setEntityToDelete] = useState(null);

  const openCreateModal = () => {
    closeAllModals();
    setShowCreateModal(true);
  };

  const openEditModal = (entity) => {
    closeAllModals();
    setSelectedEntity(entity);
    setShowEditModal(true);
  };

  const openViewModal = (entity) => {
    closeAllModals();
    setSelectedEntity(entity);
    setShowViewModal(true);
  };

  const openConfirmDialog = (entity) => {
    closeAllModals();
    setEntityToDelete(entity);
    setShowConfirmDialog(true);
  };

  const handleDelete = async () => {
    if (!entityToDelete || !onDelete) return;
    try {
      await onDelete(entityToDelete);
      setSuccessMessage("Eliminado correctamente.");
    } catch (error) {
      console.error("❌ Error al eliminar:", error.response?.data || error.message);
    } finally {
      closeAllModals();
    }
  };

  const resetSuccessMessage = () => setSuccessMessage("");

  const closeAllModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowViewModal(false);
    setShowConfirmDialog(false);
    setSelectedEntity(null);
    setEntityToDelete(null);
  };

  return {
    showCreateModal,
    showEditModal,
    showViewModal,
    showConfirmDialog,
    selectedEntity,
    entityToDelete,
    successMessage,

    openCreateModal,
    openEditModal,
    openViewModal,
    openConfirmDialog,
    handleDelete,
    resetSuccessMessage,
    closeAllModals,
  };
};

export default useEntityModal;
