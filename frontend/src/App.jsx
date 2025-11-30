import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'; 

import Menu from './Components/Layout/Menu';
import Rodape from './Components/Layout/Rodape';

import Home from './Components/Pages/Home';
import LoginForm from './Components/Pages/LoginForm';

import ClienteList from './Components/Pages/ClienteList';
import ClienteForm from './Components/Pages/ClienteForm';
import ClienteView from './Components/Pages/ClienteView';

// import QuartoList from './Components/Pages/QuartoList';
// import QuartoForm from './Components/Pages/QuartoForm';

// import ReservaList from './Components/Pages/ReservaList';
// import ReservaForm from './Components/Pages/ReservaForm';

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

        </Routes>

      </div>

      <Rodape />
      
    </Router>
  );
}

export default App;