import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Faq from './pages/Faq';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/Faq" element={<Faq />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
