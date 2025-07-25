import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../api/services';
import Spinner from '../components/Spinner';
import { Clock, CheckCircle, XCircle, AlertCircle, TriangleAlert } from 'lucide-react';

const getStatusStyles = (status) => {
  const styles = {
    pendiente: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    confirmada: "bg-blue-500/10 text-blue-400 border-blue-500/20", 
    completada: "bg-green-500/10 text-green-400 border-green-500/20",
    cancelada: "bg-red-500/10 text-red-400 border-red-500/20",
    "no-asistio": "bg-gray-500/10 text-gray-400 border-gray-500/20",
  };
  return styles[status] || styles["no-asistio"];
};

const getStatusIcon = (status) => {
  switch (status) {
    case "pendiente":
      return <Clock className="w-4 h-4" />;
    case "confirmada":
      return <CheckCircle className="w-4 h-4" />;
    case "completada":
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    case "cancelada":
      return <XCircle className="w-4 h-4" />;
    case "no-asistio":
      return <AlertCircle className="w-4 h-4" />;
    default:
      return <AlertCircle className="w-4 h-4" />;
  }
};

const AppointmentDetailsCard = ({ appointment }) => {

  const statusClasses = getStatusStyles(appointment.status);
  const statusIcon = getStatusIcon(appointment.status);

  return (
    <div className="bg-gray-900 p-8 rounded-xl shadow-xl border border-gray-700"> {/* Fondo más oscuro, padding, bordes, sombra y borde sutil */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700"> {/* Encabezado con borde inferior */}
        <h3 className="text-3xl font-extrabold text-blue-400">Detalles de tu Cita Agendada</h3> {/* Título más grande y con color */}
        <span className={`inline-flex items-center gap-1 px-4 py-1.5 text-sm font-semibold rounded-full border ${statusClasses}`}> {/* Ajustado padding para el badge */}
          {statusIcon}
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1).replace('-', ' ')}
        </span>
      </div>

      <div className="space-y-4 text-gray-300"> {/* Mayor espacio entre líneas y color de texto general */}
        {/* Usamos flex para alinear etiqueta y valor */}
        <div className="flex justify-between items-center py-2 border-b border-gray-800 last:border-b-0">
          <p className="font-bold text-gray-200">Código:</p>
          <p className="font-mono text-lg text-blue-300">{appointment.confirmationCode}</p>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-gray-800 last:border-b-0">
          <p className="font-bold text-gray-200">Fecha:</p>
          <p>{new Date(appointment.date).toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-gray-800 last:border-b-0">
          <p className="font-bold text-gray-200">Hora:</p>
          <p className="text-lg font-semibold text-green-300">{appointment.startTime}</p> {/* Hora con más énfasis */}
        </div>

        <div className="flex justify-between items-center py-2 border-b border-gray-800 last:border-b-0">
          <p className="font-bold text-gray-200">Barbero:</p>
          <p className="text-gray-200">{appointment.barberId.name} {appointment.barberId.last_name}</p> {/* Nombre del barbero más resaltado */}
        </div>

        <div className="flex justify-between items-center py-2 border-b border-gray-800 last:border-b-0">
          <p className="font-bold text-gray-200">Sede:</p>
          <p>{appointment.siteId.address_site}</p>
        </div>
      </div>
    </div>
  );
};

const CheckReservationPage = () => {
  // Estado para el formulario
  const [formData, setFormData] = useState({
    confirmationCode: '',
    clientIdentifier: '',
    identifierType: 'phone', // 'phone' por defecto
  });
  
  // Estado para el resultado
  const [appointment, setAppointment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setAppointment(null);

    try {
      const foundAppointment = await apiService.getAppointmentByDetails(formData);
      setAppointment(foundAppointment);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="consultar-reserva"
      className="bg-gradient-to-tr from-gray-900 via-blue-700 to-black min-h-screen p-4 sm:p-8 flex flex-col"
    >
      {/* Header/Nav mejorado */}
      <div className="w-full mb-8">
        <Link
          to="/"
          className="inline-flex items-center text-white hover:text-blue-300 text-lg font-medium transition-colors duration-200"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Volver al inicio
        </Link>
      </div>

      {/* Contenido principal centrado */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-lg">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black mt-4">Consulta tu Reserva</h1>
            <p className="text-gray-400 mt-2">
              Ingresa tu código de confirmación y tu email o teléfono.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-black/60 p-8 rounded-lg space-y-6"
          >
            <input
              type="text"
              name="confirmationCode"
              placeholder="Código de confirmación"
              value={formData.confirmationCode}
              onChange={handleInputChange}
              required
              className="w-full bg-gray-300/10 border-2 border-gray-600 rounded-lg p-3 focus:border-blue-500 focus:ring-blue-500 transition"
            />

            <div className="space-y-2">
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="identifierType"
                    value="phone"
                    checked={formData.identifierType === "phone"}
                    onChange={handleInputChange}
                  />{" "}
                  Teléfono
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="identifierType"
                    value="email"
                    checked={formData.identifierType === "email"}
                    onChange={handleInputChange}
                  />{" "}
                  Email
                </label>
              </div>
              <input
                type={formData.identifierType === "phone" ? "tel" : "email"}
                name="clientIdentifier"
                placeholder={
                  formData.identifierType === "phone"
                    ? "Tu número de teléfono"
                    : "Tu correo electrónico"
                }
                value={formData.clientIdentifier}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-300/10 border-2 border-gray-600 rounded-lg p-3 focus:border-blue-500 focus:ring-blue-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 text-lg font-bold rounded-lg bg-red-600 text-white hover:bg-gradient-to-r hover:from-blue-500 hover:via-white hover:to-red-500 hover:text-black disabled:bg-gray-600 disabled:hover:bg-gray-600 disabled:hover:text-white hover:scale-105 disabled:scale-100 flex justify-center transition-all duration-300"
            >
              {isLoading ? <Spinner /> : "Buscar Reserva"}
            </button>
          </form>

          {/* --- Sección de Resultados --- */}
          <div className="mt-8">
            {error && (
              <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-400/30 p-4 rounded-lg">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-red-400 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-red-200 font-medium">
                    No se pudo encontrar tu reserva. Verifica los datos
                    ingresados.
                  </p>
                </div>
                <p className="text-red-300/80 text-sm mt-2 ml-8">{error}</p>
              </div>
            )}
            {appointment && (
              <AppointmentDetailsCard appointment={appointment} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckReservationPage;