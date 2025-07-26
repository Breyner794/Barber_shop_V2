import React, { useState, useEffect } from 'react';
import { X, MapPin, Phone, Clock, Building, Save, Loader2, Plus } from 'lucide-react';
import apiService from '../../api/services';

const SiteForm = ({ isOpen, onClose, onSiteCreated, currentUser, onSiteUpdated, siteToEdit }) => {
  const [formData, setFormData] = useState({
    name_site: '',
    address_site: '',
    phone_site: '',
    headquarter_time: '',
    isActive: true
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const hasPermission = currentUser?.role === 'admin' || currentUser?.role === 'superadmin';

  useEffect(()=> {
    if(isOpen && siteToEdit){
        setFormData({
        name_site: siteToEdit.name_site || '',
        address_site: siteToEdit.address_site || '',
        phone_site: siteToEdit.phone_site || '',
        headquarter_time: siteToEdit.headquarter_time || '',
        isActive: siteToEdit.isActive !== undefined ? siteToEdit.isActive : true
      });
      setErrors({});
      setApiError('')
    }else if (!isOpen && siteToEdit){
        setFormData({ // Restablecer el formulario a valores vacíos
        name_site: '',
        address_site: '',
        phone_site: '',
        headquarter_time: '',
        isActive: true
      });
      setErrors({});
      setApiError('')
    }
  },[isOpen, siteToEdit])

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name_site.trim()) {
      newErrors.name_site = 'El nombre de la sede es requerido';
    } else if (formData.name_site.length < 3) {
      newErrors.name_site = 'El nombre debe tener al menos 3 caracteres';
    }
    
    if (!formData.address_site.trim()) {
      newErrors.address_site = 'La dirección es requerida';
    } else if (formData.address_site.length < 10) {
      newErrors.address_site = 'La dirección debe ser más específica';
    }
    
    if (!formData.phone_site.trim()) {
      newErrors.phone_site = 'El teléfono es requerido';
    } else if (!/^\+?[\d\s\-\(\)]{10,15}$/.test(formData.phone_site)) {
      newErrors.phone_site = 'Formato de teléfono inválido';
    }
    
    if (!formData.headquarter_time.trim()) {
      newErrors.headquarter_time = 'El horario es requerido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Limpiar error de API
    if (apiError) {
      setApiError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!hasPermission) {
      setApiError('No tienes permisos para crear/editar sedes');
      return;
    }
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setApiError('');
    
    try {
     let resultSite;
     if(siteToEdit){
        resultSite = await apiService.updateSite(siteToEdit._id, formData);
        if (onSiteUpdated){
            onSiteUpdated(resultSite);
        }
     }else {
        resultSite = await apiService.createSite(formData);
        if(onSiteCreated){
            onSiteCreated(resultSite);
        }
     }

      setFormData({
        name_site: '',
        address_site: '',
        phone_site: '',
        headquarter_time: '',
        isActive: true
      });

      onClose();
      
    } catch (error) {
      let errorMessage = 'Error al procesar la sede';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name_site: '',
      address_site: '',
      phone_site: '',
      headquarter_time: '',
      isActive: true
    });
    setErrors({});
    setApiError('');
    onClose();
  };

  if (!isOpen) return null;
   // Determinar el título y el texto del botón según si estamos editando o creando
  const formTitle = siteToEdit ? 'Editar Sede' : 'Nueva Sede';
  const submitButtonText = siteToEdit ? 'Actualizar Sede' : 'Crear Sede';
  const submitButtonIcon = siteToEdit ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />; // Cambiar icono a Plus para crear

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Building className="w-6 h-6 text-indigo-400" />
            {formTitle}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Error de API */}
          {apiError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-lg">
              {apiError}
            </div>
          )}

          {/* Mensaje de permisos */}
          {!hasPermission && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 p-4 rounded-lg">
              Solo los administradores pueden crear sedes
            </div>
          )}

          {/* Nombre de la sede */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Nombre de la Sede *
            </label>
            <div className="relative">
              <Building className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="name_site"
                value={formData.name_site}
                onChange={handleInputChange}
                className={`w-full bg-gray-700 text-white pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.name_site ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Ej: Sede Centro"
                disabled={isLoading || !hasPermission}
              />
            </div>
            {errors.name_site && (
              <p className="text-red-400 text-sm">{errors.name_site}</p>
            )}
          </div>

          {/* Dirección */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Dirección *
            </label>
            <div className="relative">
              <MapPin className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="address_site"
                value={formData.address_site}
                onChange={handleInputChange}
                className={`w-full bg-gray-700 text-white pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.address_site ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Ej: Calle 123 #45-67, Barrio Centro"
                disabled={isLoading || !hasPermission}
              />
            </div>
            {errors.address_site && (
              <p className="text-red-400 text-sm">{errors.address_site}</p>
            )}
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Teléfono *
            </label>
            <div className="relative">
              <Phone className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                name="phone_site"
                value={formData.phone_site}
                onChange={handleInputChange}
                className={`w-full bg-gray-700 text-white pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.phone_site ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Ej: +57 300 123 4567"
                disabled={isLoading || !hasPermission}
              />
            </div>
            {errors.phone_site && (
              <p className="text-red-400 text-sm">{errors.phone_site}</p>
            )}
          </div>

          {/* Horario */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Horario de Atención *
            </label>
            <div className="relative">
              <Clock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="headquarter_time"
                value={formData.headquarter_time}
                onChange={handleInputChange}
                className={`w-full bg-gray-700 text-white pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.headquarter_time ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Ej: Lunes a Viernes: 8:00 AM - 6:00 PM"
                disabled={isLoading || !hasPermission}
              />
            </div>
            {errors.headquarter_time && (
              <p className="text-red-400 text-sm">{errors.headquarter_time}</p>
            )}
          </div>

          {/* Estado activo */}
          <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Estado de la sede
              </label>
              <label
                htmlFor="isActive"
                className="flex items-center cursor-pointer"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    className="sr-only"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  <div
                    className={`block w-14 h-8 rounded-full ${
                      formData.isActive ? "bg-gradient-to-r from-purple-500 to-indigo-600" : "bg-gray-600"
                    }`}
                  ></div>
                  <div
                    className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                      formData.isActive ? "transform translate-x-6" : ""
                    }`}
                  ></div>
                </div>
                <div className="ml-3 text-white font-medium">
                  {formData.isActive ? "Activo" : "Inactivo"}
                </div>
              </label>
            </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || !hasPermission}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                hasPermission
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {siteToEdit ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                <>
                  {submitButtonIcon} {/* Icono dinámico */}
                  {submitButtonText}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteForm;