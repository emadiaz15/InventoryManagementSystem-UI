// src/features/product/hooks/useEditProductForm.jsx
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { listTypes } from "@/features/type/services/types";

export function useEditProductForm({
  product,
  categories,
  products,
  updateProduct,
  uploadMut,
  onSave,
  onClose,
  deleteMut
}) {
  const initialTypeAssignedRef = useRef(false);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    brand: "",
    location: "",
    position: "",
    categoryInput: "",
    typeInput: "",
    category: null,
    type: "",
    initial_stock_quantity: "",
    has_subproducts: false,
    images: []
  });
  const [previewFiles, setPreviewFiles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

  // 1) carga de tipos usando category_id
  const { data: typePage = {}, isLoading: loadingTypes } = useQuery({
    queryKey: ["types", formData.category],
    queryFn: () =>
      listTypes({
        limit: 1000,
        status: true,
        category_id: formData.category,
      }),
    enabled: !!formData.category,
    staleTime: 300000,
  });
  const filteredTypes = useMemo(() => typePage.results || [], [typePage]);

  // 2) inicialización al abrir modal
  useEffect(() => {
    if (!product) return;
    initialTypeAssignedRef.current = false;
    const cat = categories.find((c) => c.id === product.category);
    setFormData({
      name: product.name || "",
      code: String(product.code || ""),
      description: product.description || "",
      brand: product.brand || "",
      location: product.location || "",
      position: product.position || "",
      categoryInput: cat ? cat.name : "",
      typeInput: "",
      category: cat ? String(cat.id) : null,
      type: "",
      initial_stock_quantity: String(product.initial_stock_quantity || ""),
      has_subproducts: !!product.has_subproducts,
      images: [],
    });
    setPreviewFiles([]);
    setError("");
    setLoading(false);
    setShowSuccess(false);
  }, [product, categories]);

  // 3) sincroniza categoryInput -> category
  useEffect(() => {
    const norm = (t) => t.trim().toLowerCase();
    const found = categories.find((c) => norm(c.name) === norm(formData.categoryInput));
    const newCat = found ? String(found.id) : null;
    if (formData.category !== newCat) {
      setFormData((f) => ({
        ...f,
        category: newCat,
        typeInput: "",
        type: "",
      }));
      initialTypeAssignedRef.current = false;
    }
  }, [formData.categoryInput, categories, formData.category]);

  // 4) precarga única del type original
  useEffect(() => {
    if (
      formData.category &&
      product.type != null &&
      !initialTypeAssignedRef.current &&
      !loadingTypes
    ) {
      const match = filteredTypes.find((t) => t.id === product.type);
      if (match) {
        setFormData((f) => ({
          ...f,
          typeInput: match.name,
          type: String(match.id),
        }));
        initialTypeAssignedRef.current = true;
      }
    }
  }, [filteredTypes, formData.category, product.type, loadingTypes]);

  // 5) sincroniza typeInput -> type
  useEffect(() => {
    const norm = (t) => t.trim().toLowerCase();
    const found = filteredTypes.find((t) => norm(t.name) === norm(formData.typeInput));
    const newType = found ? String(found.id) : "";
    if (formData.type !== newType) {
      setFormData((f) => ({ ...f, type: newType }));
    }
  }, [formData.typeInput, filteredTypes, formData.type]);

  // 6) handlers
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }, []);
  const handleStockChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  }, []);
  const handleFileChange = useCallback(
    (e) => {
      const files = Array.from(e.target.files);
      if (formData.images.length + files.length > 5) {
        setError("Máximo 5 archivos permitidos.");
        return;
      }
      setFormData((f) => ({ ...f, images: [...f.images, ...files] }));
      setPreviewFiles((p) => [...p, ...files.map((f) => f.name)]);
    },
    [formData.images]
  );
  const removeFile = useCallback((idx) => {
    setFormData((f) => ({
      ...f,
      images: f.images.filter((_, i) => i !== idx),
    }));
    setPreviewFiles((p) => p.filter((_, i) => i !== idx));
  }, []);

  const normalize = useCallback(
    (t) => t.trim().toLowerCase().replace(/\s+/g, ""),
    []
  );
  const validateCodeUnique = useCallback(
    () =>
      !products.some(
        (p) =>
          p.id !== product.id && normalize(String(p.code)) === normalize(formData.code)
      ),
    [products, product.id, normalize, formData.code]
  );

  // 7) submit logic
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError("");
    setShowSuccess(false);

    if (!validateCodeUnique()) {
      setError("El código ya está en uso.");
      return;
    }
    if (!formData.category) {
      setError("Selecciona una categoría válida.");
      return;
    }

    let typeId = "";
    if (formData.typeInput) {
      const validType = filteredTypes.find(
        (t) =>
          t.name.trim().toLowerCase() === formData.typeInput.trim().toLowerCase()
      );
      if (!validType) {
        setError("El tipo no es válido para esa categoría.");
        return;
      }
      typeId = String(validType.id);
    }

    const codeNum = parseInt(formData.code.trim(), 10);
    if (isNaN(codeNum)) {
      setError("El código debe ser numérico.");
      return;
    }

    const fd = new FormData();
    fd.append("name", formData.name.trim());
    fd.append("code", codeNum);
    fd.append("description", formData.description.trim());
    fd.append("brand", formData.brand.trim());
    fd.append("location", formData.location.trim());
    fd.append("position", formData.position.trim());
    fd.append("category", formData.category);

    // Siempre incluimos el campo "type", incluso si typeId === ""
    fd.append("type", typeId);

    fd.append("has_subproducts", formData.has_subproducts ? "true" : "false");
    const stockVal = formData.initial_stock_quantity.replace(/[^0-9.]/g, "");
    if (stockVal) fd.append("initial_stock_quantity", stockVal);

    try {
      setLoading(true);
      await updateProduct(product.id, fd);
      if (formData.images.length) {
        await uploadMut.uploadFiles(formData.images);
      }
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      onSave?.();
      onClose();
    } catch (err) {
      setError(err.message || "Error al actualizar el producto.");
    } finally {
      setLoading(false);
    }
  }, [
    formData,
    validateCodeUnique,
    filteredTypes,
    updateProduct,
    uploadMut,
    onSave,
    onClose,
    product.id,
  ]);

  // 8) delete flow
  const openDeleteRequest = useCallback((file) => {
    setFileToDelete(file);
    setIsDeleteOpen(true);
  }, []);
  const closeDeleteRequest = useCallback(() => setIsDeleteOpen(false), []);
  const confirmDelete = useCallback(async () => {
    if (!fileToDelete) return;
    await deleteMut.deleteFile(fileToDelete.id);
    setIsDeleteOpen(false);
    onSave?.();
  }, [fileToDelete, deleteMut, onSave]);

  return {
    formData,
    previewFiles,
    error,
    loading,
    showSuccess,
    showSuggestions,
    loadingTypes,
    filteredTypes,
    handleChange,
    handleStockChange,
    handleFileChange,
    removeFile,
    handleSubmit,
    isDeleteOpen,
    fileToDelete,
    openDeleteRequest,
    closeDeleteRequest,
    confirmDelete,
    isDeleting: deleteMut.deleting,
    deleteError: deleteMut.deleteError,
    setShowSuggestions,
  };
}
