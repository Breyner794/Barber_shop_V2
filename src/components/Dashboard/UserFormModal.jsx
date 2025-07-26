import React, { useState, useEffect } from "react";
import apiService from "../../api/services"; // Asegúrate de que la ruta sea correcta
import Swal from "sweetalert2";
import { X, UploadCloud, Save, User as UserIcon, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const UserFormModal = ({
  isOpen,
  onClose,
  user,
  onSave,
  isSuperAdmin,
  isCreating,
}) => {
  // 1. Estado del formulario (para campos de texto y booleanos)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    last_name: user?.last_name || "",
    phone: user?.phone || "",
    isActive: user?.isActive !== undefined ? user.isActive : true,
    site_barber: user?.site_barber || "",
    email: user?.email || "",
    password: "",
    role: user?.role || "admin",
  });

  const [hasChanges, setHasChanges] = useState(false);

  const [errors, setErrors] = useState({});

  const { currentUser } = useAuth();

  const isEditingSelf = !isCreating && user?._id === currentUser?._id;
  // 2. Estados para la lista de sedes y manejo de IMÁGENES
  const [sitesList, setSitesList] = useState([]);
  const [uploadError, setUploadError] = useState(null);
  // Nuevo: Estado para el archivo real seleccionado (objeto File)
  const [selectedFile, setSelectedFile] = useState(null);
  // Nuevo: Estado para la URL de previsualización (Cloudinary URL o blob URL local)
  const [imagePreview, setImagePreview] = useState(user?.imageUrl || null);
  // Estado para la carga (aunque la carga ocurrirá en onSave, es útil para el feedback)
  const [isSaving, setIsSaving] = useState(false);

  const availableRoles = [
    { value: "barbero", label: "Barbero" },
    { value: "admin", label: "Admin" },
  ];

  const validatePhone = (phone) => {
    // Expresión regular para 10 dígitos
    const phoneRegex = /^\d{10}$/;
    if (!phone || !phoneRegex.test(phone)) {
      return "El número de teléfono debe tener exactamente 10 dígitos.";
    }
    return null; // El número es válido
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || email.trim() === "") {
      return "El email es requerido.";
    }
    if (!emailRegex.test(email)) {
      return "Por favor, introduce un email válido.";
    }
    return null;
  };

  const validatePassword = (password) => {
    // La contraseña solo es requerida al crear un usuario, o si se modifica en edición.
    if (isCreating && (!password || password.trim() === "")) {
      return "La contraseña es requerida.";
    }
    return null;
  };

  // Si es superadmin, añade la opción 'superadmin' al array
  if (isSuperAdmin) {
    availableRoles.push({ value: "superadmin", label: "Superadmin" });
  }

  // 3. Efecto para cargar la lista de sedes (Correcto)
  useEffect(() => {
    const loadSites = async () => {
      try {
        const response = await apiService.getAllSite();
        const data = response.data || [];
        setSitesList(data);
      } catch (error) {
        console.error("Error loading sites:", error);
      }
    };

    if (isOpen) {
      loadSites();
    }
  }, [isOpen]);

  // 4. Efecto para resetear el formulario y la imagen al abrir/cambiar usuario
  useEffect(() => {
    if (user) {
      // Inicializar formData con los datos del usuario existente
      setFormData({
        name: user.name || "",
        last_name: user.last_name || "",
        phone: user.phone || "",
        isActive: user.isActive !== undefined ? user.isActive : true,
        site_barber: user.site_barber || "",
        email: user.email || "",
        role: user.role || "admin",
        password: "", // Siempre reseteamos la contraseña en edición
      });
      // Inicializar la previsualización de la imagen y el archivo
      setImagePreview(user.imageUrl || null);
      setSelectedFile(null);
    } else {
      // Inicializar formData para creación de nuevo usuario
      setFormData({
        name: "",
        last_name: "",
        phone: "",
        isActive: true,
        site_barber: "",
        email: "",
        password: "",
        role: "admin",
      });
      setImagePreview(null);
      setSelectedFile(null);
    }
    setUploadError(null);
    setIsSaving(false);
    setHasChanges(false);
    setErrors({});
  }, [user, isOpen]);

  // 5. Manejador de cambios generales
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    if (!isCreating && !hasChanges) {
      setHasChanges(true);
    }

    // Validar en tiempo real y actualizar errores
    if (name === "phone") {
      const error = validatePhone(newValue);
      setErrors((prev) => ({ ...prev, phone: error }));
    } else if (name === "email") {
      const error = validateEmail(newValue);
      setErrors((prev) => ({ ...prev, email: error }));
    } else if (name === "password") {
      // Validar password solo si estamos creando o si el usuario está escribiendo algo
      const error = validatePassword(newValue);
      setErrors((prev) => ({ ...prev, password: error }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  // 6. Manejador de cambio de archivo (Solo guarda el archivo y crea la URL de previsualización local)
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tamaño o tipo si es necesario
    // ...
    const fileUrl = URL.createObjectURL(file);

    setSelectedFile(file); // Guarda el archivo
    setImagePreview(fileUrl); // Crea la URL local para previsualizar
    setUploadError(null);
  };

  // 7. Manejador para eliminar la imagen
  const handleRemoveImage = () => {
    setSelectedFile(null); // Deselecciona el archivo local
    setImagePreview(null); // Elimina la previsualización
  };

  // 8. Manejador de envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    const phoneError = validatePhone(formData.phone);
    const emailError = isCreating ? validateEmail(formData.email) : null;
    const passwordError = isCreating
      ? validatePassword(formData.password)
      : null;

    // Combinar todos los errores
    const currentErrors = {
      phone: phoneError,
      email: emailError,
      password: passwordError,
    };

    // Limpiar errores nulos y actualizar el estado
    Object.keys(currentErrors).forEach(
      (key) => currentErrors[key] === null && delete currentErrors[key]
    );
    setErrors(currentErrors);

    // 2. Si hay errores de validación, detener el envío
    if (Object.keys(currentErrors).length > 0) {
      console.log("Errores de validación:", currentErrors);
      return;
    }

    // 3. Verificar si hay cambios en modo edición antes de enviar
    if (
      !isCreating &&
      !hasChanges &&
      !selectedFile &&
      !(imagePreview === null && user?.imageUrl)
    ) {
      console.log("No se detectaron cambios para guardar.");
      onClose();
      return;
    }

    // Creamos un nuevo FormData para enviar los datos, incluyendo el archivo
    const finalFormData = new FormData();

    // --- 1. Manejo y formateo de site_barber para evitar el error "[object Object]" ---
    let siteBarberValue = "";

    // Verificamos si formData.site_barber existe
    if (formData.site_barber) {
      // Si formData.site_barber es un objeto (ej. si la sede fue poblada desde el backend)
      if (
        typeof formData.site_barber === "object" &&
        formData.site_barber._id
      ) {
        // Extraemos el ID de la sede
        siteBarberValue = formData.site_barber._id;
      } else if (typeof formData.site_barber === "string") {
        // Si ya es una cadena (ej. el ID o una cadena vacía si no se ha seleccionado nada)
        siteBarberValue = formData.site_barber;
      }
    }

    // Añadimos site_barber formateado al FormData
    // (Si formData.site_barber era null/undefined, siteBarberValue es '', lo cual es correcto para vaciar la sede)
    finalFormData.append("site_barber", siteBarberValue);

    // Añadir campos de texto y booleanos al FormData
    Object.keys(formData).forEach((key) => {
      // Excluimos 'imageUrl' y 'password' (si está vacío en edición)
      if (key !== "imageUrl" && key !== "password" && key !== "site_barber") {
        finalFormData.append(key, formData[key]);
      }
    });

    // Añadir la contraseña si estamos creando un usuario o si se ingresó una en edición
    if (isCreating || formData.password) {
      finalFormData.append("password", formData.password);
    }

    // Manejo de la IMAGEN
    if (selectedFile) {
      // Si se seleccionó un archivo nuevo, lo adjuntamos como 'photo' (nombre esperado por Multer en el backend)
      finalFormData.append("photo", selectedFile);
      console.log("Formulario Enviado: Adjuntando archivo 'photo' para subir.");
    } else if (imagePreview === null && user?.imageUrl) {
      // Si el usuario tenía una imagen (user.imageUrl) pero la eliminó (imagePreview === null)
      // Enviamos el campo 'imageUrl' como cadena vacía para indicarle al backend que la elimine.
      finalFormData.append("imageUrl", "");
      console.log(
        "Formulario Enviado: Solicitando eliminación de imagen existente (imageUrl: '')"
      );
    }

    if (formData.role === "barbero" && !formData.site_barber) {
      // Muestra el mensaje de error usando SweetAlert2 (Swal)
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: 'Users with the "barbero" role must select a Site/Branch.',
        confirmButtonColor: "#f97316",
        customClass: {
          popup: "swal2-dark-mode",
          title: "text-white",
          htmlContainer: "text-gray-300",
        },
        background: "#1F2937",
        color: "#E5E7EB",
      });
      return;
    }

    console.log("Informacion que se iba a enviar era la siguiente: ", formData);

    setIsSaving(true);
    onSave(finalFormData).finally(() => {
      setIsSaving(false);
    });
  };

  const isPhoneValid = validatePhone(formData.phone) === null;

  const isFormValid =
    isPhoneValid &&
    (!isCreating ||
      (validateEmail(formData.email) === null &&
        validatePassword(formData.password) === null));

  // Determinar si el formulario se puede guardar (Save)
  const canSave = isFormValid && (isCreating || hasChanges);

  // El botón debe estar deshabilitado si no se puede guardar O si ya está guardando
  const isButtonDisabled = !canSave || isSaving;

  if (!isOpen) return null;

  // 9. JSX del Formulario (Actualizado para usar imagePreview, selectedFile, etc.)
  return (
    <div className="w-full fixed inset-0 bg-black/30 backdrop-blur flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 p-4 rounded-lg shadow-xl w-full max-w-md border border-gray-700 overflow-y-auto max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-700 flex-shrink-0">
          <h3 className="text-2xl md:text-3xl font-bold text-white">
            {isCreating
              ? "Crear nuevo usuario"
              : `Editar usuario: ${user?.name} ${user?.last_name}`}
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campos de texto básicos */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300"
            >
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm p-2 text-white focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          <div>
            <label
              htmlFor="last_name"
              className="block text-sm font-medium text-gray-300"
            >
              Apellido
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm p-2 text-white focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-400"
            >
              Teléfono
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-gray-700 border-gray-600 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              placeholder="Ej: 3001234567"
              inputMode="numeric"
            />
            {/* Mostrar mensaje de error si existe */}
            {errors.phone && (
              <p className="mt-2 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* --- CAMPO DE IMAGEN (CLOUDINARY UPLOAD) --- */}
          <div className="flex flex-col items-center gap-4">
            {/* Previsualización */}
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500 flex items-center justify-center bg-gray-700">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-12 h-12 text-gray-400" />
              )}
            </div>

            {/* Input de archivo y botones */}
            <div className="flex gap-2">
              <label
                htmlFor="image-upload"
                className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
              >
                <UploadCloud size={20} />
                {selectedFile ? "Cambiar" : "Subir"}
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange} // Usamos handleFileChange
                  disabled={isSaving}
                />
              </label>
              {imagePreview && (
                <button
                  type="button"
                  onClick={handleRemoveImage} // Usamos handleRemoveImage
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Trash2 size={20} />
                  Eliminar
                </button>
              )}
            </div>
            {uploadError && (
              <p className="text-red-500 text-sm">{uploadError}</p>
            )}
          </div>

          {/* --- CAMPO DE SEDE (SELECTOR) --- */}
          {formData.role === "barbero" && (
            <div>
              <label
                htmlFor="site_barber"
                className="block text-sm font-medium text-gray-300"
              >
                Sede del Barbero
              </label>
              <select
                id="site_barber"
                name="site_barber"
                value={formData.site_barber}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm p-2 text-white focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="">Seleccione un sede</option>
                {sitesList.length > 0 ? (
                  sitesList.map((site) => (
                    <option key={site._id} value={site._id}>
                      {site.name_site}
                    </option>
                  ))
                ) : (
                  <option disabled>
                    Cargando sitios o no hay sitios disponibles...
                  </option>
                )}
              </select>
            </div>
          )}

          {/* Checkbox de activo */}
          <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                 Estado del Usuario
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
                    disabled={isEditingSelf}
                  />
                  <div
                    className={`block w-14 h-8 rounded-full ${
                      formData.isActive ? "bg-amber-600" : "bg-gray-600"
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

          {/* Mensaje de advertencia para evitar la auto-desactivación (Estilo Tailwind) */}
          {isEditingSelf && (
            <div className="mt-3 p-3 text-sm text-red-100 bg-red-800 border border-red-900 rounded shadow-md">
              ⚠️ No puedes deshabilitar tu propia cuenta.
            </div>
          )}

          {/* Campos solo para SuperAdmin o Creación */}
          {(isSuperAdmin || isCreating) && (
            <>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300"
                >
                  Correo Electronico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm p-2 text-white focus:ring-amber-500 focus:border-amber-500"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-500">{errors.email}</p>
                )}
              </div>
              {(isSuperAdmin || isCreating) && (
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Contraseña
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm p-2 text-white focus:ring-amber-500 focus:border-amber-500"
                  />
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.password}
                    </p>
                  )}
                </div>
              )}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-300"
                >
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md cursor-pointer shadow-sm p-2 text-white focus:ring-amber-500 focus:border-amber-500"
                >
                  {availableRoles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="submit"
              className={`px-4 py-2 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 
                                ${
                                  isButtonDisabled
                                    ? "bg-gray-500 cursor-not-allowed" // Estilos si está deshabilitado
                                    : "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500"
                                }`} // Estilos si está habilitado
              disabled={isButtonDisabled}
            >
              {isSaving
                ? "Guardando..."
                : isCreating
                ? "Crear Nuevo Usuario"
                : "Guardar Cambios"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-300 rounded-md shadow-md cursor-pointer hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default UserFormModal;
