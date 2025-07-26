import React, { useState, useEffect } from 'react';
import { X, Save, AlertTriangle, User, Scissors, DollarSign, Clock, Info } from 'lucide-react';
import apiService from '../../api/services.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Swal from 'sweetalert2';

const WalkinForm = ({ onClose, onSaveSuccess, barbers, services, sites }) => {
  const { currentUser } = useAuth();
  
  // Función para obtener la hora actual en formato "HH:MM"
  const getCurrentTime = () => new Date().toTimeString().slice(0, 5);

  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    barberId: currentUser.role === 'barbero' ? currentUser._id : '',
    serviceId: '',
    siteId: currentUser?.site_barber || '',
    startTime: getCurrentTime(),
    notes: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validaciones en tiempo real
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'clientName':
        if (!value.trim()) {
          newErrors.clientName = 'El nombre del cliente es obligatorio';
        } else if (value.trim().length < 2) {
          newErrors.clientName = 'El nombre debe tener al menos 2 caracteres';
        } else if (value.trim().length > 50) {
          newErrors.clientName = 'El nombre no puede exceder 50 caracteres';
        } else {
          delete newErrors.clientName;
        }
        break;

      case 'clientPhone':
        if (value && !/^\d+$/.test(value)) {
          newErrors.clientPhone = 'El teléfono solo debe contener números';
        } else if (value && value.length !== 10) {
          newErrors.clientPhone = 'El teléfono debe tener exactamente 10 dígitos';
        } else if (value && !value.startsWith('3')) {
          newErrors.clientPhone = 'Los números celulares en Colombia deben iniciar con 3';
        } else {
          delete newErrors.clientPhone;
        }
        break;

      case 'barberId':
        if (!value) {
          newErrors.barberId = 'Debe seleccionar un barbero';
        } else {
          delete newErrors.barberId;
        }
        break;

      case 'serviceId':
        if (!value) {
          newErrors.serviceId = 'Debe seleccionar un servicio';
        } else {
          delete newErrors.serviceId;
        }
        break;

      case 'siteId':

        if (currentUser.role !== 'barbero') {
          if (!value) {
            newErrors.siteId = 'Debe seleccionar una sede';
          } else {
            delete newErrors.siteId;
          }
        } else {
          // Para barberos, no es necesario validar siteId
          delete newErrors.siteId;
        }
        break;

      case 'startTime':
        if (!value) {
          newErrors.startTime = 'La hora de inicio es obligatoria';
        } else {
          delete newErrors.startTime;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Para el teléfono, limitar a 10 dígitos
    if (name === 'clientPhone' && value.length > 10) {
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validar campo si ya fue tocado
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const validateForm = () => {
    let requiredFields = ['clientName', 'barberId', 'serviceId', 'startTime'];
    
    if (currentUser.role !== 'barbero') {
      requiredFields.push('siteId');
    
    }
    let isValid = true;

    // Marcar todos los campos como tocados
    const newTouched = {};
    requiredFields.forEach(field => {
      newTouched[field] = true;
    });
    if (formData.clientPhone) {
      newTouched.clientPhone = true;
    }
    setTouched(newTouched);

    // Validar todos los campos
    requiredFields.forEach(field => {
      if (!validateField(field, formData[field])) {
        isValid = false;
      }
    });

    // Validar teléfono si se proporcionó
    if (formData.clientPhone && !validateField('clientPhone', formData.clientPhone)) {
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiService.createCompletedService(formData);

      Swal.fire({
        title: "¡Servicio Registrado Exitosamente!",
        text: `El servicio para ${formData.clientName} ha sido registrado correctamente.`,
        icon: "success",
        confirmButtonColor: "#2cb9fd",
        customClass: {
          popup: "swal2-dark-mode",
          title: "text-white",
          htmlContainer: "text-gray-300",
        },
        background: "#1F2937",
        color: "#E5E7EB",
      });

      onSaveSuccess(response.data);
      onClose();

    } catch (apiError) {
      console.error("Error completo de la API:", apiError); 
        
      let errorMessage = "Ocurrió un error inesperado al registrar el servicio.";
      
      if (apiError.response?.data) {
        const errorData = apiError.response.data;
        
        // Prioridad 1: Si viene en 'error' (más específico y claro)
        if (errorData.error) {
          errorMessage = errorData.error;
        }
        // Prioridad 2: Si viene en 'message' (más genérico)
        else if (errorData.message) {
          errorMessage = errorData.message;
        }
        // Prioridad 3: Si viene en 'errors' (validaciones múltiples)
        else if (errorData.errors) {
          // Si es un objeto con múltiples errores, tomar el primero o concatenarlos
          if (typeof errorData.errors === 'object') {
            const firstError = Object.values(errorData.errors)[0];
            errorMessage = firstError || errorMessage;
          } else if (typeof errorData.errors === 'string') {
            errorMessage = errorData.errors;
          }
        }
      }
      
      Swal.fire({
        title: "Error al Registrar Servicio",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "#dc3545",
        customClass: {
          popup: "swal2-dark-mode",
          title: "text-white",
          htmlContainer: "text-gray-300",
        },
        background: "#1F2937",
        color: "#E5E7EB",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener el servicio seleccionado para mostrar información adicional
  const selectedService = services.find(s => s._id === formData.serviceId);

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-700 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Registrar Servicio Walk-in</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Información adicional */}
        <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 p-3 rounded-lg mb-4 flex items-start gap-2">
          <Info size={16} className="mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium mb-1">Registro de servicio sin cita</p>
            <p>Se registrará automáticamente con la fecha y hora actual del dispositivo.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Información del Cliente */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-300 border-b border-gray-600 pb-1">
              Información del Cliente
            </h3>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Nombre del Cliente *
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="Ingresa el nombre completo"
                className={`w-full bg-gray-700 text-white p-3 rounded-lg border transition-all ${
                  errors.clientName && touched.clientName
                    ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                    : 'border-gray-600 focus:ring-2 focus:ring-blue-500'
                } focus:border-transparent`}
                maxLength={50}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Teléfono Celular (Opcional)
              </label>
              <input
                type="tel"
                name="clientPhone"
                value={formData.clientPhone}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="3XXXXXXXXX (10 dígitos)"
                className={`w-full bg-gray-700 text-white p-3 rounded-lg border transition-all ${
                  errors.clientPhone && touched.clientPhone
                    ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                    : 'border-gray-600 focus:ring-2 focus:ring-blue-500'
                } focus:border-transparent`}
                maxLength={10}
              />
              <p className="text-xs text-gray-500 mt-1">
                Formato: números celulares colombianos (10 dígitos, inicia con 3)
              </p>
            </div>
          </div>

          {/* Configuración del Servicio */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-300 border-b border-gray-600 pb-1">
              Configuración del Servicio
            </h3>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Barbero *
              </label>
              <select
                name="barberId"
                value={formData.barberId}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full bg-gray-700 text-white p-3 rounded-lg border transition-all ${
                  errors.barberId && touched.barberId
                    ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                    : 'border-gray-600 focus:ring-2 focus:ring-blue-500'
                } focus:border-transparent`}
                disabled={currentUser.role === 'barbero'}
              >
                <option value="">-- Seleccionar Barbero --</option>
                {barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
              {currentUser.role === 'barbero' && (
                <p className="text-xs text-gray-500 mt-1">
                  Asignado automáticamente a tu usuario
                </p>
              )}
            </div>

            {/* Solo mostrar selector de sede si NO es barbero */}
            {currentUser.role !== 'barbero' && (
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Sede *
                </label>
                <select
                  name="siteId"
                  value={formData.siteId}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full bg-gray-700 text-white p-3 rounded-lg border transition-all ${
                    errors.siteId && touched.siteId
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                      : 'border-gray-600 focus:ring-2 focus:ring-blue-500'
                  } focus:border-transparent`}
                >
                  <option value="">-- Seleccionar Sede --</option>
                  {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                {errors.siteId && touched.siteId && (
                  <p className="text-red-400 text-xs mt-1">{errors.siteId}</p>
                )}
              </div>
            )}

            {/* Mostrar información de sede para barberos */}
            {currentUser.role === 'barbero' && currentUser.site_barber && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <div className="flex items-center gap-2 text-blue-400">
                  <Info size={14} />
                  <span className="text-xs font-medium">Sede asignada automáticamente</span>
                </div>
                <p className="text-xs text-gray-300 mt-1">
                  El servicio se registrará en tu sede asignada
                </p>
              </div>
            )}
            
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Servicio *
              </label>
              <select
                name="serviceId"
                value={formData.serviceId}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full bg-gray-700 text-white p-3 rounded-lg border transition-all ${
                  errors.serviceId && touched.serviceId
                    ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                    : 'border-gray-600 focus:ring-2 focus:ring-blue-500'
                } focus:border-transparent`}
              >
                <option value="">-- Seleccionar Servicio --</option>
                {services.map(s => (
                  <option key={s._id} value={s._id}>
                    {s.name} {s.price && `- $${s.price.toLocaleString()}`}
                  </option>
                ))}
              </select>
              {selectedService && (
                <div className="mt-2 p-2 bg-gray-700/50 rounded text-xs text-gray-300">
                  <p><strong>Duración:</strong> {selectedService.duration || 'No especificada'}</p>
                  {selectedService.description && (
                    <p><strong>Descripción:</strong> {selectedService.description}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Horario */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-300 border-b border-gray-600 pb-1">
              Horario
            </h3>
            <div>
              <label htmlFor="startTime" className="block text-xs font-medium text-gray-400 mb-1">
                Hora de Inicio *
              </label>
              <input
                type="time"
                name="startTime"
                id="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full bg-gray-700 text-white p-3 rounded-lg border transition-all ${
                  errors.startTime && touched.startTime
                    ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                    : 'border-gray-600 focus:ring-2 focus:ring-blue-500'
                } focus:border-transparent`}
              />
              <p className="text-xs text-gray-500 mt-1">
                Se estableció automáticamente la hora actual, puedes modificarla si es necesario
              </p>
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-300 border-b border-gray-600 pb-1">
              Notas Adicionales
            </h3>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1" htmlFor="notes">
                Observaciones (Opcional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Ej: Cliente frecuente, preferencias especiales, observaciones del servicio..."
                rows="3" 
                className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                id="notes"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.notes.length}/500 caracteres
              </p>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-600">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium bg-gray-600 hover:bg-gray-500 text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 rounded-lg font-medium bg-green-600 hover:bg-green-500 text-white transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Registrando...' : 'Registrar Servicio'}
              <Save size={16} />
            </button>
          </div>

          {/* Mensajes de Error - Movidos al final */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={16} />
                <span className="text-sm font-medium">Por favor corrige los siguientes errores:</span>
              </div>
              <ul className="text-sm space-y-1 ml-6">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field} className="list-disc">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default WalkinForm;