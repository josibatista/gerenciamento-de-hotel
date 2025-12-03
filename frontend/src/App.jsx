import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'; 

import Menu from './Components/Layout/Menu';
import Rodape from './Components/Layout/Rodape';

import Home from './Components/Pages/Home';
import LoginForm from './Components/Pages/LoginForm';

import ClienteForm from './Components/Pages/ClienteForm';
import ClienteList from './Components/Pages/ClienteList';
import ClienteView from './Components/Pages/ClienteView';

import QuartoForm from './Components/Pages/QuartoForm';
import QuartoList from './Components/Pages/QuartoList'; 
import QuartoView from './Components/Pages/QuartoView';

import ReservaForm from './Components/Pages/ReservaForm';
import ReservaList from './Components/Pages/ReservaList';
import ReservaView from './Components/Pages/ReservaView';

function App() {
  return (
    <Router>
      <Menu />
      <div className="conteudo-pagina">
        
        <Routes>
          <Route path="/" element={<Home />} />
          
          <Route path="/login" element={<LoginForm />} />

          {/* --- ROTAS DE CLIENTES --- */}
          <Route path="/clientes" element={<ClienteForm />} />
          <Route path="/clientes/lista" element={<ClienteList />} />
          <Route path="/clientes/:id" element={<ClienteView />} />
           
            {/* --- ROTAS DE QUARTOS --- */}
          <Route path="/" element={<Home />} />
          <Route path="/quartos" element={<QuartoForm />} />
          <Route path="/quartos/lista" element={<QuartoList />} />
          <Route path="/quartos/:id" element={<QuartoView />} />
           
            {/* --- ROTAS DE RESERVAS --- */}
            
          <Route path="/reservas/lista" element={<ReservaList />} />
          <Route path="/reservas" element={<ReservaForm />} /> 
          <Route path="/reservas/:id" element={<ReservaView />} />
        </Routes>

      </div>

      <Rodape />
      
    </Router>
  );
}

export default App;
