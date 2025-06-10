import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Galeria from './pages/galeria';
import Nosotros from './pages/nosotros';
import Sedes from './pages/sedes';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/galeria" element={<Galeria />} />
          <Route path="/home" element={<Home />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/sedes" element={<Sedes />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
