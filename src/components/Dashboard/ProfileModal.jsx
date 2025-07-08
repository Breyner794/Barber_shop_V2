import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { X, UploadCloud, Save, UserIcon, Trash2 } from 'lucide-react';
import apiService from '../../api/services';

const ProfileModal = ({ isOpen, onClose, currentUser, setCurrentUser }) => {
  const [userName, setUserName] = useState(currentUser.name);
  const [userLastName, setUserLastName] = useState(currentUser.last_name)
  const [userEmail, setUserEmail] = useState(currentUser.email);
  const [userPhone, setUserPhone] = useState(currentUser?.phone || '');
  const [profilePhotoPreview, setprofilePhotoPreview] = useState(currentUser.photo || null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  if (!isOpen || !currentUser) return null;

   useEffect(() => {
    if (currentUser) {
      setUserName(currentUser.name || '');
      setUserLastName(currentUser.last_name || '');
      setUserPhone(currentUser.phone || '');
      
      setprofilePhotoPreview(currentUser.imageUrl || null);
      console.log("ProfileModal - currentUser.imageUrl en useEffect:", currentUser.imageUrl);
    }
  }, [currentUser]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const fileUrl = URL.createObjectURL(file);
      setprofilePhotoPreview(fileUrl);
      setMessage('');
      console.log("ProfileModal - Archivo seleccionado:", file);
      console.log("ProfileModal - Previsualización URL:", fileUrl);
    }
  };
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage('');
    setUploading(true);

    const formData = new FormData();
    formData.append('name', userName);
    formData.append('last_name', userLastName)
    //formData.append('email', userEmail);
    formData.append('phone', userPhone); 

    if (selectedFile) {
      formData.append('photo', selectedFile);
      console.log("ProfileModal - FormData: Adjuntando archivo 'photo'");
    }else if(profilePhotoPreview === null && currentUser.imageUrl){
      formData.append('imageUrl', '');
      console.log("ProfileModal - FormData: Solicitando eliminación de imagen existente");
    }

    // === CONSOLE.LOG PARA VER EL CONTENIDO DE FormData ===
    // Nota: FormData no se puede loggear directamente como un objeto normal.
    // Debes iterar sobre él.
    console.log("ProfileModal - Contenido de FormData antes de enviar:");
    for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
    }
    // ==============================================================

    try {
      const data = await apiService.updateMyProfile(formData);

      console.log("ProfileModal - Respuesta exitosa del backend:", data);
      
        setMessage(data.message || 'Perfil actualizado exitosamente.');
        setCurrentUser(data.data);
        setprofilePhotoPreview(data.data.imageUrl || null);
        // onClose();
        console.log("ProfileModal - currentUser actualizado en contexto:", data.data);
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
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full relative border border-gray-700">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        <h2 className="text-3xl font-bold mb-6 text-white text-center">Mi Perfil</h2>

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 flex items-center justify-center bg-gray-700">
              {profilePhotoPreview ? (
                <img src={profilePhotoPreview} alt="Foto de perfil" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-16 h-16 text-gray-400" />
              )}
            </div>
            <label htmlFor="photo-upload" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
              <UploadCloud size={20} />
              {file ? 'Cambiar Foto' : 'Subir Foto'}
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          <div>
            <label htmlFor="name" className="block text-gray-300 text-sm font-bold mb-2">Nombre</label>
            <input
              type="text"
              id="name"
              className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-gray-300 text-sm font-bold mb-2">Apellido</label>
            <input
              type="text"
              id="last_name"
              className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={userLastName}
              onChange={(e) => setUserLastName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-gray-300 text-sm font-bold mb-2">Teléfono</label>
            <input
              type="tel" // Tipo 'tel' es semántico para teléfonos
              id="phone"
              className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-300 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-gray-700 text-gray-400 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={userEmail}
              readOnly
            />
          </div>

          {message && (
            <p className={`text-center text-sm ${message.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
              {message}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={uploading}
          >
            {uploading ? 'Guardando...' : <><Save size={20} /> Guardar Cambios</>}
          </button>

          <div className="text-center mt-4">
            <NavLink
              to="/dashboard/change-password"
              className="text-blue-400 hover:text-blue-300 text-sm font-semibold"
              onClick={onClose} // Cierra el modal al navegar
            >
              ¿Cambiar contraseña?
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;