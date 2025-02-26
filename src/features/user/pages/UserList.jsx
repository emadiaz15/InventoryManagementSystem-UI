import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/common/Navbar";
import Sidebar from "../../../components/common/Sidebar";
import Footer from "../../../components/common/Footer";
import Toolbar from "../../../components/common/Toolbar";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/ui/Pagination";
import SuccessMessage from "../../../components/common/SuccessMessage";
import UserRegisterModal from "../components/register/UserRegisterModal";
import { listUsers } from "../services/listUsers";
import { useAuth } from "../../../context/AuthProvider";
import Filter from "../components/Filter";

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

  // State to hold the filter values.
  const [filters, setFilters] = useState({
    name: "",
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

  // Effect to fetch users when component mounts and when filters change.
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate("/");
        return;
      }
      const query = buildQueryString(filters);
      // Reset to first page when filters change.
      setCurrentPage(1);
      fetchUsers(`/users/list/${query}`);
    }
  }, [filters, isAuthenticated, loading, navigate]);

  // Pagination handlers: maintain the current filters.
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

  // Search logic: update filters (for example, update the "name" filter)
  const handleSearch = (query) => {
    setFilters((prev) => ({ ...prev, name: query }));
  };

  // Handler to update filters from the Filter component.
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Configure rows for the table.
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
      <div className="space-x-2">
        <button
          onClick={() => handleEdit(user)}
          className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
          aria-label="Editar usuario"
        >
          Editar
        </button>
        <button
          onClick={() => handleDelete(user.id)}
          className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
          aria-label="Eliminar usuario"
        >
          Borrar
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
          {/* Place the Filter component above the table */}
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
    </div>
  );
};

export default UserList;
