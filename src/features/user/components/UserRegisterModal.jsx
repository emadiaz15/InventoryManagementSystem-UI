import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Modal from '../../../components/ui/Modal';
import FormInput from '../../../components/ui/form/FormInput';
import FormCheckbox from '../../../components/ui/form/FormCheckbox';
import ErrorMessage from '../../../components/common/ErrorMessage';
import ActionButtons from './ActionButtons';

const UserRegisterModal = ({ isOpen, onClose, onCreate, onCreateSuccess }) => {
  const initialFormData = useMemo(() => ({
    username: '',
    name: '',
    last_name: '',
    email: '',
    dni: '',
    image: null,
    is_staff: false,
    password: '',
    confirmPassword: '',
  }), []);

  const [formData, setFormData] = useState(initialFormData);
  const [internalLoading, setInternalLoading] = useState(false);
  const [internalError, setInternalError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
      setInternalError('');
      setValidationErrors({});
      setInternalLoading(false);
    }
  }, [isOpen, initialFormData]);

  const handleChange = useCallback((e) => {
    const { name, type, value, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setInternalError('');
    setValidationErrors({});

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errors = {};

    if (!formData.username.trim()) errors.username = 'El nombre de usuario es obligatorio.';
    if (!formData.name.trim()) errors.name = 'El nombre es obligatorio.';
    if (!formData.last_name.trim()) errors.last_name = 'El apellido es obligatorio.';
    if (!formData.email.trim()) {
      errors.email = 'El correo electrónico es obligatorio.';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Ingresa un correo electrónico válido.';
    }
    if (formData.dni && !formData.dni.match(/^\d{7,11}$/)) {
      errors.dni = 'El DNI debe tener entre 7 y 11 dígitos numéricos.';
    }
    if (!formData.password || formData.password.length < 4) {
      errors.password = 'La contraseña debe tener al menos 4 caracteres.';
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden.';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const dataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'confirmPassword' || value === '' || value === undefined || value === null) return;
      if (typeof value === 'boolean') value = value ? 'true' : 'false';
      dataToSend.append(key, value);
    });

    setInternalLoading(true);

    try {
      const createdUser = await onCreate(dataToSend);
      onCreateSuccess(`Usuario "${createdUser.username}" creado con éxito.`);
    } catch (err) {
      const message = err?.message || 'Error al registrar el usuario.';
      const fieldErrors = err?.fieldErrors || {};
      setInternalError(message);
      setValidationErrors(fieldErrors);
    } finally {
      setInternalLoading(false);
    }
  }, [formData, onCreate, onCreateSuccess]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Nuevo Usuario" position="center">
      <form onSubmit={handleSubmit} encType="multipart/form-data" noValidate>
        {internalError && <ErrorMessage message={internalError} onClose={() => setInternalError('')} />}

        <FormInput
          label="Nombre de usuario"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          error={validationErrors.username}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Nombre"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            error={validationErrors.name}
          />
          <FormInput
            label="Apellido"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            error={validationErrors.last_name}
          />
        </div>

        <FormInput
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          error={validationErrors.email}
        />

        <FormInput
          label="DNI"
          name="dni"
          value={formData.dni}
          onChange={handleChange}
          required
          error={validationErrors.dni}
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Cargar Imagen
          </label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="mt-1 block w-full"
            accept="image/*"
          />
          {validationErrors.image && (
            <p className="text-red-500 text-xs italic mt-1">
              {Array.isArray(validationErrors.image)
                ? validationErrors.image.join(', ')
                : validationErrors.image}
            </p>
          )}
        </div>

        <FormCheckbox
          label="Administrador"
          name="is_staff"
          checked={formData.is_staff}
          onChange={handleChange}
        />

        <FormInput
          label="Contraseña"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          error={validationErrors.password}
        />

        <FormInput
          label="Confirmar Contraseña"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          error={validationErrors.confirmPassword}
        />

        <div className="flex justify-end space-x-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={internalLoading}
            className="bg-neutral-500 text-white py-2 px-4 rounded hover:bg-neutral-600 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={internalLoading}
            className={`bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600 transition-colors ${internalLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {internalLoading ? 'Guardando...' : 'Crear Usuario'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UserRegisterModal;
