import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Menu.css";

function Menu() {
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole'); // 'admin' ou 'cliente'
    const userId = localStorage.getItem('userId');

    // Variável auxiliar para saber se está logado
    const isLogged = !!token; 

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
        window.location.reload();
    };

    return (
        <nav className="navbar">
            <div className="container">
                <ul className="navbar-nav">
                    
                    {/* --- ITENS PÚBLICOS (Visíveis para todos) --- */}
                    <li className="nav-item">
                        <Link to="/" className="nav-link">Home</Link>
                    </li>
                    
                    <li className="nav-item">
                        <Link to="/reservas/lista" className="nav-link">Reservas</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/quartos/lista" className="nav-link">Quartos</Link>
                    </li>

                    {/* --- ÁREA DE LOGIN (Se NÃO estiver logado) --- */}
                    {!isLogged && (
                        <li className="nav-item">
                            <Link to="/login" className="nav-link">Login</Link>
                        </li>
                    )}

                    {/* --- ÁREA DO ADMIN --- */}
                    {isLogged && role === 'admin' && (
                        <li className="nav-item">
                             <Link to="/clientes/lista" className="nav-link">Gerenciar Clientes</Link>
                        </li>
                    )}

                    {/* --- ÁREA DO CLIENTE --- */}
                    {isLogged && role === 'cliente' && (
                        <li className="nav-item">
                            <Link to={`/clientes/${userId}`} className="nav-link">Meu Perfil</Link>
                        </li>
                    )}

                    {/* --- BOTÃO SAIR (Se estiver logado) --- */}
                    {isLogged && (
                        <li className="nav-item">
                            <span 
                                className="nav-link" 
                                style={{cursor: 'pointer', color: '#e74c3c'}} // Destaquei em vermelho suave
                                onClick={handleLogout}
                            >
                                Sair
                            </span>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default Menu;