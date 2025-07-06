import { useLocation, Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';

const BookingSuccess = () => {

  const location = useLocation();
  
  const { booking } = location.state || { booking: null };

  
  if (!booking) {
    return (
      <div className="bg-gradient-to-tr from-gray-900 via-blue-700 to-black text-white min-h-screen flex flex-col justify-center text-center">
        <Header/>
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <h1 className="text-2xl font-bold">No hay información de la reserva.</h1>
        <Link to="/" className="mt-8 inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300">
          Volver al Inicio
        </Link>
        </div>
        <Footer/>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-tr from-gray-900 via-blue-700 to-black text-white min-h-screen flex flex-col justify-center text-center">
      <Header/>
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

        <h1 className="text-3xl font-bold text-white mb-2">
          ¡Tu reserva está confirmada!
        </h1>
        <p className="text-gray-300 mb-6">
          Gracias por confiar en nosotros, <strong>{booking.clientName}</strong>
          .
        </p>

        <div className="bg-black p-4 rounded-lg border-2 border-dashed border-gray-600">
          <p className="text-gray-200 text-sm">Tu código de confirmación es:</p>
          <p className="text-blue-400 font-mono text-4xl font-bold tracking-widest my-2">
            {booking.confirmationCode}
          </p>
          <p className="text-gray-300 text-xs">
            Guárdalo para futuras consultas.
          </p>
        </div>

        <p className="text-gray-400 mt-6 text-sm">
          Hemos enviado un resumen a tu correo electrónico. ¡Te esperamos!
        </p>

        <Link
          to="/reservar" // Enlace para iniciar una nueva reserva
          className="mt-8 inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
        >
          Hacer otra reserva
        </Link>
      </div>
      </div>
      <Footer/>
    </div>
  );
};

export default BookingSuccess;