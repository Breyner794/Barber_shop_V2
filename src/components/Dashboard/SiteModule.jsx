import React, { useState, useEffect, useMemo } from "react";
import { Plus, Clock, MapPin, Phone, Edit, Trash2, Search, Check, X, LoaderCircle, AlertTriangle} from "lucide-react";
import apiService from "../../api/services.js";
import { useAuth } from "../../context/AuthContext.jsx";
import SiteForm from "./siteForm.jsx";
import Swal from "sweetalert2";

const SitesModule = () => {
  // --- LÓGICA DEL COMPONENTE ---
  // const { sites } = mockData;
  const {currentUser} = useAuth();
  const [sites, setSites] = useState([]);
  const [isLoading, setIsLoading]= useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(null);
  const [siteToEdit, setSiteToEdit] = useState(null);

  const hasPermission = currentUser?.role === 'admin' || currentUser?.role === 'superadmin';

  const fecthSites = async () => {
    setIsLoading(true);
    setError(null);
    console.log("fetchSites: Iniciando...");
    try{
      const response  = await apiService.getSiteDashboard();
      const data = response.data || [];
      setSites(data);
    }catch (err){
      console.error('No se pudieron obtener las sedes. Inténtalo de nuevo.', err);
      setError('No se pudieron obtener las sedes. Inténtalo de nuevo.')
    }finally{
      setIsLoading(false);
    }
  }

  useEffect(()=>{
    fecthSites()
  }, []);

  const handleSiteCreated = (createdSite) => { 
    try {
      setSites(prevSites => [...prevSites, createdSite]);
      console.log('Sede creada exitosamente:', createdSite);
      Swal.fire({
                  icon: "success",
                  title: "¡Usuario actualizado (Admin)!",
                  text: "Los detalles del usuario se han actualizado parcialmente.",
                  confirmButtonColor: "#4016f9ff",
                  customClass: {
                    popup: "swal2-dark-mode",
                    title: "text-white",
                    htmlContainer: "text-gray-300",
                  },
                  background: "#1F2937",
                  color: "#E5E7EB",
                });
      setIsFormOpen(false);
      setSiteToEdit(null);
    } catch (err) {
      console.error('Error al procesar la sede creada en el UI:', err);
      setError(err.message || 'Error al actualizar la lista de sedes');
    }
};

  const handleSiteUpdated = async(updatedSite) =>{
    try{
      setSites(prevSites =>
        prevSites.map(site => (site._id === updatedSite._id ? updatedSite : site))
      );
      console.log('Sede actualizada exitosamente:', updatedSite);
      Swal.fire({
                  icon: "success",
                  title: "¡Usuario actualizado (Admin)!",
                  text: "Los detalles del usuario se han actualizado parcialmente.",
                  confirmButtonColor: "#4016f9ff",
                  customClass: {
                    popup: "swal2-dark-mode",
                    title: "text-white",
                    htmlContainer: "text-gray-300",
                  },
                  background: "#1F2937",
                  color: "#E5E7EB",
                });
      setIsFormOpen(false)
      setSiteToEdit(null);
    }catch (err){
      console.error('Error al procesar la sede actualizada en el UI:', err);
      setError(err.message || 'Error al actualizar la lista de sedes después de editar');
    }
  }

  const handleEditSite = (site) => {
    setSiteToEdit(site); 
    setIsFormOpen(true); 
  };

  const handleOpenCreateForm = () => {
    setSiteToEdit(null); 
    setIsFormOpen(true); 
  };

  const handleDeleteSite = async (siteId) => {
    if (!hasPermission) {
      setError("No tienes permisos para eliminar sedes");
      return;
    }

    const confirmMessage = `¿Estás seguro de que deseas eliminar la sede de forma permanente? Esta acción no se puede deshacer.`;

    const confirmDelete = await Swal.fire({
      title: "Confirmar eliminación",
      text: confirmMessage,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626", // Rojo para confirmar eliminación
      cancelButtonColor: "#6b7280", // Gris para cancelar
      confirmButtonText: "Si, eliminalo!",
      cancelButtonText: "Cancelar",
      reverseButtons: true, 
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
    if (confirmDelete.isConfirmed) {
      setIsDeleteLoading(siteId);
      try {
        await apiService.deleteSite(siteId);

        setSites((prevSites) =>
          prevSites.filter((site) => site._id !== siteId)
        );

        console.log("Sede eliminada exitosamente");
      } catch (error) {
        console.error("Error al eliminar la sede:", error);
        setError(error.message || "Error al eliminar la sede");
      } finally {
        setIsDeleteLoading(null);
      }
    }
  };

  const filteredSites = useMemo(() => {
    if(!Array.isArray(sites)) return [];

    if(!searchTerm.trim()) return sites;

    const searchTermLower = searchTerm.toLocaleLowerCase();

    return sites.filter((site) => {
      if(!site) return false;

      const name_site = site.name_site || "";
      const address = site.address_site || "";
      const searchText = `${name_site} ${address}`.toLocaleLowerCase()

      return searchText.includes(searchTermLower);
    })
  },[sites, searchTerm]);

  if (isLoading) {
    return (
      <div className="bg-gray-900 min-h-screen flex justify-center items-center">
        <LoaderCircle className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="ml-4 text-white text-xl">Cargando Sedes...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-tr from-black to-blue-700/30  min-h-full p-4 sm:p-6">
      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* --- CABECERA --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <h2 className="text-3xl md:text-4xl font-black text-white text-center sm:text-left">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
            Gestionar Sedes
          </span>
        </h2>
        
        {/* Botón New Branch - Solo visible para admin/superadmin */}
        {hasPermission ? (
          <button
            onClick={handleOpenCreateForm}
            className="w-full sm:w-auto py-3 px-6 text-base font-bold rounded-lg transition-all duration-300 transform 
                       bg-gradient-to-r from-purple-500 to-indigo-600 text-white
                       hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nueva Sede
          </button>
        ) : (
          <div
            className="w-full sm:w-auto py-3 px-6 text-base font-bold rounded-lg 
                         bg-gray-700 text-gray-400 cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nueva Sede
          </div>
        )}
      </div>

      {/* Mensaje de permisos para barberos */}
      {!hasPermission && (
        <div className="mb-6 bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 p-4 rounded-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Solo puedes visualizar las sedes. Los permisos de creación, edición y
          eliminación están restringidos a los que no sean administradores.
        </div>
      )}

      {/* --- BARRA DE BÚSQUEDA --- */}
      <div className="mb-8 max-w-md">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre de la sede o dirección..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 text-white pl-12 pr-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* --- GRID DE TARJETAS DE SEDES (RESPONSIVO) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSites.map((site) => (
          <div
            key={site._id}
            className="bg-gray-800/50 border-2 border-gray-700 rounded-2xl shadow-lg flex flex-col transition-all duration-300 hover:border-indigo-500/50 hover:scale-[1.02]"
          >
            {/* --- Cabecera de la Tarjeta --- */}
            <div className="p-5 flex justify-between items-start border-b border-gray-700">
              <div>
                <p className="font-bold text-xl text-white">{site.name_site}</p>
              </div>
              <span
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border
                ${
                  site.isActive
                    ? "bg-green-500/10 text-green-300 border-green-500/20"
                    : "bg-red-500/10 text-red-400 border-red-500/20"
                }`}
              >
                {site.isActive ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <X className="w-4 h-4" />
                )}
                {site.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            {/* --- Cuerpo de la Tarjeta (Detalles de Contacto) --- */}
            <div className="p-5 space-y-4 flex-grow">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Dirección</p>
                  <p className="font-medium text-white">{site.address_site}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Número de celular</p>
                  <p className="font-medium text-white">{site.phone_site}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Horarios</p>
                  <p className="font-medium text-white">
                    {site.headquarter_time}
                  </p>
                </div>
              </div>
            </div>
            
            {/* --- Pie de la Tarjeta (Acciones) --- */}
            <div className="p-3 bg-gray-900/50 border-t border-gray-700 flex justify-end gap-2">
              {hasPermission ? (
                <>
                  <button 
                    className="flex-1 bg-gray-700/50 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2 transition-colors"
                    onClick={() => {
                      handleEditSite(site);
                      console.log("Editar sede:", site._id);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </button>
                  <button 
                    className="p-3 text-red-500 bg-gray-700/50 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors disabled:opacity-50"
                    onClick={() => handleDeleteSite(site._id)}
                    disabled={isDeleteLoading === site._id}
                  >
                    {isDeleteLoading === site._id ? (
                      <LoaderCircle className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </>
              ) : (
                <div className="flex-1 bg-gray-700/30 text-gray-500 px-4 py-2 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed">
                  <Edit className="w-4 h-4" />
                  Solo visualización
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* --- Mensaje por si no hay resultados --- */}
      {filteredSites.length === 0 && !isLoading && (
        <div className="text-center py-20 col-span-full">
          <div className="bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-3xl p-12 max-w-lg mx-auto">
            {/* Icono principal */}
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-full flex items-center justify-center border border-purple-500/30">
                <MapPin className="w-10 h-10 text-purple-400" />
              </div>
            </div>
            
            {/* Título y descripción */}
            <h3 className="text-2xl font-bold text-white mb-3">
              {searchTerm ? 'No hay sucursales que coincidan con tu búsqueda' : 'Aún no hay sucursales'}
            </h3>
            
            <p className="text-gray-400 mb-6 leading-relaxed">
              {searchTerm 
                ? `No pudimos encontrar ninguna sucursal que coincida "${searchTerm}". Pruebe diferentes palabras clave o compruebe la ortografía.`
                : hasPermission 
                  ? 'Comience a construir su red creando su primera sucursal.'
                  : 'Aún no se han creado sucursales. Contacta con un administrador para agregar nuevas ubicaciones.'
              }
            </p>

            {/* Acciones sugeridas */}
            <div className="space-y-3">
              {searchTerm ? (
                <button
                  onClick={() => setSearchTerm('')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Borrar búsqueda
                </button>
              ) : hasPermission ? (
                <button
                  onClick={handleOpenCreateForm}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:scale-105 transition-all duration-300 font-medium shadow-lg hover:shadow-purple-500/25"
                >
                  <Plus className="w-5 h-5" />
                  Crea tu primera sucursal
                </button>
              ) : null}
            </div>

            {/* Elementos decorativos */}
            <div className="mt-8 flex justify-center gap-4 opacity-30">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
          </div>
        </div>
      )}

      {/* --- FORMULARIO MODAL --- */}
      <SiteForm 
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSiteToEdit(null);
        }}
        onSiteCreated={handleSiteCreated}
        currentUser={currentUser}
        onSiteUpdated={handleSiteUpdated}
        siteToEdit={siteToEdit}
      />
    </div>
  );
};

export default SitesModule;