import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from 'react';
import Menu from './Components/Layout/Menu';
import Rodape from './Components/Layout/Rodape';
import Home from './Components/Pages/Home'
import LoginForm from './Components/Pages/LoginForm'
import ClienteList from './Components/Pages/ClienteList';
import ClienteForm from './Components/Pages/ClienteForm';

function App() {
  return (
    <>
    <Router>
      <Menu />
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/clientes" element={<ClienteList />} />
          <Route path="/novo-cliente" element={<ClienteForm />} />
      </Routes>
      <Rodape />
    </Router>
    </>
  );
}

export default App;