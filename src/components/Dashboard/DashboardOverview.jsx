import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Scissors, MapPin, Users, BarChart3, ArrowRight, AlertCircle, LoaderCircle, Shield, Loader2, TrendingUp, ShoppingCart, UserSearch } from 'lucide-react';
import { format, parseISO, isToday, isTomorrow, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { NavLink } from 'react-router-dom';
import apiService from '../../api/services.js'; 
import { useAuth } from '../../context/AuthContext.jsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import formatCurrency from '../../utils/formatCurrency.jsx';
import Pagination from '../Pagination/pagination.jsx';
import usePagination from '../../hook/usePagination.js';
import NetRevenueCard from '../analytics/NetRevenueCard.jsx';
import SiteRevenueCard from '../analytics/SiteRevenueCard.jsx';

// Pequeña función auxiliar para el saludo
const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buen día";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
};

const DashboardOverview = () => {
    // Usa el contexto de autenticación
    const { currentUser, isAuthLoading } = useAuth();

    // Estados para los datos del dashboard
    const [stats, setStats] = useState([]); // KPIs como Bookings Today, Active Barbers, etc.
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [dailyBookingsChartData, setDailyBookingsChartData] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(null);
    const [revenueByBarber, setRevenueByBarber] = useState([]);
    const [revenueByService, setRevenueByService] = useState([]); // Nuevo estado para recaudación por servicio
    const [occupancyRate, setOccupancyRate] = useState(null);
    const [serviceStatus, setServiceStatus] = useState(null);
    const [cancellationRate, setCancellationRate] = useState(null);
    const [recurringClients, setRecurringClients] = useState([]); // Nuevo estado para clientes recurrentes

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [revenueLoading, setRevenueLoading] = useState(false);
    const [barberRevenueLoading, setBarberRevenueLoading] = useState(false);
    const [serviceRevenueLoading, setServiceRevenueLoading] = useState(false);
    const [occupancyLoading, setOccupancyLoading] = useState(false);
    const [cancellationLoading, setCancellationLoading] = useState(false);

    // Define rangos de fechas para las consultas
    const today = new Date();
    const endDate = format(today, 'yyyy-MM-dd');
    const startDateOfMonth = format(new Date(today.getFullYear(), today.getMonth(), 1), 'yyyy-MM-dd'); // Inicio del mes actual
    const last7DaysStart = format(subDays(today, 6), 'yyyy-MM-dd'); // Últimos 7 días incluyendo hoy

    // Nuevos estados para el rango de fechas de Revenue
    const [customRevenueStartDate, setCustomRevenueStartDate] = useState(startDateOfMonth);
    const [customRevenueEndDate, setCustomRevenueEndDate] = useState(endDate);

    const [customBarberRevenueStartDate, setCustomBarberRevenueStartDate] = useState(startDateOfMonth);
    const [customBarberRevenueEndDate, setCustomBarberRevenueEndDate] = useState(endDate);

    const [customServiceRevenueStartDate, setCustomServiceRevenueStartDate] = useState(startDateOfMonth);
    const [customServiceRevenueEndDate, setCustomServiceRevenueEndDate] = useState(endDate);

    const [customOccupancyStartDate, setCustomOccupancyStartDate] = useState(startDateOfMonth);
    const [customOccupancyEndDate, setCustomOccupancyEndDate] = useState(endDate);
    const [selectedOccupancyBarberId, setSelectedOccupancyBarberId] = useState(''); // Para el dropdown de barbero
    const [allBarbers, setAllBarbers] = useState([]);

    const [customCancellationStartDate, setCustomCancellationStartDate] = useState(startDateOfMonth);
    const [customCancellationEndDate, setCustomCancellationEndDate] = useState(endDate);

    const [triggerFetch, setTriggerFetch] = useState(0);

    const isAdminOrSuperAdmin = currentUser?.role === 'admin' || currentUser?.role === 'superadmin';

    const {
        currentItems: currentClients,
        currentPage: clientsPage,
        itemsPerPage: clientsPerPage,
        totalItems: totalClients,
        handlePageChange: handleClientsPageChange,
        handleItemsPerPageChange: handleClientsPerPageChange
    } = usePagination(recurringClients, 6);
    
    const {
        currentItems: currentBarbers,
        currentPage: barbersPage,
        itemsPerPage: barbersPerPage,
        totalItems: totalBarbers,
        handlePageChange: handleBarbersPageChange,
        handleItemsPerPageChange: handleBarbersPerPageChange
    } = usePagination(revenueByBarber, 6);

    const {
        currentItems: currentServices,
        currentPage: servicesPage,
        itemsPerPage: servicesPerPage,
        totalItems: totalServices,
        handlePageChange: handleServicesPageChange,
        handleItemsPerPageChange: handleServicesPerPageChange
    } = usePagination(revenueByService, 6);

    const fetchTotalRevenue = useCallback(async (start, end) => {
      if(!isAdminOrSuperAdmin) return;
      setRevenueLoading(true);
      try{
        const revenueTotal = await apiService.getRevenueByDateRange(start, end);
        setTotalRevenue(revenueTotal);
      }catch(err){
        console.error("Error fetching total revenue:", err);
            // Considera establecer un error específico para revenue si lo necesitas
        } finally {
            setRevenueLoading(false);
        }
    },[isAdminOrSuperAdmin]);

    const fetchRevenueByBarber = useCallback(async (start, end) => {
        if (!isAdminOrSuperAdmin) return; // Solo para admins
        setBarberRevenueLoading(true);
        try {
            const revByBarber = await apiService.getRevenueBreakdownByBarber(start, end);
            setRevenueByBarber(revByBarber.data);
        } catch (err) {
            console.error("Error fetching revenue by barber:", err);
        } finally {
            setBarberRevenueLoading(false);
        }
    }, [isAdminOrSuperAdmin]); 

    const fetchRevenueByService = useCallback(async (start, end) => {
        if (!isAdminOrSuperAdmin) return; // Solo para admins
        setServiceRevenueLoading(true);
        try {
            const revByService = await apiService.getRevenueByBarberOrService(start, end, 'service');
            setRevenueByService(revByService.data);
        } catch (err) {
            console.error("Error fetching revenue by service:", err);
        } finally {
            setServiceRevenueLoading(false);
        }
    }, [isAdminOrSuperAdmin]);

    const fetchOccupancyRate = useCallback(async (start, end, barberId) => {
        if (!barberId) { // Si no hay barbero seleccionado, no se puede calcular
            setOccupancyRate(null);
            return;
        }
        setOccupancyLoading(true);
        try {
            const occupancy = await apiService.getOccupancyRate(start, end, barberId); // Pasa rango de fechas y barberId
            setOccupancyRate(occupancy);
        } catch (err) {
            console.error("Error fetching occupancy rate:", err);
            setOccupancyRate(null); // Limpiar si hay error
        } finally {
            setOccupancyLoading(false);
        }
    }, []);

    const fetchCancellationRate = useCallback(async (start, end) => {
        if (!isAdminOrSuperAdmin) return; // Solo para admins
        setCancellationLoading(true);
        try {
            const cancelRate = await apiService.getCancellationRate(start, end);
            setCancellationRate(cancelRate);
        } catch (err) {
            console.error("Error fetching cancellation rate:", err);
            setCancellationRate(null); // Limpiar si hay error
        } finally {
            setCancellationLoading(false);
        }
    }, [isAdminOrSuperAdmin]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (isAuthLoading) {
                // Espera a que la autenticación termine
                return;
            }

            if (!currentUser) {
                // Si no hay usuario autenticado, no se cargan datos y se muestra un mensaje
                setLoading(false);
                setError("No user authenticated. Please log in.");
                return;
            }

            setLoading(true);
            setError(null);

            try {
                // Determinar si el usuario es admin o superadmin (definido aquí para usar en las llamadas API)
                const isAdminOrSuperAdminLocal = currentUser.role === 'admin' || currentUser.role === 'superadmin';
                const currentBarberId = currentUser._id; // El ID del barbero logueado

                // --- Datos Generales (KPIs) ---

                // 1. Bookings Today (Ahora con filtro por barbero si aplica)
                let bookingsTodayCount;
                if (isAdminOrSuperAdminLocal) {
                    const dailyBookingsResponse = await apiService.getDailyBookings(endDate, endDate);
                    bookingsTodayCount = dailyBookingsResponse.find(item => item.date === endDate)?.count || 0;
                } else { // Si es barbero, filtra por su ID
                    const dailyBookingsResponse = await apiService.getDailyBookings(endDate, endDate, currentBarberId); // <-- Pasa currentBarberId
                    bookingsTodayCount = dailyBookingsResponse.find(item => item.date === endDate)?.count || 0;
                }
                
                // 2. Active Services
                const serviceStatusData = await apiService.getServiceStatus();
                setServiceStatus(serviceStatusData);
                const activeServicesCount = serviceStatusData.activeCount || 0;

                // 3. Active Barbers (usando la nueva API)
                const activeBarbersCount = await apiService.getActiveBarbersCount();

                // 4. Active Branches (usando la nueva API)
                const activeBranchesCount = await apiService.getActiveBranchesCount();

                setStats([
                    {
                        title: "Reservas hoy",
                        value: bookingsTodayCount, // Usar el valor dinámico
                        icon: Calendar,
                        color: "blue"
                    },
                    {
                        title: "Barberos Activos",
                        value: activeBarbersCount,
                        icon: Users,
                        color: "orange"
                    },
                    {
                        title: "Servicios Activos",
                        value: activeServicesCount,
                        icon: Scissors,
                        color: "green"
                    },
                    {
                        title: "Sucursales Activas",
                        value: activeBranchesCount,
                        icon: MapPin,
                        color: "purple"
                    },
                ]);

                // --- Cargar Citas Próximas (usando la nueva API) ---
                let fetchedAppointments = [];
                if (isAdminOrSuperAdminLocal) {
                    fetchedAppointments = await apiService.getUpcomingAppointmentsForDashboard();
                } else { // Si es barbero
                    fetchedAppointments = await apiService.getUpcomingAppointmentsForDashboard(currentBarberId);
                }
                setUpcomingAppointments(fetchedAppointments); 

                // --- Datos de Análisis (dependiendo del rol) ---
                if (isAdminOrSuperAdminLocal) { 
                    const daily = await apiService.getDailyBookings(last7DaysStart, endDate, null, "pendiente,confirmada,completada");
                    setDailyBookingsChartData(daily);

                    const recurring = await apiService.getRecurringClients();
                    setRecurringClients(recurring);

                    // Carga la lista de barberos para el selector de Occupancy Rate
                    const barbers = await apiService.getAllBarbers();
                    setAllBarbers(barbers);
                    if (barbers.length > 0) {
                        setSelectedOccupancyBarberId(currentBarberId || barbers[0]._id);
                    }

                } else if (currentUser.role === 'barbero') { // currentBarberId ya está definido
                    const daily = await apiService.getDailyBookings(last7DaysStart, endDate, currentBarberId, "pendiente,confirmada,completada");
                    setDailyBookingsChartData(daily); 

                    setSelectedOccupancyBarberId(currentBarberId); // Establece el ID del barbero logueado
                    fetchOccupancyRate(endDate, endDate, currentBarberId); 

                    const revByBarber = await apiService.getRevenueByBarberOrService(startDateOfMonth, endDate, 'barber');
                    const ownRevenue = revByBarber.data.find(item => item.barberId === currentBarberId);
                    setRevenueByBarber(ownRevenue ? [ownRevenue] : []); 

                    setTotalRevenue(null);
                    setRevenueByService([]);
                    setCancellationRate(null); 
                    setRecurringClients([]); 
                }

            } catch (err) {
                setError(err.message);
                console.error("Error fetching dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [isAuthLoading, currentUser, startDateOfMonth, endDate, last7DaysStart, fetchOccupancyRate]); 

    useEffect(() => {
        if (isAdminOrSuperAdmin && !isAuthLoading && currentUser) {
            
            fetchTotalRevenue(startDateOfMonth, endDate);
        }
    }, [isAdminOrSuperAdmin, isAuthLoading, currentUser, startDateOfMonth, endDate, fetchTotalRevenue]);

    useEffect(() => {
        if (isAdminOrSuperAdmin && !isAuthLoading && currentUser) {
            fetchRevenueByBarber(startDateOfMonth, endDate);
        }
    }, [isAdminOrSuperAdmin, isAuthLoading, currentUser, startDateOfMonth, endDate, fetchRevenueByBarber]);

    useEffect(() => {
        if (isAdminOrSuperAdmin && !isAuthLoading && currentUser) {
            fetchRevenueByService(startDateOfMonth, endDate);
        }
    }, [isAdminOrSuperAdmin, isAuthLoading, currentUser, startDateOfMonth, endDate, fetchRevenueByService]);

    useEffect(() => {
        if (isAdminOrSuperAdmin && !isAuthLoading && currentUser && selectedOccupancyBarberId) {
            fetchOccupancyRate(customOccupancyStartDate, customOccupancyEndDate, selectedOccupancyBarberId);
        }
    }, [isAdminOrSuperAdmin, isAuthLoading, currentUser, fetchOccupancyRate]);

    useEffect(() => {
        if (isAdminOrSuperAdmin && !isAuthLoading && currentUser) {
            fetchCancellationRate(startDateOfMonth, endDate);
        }
    }, [isAdminOrSuperAdmin, isAuthLoading, currentUser, startDateOfMonth, endDate, fetchCancellationRate]);

    const handleApplyRevenueFilter = () => {
        fetchTotalRevenue(customRevenueStartDate, customRevenueEndDate);
        setTriggerFetch(prev => prev + 1);
    };

    const handleApplyBarberRevenueFilter = () => {
        fetchRevenueByBarber(customBarberRevenueStartDate, customBarberRevenueEndDate);
    };

    const handleApplyServiceRevenueFilter = () => {
        fetchRevenueByService(customServiceRevenueStartDate, customServiceRevenueEndDate);
    };

    const handleApplyOccupancyFilter = () => {
        fetchOccupancyRate(customOccupancyStartDate, customOccupancyEndDate, selectedOccupancyBarberId);
    };

    const handleApplyCancellationFilter = () => {
        fetchCancellationRate(customCancellationStartDate, customCancellationEndDate);
    };

    // Si la autenticación aún está cargando
    if (isAuthLoading) {
      return (
        <div className="bg-gradient-to-tr from-black to-blue-700/30 min-h-screen flex items-center justify-center p-4 sm:p-6 font-inter">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Shield className="w-16 h-16 text-blue-500" />
                <Loader2 className="w-6 h-6 text-blue-400 absolute -top-1 -right-1 animate-spin" />
              </div>
            </div>
            <p className="text-white text-xl font-semibold mb-2">
              Cargando autenticación...
            </p>
            <p className="text-gray-400 text-sm">Verificando tu sesión.</p>
          </div>
        </div>
      );
    }

    // Si no hay usuario autenticado después de cargar
    if (!currentUser) {
        return (
          <div className="bg-gradient-to-tr from-black to-blue-700/30 min-h-screen flex items-center justify-center p-4 sm:p-6 font-inter">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-red-500/20 p-4 rounded-full">
                  <Shield className="w-12 h-12 text-red-400" />
                </div>
              </div>
              <p className="text-red-400 text-xl font-semibold mb-2">
                Acceso Denegado
              </p>
              <p className="text-gray-400">
                Por favor, inicia sesión para ver el dashboard.
              </p>
            </div>
          </div>
        );
    }

    // Si hay un error al cargar los datos del dashboard
    if (error) {
        return (
            <div className="bg-gradient-to-tr from-black to-blue-700/30 min-h-screen flex items-center justify-center p-4 sm:p-6 font-inter">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-red-500/20 p-4 rounded-full">
            <AlertCircle className="w-12 h-12 text-red-400" />
          </div>
        </div>
        <p className="text-red-500 text-xl font-semibold mb-2">Error al cargar el dashboard</p>
        <p className="text-gray-400 mb-2">{error}</p>
        <p className="text-gray-500 text-sm">Por favor, intenta de nuevo más tarde.</p>
      </div>
    </div>  
        );
    }

    // Si los datos aún están cargando
    if (loading) {
      return (
        <div className="bg-gradient-to-tr from-black to-blue-700/30 min-h-screen flex items-center justify-center p-4 sm:p-6 font-inter">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <BarChart3 className="w-16 h-16 text-purple-500" />
                <LoaderCircle className="w-6 h-6 text-purple-400 absolute -top-1 -right-1 animate-spin" />
              </div>
            </div>
            <p className="text-white text-xl font-semibold mb-2">
              Cargando datos del dashboard...
            </p>
            <p className="text-gray-400 text-sm">
              Preparando tu resumen de negocio.
            </p>
          </div>
        </div>
      );
    }

    return (
        <div className="bg-gradient-to-tr from-black to-blue-700/30 min-h-full p-4 sm:p-6 space-y-8 font-inter">
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                .font-inter {
                    font-family: 'Inter', sans-serif;
                }
                `}
            </style>
            {/* --- CABECERA DE BIENVENIDA --- */}
            <div>
                <h2 className="text-3xl md:text-4xl font-black text-white">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                        {getGreeting()}, {currentUser.name}!
                    </span>
                </h2>
                <p className="text-gray-400 mt-2">Aquí tienes un resumen de tu negocio hoy.</p>
            </div>

            {/* --- TARJETAS DE ESTADÍSTICAS (KPIs) --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const colorClasses = {
                        blue: { text: 'text-blue-400', bg: 'bg-blue-800/50', border: 'hover:border-blue-500/50' },
                        orange: { text: 'text-orange-400', bg: 'bg-orange-800/50', border: 'hover:border-orange-500/50' },
                        green: { text: 'text-green-400', bg: 'bg-green-800/50', border: 'hover:border-green-500/50' },
                        purple: { text: 'text-purple-400', bg: 'bg-purple-800/50', border: 'hover:border-purple-500/50' },
                    };
                    const currentColors = colorClasses[stat.color];

                    return (
                        <div key={stat.title} className={`bg-gradient-to-br from-black-900/30 to-blue-900/30 border-2 border-gray-700 rounded-2xl p-6 flex items-center gap-6 transition-colors duration-300 ${currentColors.border}`}>
                            <div className={`p-4 rounded-lg ${currentColors.bg}`}>
                                <stat.icon className={`w-8 h-8 ${currentColors.text}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-400 break-words truncate">{stat.title}</p>
                                <p className="text-4xl font-bold text-white break-all">{stat.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* --- SECCIÓN INFERIOR (PRÓXIMAS CITAS Y GRÁFICO DE RESERVAS DIARIAS) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Columna de Próximas Citas */}
                <div className="lg:col-span-2 bg-gradient-to-br from-blue-900/30 to-black-900/30 border border-blue-700 rounded-2xl">
                    <div className="p-5 flex justify-between items-center border-b border-gray-700">
                        <h3 className="text-xl font-bold text-white">Próximas reservas</h3>
                        <NavLink to="/dashboard/bookings" className="text-sm font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                            Ver todo <ArrowRight className="w-4 h-4" />
                        </NavLink>
                    </div>
                    <div className="p-3 space-y-2">
                        {upcomingAppointments.length > 0 ? upcomingAppointments.map(appointment => {
                            
                            const date = parseISO(appointment.date);
                            let dayLabel;
                            if (isToday(date)) {
                                dayLabel = 'Hoy';
                            } else if (isTomorrow(date)) {
                                dayLabel = 'Mañana';
                            } else {
                                dayLabel = format(date, 'EEEE, MMM d', { locale: es });
                            }

                            const barberName = appointment.barberId ? `${appointment.barberId.name || ''} ${appointment.barberId.last_name || ''}`.trim() : 'N/A';
                            const serviceName = appointment.serviceId ? appointment.serviceId.name : 'N/A';

                            return (
                                <div key={appointment._id} className="p-4 rounded-lg flex items-center justify-between transition-colors hover:bg-gray-700/50">
                                    <div className="flex items-center gap-4">
                                        <div className="text-center w-12 flex-shrink-0">
                                            <p className="text-xs text-gray-400">{format(date, 'MMM', { locale: es })}</p>
                                            <p className="text-2xl font-bold text-white">{format(date, 'd')}</p>
                                        </div>
                                        <div className="w-px h-10 bg-gray-700"></div>
                                        <div>
                                            <p className="font-semibold text-white">{appointment.clientName}</p>
                                            <p className="text-sm text-gray-400">{serviceName} con <strong className='text-sm text-blue-400'>{barberName}</strong></p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-white">{appointment.startTime}</p>
                                        <p className="text-xs text-gray-400">{dayLabel}</p>
                                    </div>
                                </div>
                            );
                        }) : <p className="text-center py-8 text-gray-500">No hay reservas próximas.</p>}
                    </div>
                </div>

                {/* Columna de Gráfico de Reservas Diarias */}
                <div className="bg-gradient-to-br from-black-900/30 to-blue-900/30 border border-blue-700 rounded-2xl p-5 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-4">Reservas de los últimos 7 días</h3>
                    <div className="flex-grow h-64"> {/* Altura fija para el gráfico */}
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={dailyBookingsChartData}
                                margin={{
                                    top: 5, right: 10, left: 10, bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                                <XAxis dataKey="date" stroke="#cbd5e0" tickFormatter={(tick) => format(parseISO(tick), 'MMM d')} />
                                <YAxis stroke="#cbd5e0" />
                                <Tooltip
                                    cursor={{ fill: '#4a5568', opacity: 0.3 }}
                                    contentStyle={{ backgroundColor: '#2d3748', border: 'none', borderRadius: '8px' }}
                                    labelStyle={{ color: '#ffffff' }}
                                    itemStyle={{ color: '#ffffff' }}
                                />
                                <Bar dataKey="count" fill="#8884d8" name="Reservas" radius={[10, 10, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* --- SELECTOR DE FECHAS UNIFICADO (SOLO ADMIN/SUPERADMIN) --- */}
            {isAdminOrSuperAdmin && (
                <div className="bg-gradient-to-br from-black-900/30 to-blue-900/30 border-2 border-blue-700/50 rounded-xl shadow-md p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Calendar className="text-blue-600" size={24} />
                        <h2 className="text-xl font-semibold text-white">Seleccionar Período de Análisis</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div>
                            <label htmlFor="globalStartDate" className="block text-sm font-medium text-gray-300 mb-2">
                                Fecha Inicial
                            </label>
                            <input
                                type="date"
                                id="globalStartDate"
                                value={customRevenueStartDate}
                                onChange={(e) => {
                                    setCustomRevenueStartDate(e.target.value);
                                    setCustomBarberRevenueStartDate(e.target.value);
                                    setCustomServiceRevenueStartDate(e.target.value);
                                }}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition datetime-input-complete"
                            />
                        </div>

                        <div>
                            <label htmlFor="globalEndDate" className="block text-sm font-medium text-gray-300 mb-2">
                                Fecha Final
                            </label>
                            <input
                                type="date"
                                id="globalEndDate"
                                value={customRevenueEndDate}
                                onChange={(e) => {
                                    setCustomRevenueEndDate(e.target.value);
                                    setCustomBarberRevenueEndDate(e.target.value);
                                    setCustomServiceRevenueEndDate(e.target.value);
                                }}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition datetime-input-complete"
                            />
                        </div>
                        <button
                            onClick={() => {
                                handleApplyRevenueFilter();
                                handleApplyBarberRevenueFilter();
                                handleApplyServiceRevenueFilter();
                            }}
                            disabled={revenueLoading || barberRevenueLoading || serviceRevenueLoading}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                        >
                            {(revenueLoading || barberRevenueLoading || serviceRevenueLoading) ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Cargando...
                                </>
                            ) : (
                                <>
                                    <TrendingUp size={20} />
                                    Consultar
                                </>
                            )}
                        </button>
                    </div>

                    {/* Opcional: Mensaje de error si lo necesitas */}
                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                            <p className="text-red-700 font-medium">{error}</p>
                        </div>
                    )}
                </div>
            )}

            {/* --- SECCIONES DE ANÁLISIS ADICIONALES (VISIBLES SEGÚN EL ROL) --- */}

            {/* Recaudación Total (Solo Admin/SuperAdmin) */}
            {isAdminOrSuperAdmin && (
                <NetRevenueCard
                    startDate={customRevenueStartDate}
                    endDate={customRevenueEndDate}
                    triggerFetch={triggerFetch}
                />
            )}

            {isAdminOrSuperAdmin && (
                <SiteRevenueCard
                    startDate={customRevenueStartDate}
                    endDate={customRevenueEndDate}
                    triggerFetch={triggerFetch}
                />
            )}

            {isAdminOrSuperAdmin && (
                <div className="bg-gradient-to-br from-blue-900/30 to-black-900/30 border-2 border-blue-700 rounded-2xl p-6">
                    <div className="p-6 mt-6">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <span><UserSearch/></span>
                            Desglose por Barbero
                        </h2>
                        <p className="text-sm font-medium text-gray-300 mb-2">
                            Período: {totalRevenue.startDate} al {totalRevenue.endDate}
                        </p>
                    </div>
                    {barberRevenueLoading ? (
                        <p className="text-gray-400 text-lg text-center">Cargando ingresos por barbero...</p>
                    ) : currentBarbers.length > 0 ? (
                        <>
                            {/* Vista de Tabla para Desktop */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-800/50 border border-gray-700">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                                Barbero
                                            </th>
                                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                                Citas
                                            </th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                                Total Servicios
                                            </th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                                Comisión
                                            </th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                                Para Negocio
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-500/10">
                                        {currentBarbers.map(item => (
                                            <tr key={item.barberId} className="bg-gray-700/30 rounded-b-lg hover:bg-gray-700/50 border border-gray-700">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                            {item.barberName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-400">
                                                                {item.barberName} {item.barberLastName}
                                                            </p>
                                                            <p className="text-xs text-slate-500">ID: {item.barberId.slice(-6)}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex items-center justify-center w-12 h-12 bg-blue-900/30 text-blue-400 rounded-full font-bold">
                                                        {item.appointmentCount}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right font-semibold text-gray-400">
                                                    {formatCurrency(item.totalServices)}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="text-purple-400 font-semibold">
                                                        {formatCurrency(item.barberCommission)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="text-green-400 font-semibold">
                                                        {formatCurrency(item.businessShare)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Vista de Tarjetas para Mobile */}
                            <div className="md:hidden space-y-4 mt-4">
                                {currentBarbers.map(item => (
                                    <div
                                        key={item.barberId}
                                        className="bg-gray-800/50 rounded-lg p-4 border-2 border-gray-700 hover:border-blue-500/50 transition-colors"
                                    >
                                        {/* Header de la tarjeta */}
                                        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-700">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                                {item.barberName.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-400 text-base">
                                                    {item.barberName} {item.barberLastName}
                                                </p>
                                                <p className="text-xs text-slate-500">ID: {item.barberId.slice(-6)}</p>
                                            </div>
                                            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-900/30 text-blue-400 rounded-full font-bold">
                                                {item.appointmentCount}
                                            </div>
                                        </div>

                                        {/* Información financiera */}
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-400 text-sm font-medium">Total Servicios</span>
                                                <span className="font-bold text-gray-400 text-lg">
                                                    {formatCurrency(item.totalServices)}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center -mx-4 px-4 py-2">
                                                <span className="text-purple-400 text-sm font-medium">
                                                    Comisión <span className="text-xs"></span>
                                                </span>
                                                <span className="text-purple-400 font-bold">
                                                    {formatCurrency(item.barberCommission)}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center -mx-4 px-4 py-2">
                                                <span className="text-green-400 text-sm font-medium">
                                                    Para Negocio <span className="text-xs"></span>
                                                </span>
                                                <span className="text-green-400 font-bold">
                                                    {formatCurrency(item.businessShare)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Pagination
                                currentPage={barbersPage}
                                totalItems={totalBarbers}
                                itemsPerPage={barbersPerPage}
                                onPageChange={handleBarbersPageChange}
                                onItemsPerPageChange={handleBarbersPerPageChange}
                            />
                        </>
                    ) : (
                        <p className="text-gray-400 text-lg text-center">No hay datos de ingresos para este período.</p>
                    )}
                </div>
            )}

            {/* Recaudación por Servicio (Solo Admin/SuperAdmin) */}
            {isAdminOrSuperAdmin && (
                <div className="bg-gradient-to-br from-blue-900/30 to-black-900/30 border-2 border-blue-700 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3 mb-4"><span><ShoppingCart/></span> Ingresos por servicio</h3>

                    {serviceRevenueLoading ? (
                        <p className="text-gray-400 text-lg text-center">Cargando ingresos por servicio...</p>
                    ) : currentServices.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {currentServices.map(item => (
                                    <div key={item.serviceId} className="flex flex-col p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors border border-gray-600/30">
                                        <span className="text-gray-300 text-sm mb-2">
                                            {item.serviceName || (
                                                <span className="text-red-400 italic">
                                                    [Servicio Eliminado ID: {item.serviceId.slice(-8)}]
                                                </span>
                                            )}
                                        </span>
                                        <span className="font-bold text-green-400 text-2xl">
                                            ${formatCurrency(item.totalRevenue)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Solo mostrar paginación si hay datos */}
                            <Pagination
                                currentPage={servicesPage}
                                totalItems={totalServices}
                                itemsPerPage={servicesPerPage}
                                onPageChange={handleServicesPageChange}
                                onItemsPerPageChange={handleServicesPerPageChange}
                            />
                        </>
                    ) : (
                        <p className="text-gray-400 text-lg text-center">No hay datos de ingresos para este período.</p>
                    )}
                </div>
            )}

            {/* Clientes Recurrentes (Solo Admin/SuperAdmin) */}
            {isAdminOrSuperAdmin && currentClients.length > 0 && (
                <div className="bg-gradient-to-br from-blue-900/30 to-black-900/30 border-2 border-blue-700 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3 mb-4">
                        <span><Users/></span> Clientes recurrentes
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {currentClients.map(client => (
                            <div
                                key={client._id}
                                className="flex flex-col p-4 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg hover:from-purple-900/30 hover:to-blue-900/30 transition-all duration-200 border border-purple-700/30 hover:border-purple-600/50 shadow-lg"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <p className="text-white font-semibold text-lg mb-1">{client.clientName}</p>
                                        <p className="text-gray-400 text-sm flex items-center gap-1">
                                            <span>📱</span> {client._id}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-600/30">
                                    <span className="text-gray-400 text-sm">Total reservas:</span>
                                    <span className="font-bold text-blue-400 text-xl">{client.totalBookings}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Pagination
                        currentPage={clientsPage}
                        totalItems={totalClients}
                        itemsPerPage={clientsPerPage}
                        onPageChange={handleClientsPageChange}
                        onItemsPerPageChange={handleClientsPerPageChange}
                    />
                </div>
            )}
        </div>
    );
};

export default DashboardOverview;
