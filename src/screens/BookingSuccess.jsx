import { useLocation, Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { TriangleAlert } from 'lucide-react';

const BookingSuccess = () => {

  const location = useLocation();
  
  const { booking } = location.state || { booking: null };

  
  if (!booking) {
    return (
      <div className="bg-gradient-to-tr from-gray-900 via-blue-700 to-black text-white min-h-screen flex flex-col">
        <Header/>
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          <div className="max-w-md bg-black/70 p-8 rounded-xl shadow-2xl text-center">
            <TriangleAlert className="mx-auto h-20 w-20 text-yellow-400 mb-6"/> {/* Icono de advertencia */}
            <h1 className="text-3xl font-bold text-white mb-4">
              ¡Vaya! Algo salió mal.
            </h1>
            <p className="text-gray-300 mb-6">
              Parece que no hay información de reserva disponible para mostrar.
              Esto puede ocurrir si intentaste acceder directamente al enlace sin completar una reserva,
              o si hubo un problema al procesar tu solicitud.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/" 
                className="inline-block bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 text-sm"
              >
                Volver al Inicio
              </Link>
              <Link 
                to="/reservar" 
                className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 text-sm"
              >
                Iniciar nueva Reserva
              </Link>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-tr from-gray-900 via-blue-700 to-black text-white min-h-screen flex flex-col justify-center text-center">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="max-w-lg bg-black/70 p-8 rounded-xl shadow-2xl">
          <svg
            className="mx-auto h-20 w-20 text-blue-400 mb-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>

          <h1 className="text-3xl font-bold text-white mb-2">¡Cita agendada! Tu barbero confirmará contigo.</h1>
        <p className="text-gray-300 mb-6">
          Hemos registrado tu reserva con éxito, <strong>{booking.clientName}</strong>. Para garantizar tu cupo y brindarte el mejor servicio, tu barbero asignado te contactará pronto por teléfono para confirmar los detalles y tu asistencia. ¡Agradecemos tu comprensión!
          </p>
          <div className="bg-black p-4 rounded-lg border-2 border-dashed border-gray-600">
            <p className="text-gray-200 text-sm">
              Tu código de confirmación es:
            </p>
            <p className="text-blue-400 font-mono text-4xl font-bold tracking-widest my-2">
              {booking.confirmationCode}
            </p>
            <p className="text-gray-300 text-xs">
              Guárdalo para futuras consultas.
            </p>
          </div>

            {/* Advertencia de puntualidad */}
        <div className="bg-[#3F2913] text-[#FFDDAA] p-4 rounded-lg border-2 border-dashed border-[#F59E0B] mt-6 text-sm text-center mb-6">
          <p className="font-bold mb-1 text-base">¡ATENCIÓN: Cita sujeta a puntualidad!</p>
          <p className="mb-1">Si llegas <strong>10 minutos tarde</strong>, tu reserva será marcada como "No Asistió".</p>
          <p>Por favor, llega a tiempo para no perder tu cita. ¡Gracias!</p>
        </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Link
              to="/consultar-reserva"
              className="inline-block bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 text-sm"
            >
              Consultar mi Reserva 
            </Link>
            
            <Link
              to="/reservar"
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 text-sm"
            >
              Hacer otra reserva
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingSuccess;