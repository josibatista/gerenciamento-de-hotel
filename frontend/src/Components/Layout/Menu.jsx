import React from "react";
import { Link } from "react-router-dom";
import "./Menu.css";

function Menu() {
    // --- SIMULAÇÃO (Depois trocaremos isso pelo Contexto Real) ---
    // Mude aqui manualmente para testar: 'admin', 'cliente' ou null
    const user = null; 
    // -------------------------------------------------------------

    return (
        <nav className="navbar">
            <div className="container">
                <ul className="navbar-nav">
                    {/* Itens visíveis para TODOS */}
                    <li className="nav-item">
                        <Link to="/" className="nav-link">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/reservas" className="nav-link">Reservas</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/quartos" className="nav-link">Quartos</Link>
                    </li>

                    {/* Lógica: Se NÃO tem usuário (!user), mostra Login */}
                    {!user && (
                        <li className="nav-item">
                            <Link to="/login" className="nav-link">Login</Link>
                        </li>
                    )}

                    {/* Lógica: Se tem usuário E ele é admin */}
                    {user && user.role === 'admin' && (
                        <li className="nav-item">
                             <Link to="/clientes" className="nav-link">Clientes</Link>
                        </li>
                    )}

                    {/* Lógica: Se tem usuário E ele é cliente */}
                    {user && user.role === 'cliente' && (
                        <li className="nav-item">
                            <Link to="/cliente" className="nav-link">Meu Perfil</Link>
                        </li>
                    )}

                    {/* Botão de Sair (Só aparece se alguém estiver logado) */}
                    {user && (
                        <li className="nav-item">
                            <span className="nav-link" style={{cursor: 'pointer'}}>Sair</span>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default Menu;