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
    <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-8 flex flex-col items-center">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <Link to="/" className="text-blue-400 hover:text-blue-300">&larr; Volver al inicio</Link>
          <h1 className="text-4xl font-black mt-4">Consulta tu Reserva</h1>
          <p className="text-gray-400 mt-2">Ingresa tu código de confirmación y tu email o teléfono.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg space-y-6">
          <input
            type="text"
            name="confirmationCode"
            placeholder="Código de confirmación"
            value={formData.confirmationCode}
            onChange={handleInputChange}
            required
            className="w-full bg-gray-700 border-2 border-gray-600 rounded-lg p-3 focus:border-blue-500 focus:ring-blue-500 transition"
          />
          
          <div className="space-y-2">
            <div className="flex gap-4">
                <label className="flex items-center gap-2"><input type="radio" name="identifierType" value="phone" checked={formData.identifierType === 'phone'} onChange={handleInputChange} /> Teléfono</label>
                <label className="flex items-center gap-2"><input type="radio" name="identifierType" value="email" checked={formData.identifierType === 'email'} onChange={handleInputChange} /> Email</label>
            </div>
            <input
              type={formData.identifierType === 'phone' ? 'tel' : 'email'}
              name="clientIdentifier"
              placeholder={formData.identifierType === 'phone' ? 'Tu número de teléfono' : 'Tu correo electrónico'}
              value={formData.clientIdentifier}
              onChange={handleInputChange}
              required
              className="w-full bg-gray-700 border-2 border-gray-600 rounded-lg p-3 focus:border-blue-500 focus:ring-blue-500 transition"
            />
          </div>

          <button type="submit" disabled={isLoading} className="w-full py-3 text-lg font-bold rounded-lg bg-gradient-to-r from-blue-600 to-red-600 text-white hover:scale-105 disabled:bg-gray-600 disabled:scale-100 flex justify-center">
            {isLoading ? <Spinner /> : 'Buscar Reserva'}
          </button>
        </form>

        {/* --- Sección de Resultados --- */}
        <div className="mt-8">
          {error && <p className="text-center text-red-500 bg-red-500/10 p-4 rounded-lg">{error}</p>}
          {appointment && <AppointmentDetailsCard appointment={appointment} />}
        </div>
      </div>
    </div>
  );
};

export default CheckReservationPage;