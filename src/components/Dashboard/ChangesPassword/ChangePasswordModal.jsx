import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import apiService from '../../../api/services';
import Swal from 'sweetalert2';

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Errores de validación del CLIENTE para nueva contraseña y confirmación
  const [newPasswordClientError, setNewPasswordClientError] = useState('');
  const [confirmPasswordClientError, setConfirmPasswordClientError] = useState('');

  // Error ESPECÍFICO del campo de CONTRASEÑA ACTUAL (proviene del backend)
  const [currentPasswordBackendError, setCurrentPasswordBackendError] = useState('');

  // Un único estado para errores generales o de backend que no son de campo específico
  const [generalBackendError, setGeneralBackendError] = useState(''); // Ejemplo: "Nueva contraseña no puede ser igual a la actual"
  const [successMessage, setSuccessMessage] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setNewPasswordClientError('');
      setConfirmPasswordClientError('');
      setCurrentPasswordBackendError('');
      setGeneralBackendError('');
      setSuccessMessage('');
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getNewPasswordValidationError = (password) => {
    if (password.length < 8) {
      return 'Debe tener al menos 8 caracteres.';
    }
    if (!/[a-z]/.test(password)) {
      return 'Debe contener al menos una letra minúscula.';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Debe contener al menos una letra mayúscula.';
    }
    if (!/\d/.test(password)) {
      return 'Debe contener al menos un número.';
    }
    return '';
  };

  const handleCurrentPasswordChange = (e) => {
    setCurrentPassword(e.target.value);
    setCurrentPasswordBackendError('');
    setGeneralBackendError(''); 
    setSuccessMessage('');
  };

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    setNewPasswordClientError(getNewPasswordValidationError(value));
    // Limpiar error de confirmación si al modificar la nueva contraseña coinciden
    if (confirmNewPassword !== '' && value === confirmNewPassword) {
      setConfirmPasswordClientError('');
    } else if (confirmNewPassword !== '' && value !== confirmNewPassword) {
      setConfirmPasswordClientError('Las nuevas contraseñas no coinciden.');
    }
    setCurrentPasswordBackendError('');
    setGeneralBackendError(''); 
    setSuccessMessage('');
  };

  const handleConfirmNewPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmNewPassword(value);
    if (newPassword !== '' && value !== newPassword) {
      setConfirmPasswordClientError('Las nuevas contraseñas no coinciden.');
    } else {
      setConfirmPasswordClientError('');
    }
    setCurrentPasswordBackendError(''); 
    setGeneralBackendError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCurrentPasswordBackendError('');
    setGeneralBackendError('');
    setSuccessMessage('');
    setLoading(true);

    // 1. Validaciones del lado del cliente (para la NUEVA contraseña)
    const newPassValidationError = getNewPasswordValidationError(newPassword);
    if (newPassValidationError) {
      setNewPasswordClientError(newPassValidationError);
      setGeneralBackendError('Por favor, corrige los errores en los campos de la nueva contraseña.');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setConfirmPasswordClientError('Las nuevas contraseñas no coinciden.');
      setGeneralBackendError('Las nuevas contraseñas no coinciden.');
      setLoading(false);
      return;
    }

    // Si las validaciones del cliente para la nueva contraseña pasaron, intentamos con el backend
    try {
      await apiService.changeMyPassword({ currentPassword, newPassword });

      //const data = await apiService.changeMyPassword({ currentPassword, newPassword });
      //setSuccessMessage(data.message || 'Contraseña cambiada exitosamente.');

      // Limpiar campos en éxito
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setNewPasswordClientError('');
      setConfirmPasswordClientError('');

      await Swal.fire({
              icon: "success",
              title: "Se cambio la contraseña Exitosamente",
              showConfirmButton: false,
              timer: 2500,
              customClass: {
                popup: "swal2-dark-mode",
                title: "text-white",
                htmlContainer: "text-gray-300",
                confirmButton: "px-4 py-2 rounded-lg text-sm font-semibold",
              },
              background: "#1F2937",
              color: "#E5E7EB",
            });

      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (err) {
      console.error('Error al cambiar la contraseña:', err);
      const backendResponse = err.response?.data;

      if (backendResponse) {
        if (backendResponse.code === "INCORRECT_CURRENT_PASSWORD") {
          // *** Este error se dirige al campo de contraseña actual ***
          setCurrentPasswordBackendError(backendResponse.message || 'La contraseña actual ingresada es incorrecta.');
        } else if (backendResponse.message === 'La nueva contraseña no puede ser igual a la actual.') {
          // Este error es una validación más general del backend
          setGeneralBackendError(backendResponse.message);
        }
        // Puedes añadir más `else if` para otros códigos de error específicos del backend
        else {
          // Para cualquier otro error del servidor no mapeado
          setGeneralBackendError(backendResponse.message || "Ocurrió un error inesperado al cambiar la contraseña.");
        }
      } else {
        // Errores de red o si el servidor no responde
        setGeneralBackendError("No se pudo conectar con el servidor. Intenta de nuevo más tarde.");
      }
      
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled = loading ||
                           currentPassword === '' ||
                           newPassword === '' ||
                           confirmNewPassword === '' ||
                           newPasswordClientError !== '' ||
                           confirmPasswordClientError !== '';

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full relative border border-gray-700">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        <h2 className="text-3xl font-bold mb-6 text-white text-center">Cambiar Contraseña</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="currentPassword" className="block text-gray-300 text-sm font-bold mb-2">Contraseña Actual</label>
            <input
              type="password"
              id="currentPassword"
              // Aplica borde rojo si hay un error de backend específico para esta contraseña
              className={`shadow appearance-none border ${currentPasswordBackendError ? 'border-red-500' : 'border-gray-700'} rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={currentPassword}
              onChange={handleCurrentPasswordChange}
              required
            />
            {/* Muestra el error de backend específico para contraseña actual */}
            {currentPasswordBackendError && <p className="text-red-400 text-xs mt-1">{currentPasswordBackendError}</p>}
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-gray-300 text-sm font-bold mb-2">Nueva Contraseña</label>
            <input
              type="password"
              id="newPassword"
              className={`shadow appearance-none border ${newPasswordClientError ? 'border-red-500' : 'border-gray-700'} rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={newPassword}
              onChange={handleNewPasswordChange}
              required
            />
            {newPasswordClientError && <p className="text-red-400 text-xs mt-1">{newPasswordClientError}</p>}
          </div>
          <div>
            <label htmlFor="confirmNewPassword" className="block text-gray-300 text-sm font-bold mb-2">Confirmar Nueva Contraseña</label>
            <input
              type="password"
              id="confirmNewPassword"
              className={`shadow appearance-none border ${confirmPasswordClientError ? 'border-red-500' : 'border-gray-700'} rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={confirmNewPassword}
              onChange={handleConfirmNewPasswordChange}
              required
            />
            {confirmPasswordClientError && <p className="text-red-400 text-xs mt-1">{confirmPasswordClientError}</p>}
          </div>

          {/* Mostrar error general (de backend no específico de campo) */}
          {generalBackendError && (
            <p className="text-center text-red-400 text-sm">
              {generalBackendError}
            </p>
          )}

          {/* Mostrar mensaje de éxito */}
          {successMessage && (
            <p className="text-center text-green-400 text-sm">
              {successMessage}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitDisabled}
          >
            {loading ? 'Cambiando...' : <><Save size={20} /> Cambiar Contraseña</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;