// src/features/user/pages/UserList.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/common/Navbar";
import Sidebar from "../../../components/common/Sidebar";
import Footer from "../../../components/common/Footer";
import Toolbar from "../../../components/common/Toolbar";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/ui/Pagination";
import SuccessMessage from "../../../components/common/SuccessMessage";
import UserRegisterModal from "../components/UserRegisterModal";
import UserEditModal from "../components/UserEditModal";
import { listUsers } from "../services/listUsers";
import { updateUser } from "../services/updateUser"; // Importa el servicio de actualización
import { useAuth } from "../../../context/AuthProvider";
import Filter from "../components/Filter";
import { PencilIcon } from "@heroicons/react/24/outline";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Estados para el modal de edición
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // State to hold the filter values.
  const [filters, setFilters] = useState({
    full_name: "",
    dni: "",
    is_active: "Activo", // Default to "Activo"
    is_staff: ""         // Default blank: show all
  });

  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  // Table headers (for display)
  const headers = [
    "Nombre de usuario",
    "Nombre",
    "Email",
    "DNI",
    "Imagen",
    "Estado",
    "Administrador",
    "Acciones"
  ];

  // Define columns for the Filter component
  const filterColumns = [
    { key: "full_name", label: "Nombre y Apellido", filterable: true },
    { key: "dni", label: "DNI", filterable: true },
    { key: "is_active", label: "Estado", filterable: true },
    { key: "is_staff", label: "Administrador", filterable: true }
  ];

  // Helper: Build query string from filters with conversion for booleans
  const buildQueryString = (filterObj) => {
    const queryParams = new URLSearchParams();
    Object.entries(filterObj).forEach(([key, value]) => {
      if (value) {
        if (key === "is_active") {
          // Convert "Activo" -> "true", "Inactivo" -> "false"
          value = value.toLowerCase() === "activo" ? "true" : "false";
        }
        if (key === "is_staff") {
          // Convert "Sí" -> "true", "No" -> "false"
          if (value.toLowerCase() === "sí") {
            value = "true";
          } else if (value.toLowerCase() === "no") {
            value = "false";
          }
        }
        queryParams.append(key, value);
      }
    });
    return queryParams.toString() ? `?${queryParams.toString()}` : "";
  };

  // Function to load users (with filters and pagination)
  const fetchUsers = async (url = "/users/list/") => {
    setLoadingUsers(true);
    try {
      const data = await listUsers(url);
      if (data && Array.isArray(data.results)) {
        setUsers(data.results);
        setNextPage(data.next);
        setPreviousPage(data.previous);
        setTotalPages(Math.ceil(data.count / 10));
      } else {
        setError(new Error("Error en el formato de los datos de la API"));
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Effect para cargar usuarios al montar el componente o al cambiar filtros.
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate("/");
        return;
      }
      const query = buildQueryString(filters);
      setCurrentPage(1);
      fetchUsers(`/users/list/${query}`);
    }
  }, [filters, isAuthenticated, loading, navigate]);

  // Handlers para paginación (manteniendo filtros)
  const handleNextPage = () => {
    if (nextPage) {
      fetchUsers(nextPage);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (previousPage) {
      fetchUsers(previousPage);
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleShowSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    const query = buildQueryString(filters);
    fetchUsers(`/users/list/${query}`);
  };

  const handleUserRegistration = () => {
    handleShowSuccess("¡Usuario registrado con éxito!");
    setShowRegisterModal(false);
  };

  // Lógica de búsqueda: actualiza filtros (por ejemplo, full_name)
  const handleSearch = (query) => {
    setFilters((prev) => ({ ...prev, full_name: query }));
  };

  // Handler para actualizar filtros desde el componente Filter.
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Configurar filas para la tabla.
  const rows = users.map((user) => ({
    "Nombre de usuario": user.username,
    "Nombre": `${user.name} ${user.last_name}`,
    "Email": user.email,
    "DNI": user.dni || "Sin DNI",
    "Imagen": user.image ? (
      <img className="w-10 h-10 rounded-full" src={user.image} alt={`${user.name} profile`} />
    ) : (
      "Sin imagen"
    ),
    "Estado": (
      <div className="flex items-center">
        <div className={`h-2.5 w-2.5 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'} me-2`}></div>
        {user.is_active ? "Activo" : "Inactivo"}
      </div>
    ),
    "Administrador": user.is_staff ? "Sí" : "No",
    "Acciones": (
      <div className="flex space-x-2">
        <button
          onClick={() => {
            console.log("Editar", user);
            setSelectedUser(user);
            setShowEditModal(true);
          }}
          className="bg-primary-500 p-2 rounded hover:bg-primary-600 transition-colors"
          aria-label="Editar usuario"
        >
          <PencilIcon className="w-5 h-5 text-text-white" />
        </button>
      </div>
    )
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col p-2 mt-14">
          <Toolbar
            onSearch={handleSearch}
            onCreate={() => setShowRegisterModal(true)}
            createButtonText="Registrar Usuario"
          />
          <Filter columns={filterColumns} onFilterChange={handleFilterChange} />
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg flex-1">
            {loadingUsers ? (
              <p className="p-6">Cargando usuarios...</p>
            ) : (
              <Table headers={headers} rows={rows} />
            )}
          </div>
          <Pagination
            onNext={handleNextPage}
            onPrevious={handlePreviousPage}
            hasNext={Boolean(nextPage)}
            hasPrevious={Boolean(previousPage)}
          />
        </div>
      </div>
      <Footer />
      {showSuccess && (
        <SuccessMessage
          message={successMessage}
          onClose={() => setShowSuccess(false)}
        />
      )}
      {showRegisterModal && (
        <UserRegisterModal
          onClose={() => setShowRegisterModal(false)}
          onSave={handleUserRegistration}
        />
      )}
      {/* Modal de edición de usuario */}
      {showEditModal && selectedUser && (
        <UserEditModal
          user={selectedUser}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={async (id, updatedData) => {
            try {
              await updateUser(id, updatedData);
              setShowEditModal(false);
              handleShowSuccess("Usuario actualizado con éxito");
            } catch (err) {
              console.error("Error al actualizar:", err);
            }
          }}
          onPasswordReset={(id, newPasswordData) => {
            console.log("Restableciendo contraseña para", id, newPasswordData);
            // Aquí implementa la lógica de restablecimiento de contraseña si es necesario.
          }}
        />
      )}
    </div>
  );
};

export default UserList;
