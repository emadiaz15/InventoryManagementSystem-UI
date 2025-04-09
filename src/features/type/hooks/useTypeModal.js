import { useState } from "react";

const useTypeModal = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const openCreateModal = () => setShowCreateModal(true);
  const closeCreateModal = () => setShowCreateModal(false);

  const openEditModal = (type) => {
    setSelectedType(type);
    setShowEditModal(true);
  };

  const closeEditModal = () => setShowEditModal(false);

  const openViewModal = (type) => {
    setSelectedType(type);
    setShowViewModal(true);
  };

  const closeViewModal = () => setShowViewModal(false);

  return {
    showCreateModal,
    showEditModal,
    showViewModal,
    selectedType,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openViewModal,
    closeViewModal,
  };
};

export default useTypeModal;