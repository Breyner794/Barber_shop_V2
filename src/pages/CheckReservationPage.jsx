// src/pages/CheckReservationPage.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../api/services';
import Spinner from '../components/Spinner';

// Un componente para mostrar los detalles de la cita una vez encontrada
const AppointmentDetailsCard = ({ appointment }) => {
  // ... (puedes añadir más detalles aquí)
  return (
    <div className="bg-gray-800 p-6 rounded-lg mt-8 border-l-4 border-blue-500">
      <h3 className="text-2xl font-bold mb-4">Detalles de tu Cita</h3>
      <div className="space-y-3">
        <p><strong>Estado:</strong> <span className="font-semibold capitalize px-2 py-1 bg-green-600/20 text-green-300 rounded-full">{appointment.status}</span></p>
        <p><strong>Código:</strong> {appointment.confirmationCode}</p>
        <p><strong>Fecha:</strong> {new Date(appointment.date).toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <p><strong>Hora:</strong> {appointment.startTime} - {appointment.endTime}</p>
        <p><strong>Barbero:</strong> {appointment.barberId.name} {appointment.barberId.last_name}</p>
        <p><strong>Sede:</strong> {appointment.siteId.address_site}</p>
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