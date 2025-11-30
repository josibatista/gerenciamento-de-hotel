import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function QuartoList() {
    const navigate = useNavigate();
    const [quartos, setQuartos] = useState([]);
    const [mensagem, setMensagem] = useState('');
    const [currentQuarto, setCurrentQuarto] = useState({
        codigo: '',
        tipo: '',
        valorDiaria: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch('http://localhost:8080/api/quartos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then((resp) => {
            if (!resp.ok) {
                throw new Error('Falha ao obter quartos');
            }
            return resp.json();
        })
        .then((data) => setQuartos(data))
        .catch((err) => console.log(err));
    }, []);

    const handleDelete = (id) => {
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
                <button onClick={() => navigate('/quartos')}>+ Novo Quarto</button>
            </div>

            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <table>
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Tipo</th>
                            <th>Valor Diária</th>
                            <th style={{ width: '200px' }}>Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {quartos.map((quarto) => (
                            <tr key={quarto.id}>
                                <td>{quarto.codigo}</td>
                                <td>{quarto.tipo}</td>
                                <td>R$ {quarto.valorDiaria}</td>
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
                            </tr>
                        ))}
                        {quartos.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{textAlign: 'center', padding: '20px'}}>Nenhum quarto encontrado.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default QuartoList;