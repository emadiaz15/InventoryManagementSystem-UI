// src/features/type/pages/TypesList.jsx
import React, { useState, useEffect } from 'react';
import { listTypes } from '../services/listType';
import { updateType } from '../services/updateType';
import Navbar from '../../../components/common/Navbar';
import Sidebar from '../../../components/common/Sidebar';
import Footer from '../../../components/common/Footer';
import Toolbar from '../../../components/common/Toolbar';
import Modal from '../../../components/ui/Modal';
import SuccessMessage from '../../../components/common/SuccessMessage';
import Table from '../../../components/common/Table';
import ButtonsActions from '../../../components/ui/ButtonsActions';

const TypesList = () => {
  const [types, setTypes] = useState([]);
  const [filteredTypes, setFilteredTypes] = useState([]);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      const response = await listTypes();
      const activeTypes = response.filter((type) => type.is_active);
      setTypes(activeTypes);
      setFilteredTypes(activeTypes);
    } catch (error) {
      console.error('Error al obtener los tipos:', error);
      setError('Error al obtener los tipos.');
    }
  };

  // Asegúrate de que handleSearch esté definida
  const handleSearch = (query) => {
    const filtered = types.filter((type) =>
      type.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTypes(filtered);
  };

  const handleCreateType = () => {
    setShowCreateModal(true);
  };

  const handleEditType = (type) => {
    setSelectedType(type);
    setShowEditModal(true);
  };

  const handleToggleStatus = async (typeId, isActive) => {
    if (window.confirm(`¿Estás seguro de que deseas ${isActive ? 'restaurar' : 'eliminar'} este tipo?`)) {
      try {
        await updateType(typeId, { is_active: isActive });
        fetchTypes();
        showSuccessMessage(`Tipo ${isActive ? 'restaurado' : 'eliminado'} correctamente.`);
      } catch (error) {
        console.error('Error al cambiar el estado del tipo:', error);
        setError('No se pudo cambiar el estado del tipo.');
      }
    }
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);
  };

  const headers = ["Nombre de Tipo", "Descripción", "Acciones"];
  const rows = filteredTypes.map((type) => ({
    id: type.id,
    cells: [
      type.name,
      type.description,
      <ButtonsActions
        onEdit={() => handleEditType(type)}
        onDelete={() => handleToggleStatus(type.id, false)}
      />
    ]
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <div className="w-64">
          <Sidebar />
        </div>
        <div className="flex-1 mt-14 rounded-lg">
          <div className="p-2 border-gray-200 rounded-lg dark:border-gray-700">
            <Toolbar
              onSearch={handleSearch}
              onCreate={handleCreateType}
              createButtonText="Nuevo Tipo"
              placeholder="Buscar Tipo"
            />
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <Table headers={headers} rows={rows} />
            )}
          </div>
        </div>
      </div>

      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Crear Tipo"
        >
          <TypeCreateForm
            onClose={() => setShowCreateModal(false)}
            onSave={() => { fetchTypes(); showSuccessMessage('Tipo creado correctamente.'); }}
          />
        </Modal>
      )}
      
      {showEditModal && (
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Editar Tipo"
        >
          <TypeEditForm
            type={selectedType}
            onClose={() => setShowEditModal(false)}
            onSave={() => { fetchTypes(); showSuccessMessage('Tipo editado correctamente.'); }}
          />
        </Modal>
      )}

      {showSuccess && (
        <SuccessMessage 
          message={successMessage} 
          onClose={() => setShowSuccess(false)} 
        />
      )}

      <Footer />
    </div>
  );
};

export default TypesList;
