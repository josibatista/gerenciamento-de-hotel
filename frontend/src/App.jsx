import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from 'react';
import Home from './Components/Pages/Home';
import QuartoForm from './Components/Pages/QuartoForm';
import QuartoList from './Components/Pages/QuartoList'; // ⭐ ADICIONADO
//import Menu from './Components/Layout/Menu';
//import Rodape from './Components/Layout/Rodape';

import './App.css'

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quartos" element={<QuartoForm />} />
        <Route path="/quartos/lista" element={<QuartoList />} />
      </Routes>
    </Router>
    </>
  );
}
export default App;
