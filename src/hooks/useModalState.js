import { useState } from "react";
import { updateType } from "../features/type/services/updateType";

const useModalState = (fetchData) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [typeToDelete, setTypeToDelete] = useState(null);

  const handleShowSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    fetchData();
  };

  const handleCreateType = () => {
    setSelectedType(null);
    setShowCreateModal(true);
  };

  const handleEditType = (type) => {
    setSelectedType(type);
    setShowEditModal(true);
  };

  const handleToggleStatus = (type) => {
    setTypeToDelete(type);
    setShowConfirmDialog(true);
  };

  const handleDeleteType = async (id) => {
    try {
      setShowConfirmDialog(false);
      setShowEditModal(false);
      await updateType(id, { status: false });
      fetchData();
      handleShowSuccess("Tipo eliminado correctamente.");
    } catch (error) {
      console.error("❌ Error al eliminar el tipo:", error.response?.data || error.message);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
  };

  return {
    showSuccess,
    successMessage,
    showCreateModal,
    showEditModal,
    showConfirmDialog,
    selectedType,
    typeToDelete,
    handleShowSuccess,
    handleCreateType,
    handleEditType,
    handleToggleStatus,
    handleDeleteType,
    cancelDelete,
    setShowCreateModal,
    setShowEditModal,
  };
};

export default useModalState;
