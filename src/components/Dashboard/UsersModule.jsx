import React, { useState, useEffect, useMemo } from "react";
import { format, parseISO, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import {
  Plus,
  Trash2,
  Edit,
  Search,
  ShieldCheck,
  MapPin,
  LogIn,
  Activity,
  LoaderCircle,
  RefreshCw,
  ShieldOff,
  Home,
  User
} from "lucide-react";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext.jsx";
import apiService from "../../api/services.js";
import UserFormModal from "./UserFormModal.jsx";

const UsersModule = () => {
  // --- LÓGICA DEL COMPONENTE ---
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorType, setErrorType] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const isSuperAdmin = currentUser?.role === "superadmin";
  const isAdmin = currentUser?.role === "admin" || isSuperAdmin;

  // --- Función para cargar usuarios desde la API ---
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    console.log("fetchUsers: Iniciando...");
    try {
      const response = await apiService.getAllUsers();
      const usersData = response?.data || [];
      setUsers(usersData);
    } catch (err) {
      console.error("fetchUsers: Error:", err);
      if (err.response?.status === 403) {
        console.log('error 403')
        setError("No tienes los permisos necesarios para acceder a esta información.");
        setErrorType("permission");
      } else if (err.response?.status === 401) {
        setError("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
        setErrorType("auth");
      } else {
        setError("No se pudieron obtener los usuarios. Inténtalo de nuevo.");
        setErrorType("api");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUser) {
      setIsLoading(false);
      setError("Debes iniciar sesión para ver esta página.");
      setErrorType("auth");
      return;
    }
    // Si el usuario no es admin
    if (!isAdmin) {
      setIsLoading(false);
      setError("No tienes los permisos necesarios para ver esta página.");
      setErrorType("permission");
      return;
    }
    // Si es admin, cargar usuarios
    fetchUsers();
  }, [currentUser, isAdmin]);

  // --- Filtrado (Tu código useMemo existente) ---
  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];

    if (!searchTerm.trim()) return users;

    const searchTermLower = searchTerm.toLowerCase();

    return users.filter((user) => {
      if (!user) return false;

      const firstName = user.name || "";
      const lastName = user.last_name || "";
      const role = user.role || "";
      const email = user.email || "";

      const searchText =
        `${firstName} ${lastName} ${role} ${email}`.toLowerCase();

      return searchText.includes(searchTermLower);
    });
  }, [users, searchTerm]);

  const handleNewUserClick = () => {
    setIsCreatingUser(true);
    setSelectedUser(null);
    setIsFormModalOpen(true);
  };

  const handleEditClick = (user) => {
    setIsCreatingUser(false);
    setSelectedUser(user);
    setIsFormModalOpen(true);
  };

  const handleFormModalClose = () => {
    setIsFormModalOpen(false);
    setSelectedUser(null);
    setIsCreatingUser(false);
  };

  const handleRetry = () => { 
    fetchUsers(); 
};

  const handleGoHome = () => {
    window.location.href = "/dashboard"; 
};

const handleLogin = () => {
    window.location.href = "/login"
  };

  const Avatar = ({ src, alt, size = 14 }) => {
  const [imageError, setImageError] = useState(false);
  
  if (!src || imageError) {
    return (
      <div className={`h-${size} w-${size} rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center`}>
        <User className={`w-${size - 6} h-${size - 6} text-gray-400`} />
      </div>
    );
  }
  
  return (
    <img
      className={`h-${size} w-${size} rounded-full object-cover border-2 border-gray-600`}
      src={src}
      alt={alt || ""}
      onError={() => setImageError(true)}
    />
  );
};

  const handleSaveUser = async (formData) => {
    if (!currentUser) {
      Swal.fire({
        icon: "error",
        title: "Error de autenticación",
        text: "Usuario no autenticado para esta acción.",
        confirmButtonColor: "#f97316",
      });
      return;
    }

    try {
      if (isCreatingUser) {
        // Crear usuario
        await apiService.createUser(formData);
        Swal.fire({
          icon: "success",
          title: "Usuario creado!",
          text: "El nuevo usuario ha sido creado exitosamente.",
          confirmButtonColor: "#f97316",
          customClass: {
            popup: "swal2-dark-mode",
            title: "text-white",
            htmlContainer: "text-gray-300",
          },
          background: "#1F2937",
          color: "#E5E7EB",
        });
      } else if (selectedUser) {
        // Actualizar usuario
        if (isSuperAdmin) {
          await apiService.superUpdateUser(selectedUser._id, formData);
          Swal.fire({
            icon: "success",
            title: "¡Usuario actualizado (Superadministrador)!",
            text: "Los detalles del usuario se han actualizado completamente.",
            confirmButtonColor: "#f97316",
            customClass: {
              popup: "swal2-dark-mode",
              title: "text-white",
              htmlContainer: "text-gray-300",
            },
            background: "#1F2937",
            color: "#E5E7EB",
          });
        } else if (isAdmin) {
          // Filtrar campos permitidos (revisar que imageUrl y site_barber estén incluidos aquí)
          await apiService.updateUser(selectedUser._id, formData);
          Swal.fire({
            icon: "success",
            title: "¡Usuario actualizado (Admin)!",
            text: "Los detalles del usuario se han actualizado parcialmente.",
            confirmButtonColor: "#f97316",
            customClass: {
              popup: "swal2-dark-mode",
              title: "text-white",
              htmlContainer: "text-gray-300",
            },
            background: "#1F2937",
            color: "#E5E7EB",
          });
        }
      }

      // Después de una operación exitosa, recarga la lista de usuarios
      await fetchUsers();
      handleFormModalClose();
    } catch (err) {
      console.error(
        "Guardar error de usuario:",
        err.response?.data || err.message
      );
      Swal.fire({
        icon: "error",
        title: "Error al guardar el usuario",
        text: `No se pudo guardar el usuario: ${
          err.response?.data?.message || err.message
        }`,
        confirmButtonColor: "#f97316",
        customClass: {
          popup: "swal2-dark-mode",
          title: "text-white",
          htmlContainer: "text-gray-300",
        },
        background: "#1F2937",
        color: "#E5E7EB",
      });
    }
  };

  const handleDeleteClick = async (user, hardDelete = false) => {
    if (!currentUser) {
      Swal.fire({
        icon: "error",
        title: "Error de autenticación",
        text: "Usuario no autenticado para esta acción.",
        confirmButtonColor: "#f97316",
      });
      return;
    }

    const confirmMessage = hardDelete
      ? `¿Estás seguro de que deseas eliminar el usuario de forma permanente "${user.name_barber} ${user.last_name_barber}"? Esta acción no se puede deshacer.`
      : `¿Estás seguro que deseas eliminar el usuario "${user.name_barber} ${user.last_name_barber}"? Esta acción marcará al usuario como inactivo.`;

    const confirmResult = await Swal.fire({
      title: "Confirmar eliminación",
      text: confirmMessage,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626", // Rojo para confirmar eliminación
      cancelButtonColor: "#6b7280", // Gris para cancelar
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true, // Pone el botón de confirmar a la derecha
      customClass: {
        popup: "swal2-dark-mode",
        title: "text-white",
        htmlContainer: "text-gray-300",
        confirmButton: "hover:bg-red-700",
        cancelButton: "hover:bg-gray-700",
      },
      background: "#1F2937",
      color: "#E5E7EB",
    });

    if (confirmResult.isConfirmed) {
      try {
        if (hardDelete) {
          await apiService.hardDeleteUser(user._id);
          Swal.fire({
            icon: "success",
            title: "¡Usuario eliminado definitivamente!",
            text: "El usuario ha sido eliminado de forma permanente.",
            confirmButtonColor: "#f97316",
            customClass: {
              popup: "swal2-dark-mode",
              title: "text-white",
              htmlContainer: "text-gray-300",
            },
            background: "#1F2937",
            color: "#E5E7EB",
          });
        } else {
          await apiService.deleteEasyUser(user._id);
          Swal.fire({
            icon: "success",
            title: "¡Usuario eliminado temporalmente!",
            text: "El usuario ha sido marcado como inactivo.",
            confirmButtonColor: "#f97316",
            customClass: {
              popup: "swal2-dark-mode",
              title: "text-white",
              htmlContainer: "text-gray-300",
            },
            background: "#1F2937",
            color: "#E5E7EB",
          });
        }
        // Recarga la lista de usuarios después de la eliminación
        await fetchUsers();
      } catch (err) {
        console.error(
          "Error al eliminar usuario:",
          err.response?.data || err.message
        );
        Swal.fire({
          icon: "error",
          title: "Error al eliminar usuario",
          text: `No se pudo eliminar el usuario: ${
            err.response?.data?.message || err.message
          }`,
          confirmButtonColor: "#f97316",
          customClass: {
            popup: "swal2-dark-mode",
            title: "text-white",
            htmlContainer: "text-gray-300",
          },
          background: "#1F2937",
          color: "#E5E7EB",
        });
      }
    }
  };

  // --- Renderizado Condicional del Contenido ---
  if (isLoading) {
    return (
      <div className="bg-gradient-to-tr from-black to-blue-700/30 min-h-screen flex justify-center items-center">
        <LoaderCircle className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="ml-4 text-white text-xl">Cargando usuarios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-tr from-black to-blue-700/30 min-h-screen flex justify-center items-center p-6">
        <div className="bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center border border-red-700/30">
          
          {/* Ícono dinámico basado en el tipo de error */}
          <div className="text-red-500 mb-6 flex justify-center">
            {errorType === "permission" && <ShieldOff className="w-16 h-16 md:w-20 md:h-20" />}
            {errorType === "auth" && <LogIn className="w-16 h-16 md:w-20 md:h-20" />}
            {errorType === "api" && <Activity className="w-16 h-16 md:w-20 md:h-20" />}
          </div>

          {/* Título dinámico */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            {errorType === "permission" && "Acceso Denegado"}
            {errorType === "auth" && "Sesión Requerida"}
            {errorType === "api" && "Error de Conexión"}
          </h1>

          {/* Mensaje de Error */}
          <p className="text-gray-400 text-base md:text-lg mb-8">
            {error}
          </p>

          {/* Botones de Acción dinámicos */}
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            
            {/* Para errores de permisos */}
            {errorType === "permission" && (
              <button
                onClick={handleGoHome}
                className="w-full md:w-auto px-8 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold transition-transform transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Ir al Panel de Control
              </button>
            )}

            {/* Para errores de autenticación */}
            {errorType === "auth" && (
              <button
                onClick={handleLogin}
                className="w-full md:w-auto px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-transform transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                Iniciar Sesión
              </button>
            )}

            {/* Para errores de API */}
            {errorType === "api" && (
              <button
                onClick={handleRetry}
                className="w-full md:w-auto px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-transform transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Reintentar
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- Estructura del Componente ---
  return (
    <div className="bg-gradient-to-tr from-black to-blue-700/30 min-h-full p-4 sm:p-6">
      {/* --- CABECERA --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <h2 className="text-3xl md:text-4xl font-black text-white text-center sm:text-left">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
            Administrar usuarios
          </span>
        </h2>
        {isAdmin && ( // Solo Admin/Superadmin pueden crear usuarios
          <button
            onClick={handleNewUserClick}
            className="w-full sm:w-auto py-3 px-6 text-base font-bold rounded-lg transition-all duration-300 transform
                                      bg-gradient-to-r from-orange-500 to-amber-600 text-white
                                      hover:scale-105 hover:shadow-lg hover:shadow-amber-500/30 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nuevo Usuario
          </button>
        )}
      </div>

      {/* --- BARRA DE BÚSQUEDA --- */}
      <div className="mb-8 max-w-md">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o rol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800/90 text-white pl-12 pr-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
      </div>

      {/* --- GRID DE TARJETAS DE USUARIO (RESPONSIVO) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="bg-gray-800/50 border-2 border-gray-700 rounded-2xl shadow-lg flex flex-col transition-all duration-300 hover:border-amber-500/50 hover:scale-[1.02]"
          >
            {/* --- Cabecera de la Tarjeta --- */}
            <div className="p-5 flex items-center justify-between border-b border-gray-700">
              <div className="flex items-center gap-4">
                <Avatar
                  src={user.imageUrl}
                  alt={`${user.name} ${user.last_name}`}
                  size={14}
                />
                <div>
                  <p className="font-bold text-lg text-white">
                    {user.name} {user.last_name}
                  </p>
                  <p className="text-sm text-gray-400">ID: {user._id}</p>
                </div>
              </div>
              {/* --- Botones de acción en la cabecera (condicionales) --- */}
              <div className="flex gap-1">
                {isAdmin && ( // Solo Admin/Superadmin pueden editar
                  <button
                    onClick={() => handleEditClick(user)}
                    className="p-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                )}
                {isAdmin && ( // Solo Admin/Superadmin pueden eliminar
                  <button
                    onClick={() => handleDeleteClick(user, isSuperAdmin)} // Pasa isSuperAdmin para diferenciar
                    className="p-2 rounded-md text-red-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* --- Cuerpo de la Tarjeta (Detalles) --- */}
            <div className="p-5 space-y-4 flex-grow">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <p className="text-sm text-gray-400">Role:</p>
                <span className="font-medium capitalize px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20">
                  {user.role}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <p className="text-sm text-gray-400">Sede:</p>
                <p className="font-medium text-white">
                  {user.site_barber?.name_site || "Not Assigned"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <p className="text-sm text-gray-400">Estado:</p>
                <span
                  className={`font-medium capitalize px-2 py-0.5 text-xs rounded-full border
                                        ${
                                          user.isActive
                                            ? "bg-green-500/10 text-green-300 border-green-500/20"
                                            : "bg-red-500/10 text-red-400 border-red-500/20"
                                        }`}
                >
                  {user.isActive ? "Activo" : "Inactivo"}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <LogIn className="w-5 h-5 text-amber-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">
                    Último inicio de sesión
                  </p>
                  {user.last_login ? (
                    <>
                      <p className="font-medium text-white">
                        {format(
                          parseISO(user.last_login),
                          "MMMM d, yyyy - hh:mm a"
                        )}
                      </p>
                      <p className="text-xs text-gray-500">
                        (
                        {formatDistanceToNow(parseISO(user.last_login), {
                          addSuffix: true,
                          locale: es,
                        })}
                        )
                      </p>
                    </>
                  ) : (
                    <p className="font-medium text-gray-500 italic">Nunca</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- Mensaje por si no hay resultados --- */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-16 col-span-full">
          <p className="text-xl font-semibold text-gray-300">
            No se encontraron usuarios.
          </p>
          <p className="text-gray-500 mt-2">
            Intenta ajustar tus términos de búsqueda.
          </p>
        </div>
      )}

      {/* --- Modal de Formulario (Edición/Creación) --- */}
      <UserFormModal
        isOpen={isFormModalOpen}
        onClose={handleFormModalClose}
        user={selectedUser}
        onSave={handleSaveUser}
        isSuperAdmin={isSuperAdmin}
        isCreating={isCreatingUser}
      />
    </div>
  );
};

export default UsersModule;
