import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Scissors, MapPin, Users, BarChart3, ArrowRight, AlertCircle, LoaderCircle, Shield, Loader2 } from 'lucide-react';
import { format, parseISO, isToday, isTomorrow, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { NavLink } from 'react-router-dom';

// Importa tu apiService y tu hook de autenticación
import apiService from '../../api/services.js'; // Ajusta la ruta si es diferente
import { useAuth } from '../../context/AuthContext.jsx';// Ajusta la ruta si es diferente

// Importa componentes de Recharts para gráficos
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

    const isAdminOrSuperAdmin = currentUser?.role === 'admin' || currentUser?.role === 'superadmin';

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
            const revByBarber = await apiService.getRevenueByBarberOrService(start, end, 'barber');
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
                        <div key={stat.title} className={`bg-gray-800/50 border-2 border-gray-700 rounded-2xl p-6 flex items-center gap-6 transition-colors duration-300 ${currentColors.border}`}>
                            <div className={`p-4 rounded-lg ${currentColors.bg}`}>
                                <stat.icon className={`w-8 h-8 ${currentColors.text}`} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                                <p className="text-4xl font-bold text-white">{stat.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* --- SECCIÓN INFERIOR (PRÓXIMAS CITAS Y GRÁFICO DE RESERVAS DIARIAS) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Columna de Próximas Citas */}
                <div className="lg:col-span-2 bg-gray-800/50 border-2 border-gray-700 rounded-2xl">
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
                <div className="bg-gray-800/50 border-2 border-gray-700 rounded-2xl p-5 flex flex-col">
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

            {/* --- SECCIONES DE ANÁLISIS ADICIONALES (VISIBLES SEGÚN EL ROL) --- */}

            {/* Recaudación Total (Solo Admin/SuperAdmin) */}
            {isAdminOrSuperAdmin && (
                <div className="bg-gray-800/50 border-2 border-gray-700 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Ingresos totales</h3>
                    {/* Controles de fecha para admins */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
                        <div className="flex-1 w-full sm:w-auto">
                            <label htmlFor="revenueStartDate" className="block text-sm font-medium text-gray-400 mb-1">Fecha de inicio:</label>
                            <input
                                type="date"
                                id="revenueStartDate"
                                className="datetime-input-complete"
                                value={customRevenueStartDate}
                                onChange={(e) => setCustomRevenueStartDate(e.target.value)}
                            />
                        </div>
                        <div className="flex-1 w-full sm:w-auto">
                            <label htmlFor="revenueEndDate" className="block text-sm font-medium text-gray-400 mb-1">Fecha de finalización:</label>
                            <input
                                type="date"
                                id="revenueEndDate"
                                className="datetime-input-complete"
                                value={customRevenueEndDate}
                                onChange={(e) => setCustomRevenueEndDate(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={handleApplyRevenueFilter}
                            disabled={revenueLoading}
                            className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 w-full sm:w-auto mt-4 sm:mt-0
                                ${revenueLoading ? 'bg-blue-600/50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}
                            `}
                        >
                            {revenueLoading ? 'Cargando...' : 'Aplicar filtro'}
                        </button>
                    </div>
                    {/* Visualización del total de revenue */}
                    {totalRevenue ? (
                        <>
                            <p className="text-4xl font-bold text-green-400">${totalRevenue.totalRevenue.toFixed(2)}</p>
                            <p className="text-gray-400 mt-2 text-sm">
                                Para el periodo: <strong className='text-sm text-blue-400'>{totalRevenue.startDate}</strong> hasta <strong className='text-sm text-blue-400'>{totalRevenue.endDate}</strong>
                            </p>
                        </>
                    ) : (
                        revenueLoading ? (
                            <p className="text-gray-400 text-lg">Cargando ingresos...</p>
                        ) : (
                            <p className="text-gray-400 text-lg">No hay datos de ingresos para este período.</p>
                        )
                    )}
                </div>
            )}

            {/* Recaudación por Barbero (Admin/SuperAdmin ven todos, Barbero ve solo el suyo) */}
            {isAdminOrSuperAdmin && ( // Solo mostrar si es admin/superadmin
                <div className="bg-gray-800/50 border-2 border-gray-700 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Ingresos por Barber</h3>
                    {/* Controles de fecha para admins */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
                        <div className="flex-1 w-full sm:w-auto">
                            <label htmlFor="barberRevenueStartDate" className="block text-sm font-medium text-gray-400 mb-1">Fecha de inicio:</label>
                            <input
                                type="date"
                                id="barberRevenueStartDate"
                                className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={customBarberRevenueStartDate}
                                onChange={(e) => setCustomBarberRevenueStartDate(e.target.value)}
                            />
                        </div>
                        <div className="flex-1 w-full sm:w-auto">
                            <label htmlFor="barberRevenueEndDate" className="block text-sm font-medium text-gray-400 mb-1">Fecha de finalización:</label>
                            <input
                                type="date"
                                id="barberRevenueEndDate"
                                className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={customBarberRevenueEndDate}
                                onChange={(e) => setCustomBarberRevenueEndDate(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={handleApplyBarberRevenueFilter}
                            disabled={barberRevenueLoading}
                            className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 w-full sm:w-auto mt-4 sm:mt-0
                                ${barberRevenueLoading ? 'bg-blue-600/50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}
                            `}
                        >
                            {barberRevenueLoading ? 'Cargando...' : 'Aplicar filtro'}
                        </button>
                    </div>
                    {/* Visualización del revenue por barbero */}
                    {revenueByBarber.length > 0 ? (
                        <div className="space-y-2">
                            {revenueByBarber.map(item => (
                                <div key={item.barberId} className="flex justify-between items-center text-gray-300">
                                    <span>{item.barberName} {item.barberLastName || ''}</span>
                                    <span className="font-semibold text-white">${item.totalRevenue.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        barberRevenueLoading ? (
                            <p className="text-gray-400 text-lg">Cargando ingresos por barbero...</p>
                        ) : (
                            <p className="text-gray-400 text-lg">No hay datos de ingresos para este período.</p>
                        )
                    )}
                </div>
            )}

            {/* Recaudación por Servicio (Solo Admin/SuperAdmin) */}
            {isAdminOrSuperAdmin && ( // Solo mostrar si es admin/superadmin
                <div className="bg-gray-800/50 border-2 border-gray-700 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Ingresos por servicio</h3>
                    {/* Controles de fecha para admins */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
                        <div className="flex-1 w-full sm:w-auto">
                            <label htmlFor="serviceRevenueStartDate" className="block text-sm font-medium text-gray-400 mb-1">Fecha de inicio:</label>
                            <input
                                type="date"
                                id="serviceRevenueStartDate"
                                className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={customServiceRevenueStartDate}
                                onChange={(e) => setCustomServiceRevenueStartDate(e.target.value)}
                            />
                        </div>
                        <div className="flex-1 w-full sm:w-auto">
                            <label htmlFor="serviceRevenueEndDate" className="block text-sm font-medium text-gray-400 mb-1">Fecha de finalización:</label>
                            <input
                                type="date"
                                id="serviceRevenueEndDate"
                                className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={customServiceRevenueEndDate}
                                onChange={(e) => setCustomServiceRevenueEndDate(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={handleApplyServiceRevenueFilter}
                            disabled={serviceRevenueLoading}
                            className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 w-full sm:w-auto mt-4 sm:mt-0
                                ${serviceRevenueLoading ? 'bg-blue-600/50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}
                            `}
                        >
                            {serviceRevenueLoading ? 'Cargando...' : 'Aplicar filtro'}
                        </button>
                    </div>
                    {/* Visualización del revenue por servicio */}
                    {revenueByService.length > 0 ? (
                        <div className="space-y-2">
                            {revenueByService.map(item => (
                                <div key={item.serviceId} className="flex justify-between items-center text-gray-300">
                                    <span>{item.serviceName}</span>
                                    <span className="font-semibold text-white">${item.totalRevenue.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        serviceRevenueLoading ? (
                            <p className="text-gray-400 text-lg">Cargando ingresos por servicio...</p>
                        ) : (
                            <p className="text-gray-400 text-lg">No hay datos de ingresos para este período.</p>
                        )
                    )}
                </div>
            )}

            {/* Tasa de Ocupación (Admin/SuperAdmin ven todos, Barbero ve solo el suyo) */}
            {isAdminOrSuperAdmin && ( // Solo mostrar si es admin/superadmin
                <div className="bg-gray-800/50 border-2 border-gray-700 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Tasa de ocupación</h3>
                    {/* Controles de fecha y barbero para admins */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
                        <div className="flex-1 w-full sm:w-auto">
                            <label htmlFor="occupancyStartDate" className="block text-sm font-medium text-gray-400 mb-1">Fecha de inicio:</label>
                            <input
                                type="date"
                                id="occupancyStartDate"
                                className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={customOccupancyStartDate}
                                onChange={(e) => setCustomOccupancyStartDate(e.target.value)}
                            />
                        </div>
                        <div className="flex-1 w-full sm:w-auto">
                            <label htmlFor="occupancyEndDate" className="block text-sm font-medium text-gray-400 mb-1">Fecha de finalización:</label>
                            <input
                                type="date"
                                id="occupancyEndDate"
                                className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={customOccupancyEndDate}
                                onChange={(e) => setCustomOccupancyEndDate(e.target.value)}
                            />
                        </div>
                        <div className="flex-1 w-full sm:w-auto">
                            <label htmlFor="occupancyBarberSelect" className="block text-sm font-medium text-gray-400 mb-1">Barbero:</label>
                            <select
                                id="occupancyBarberSelect"
                                className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={selectedOccupancyBarberId}
                                onChange={(e) => setSelectedOccupancyBarberId(e.target.value)}
                            >
                                <option value="">Seleccionar barbero</option>
                                {allBarbers.map(barber => (
                                    <option key={barber._id} value={barber._id}>
                                        {barber.name} {barber.last_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={handleApplyOccupancyFilter}
                            disabled={occupancyLoading || !selectedOccupancyBarberId} // Deshabilitar si no hay barbero seleccionado
                            className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 w-full sm:w-auto mt-4 sm:mt-0
                                ${occupancyLoading || !selectedOccupancyBarberId ? 'bg-blue-600/50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}
                            `}
                        >
                            {occupancyLoading ? 'Cargando...' : 'Aplicar filtro'}
                        </button>
                    </div>
                    {/* Visualización de la tasa de ocupación */}
                    {occupancyRate ? (
                        <>
                            <p className="text-4xl font-bold text-blue-400">{occupancyRate.occupancyRate}</p>
                            <p className="text-gray-400 mt-2 text-sm">
                                Reservado: {occupancyRate.bookedMinutes} min / Disponible: {occupancyRate.totalAvailableMinutes} min
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                                Para el periodo: <strong className='text-sm text-blue-400'>{occupancyRate.startDate}</strong> hasta <strong className='text-sm text-blue-400'>{occupancyRate.endDate}</strong> (Barbero: <strong className='text-sm text-blue-400'>{allBarbers.find(b => b._id === occupancyRate.barberId)?.name || 'N/A'}</strong>)
                            </p>
                        </>
                    ) : (
                        occupancyLoading ? (
                            <p className="text-gray-400 text-lg">Cargando tasa de ocupación...</p>
                        ) : (
                            <p className="text-gray-400 text-lg">No hay datos de ocupación para este periodo ni para la peluquería.</p>
                        )
                    )}
                </div>
            )}

            {/* Estado de Servicios (Solo Admin/SuperAdmin) */}
            {isAdminOrSuperAdmin && serviceStatus && (
                <div className="bg-gray-800/50 border-2 border-gray-700 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Estado de los servicios</h3>
                    <p className="text-lg text-green-400">Servicios Activos: {serviceStatus.activeCount}</p>
                    <p className="text-lg text-red-400">Servicios inactivos: {serviceStatus.inactiveCount}</p>
                    {/* Puedes añadir una lista de servicios aquí si lo deseas */}
                </div>
            )}

            {/* Tasa de Cancelación (Solo Admin/SuperAdmin) */}
            {isAdminOrSuperAdmin && ( // Solo mostrar si es admin/superadmin
                <div className="bg-gray-800/50 border-2 border-gray-700 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Tasa de cancelación</h3>
                    {/* Controles de fecha para admins */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
                        <div className="flex-1 w-full sm:w-auto">
                            <label htmlFor="cancellationStartDate" className="block text-sm font-medium text-gray-400 mb-1">Fecha de inicio:</label>
                            <input
                                type="date"
                                id="cancellationStartDate"
                                className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={customCancellationStartDate}
                                onChange={(e) => setCustomCancellationStartDate(e.target.value)}
                            />
                        </div>
                        <div className="flex-1 w-full sm:w-auto">
                            <label htmlFor="cancellationEndDate" className="block text-sm font-medium text-gray-400 mb-1">Fecha de finalización:</label>
                            <input
                                type="date"
                                id="cancellationEndDate"
                                className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={customCancellationEndDate}
                                onChange={(e) => setCustomCancellationEndDate(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={handleApplyCancellationFilter}
                            disabled={cancellationLoading}
                            className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 w-full sm:w-auto mt-4 sm:mt-0
                                ${cancellationLoading ? 'bg-blue-600/50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}
                            `}
                        >
                            {cancellationLoading ? 'Cargando...' : 'Aplicar filtro'}
                        </button>
                    </div>
                    {/* Visualización de la tasa de cancelación */}
                    {cancellationRate ? (
                        <>
                            <p className="text-4xl font-bold text-red-400">{cancellationRate.cancellationRate}</p>
                            <p className="text-gray-400 mt-2 text-sm">
                                Canceladas: {cancellationRate.cancelledAppointments} / Total: {cancellationRate.totalAppointments}
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                                Para el periodo: <strong className='text-sm text-blue-400'>{cancellationRate.startDate}</strong> hasta <strong className='text-sm text-blue-400'>{cancellationRate.endDate}</strong>
                            </p>
                        </>
                    ) : (
                        cancellationLoading ? (
                            <p className="text-gray-400 text-lg">Cargando tasa de cancelación...</p>
                        ) : (
                            <p className="text-gray-400 text-lg">No hay datos de cancelación para este período.</p>
                        )
                    )}
                </div>
            )}

            {/* Clientes Recurrentes (Solo Admin/SuperAdmin) */}
            {isAdminOrSuperAdmin && recurringClients.length > 0 && (
                <div className="bg-gray-800/50 border-2 border-gray-700 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Clientes recurrentes</h3>
                    <div className="space-y-2">
                        {recurringClients.map(client => (
                            <div key={client._id} className="flex justify-between items-center text-gray-300">
                                <span>{client.clientName} ({client._id})</span> {/* _id es el número de teléfono */}
                                <span className="font-semibold text-white">Reservas: {client.totalBookings}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardOverview;
