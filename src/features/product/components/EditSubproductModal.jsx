import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "../../../components/ui/Modal";
import FormInput from "../../../components/ui/form/FormInput";
import FormSelect from "../../../components/ui/form/FormSelect";
import ErrorMessage from "../../../components/common/ErrorMessage";
import SuccessMessage from "../../../components/common/SuccessMessage";

import useSubproductFileUpload from "../hooks/useSubproductFileUpload";
import { updateSubproduct } from "../services/updateSubproduct";

const locationOptions = [
    { value: "Deposito Principal", label: "Depósito Principal" },
    { value: "Deposito Secundario", label: "Depósito Secundario" },
];

const formTypeOptions = [
    { value: "Bobina", label: "Bobina" },
    { value: "Rollo", label: "Rollo" },
];

const EditSubproductModal = ({ isOpen, onClose, onSave, subproduct }) => {
    const [formData, setFormData] = useState({
        brand: "",
        number_coil: "",
        initial_enumeration: "",
        final_enumeration: "",
        gross_weight: "",
        net_weight: "",
        initial_stock_quantity: "",
        location: "Deposito Principal",
        form_type: "Bobina",
        observations: "",
        images: [],
    });

    const [previewFiles, setPreviewFiles] = useState([]);
    const [error, setError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const { uploadFiles, uploading, uploadError, clearUploadError } = useSubproductFileUpload();

    useEffect(() => {
        if (subproduct) {
            setFormData({
                brand: subproduct.brand || "",
                number_coil: subproduct.number_coil || "",
                initial_enumeration: subproduct.initial_enumeration || "",
                final_enumeration: subproduct.final_enumeration || "",
                gross_weight: subproduct.gross_weight || "",
                net_weight: subproduct.net_weight || "",
                initial_stock_quantity: subproduct.initial_stock_quantity || "",
                location: subproduct.location || "Deposito Principal",
                form_type: subproduct.form_type || "Bobina",
                observations: subproduct.observations || "",
                images: [],
            });
            setPreviewFiles([]);
        }
    }, [subproduct]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (formData.images.length + files.length > 5) {
            setError("Máximo 5 archivos permitidos.");
            return;
        }
        const all = [...formData.images, ...files];
        setFormData((prev) => ({ ...prev, images: all }));
        setPreviewFiles(all.map((f) => f.name));
    };

    const removeFile = (idx) => {
        const imgs = formData.images.filter((_, i) => i !== idx);
        setFormData((prev) => ({ ...prev, images: imgs }));
        setPreviewFiles((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        clearUploadError();

        const qty = String(formData.initial_stock_quantity).replace(/[^0-9.]/g, "").trim();
        if (qty && isNaN(parseFloat(qty))) {
            setError("La cantidad de stock inicial no es válida.");
            return;
        }

        const fd = new FormData();
        Object.entries(formData).forEach(([key, val]) => {
            if ((val !== "" && val != null) && key !== "images") {
                if (key === "initial_stock_quantity") {
                    fd.append("initial_stock_quantity", qty);
                } else {
                    fd.append(key, val);
                }
            }
        });

        try {
            await updateSubproduct(subproduct.parent, subproduct.id, fd);

            if (formData.images.length) {
                const ok = await uploadFiles(subproduct.parent, subproduct.id, formData.images);
                if (!ok && uploadError) {
                    setError(uploadError);
                    return;
                }
            }

            setShowSuccess(true);
            setTimeout(() => {
                onSave();
                onClose();
                setShowSuccess(false);
            }, 1500);
        } catch (err) {
            console.error("Error al actualizar subproducto:", err);
            setError("No se pudo actualizar el subproducto.");
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Editar Subproducto">
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
                {error && <ErrorMessage message={error} onClose={() => setError("")} />}
                {uploadError && <ErrorMessage message={uploadError} onClose={clearUploadError} />}

                <FormSelect
                    label="Tipo de Forma"
                    name="form_type"
                    value={formData.form_type}
                    onChange={handleChange}
                    options={formTypeOptions}
                    required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput label="Marca" name="brand" value={formData.brand} onChange={handleChange} />
                    <FormInput label="Número de Bobina" name="number_coil" value={formData.number_coil} onChange={handleChange} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput label="Enumeración Inicial" name="initial_enumeration" value={formData.initial_enumeration} onChange={handleChange} />
                    <FormInput label="Enumeración Final" name="final_enumeration" value={formData.final_enumeration} onChange={handleChange} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput label="Peso Bruto (kg)" name="gross_weight" value={formData.gross_weight} onChange={handleChange} />
                    <FormInput label="Peso Neto (kg)" name="net_weight" value={formData.net_weight} onChange={handleChange} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput label="Stock Inicial" name="initial_stock_quantity" value={formData.initial_stock_quantity} onChange={handleChange} />
                    <FormSelect
                        label="Ubicación"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        options={locationOptions}
                        required
                    />
                </div>

                <FormInput
                    label="Observaciones"
                    name="observations"
                    value={formData.observations}
                    onChange={handleChange}
                    textarea
                />

                <div>
                    <label className="block mb-2 text-sm font-medium">Archivos (máx. 5)</label>
                    <div className="flex items-center space-x-4">
                        <label htmlFor="images" className="cursor-pointer bg-info-500 text-white px-4 py-2 rounded hover:bg-info-600">
                            Seleccionar archivos
                        </label>
                        <span className="text-sm text-text-secondary">
                            {previewFiles.length ? `${previewFiles.length} archivo(s)` : "Sin archivos"}
                        </span>
                    </div>
                    <input
                        id="images"
                        type="file"
                        multiple
                        accept="image/*,video/*,application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    {previewFiles.length > 0 && (
                        <ul className="mt-2 text-sm text-gray-600 space-y-1">
                            {previewFiles.map((nm, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <span className="truncate">{nm}</span>
                                    <button type="button" onClick={() => removeFile(i)} className="text-gray-400 hover:text-red-600">
                                        ✖
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={uploading}
                        className="bg-neutral-500 text-white py-2 px-4 rounded hover:bg-neutral-600"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={uploading}
                        className={`bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600 ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {uploading ? "Guardando..." : "Actualizar Subproducto"}
                    </button>
                </div>

                {showSuccess && <SuccessMessage message="¡Subproducto actualizado con éxito!" onClose={() => setShowSuccess(false)} />}
            </form>
        </Modal>
    );
};

EditSubproductModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    subproduct: PropTypes.object.isRequired,
};

export default EditSubproductModal;
