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

function App() {
  return (
    <AuthProvider>
    <BookingProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/Faq" element={<Faq />} />
        <Route path="/consultar-reserva" element={<CheckReservationPage />} />
         <Route path="/reserva-exitosa" element={<BookingSuccess />} />
        <Route path="/reservar" element={<ServiceScreen />} />
        <Route path="/reservar/sede" element={<SiteScreen />} />
        <Route path="/reservar/barbero" element={<BarberScreen />} />
        <Route path='/reservar/fecha-hora' element={<DateTimeScreen/>}/>
        <Route path='/reservar/confirmacion' element={<ConfirmationScreen/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/dashboard/*' element={
          <ProtectedRoute>
          <Dashboard/>
          </ProtectedRoute>
          }/>
      </Routes>
    </BrowserRouter>
    </BookingProvider>
    </AuthProvider>
  );
}

export default App
