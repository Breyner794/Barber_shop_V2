import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Faq from './pages/Faq';
import { BookingProvider } from './context/BookingContext';
import ServiceScreen from './screens/ServiceScreen';
import SiteScreen from './screens/SiteScreen';
import BarberScreen from './screens/BarberScreen';
import DateTimeScreen from './screens/DateTimeScreen';
import ConfirmationScreen from './screens/ConfirmationScreen';
import CheckReservationPage from './pages/CheckReservationPage';
import BookingSuccess from './screens/BookingSuccess';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import Barber404Page from './pages/Not_Fount'
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <BrowserRouter>
          <Routes>
            {/* 🏠 RUTAS PÚBLICAS PRINCIPALES */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/faq" element={<Faq />} />
            
            {/* 📅 RUTAS DE RESERVAS (PÚBLICAS) */}
            <Route path="/consultar-reserva" element={<CheckReservationPage />} />
            <Route path="/reserva-exitosa" element={<BookingSuccess />} />
            <Route path="/reservar" element={<ServiceScreen />} />
            <Route path="/reservar/sede" element={<SiteScreen />} />
            <Route path="/reservar/barbero" element={<BarberScreen />} />
            <Route path="/reservar/fecha-hora" element={<DateTimeScreen />} />
            <Route path="/reservar/confirmacion" element={<ConfirmationScreen />} />
            
            {/* 🔐 RUTAS DE AUTENTICACIÓN */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            
            {/* 🛡️ RUTAS PROTEGIDAS */}
            <Route path="/dashboard/*" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            {/* ❌ RUTA 404 */}
            <Route path="*" element={<Barber404Page />} />
          </Routes>
        </BrowserRouter>
      </BookingProvider>
    </AuthProvider>
  );
}

export default App
