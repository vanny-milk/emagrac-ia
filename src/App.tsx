import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Calculate from './pages/Calculate';
import Dashboard from './pages/Dashboard';
import Teste from './pages/Teste'; // Importação da página Teste


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calculate" element={<Calculate />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/teste" element={<Teste />} />
        {/* Caso o usuário digite uma rota inexistente, volta para Home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;