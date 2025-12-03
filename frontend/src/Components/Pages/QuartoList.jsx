import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"; 

function QuartoList() {
    const navigate = useNavigate();
    const [quartos, setQuartos] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false); 
    const [mensagem, setMensagem] = useState('');
    const [currentQuarto, setCurrentQuarto] = useState({
        codigo: '',
        tipo: '',
        valorDiaria: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const decoded = jwtDecode(token);
            if (decoded.role === 'admin') {
                setIsAdmin(true);
            }
        } catch (error) {
            console.error("Token inválido:", error);
            // Continua, mas o usuário não terá permissões de admin
        }


        fetch('http://localhost:8080/api/quartos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then((resp) => {
            if (!resp.ok) {
                // Se o backend estiver usando o checkAdmin na rota GET /quartos,
                if (resp.status === 403) {
                     console.warn("Acesso negado à lista completa de quartos.");
                     setMensagem("Acesso negado à lista completa de quartos.");
                }
                throw new Error('Falha ao obter quartos');
            }
            return resp.json();
        })
        .then((data) => setQuartos(data))
        .catch((err) => console.log(err));
    }, []);

    const handleDelete = (id) => {
        if (!isAdmin) { 
            alert('Acesso negado para exclusão de quartos.');
            return;
        }

        if(!window.confirm("Deseja realmente excluir este quarto?")) return;

        const token = localStorage.getItem('token');

        fetch(`http://localhost:8080/api/quartos/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then((resp) => {
            if (resp.status === 403) {
                 alert('Você não tem permissão para excluir quartos.');
                 throw new Error('Permissão negada');
            }
            if (!resp.ok) {
                throw new Error('Falha ao excluir quarto');
            }
            setQuartos(quartos.filter((quarto) => quarto.id !== id));
        })
        .catch((err) => console.error(err));
    };

    return (
        <div className="conteudo-pagina">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                <h2>Listar Quartos</h2>
                {isAdmin && <button onClick={() => navigate('/quartos')}>+ Novo Quarto</button>} 
            </div>

            {mensagem && <div className="alert-erro">{mensagem}</div>}

            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <table>
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Tipo</th>
                            <th>Valor Diária</th>
                            {isAdmin && <th style={{ width: '200px' }}>Ações</th>}
                        </tr>
                    </thead>

                    <tbody>
                        {quartos.map((quarto) => (
                            <tr key={quarto.id}>
                                <td>{quarto.codigo}</td>
                                <td>{quarto.tipo}</td>
                                <td>R$ {quarto.valorDiaria}</td>
                                
                                {isAdmin && (
                                    <td>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button onClick={() => navigate(`/quartos/${quarto.id}`)}>
                                                Visualizar
                                            </button>
                                            <button className="btn-perigo" onClick={() => handleDelete(quarto.id)}>
                                                Excluir
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {quartos.length === 0 && (
                            <tr>
                                <td colSpan={isAdmin ? "4" : "3"} style={{textAlign: 'center', padding: '20px'}}>Nenhum quarto encontrado.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default QuartoList;