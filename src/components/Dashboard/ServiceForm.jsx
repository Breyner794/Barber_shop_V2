import React, { useState, useEffect } from "react";
import {
  X,
  UploadCloud,
  LoaderCircle,
  Image as ImageIcon,
  AlertTriangle,
} from "lucide-react";

// Este es un componente reutilizable para los campos del formulario
const FormInput = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = true,
}) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-300 mb-1"
    >
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
    />
  </div>
);

const ServiceForm = ({ serviceToEdit, onClose, onSave, currentUser }) => {
  const initialState = {
    name: "",
    description: "",
    price: "",
    duration: "",
    image_Url: "",
    isActive: true,
  };

  const [formData, setFormData] = useState(initialState);
  const [imageFile, setImageFile] = useState(null); // Para guardar el objeto File
  const [imagePreview, setImagePreview] = useState(""); // Para mostrar la vista previa
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const hasPermission = currentUser?.role === 'admin' || currentUser?.role === 'superadmin';

  // useEffect se ejecuta cuando 'serviceToEdit' cambia.
  // Si estamos editando, llena el formulario con los datos del servicio.
  // Si no, asegura que el formulario esté vacío (para crear uno nuevo).
  useEffect(() => {
    if (serviceToEdit) {
      setFormData({
        _id: serviceToEdit._id, // Importante para saber que estamos actualizando
        name: serviceToEdit.name || "",
        description: serviceToEdit.description || "",
        price: serviceToEdit.price || "",
        duration: serviceToEdit.duration || "",
        isActive:
          serviceToEdit.isActive !== undefined ? serviceToEdit.isActive : true,
      });
      if (serviceToEdit.image_Url) {
        setImagePreview(serviceToEdit.image_Url);
      }
    } else {
      setFormData(initialState);
      setImageFile(null);
      setImagePreview("");
    }
  }, [serviceToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

   const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Guardamos el archivo real en su estado
      setImageFile(file);
      const fileUrl = URL.createObjectURL(file);
      setImagePreview(fileUrl);
    }
  };

  const handleSubmit = async (e) => {
     e.preventDefault();

     if (!hasPermission) {
      setApiError('No tienes permisos para crear/editar sedes');
      return;
    }

    setIsSaving(true);
    setFormError('');

    const submissionData = new FormData();

    submissionData.append('name', formData.name);
    submissionData.append('description', formData.description);
    submissionData.append('price', formData.price);
    submissionData.append('duration', formData.duration);
    submissionData.append('isActive', formData.isActive);

    if (imageFile) {
        submissionData.append('image_Url', imageFile);
    }
    // else if (imagePreview) {
    //    submissionData.append('image_Url', imagePreview);
    //  }
    try {
      await onSave(submissionData, formData._id);
    } catch (error) {
      setFormError(error.message || "No se pudo guardar el servicio.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    // Contenedor del Modal (Overlay)
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      {/* Contenido del Formulario */}
      <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-700 max-h-[90vh] flex flex-col">
        {/* Cabecera del Formulario */}
        <div className="p-5 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-2xl font-bold text-white">
            {serviceToEdit ? "Edit Service" : "Create New Service"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cuerpo del Formulario con Scroll */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          {formError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-3 rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormInput
              label="Service Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Classic Haircut"
            />
            <FormInput
              label="Price ($)"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g., 25000"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormInput
              label="Duration (minutes)"
              name="duration"
              type="number"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g., 30"
            />

            {/* Toggle para el estado Activo/Inactivo */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Service Status
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
                    onChange={handleChange}
                  />
                  <div
                    className={`block w-14 h-8 rounded-full ${
                      formData.isActive ? "bg-teal-500" : "bg-gray-600"
                    }`}
                  ></div>
                  <div
                    className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                      formData.isActive ? "transform translate-x-6" : ""
                    }`}
                  ></div>
                </div>
                <div className="ml-3 text-white font-medium">
                  {formData.isActive ? "Active" : "Inactive"}
                </div>
              </label>
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Briefly describe the service..."
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
            ></textarea>
          </div>

          {/* Sección de subida de imagen */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Service Image
            </label>
            <div className="mt-2 flex items-center gap-4">
              {/* Vista previa de la imagen */}
              <div className="w-24 h-24 rounded-lg bg-gray-700 border-2 border-dashed border-gray-600 flex items-center justify-center">
                {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-md" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-500" />
                )}
              </div>

              {/* Botón para subir archivo */}
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 flex items-center gap-2"
              >
                <UploadCloud className="w-5 h-5" />
                <span>Choose Image</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </label>
            </div>
          </div>

          {/* Pie del Formulario (Acciones) */}
          <div className="pt-5 border-t border-gray-700 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="py-2 px-5 text-base font-bold rounded-lg bg-gray-600 hover:bg-gray-500 text-white transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={ isSaving }
              className="py-2 px-5 text-base font-bold rounded-lg bg-gradient-to-r from-teal-500 to-green-600 text-white hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                <LoaderCircle className="w-5 h-5 animate-spin" />
              ) : null}
              {isSaving
                ? "Saving..."
                : serviceToEdit
                ? "Save Changes"
                : "Create Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;
