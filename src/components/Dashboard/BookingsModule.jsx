import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Plus,
  Search,
  ChevronDown,
  Bell,
  History,
  LoaderCircle,
  ClipboardCheck,
  AlertTriangle, 
  RefreshCw, 
  Home,
} from "lucide-react"; // Added Mail, Hash, Walk icons
import apiService from "../../api/services.js";
import { useAuth } from "../../context/AuthContext.jsx";
import BookingForm from "./BookingForm"; // Ajusta la ruta si es necesario
import WalkinForm from "./WalkinForm.jsx";
import Swal from "sweetalert2";
import BookingCard from "./BookingCard.jsx";

// --- COMPONENTES AUXILIARES ---

const NotificationToast = ({ message, onClose }) => (
  <div className="fixed top-5 right-5 z-50 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
    <Bell className="w-5 h-5" />
    <span>{message}</span>
    <button onClick={onClose} className="ml-4 text-lg font-bold">
      ×
    </button>
  </div>
);

// --- COMPONENTE PRINCIPAL ---
const BookingsModule = () => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [barbersList, setBarbersList] = useState([]);
  const [locationsList, setLocationsList] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [previousBookingsCount, setPreviousBookingsCount] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [isWalkinFormOpen, setIsWalkinFormOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageHistory, setCurrentPageHistory] = useState(1);
  const bookingsPerPage = 6;
  const bookingsPerPageHistory = 6;

  const [filters, setFilters] = useState({
    status: currentUser.role === "barbero" ? "all" : "active",
    barber: "all",
    location: "all",
  });

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const promises = [
        apiService.getAllServices(),
        currentUser.role === "admin" || currentUser.role === "superadmin"
          ? apiService.getAllAppointments()
          : apiService.getAppointmentsByBarber(currentUser._id),
      ];

      if (currentUser.role === "admin" || currentUser.role === "superadmin") {
        promises.push(apiService.getAllUsers());
        promises.push(apiService.getSiteDashboard());
      }

      const response = await Promise.all(promises);

      const serviceResponse = response[0];
      setServicesList(serviceResponse.data || []);

      const bookingsResponse = response[1];
      const bookingsApiData = bookingsResponse.data || [];
      const formattedBookings = bookingsApiData.map((booking) => ({
        id: booking._id,
        clientName: booking.clientName || "Cliente no especificado",
        clientPhone: booking.clientPhone || "N/A",
        // --- NUEVOS CAMPOS ---
        clientEmail: booking.clientEmail || "N/A",
        confirmationCode: booking.confirmationCode || "N/A",
        isWalkIn: booking.isWalkIn || false,
        completedAt: booking.completedAt || null,
        // --- FIN NUEVOS CAMPOS ---
        barberName: `${booking.barberId?.name || "Barbero"} ${
          booking.barberId?.last_name || ""
        }`,
        barberId:
          typeof booking.barberId === "object"
            ? booking.barberId?._id
            : booking.barberId,
        serviceName: booking.serviceId?.name || "Servicio no especificado",
        serviceId:
          typeof booking.serviceId === "object"
            ? booking.serviceId?._id
            : booking.serviceId,
        locationName: booking.siteId?.name_site || "Sede no especificada",
        locationId:
          typeof booking.siteId === "object"
            ? booking.siteId?._id
            : booking.siteId,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: booking.status.toLowerCase(),
        notes: booking.notes,
        updatedAt: booking.updatedAt,
        createdAt: booking.createdAt,
      }));

       // --- Lógica para la notificación de nuevas reservas ---
      // Solo notificar si ya tenemos un conteo previo y el número actual es mayor
      if (previousBookingsCount > 0 && formattedBookings.length > previousBookingsCount) {
        const newCount = formattedBookings.length - previousBookingsCount;
        setNotificationMessage(`¡Tienes ${newCount} nueva(s) reserva(s)!`);
        setShowNotification(true);
      }
      // Si es la primera carga o si el conteo disminuye (reservas eliminadas/canceladas), no notificar.
      // Actualiza siempre el conteo previo para la próxima iteración.
      setPreviousBookingsCount(formattedBookings.length);
      // --- FIN Lógica para la notificación ---

      setBookings(formattedBookings);

      if (currentUser.role === "admin" || currentUser.role === "superadmin") {
        const userResponse = response[2];
        const allUsers = userResponse.data || [];

        const barberUsers = allUsers.filter((user) => user.role === "barbero" && user.isActive === true);

        const formattedBarbers = barberUsers.map((barber) => ({
          id: barber._id,
          name: `${barber.name} ${barber.last_name}`.trim(),
        }));

        setBarbersList(formattedBarbers);

        const sitesResponse = response[3];
        const allSites = sitesResponse.data || [];

        const formattedSites = allSites.map((site) => ({
          id: site._id,
          name: site.name_site,
        }));
        setLocationsList(formattedSites);
      } else {
        const barberInfo = {
          id: currentUser._id,
          name: `${currentUser.name} ${currentUser.last_name}`.trim(),
        };
        setBarbersList([barberInfo]);

        if (currentUser?.site_barber) {

          const formattedSite = {
            id: currentUser.site_barber._id,
            name: currentUser.site_barber.name_site,
          };

          setLocationsList([formattedSite]);
        } else {
          // Asegura que la lista no sea undefined si el barbero no tiene sede asignada
          setLocationsList([]);
        }
      }
    } catch (err) {
      console.error("Error fetching initial data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser, previousBookingsCount]);

  useEffect(() => {
    if (currentUser) {
      fetchInitialData();
    }
    console.log("Se refresco la pagina manualmente")
    const pollInterval = setInterval(() => {
      console.log("Verificando nuevas reservas...");
      fetchInitialData();
    }, 30000);

    return () => clearInterval(pollInterval);
  }, [currentUser, fetchInitialData]);

  const handleStatusChange = async (bookingId, newStatus) => {
    const originalBookings = [...bookings];
    const updatedBookings = bookings.map((b) =>
      b.id === bookingId ? { ...b, status: newStatus } : b
    );
    setBookings(updatedBookings);

    try {
      await apiService.updateAppointmentStatus(bookingId, newStatus);
      //console.log(`Reserva ${bookingId} actualizada a ${newStatus} con éxito.`);

      Swal.fire({
        icon: 'success',
        title: '¡Estado Actualizado Correctamente!',
        text: `Se Actualizo Correctamente el estado de la reserva a ${newStatus}`,
        confirmButtonColor: "#2cb9fd",
        customClass: {
              popup: "swal2-dark-mode",
              title: "text-white",
              htmlContainer: "text-gray-300",
            },
        background: "#1F2937",
        color: "#E5E7EB",
      })

      await fetchInitialData(); 
      //console.log("Datos recargados después de cambiar el estado.");

    } catch (error) {
    console.error("Error al actualizar el estado en la API:", error);
     setBookings(originalBookings); 
     Swal.fire({
      icon: 'error',
      title: 'Error al actualizar',
      text: 'No se pudo actualizar el estado de la reserva. Inténtalo de nuevo.',
      confirmButtonText: 'Ok',
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

  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filterType]: value }));
  };

  const handleBookingDeleteOrCancel = (
    bookingId,
    updatedBookingData = null
  ) => {
    setBookings((prevBookings) => {
      if (updatedBookingData) {
        return prevBookings.map((b) =>
          b.id === bookingId ? { ...b, ...updatedBookingData } : b
        );
      } else {
        return prevBookings.filter((b) => b.id !== bookingId);
      }
    });
  };

  const filteredAndSortedBookings = useMemo(() => {
    let result = [...bookings];
    if (currentUser.role === "barbero") {
      result = result.filter((b) => b.barberId === currentUser._id);
    }
    if (searchTerm) {
      result = result.filter((b) =>
        `${b.clientName} ${b.barberName} ${b.serviceName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    if (filters.status !== "all") {
      if (filters.status === "active") {
        result = result.filter((b) =>
          ["pendiente", "confirmada"].includes(b.status)
        );
      } else {
        result = result.filter((b) => b.status === filters.status);
      }
    }

    if (filters.barber !== "all") {
      result = result.filter((b) => b.barberId === filters.barber);
    }
    if (filters.location !== "all") {
      result = result.filter((b) => b.locationId === filters.location);
    }

    return result;
  }, [bookings, searchTerm, filters, currentUser]);

  useEffect(() => {
    setCurrentPage(1);
    setCurrentPageHistory(1);
}, [searchTerm, filters]); 

  const activeBookings = useMemo(() => {
    return filteredAndSortedBookings
      .filter((b) => ["pendiente", "confirmada"].includes(b.status))
      .sort((a, b) => {
        const dateTimeA = new Date(`${a.date}T${a.startTime}`);
        const dateTimeB = new Date(`${b.date}T${b.startTime}`);
        return dateTimeA - dateTimeB;
      });
  }, [filteredAndSortedBookings]);

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentActiveBookings = activeBookings.slice(indexOfFirstBooking, indexOfLastBooking);

  const totalPages = Math.ceil(activeBookings.length / bookingsPerPage);

  const historicalBookings = useMemo(() => {
    return filteredAndSortedBookings
      .filter((b) =>
        ["completada", "cancelada", "no-asistio"].includes(b.status)
      )
      .sort((a, b) => {
        const timestampA = new Date(a.updatedAt || a.createdAt || a.date);
        const timestampB = new Date(b.updatedAt || b.createdAt || b.date);
        return timestampB - timestampA;
      });
  }, [filteredAndSortedBookings]);

  const indexOfLastBookingHistory = currentPageHistory * bookingsPerPageHistory;
  const indexOfFirstBookingHistory = indexOfLastBookingHistory - bookingsPerPageHistory;
  const currentActiveBookingsHistory = historicalBookings.slice(indexOfFirstBookingHistory, indexOfLastBookingHistory);

  const totalPagesHistory = Math.ceil(historicalBookings.length / bookingsPerPageHistory);

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => setShowNotification(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  const handleEditClick = (bookingData) => {
    setEditingBooking(bookingData);
    setIsBookingFormOpen(true);
  };

  const onGoHome = () => {
    window.location.href = "/dashboard"; 
};

const onRetry = () => { 
    fetchInitialData(); 
};

  if (loading && bookings.length === 0) {
    return (
      <div className="bg-gradient-to-tr from-black to-blue-700/30 min-h-screen flex justify-center items-center">
        <LoaderCircle className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="ml-4 text-white text-xl">Cargando reservas...</p>
      </div>
    );
  }
  if (error)
    return (
      <div className="bg-gradient-to-tr from-black to-blue-700/30 min-h-screen flex justify-center items-center p-6">
      <div className="bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center border border-red-700/30">
        
        {/* Ícono de error */}
        <div className="text-red-500 mb-6 flex justify-center">
          <AlertTriangle className="w-16 h-16 md:w-20 md:h-20" />
        </div>

        {/* Título */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
          Error del Sistema
        </h1>

        {/* Mensaje de Error */}
        <p className="text-gray-400 text-base md:text-lg mb-8">
          {error}
        </p>

        {/* Botones de Acción */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button
            onClick={onRetry}
            className="w-full md:w-auto px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-transform transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Reintentar
          </button>

          <button
            onClick={onGoHome}
            className="w-full md:w-auto px-8 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold transition-transform transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
    );

  return (
    <div className="bg-gradient-to-tr from-black to-blue-700/30 min-h-screen p-4 sm:p-6 text-white">
      {showNotification && (
        <NotificationToast
          message={notificationMessage}
          onClose={() => setShowNotification(false)}
        />
      )}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <h2 className="text-3xl md:text-4xl font-black text-white text-center sm:text-left">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            Gestión de Reservas
          </span>
        </h2>
        {/* NEW: Wrapper for buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button
            onClick={() => setIsWalkinFormOpen(true)}
            className="w-full sm:w-auto py-3 px-6 text-base font-bold rounded-lg transition-all duration-300 transform bg-gradient-to-r from-green-500 to-green-600 text-white hover:scale-105 hover:shadow-lg hover:shadow-green-500/30 flex items-center justify-center gap-2"
          >
            <ClipboardCheck className="w-5 h-5" /> Registrar Servicio sin cita
          </button>
          <button
            onClick={() => {
              setEditingBooking(null);
              setIsBookingFormOpen(true);
            }}
            className="w-full sm:w-auto py-3 px-6 text-base font-bold rounded-lg transition-all duration-300 transform bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" /> Nueva Reserva
          </button>
        </div>
      </div>

      <div className="mb-8 p-4 bg-gray-800/50 border border-gray-700 rounded-xl space-y-4">
        <div className="relative flex-1 w-full">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por cliente, barbero o servicio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 text-white pl-12 pr-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {["admin", "superadmin"].includes(currentUser.role) && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-400">
                Estado
              </label>
              <select
                onChange={(e) => handleFilterChange("status", e.target.value)}
                value={filters.status}
                className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white"
              >
                <option value="all">Todas</option>
                <option value="active">
                  Activas (Pendientes y Confirmadas)
                </option>
                <option value="pendiente">Solo Pendientes</option>
                <option value="confirmada">Solo Confirmadas</option>
                <option value="completada">Completadas</option>
                <option value="cancelada">Canceladas</option>
                <option value="no-asistio">No Asistió</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-400">
                Barbero
              </label>
              <select
                onChange={(e) => handleFilterChange("barber", e.target.value)}
                value={filters.barber}
                className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white"
              >
                <option value="all">Todos</option>
                {barbersList.map((barber) => (
                  <option key={barber.id} value={barber.id}>
                    {barber.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-400">
                Sede
              </label>
              <select
                onChange={(e) => handleFilterChange("location", e.target.value)}
                value={filters.location}
                className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white"
              >
                <option value="all">Todas</option>
                {locationsList.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      <h3 className="text-2xl font-bold mb-4 text-cyan-300">
        Reservas Activas
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {currentActiveBookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            onStatusChange={handleStatusChange}
            onDeleteOrCancel={handleBookingDeleteOrCancel}
            onEdit={handleEditClick}
          />
        ))}
      </div>
      {activeBookings.length > 0 && (
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <span className="text-gray-400">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      )}
      {activeBookings.length === 0 && !loading && (
        <p className="text-center text-gray-500 py-8">
          No hay reservas activas.
        </p>
      )}

      <div className="mt-12">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full flex justify-between items-center p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700"
        >
          <div className="flex items-center gap-3">
            <History className="w-6 h-6 text-blue-400" />
            <span className="text-xl font-bold">Historial de Reservas</span>
          </div>
          <ChevronDown
            className={`w-6 h-6 transition-transform ${
              showHistory ? "rotate-180" : ""
            }`}
          />
        </button>
        {showHistory && (
          <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {currentActiveBookingsHistory.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onStatusChange={handleStatusChange}
                  isHistory={true}
                  onEdit={handleEditClick}
                  onDeleteOrCancel={handleBookingDeleteOrCancel}
                />
              ))}
            </div>
            {historicalBookings.length > 0 && (
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={() => setCurrentPageHistory((prev) => Math.max(prev - 1, 1))}
            disabled={currentPageHistory === 1}
            className="px-4 py-2 rounded-lg bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <span className="text-gray-400">
            Página {currentPageHistory} de {totalPagesHistory}
          </span>
          <button
            onClick={() =>
              setCurrentPageHistory((prev) => Math.min(prev + 1, totalPagesHistory))
            }
            disabled={currentPageHistory === totalPagesHistory}
            className="px-4 py-2 rounded-lg bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      )}
            {historicalBookings.length === 0 && !loading && (
              <div className="mt-4 flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-gray-700 bg-gray-800/50 p-8 text-center">
                <History className="h-10 w-10 text-gray-500" />
                <h4 className="text-lg font-semibold text-white">
                  El historial está vacío
                </h4>
                <p className="max-w-xs text-gray-400">
                  Cuando las reservas se completen o cancelen, aparecerán aquí.
                  {["admin", "superadmin"].includes(currentUser.role) && (
                    <span className="mt-2 block rounded border border-yellow-600 px-2 py-1 text-sm font-semibold text-yellow-400">
                      Sugerencia: Prueba a cambiar los filtros para ver otros
                      resultados.
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      {isBookingFormOpen && (
        <BookingForm
          booking={editingBooking}
          onClose={() => {
            setIsBookingFormOpen(false);
            setEditingBooking(null);
          }}
          onSaveSuccess={() => {
            setIsBookingFormOpen(false);
            setEditingBooking(null);
            fetchInitialData();
          }}
          barbers={barbersList}
          sites={locationsList}
          services={servicesList}
        />
      )}

      {isWalkinFormOpen && (
        <WalkinForm
          onClose={() => setIsWalkinFormOpen(false)}
          onSaveSuccess={() => {
            setIsWalkinFormOpen(false);
            fetchInitialData();
          }}
          barbers={barbersList}
          sites={locationsList}
          services={servicesList}
        />
      )}
    </div>
  );
};

export default BookingsModule;
