import React, { useState, useEffect } from 'react';
import { X, UploadCloud, Save, UserIcon, Trash2, Check } from 'lucide-react';
import apiService from '../../api/services';
import ChangePasswordModal from './ChangesPassword/ChangePasswordModal';

const ProfileModal = ({ isOpen, onClose, currentUser, setCurrentUser }) => {
  const [userName, setUserName] = useState(currentUser.name);
  const [userLastName, setUserLastName] = useState(currentUser.last_name)
  const [userEmail, setUserEmail] = useState(currentUser.email);
  const [userPhone, setUserPhone] = useState(currentUser?.phone || '');
  const [profilePhotoPreview, setprofilePhotoPreview] = useState(currentUser.photo || null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false); // Nuevo estado para el modal de cambio de contraseña
  
  if (!isOpen || !currentUser) return null;

   useEffect(() => {
    if (currentUser) {
      setUserName(currentUser.name || '');
      setUserLastName(currentUser.last_name || '');
      setUserPhone(currentUser.phone || '');
      
      setprofilePhotoPreview(currentUser.imageUrl || null);
    }
  }, [currentUser]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const fileUrl = URL.createObjectURL(file);
      setprofilePhotoPreview(fileUrl);
      setMessage('');
    }
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setprofilePhotoPreview(null);
    setMessage('');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    const formData = new FormData();
    formData.append('name', userName);
    formData.append('last_name', userLastName)
    //formData.append('email', userEmail);
    formData.append('phone', userPhone); 

    if (selectedFile) {
      formData.append('photo', selectedFile);
    }else if(profilePhotoPreview === null && currentUser.imageUrl){
      formData.append('imageUrl', '');
    }

    // === CONSOLE.LOG PARA VER EL CONTENIDO DE FormData ===
    // Nota: FormData no se puede loggear directamente como un objeto normal.
    // Debes iterar sobre él.
    // console.log("ProfileModal - Contenido de FormData antes de enviar:");
    // for (let [key, value] of formData.entries()) {
    //     console.log(`${key}:`, value);
    // }
    // ==============================================================

    try {
      const data = await apiService.updateMyProfile(formData);

      
        setMessage(data.message || 'Perfil actualizado exitosamente.');
        setCurrentUser(data.data);
        setprofilePhotoPreview(data.data.imageUrl || null);
        setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error de red al actualizar el perfil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-md w-full relative border border-gray-600/50 max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header con gradiente */}
        <div className="relative overflow-hidden flex-shrink-0">
          {/* Fondo decorativo */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-indigo-600/20"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(120,119,198,0.3),transparent_50%)]"></div>
          
          {/* Contenido del header */}
          <div className="relative flex justify-between items-center p-6 border-b border-gray-600/30">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">Mi Perfil</h2>
              <p className="text-sm text-gray-300/80 mt-1">Actualiza tu información personal</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-all duration-200 p-2 hover:bg-white/10 rounded-xl backdrop-blur-sm"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Contenido con scroll */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            
            {/* Sección de foto de perfil mejorada */}
            <div className="flex flex-col items-center gap-6 mb-8">
              {/* Avatar con efectos */}
              <div className="relative group">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-gradient-to-r from-blue-500 to-purple-500 p-1 bg-gradient-to-r from-blue-500 to-purple-500">
                  <div className="w-full h-full rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                    {profilePhotoPreview ? (
                      <img src={profilePhotoPreview} alt="Foto de perfil" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-12 h-12 md:w-16 md:h-16 text-gray-400" />
                    )}
                  </div>
                </div>
                
                {/* Overlay de hover */}
                <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                      <UploadCloud className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Botones de foto */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <label htmlFor="photo-upload" className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/25">
                  <UploadCloud size={18} />
                  {selectedFile ? 'Cambiar Foto' : 'Subir Foto'}
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                
                {profilePhotoPreview && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 hover:text-red-300 font-medium py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all duration-300 backdrop-blur-sm"
                  >
                    <Trash2 size={18} />
                    Eliminar
                  </button>
                )}
              </div>
            </div>

            {/* Campos del formulario mejorados */}
            <div className="space-y-5">
              <div className="group">
                <label htmlFor="name" className="block text-gray-300 text-sm font-semibold mb-2 group-focus-within:text-blue-400 transition-colors">
                  Nombre *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    className="w-full bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-xl py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:bg-gray-700/70"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                    placeholder="Ingresa tu nombre"
                  />
                </div>
              </div>
              
              <div className="group">
                <label htmlFor="last_name" className="block text-gray-300 text-sm font-semibold mb-2 group-focus-within:text-blue-400 transition-colors">
                  Apellido *
                </label>
                <input
                  type="text"
                  id="last_name"
                  className="w-full bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-xl py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:bg-gray-700/70"
                  value={userLastName}
                  onChange={(e) => setUserLastName(e.target.value)}
                  required
                  placeholder="Ingresa tu apellido"
                />
              </div>
              
              <div className="group">
                <label htmlFor="phone" className="block text-gray-300 text-sm font-semibold mb-2 group-focus-within:text-blue-400 transition-colors">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-xl py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:bg-gray-700/70"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  placeholder="Número de teléfono"
                />
              </div>
              
              <div className="group">
                <label htmlFor="email" className="block text-gray-300 text-sm font-semibold mb-2">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    className="w-full bg-gray-700/30 border border-gray-600/30 rounded-xl py-3 px-4 text-gray-400 leading-tight cursor-not-allowed"
                    value={userEmail}
                    readOnly
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="bg-gray-600/50 rounded-full px-2 py-1">
                      <span className="text-xs text-gray-400 font-medium">Solo lectura</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mensaje de estado mejorado */}
            {message && (
              <div className={`p-4 rounded-xl border backdrop-blur-sm ${
                message.includes('Error') 
                  ? 'bg-red-500/10 border-red-500/20 text-red-300' 
                  : 'bg-green-500/10 border-green-500/20 text-green-300'
              }`}>
                <p className="text-center text-sm font-medium flex items-center justify-center gap-2">
                  {message.includes('Error') ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {message}
                </p>
              </div>
            )}

            {/* Botones de acción mejorados */}
            <div className="space-y-4 pt-2">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Guardando cambios...
                  </>
                ) : (
                  <>
                    <Save size={20} /> 
                    Guardar Cambios
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsChangePasswordModalOpen(true);
                  }}
                  className="text-blue-400 hover:text-blue-300 text-sm font-semibold underline decoration-blue-400/50 underline-offset-4 transition-all duration-300 hover:decoration-blue-300/70"
                >
                  ¿Cambiar contraseña?
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      {/* Modal de cambio de contraseña */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      />
    </div>
  );
};

export default ProfileModal;