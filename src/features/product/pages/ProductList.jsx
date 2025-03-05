import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../../components/common/Navbar";
import Sidebar from "../../../components/common/Sidebar";
import Footer from "../../../components/common/Footer";
import Toolbar from "../../../components/common/Toolbar";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/ui/Pagination";
import SuccessMessage from "../../../components/common/SuccessMessage";
import ProductFormModal from "../components/ProductFormModal";
import ProductFilter from "../components/ProductFilter";
import { listProducts } from "../services/listProducts";
import { PencilIcon } from "@heroicons/react/24/outline";

const ProductsList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const getFiltersFromURL = () => {
    const params = new URLSearchParams(location.search);
    return {
      name: params.get("name") || "",
      category: params.get("category") || "",
      status: params.get("status") === "true" ? "Disponible" : "Agotado",
    };
  };

  const [filters, setFilters] = useState({
    name: "",
    category: "",
    status: "true", // Change to "true" to get active products
  });

  const buildQueryString = (filterObj) => {
    const queryParams = new URLSearchParams();
    Object.entries(filterObj).forEach(([key, value]) => {
      if (value) {
        if (key === "status") value = value === "Disponible" ? "true" : value === "Agotado" ? "false" : "";
        queryParams.append(key, value);
      }
    });
    return queryParams.toString() ? `?${queryParams.toString()}` : "";
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      console.log("Fetching ALL products without filters...");
      const data = await listProducts(`/inventory/products/`); // Remove query params
      console.log("Products fetched:", data.results);
      setProducts(data.results);
      setNextPage(data.next);
      setPreviousPage(data.previous);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Error al obtener los productos.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const query = buildQueryString(filters);
    navigate({ search: query });
    fetchProducts();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const rows = products.map((product) => ({
    "Código": product.code,
    "Tipo": product.type?.name || "Sin tipo",
    "Nombre": product.name,
    "Stock": product.subproducts.length > 0 ? "Tiene subproductos" : "Stock independiente",
    "Acciones": (
      <div className="flex space-x-2">
        <button
          onClick={() => {
            setSelectedProduct(product);
            setShowEditModal(true);
          }}
          className="bg-primary-500 p-2 rounded hover:bg-primary-600 transition-colors"
        >
          <PencilIcon className="w-5 h-5 text-white" />
        </button>
      </div>
    ),
  }));

  console.log("Rendering rows:", rows);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-2 mt-14 ml-64">
          <Toolbar title="Lista de Productos" buttonText="Crear Producto" onButtonClick={() => setShowCreateModal(true)} />
          <ProductFilter onFilterChange={handleFilterChange} />
          <Table headers={["Código", "Tipo", "Nombre", "Stock", "Acciones"]} rows={rows} />
          <Pagination
            onNext={() => nextPage && fetchProducts(nextPage)}
            onPrevious={() => previousPage && fetchProducts(previousPage)}
            hasNext={Boolean(nextPage)}
            hasPrevious={Boolean(previousPage)}
          />
        </div>
      </div>
      <Footer />
      {showCreateModal && <ProductFormModal onClose={() => setShowCreateModal(false)} />}
      {showEditModal && selectedProduct && <ProductFormModal product={selectedProduct} onClose={() => setShowEditModal(false)} />}
      {showSuccess && <SuccessMessage message={successMessage} onClose={() => setShowSuccess(false)} />}
    </div>
  );
};

export default ProductsList;
