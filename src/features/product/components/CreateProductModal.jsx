import React, { useState, useEffect, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";
import Modal from "@/components/ui/Modal";
import FormInput from "@/components/ui/form/FormInput";
import FormStockInput from "@/features/product/components/FormStockInput";
import ErrorMessage from "@/components/common/ErrorMessage";
import SuccessMessage from "@/components/common/SuccessMessage";
import { listCategories } from "@/features/category/services/categories";
import { listTypes } from "@/features/type/services/types";
import { useProducts } from "@/features/product/hooks/useProductHooks";
import { useUploadProductFiles } from "@/features/product/hooks/useProductFileHooks";

const CreateProductModal = ({ isOpen, onClose, onSave }) => {
  const [categoryInput, setCategoryInput] = useState("");
  const [typeInput, setTypeInput] = useState("");
  const [formData, setFormData] = useState({
    name: "", code: "", description: "", brand: "", location: "",
    position: "", category: null, type: "", initial_stock_quantity: "",
    has_subproducts: false, images: []
  });
  const [previewFiles, setPreviewFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // 🔧 añadido

  const { createProduct, products } = useProducts({ status: true, page_size: 1000 });
  const [createdProductId, setCreatedProductId] = useState(null);
  const { uploadFiles, uploading, uploadError } = useUploadProductFiles(createdProductId);

  const { data: catPage = {}, isLoading: loadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => listCategories({ limit: 1000, status: true }),
    staleTime: 300000, refetchOnWindowFocus: false
  });
  const categories = useMemo(() => catPage.results ?? [], [catPage.results]);

  const { data: typePage = {}, isLoading: loadingTypes } = useQuery({
    queryKey: ["types", formData.category],
    queryFn: () => listTypes({ limit: 1000, status: true, category_id: formData.category }),
    enabled: formData.category != null, staleTime: 300000, refetchOnWindowFocus: false
  });
  const types = useMemo(() => typePage.results ?? [], [typePage.results]);

  useEffect(() => {
    const found = categories.find(c => c.name.trim().toLowerCase() === categoryInput.trim().toLowerCase());
    setFormData(prev => ({ ...prev, category: found ? found.id : null }));
  }, [categoryInput, categories]);

  useEffect(() => {
    setTypeInput(""); setFormData(prev => ({ ...prev, type: "" }));
  }, [formData.category]);

  useEffect(() => {
    const found = types.find(t => t.name === typeInput);
    setFormData(prev => ({ ...prev, type: found ? String(found.id) : "" }));
  }, [typeInput, types]);

  const normalize = txt => txt.trim().toLowerCase().replace(/\s+/g, "");
  const validateCodeUnique = () => {
    const codeStr = normalize(formData.code);
    if (products.some(p => p.code && normalize(String(p.code)) === codeStr)) {
      setError("El código ya está en uso."); return false;
    }
    return true;
  };

  const handleChange = useCallback(e => {
    const { name, type, checked, value } = e.target;
    setFormData(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }, []);

  const handleStockChange = e => setFormData(f => ({ ...f, initial_stock_quantity: e.target.value }));

  const handleFileChange = e => {
    const files = Array.from(e.target.files).filter(f => f instanceof File);
    if (formData.images.length + files.length > 5) {
      setError("Máximo 5 archivos permitidos."); return;
    }
    setFormData(f => ({ ...f, images: [...f.images, ...files] }));
    setPreviewFiles(p => [...p, ...files.map(f => f.name)]);
  };

  const removeFile = idx => {
    setFormData(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
    setPreviewFiles(p => p.filter((_, i) => i !== idx));
  };

  useEffect(() => {
    if (!createdProductId) return;

    if (formData.images.length > 0) {
      uploadFiles(formData.images)
        .then(() => {
          setShowSuccess(true);
          setTimeout(() => {
            onSave?.();
            onClose();
          }, 1500);
        })
        .catch(err => {
          setError(err.message || uploadError || "Error subiendo archivos.");
        });
    } else {
      setShowSuccess(true);
      setTimeout(() => {
        onSave?.();
        onClose();
      }, 1500);
    }
  }, [
    createdProductId,
    formData.images,
    uploadFiles,
    uploadError,
    onSave,
    onClose,
  ]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(""); setShowSuccess(false);
    if (!validateCodeUnique()) return;
    if (!formData.category) { setError("Selecciona una categoría válida."); return; }
    if (typeInput && !types.find(t => t.name.toLowerCase() === typeInput.toLowerCase())) {
      setError("El tipo ingresado no es válido."); return;
    }

    const fd = new FormData();
    fd.append("name", formData.name.trim());
    const codeNum = parseInt(formData.code, 10);
    if (isNaN(codeNum)) { setError("El código debe ser numérico."); return; }
    fd.append("code", codeNum.toString());
    fd.append("description", formData.description.trim());
    fd.append("brand", formData.brand.trim());
    fd.append("location", formData.location.trim());
    fd.append("position", formData.position.trim());
    fd.append("category", formData.category);
    formData.type && fd.append("type", formData.type);
    const stockVal = formData.initial_stock_quantity.replace(/[^0-9.]/g, "");
    if (stockVal && parseFloat(stockVal) > 0) fd.append("initial_stock_quantity", stockVal);
    fd.append("has_subproducts", formData.has_subproducts ? "true" : "false");

    try {
      setSubmitting(true);
      const newProd = await createProduct(fd);
      setCreatedProductId(newProd.id);
    } catch (err) {
      setError(err.message || "Error al crear el producto.");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Nuevo Producto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <ErrorMessage message={error} onClose={() => setError("")} />}
        {showSuccess && <SuccessMessage message="¡Producto creado exitosamente!" />}

        {/* Categoría */}
        <div>
          <label htmlFor="category-input" className="block text-sm font-medium text-text-secondary">
            Categoría *
          </label>
          <div className="relative mt-1">
            <input
              id="category-input"
              type="text"
              list="category-options"
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              disabled={loadingCategories}
              placeholder="Selecciona o escribe una categoría"
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 border-background-200"
            />
            <datalist id="category-options">
              {categories.map((c) => (
                <option key={c.id} value={c.name} />
              ))}
            </datalist>
          </div>
        </div>

        {/* Tipo */}
        <div>
          <label htmlFor="type-input" className="block text-sm font-medium text-text-secondary">
            Tipo (opcional)
          </label>
          <div className="relative mt-1">
            <input
              id="type-input"
              type="text"
              value={typeInput}
              onChange={(e) => setTypeInput(e.target.value)}
              disabled={!formData.category || loadingTypes}
              placeholder="Selecciona o escribe un tipo"
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 border-background-200 disabled:opacity-50"
              autoComplete="off"
              onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
              onFocus={() => setShowSuggestions(true)}
            />
            {showSuggestions && typeInput && types.length > 0 && (
              <ul className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-md bg-white border border-gray-300 text-sm shadow-lg">
                {types
                  .filter((t) =>
                    t.name.toLowerCase().includes(typeInput.toLowerCase())
                  )
                  .map((t) => (
                    <li
                      key={t.id}
                      onMouseDown={() => {
                        setTypeInput(t.name);
                        setFormData((prev) => ({
                          ...prev,
                          type: String(t.id),
                        }));
                        setShowSuggestions(false);
                      }}
                      className="cursor-pointer px-4 py-2 hover:bg-primary-100"
                    >
                      {t.name}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>

        <FormInput label="Nombre / Medida" name="name" value={formData.name} onChange={handleChange} required />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput label="Código" name="code" value={formData.code} onChange={handleChange} required />
          <FormInput label="Marca" name="brand" value={formData.brand} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormStockInput label="Stock Inicial" name="initial_stock_quantity" value={formData.initial_stock_quantity} onChange={handleStockChange} placeholder="Ej: 100" />
          <FormInput label="Ubicación" name="location" value={formData.location} onChange={handleChange} />
          <FormInput label="Posición" name="position" value={formData.position} onChange={handleChange} />
        </div>

        <FormInput label="Descripción" name="description" value={formData.description} onChange={handleChange} />

        <div className="flex items-center space-x-2">
          <input type="checkbox" id="has_subproducts" name="has_subproducts" checked={formData.has_subproducts} onChange={handleChange} className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500" />
          <label htmlFor="has_subproducts" className="ml-2 text-sm">Este producto tiene subproductos</label>
        </div>

        <div>
          <label className="block mb-2 text-sm">Archivos (máx. 5)</label>
          <div className="flex items-center space-x-4">
            <label htmlFor="images" className="cursor-pointer bg-info-500 text-white px-4 py-2 rounded hover:bg-info-600">Seleccionar archivos</label>
            <span className="text-sm">{previewFiles.length ? `${previewFiles.length} archivo(s)` : "Sin archivos"}</span>
          </div>
          <input id="images" type="file" multiple accept="image/*,video/*,application/pdf" onChange={handleFileChange} className="hidden" />
          {previewFiles.length > 0 && (
            <ul className="mt-2 text-sm text-gray-600 space-y-1">
              {previewFiles.map((nm, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="truncate">{nm}</span>
                  <button type="button" onClick={() => removeFile(i)} className="text-gray-400 hover:text-red-600">✖</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onClose} disabled={submitting} className="bg-neutral-500 text-white px-4 py-2 rounded hover:bg-neutral-600">Cancelar</button>
          <button type="submit" disabled={submitting || uploading} className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600">{submitting || uploading ? "Guardando..." : "Crear Producto"}</button>
        </div>
      </form>
    </Modal >
  );
};

CreateProductModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func,
};

export default CreateProductModal;
