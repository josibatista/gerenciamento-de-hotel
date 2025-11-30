import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ClienteList() {
    const [clientes, setClientes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
//        const token = localStorage.getItem('token');

        fetch('http://localhost:8080/api/clientes', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
//                'Authorization': `Bearer ${token}`
            }
        })
        .then((resp) => {
            if (!resp.ok) {
                throw new Error('Falha ao obter clientes!');
            }
            return resp.json();
        })
        .then((data) => setClientes(data))
        .catch((err) => console.log(err));
    }, []);

    const handleDelete = (id) => {
//        const token = localStorage.getItem('token');

        fetch(`http://localhost:8080/api/clientes/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
//                'Authorization': `Bearer ${token}`
            }
        })
        .then((resp) => {
            if (!resp.ok) {
                throw new Error('Falha ao excluir cliente!');
            }
            setClientes(clientes.filter((cliente) => cliente.id !== id));
        })
        .catch((err) => console.error(err));
    };

    return (
        <div className="conteudo-pagina">
            <h2>Listar Clientes</h2>
            
            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Telefone</th>
                            <th>CPF</th>
                            <th style={{ width: '200px' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map((cliente) => (
                            <tr key={cliente.id}>
                                <td>{cliente.nome}</td>
                                <td>{cliente.telefone}</td>
                                <td>{cliente.cpf}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button 
                                            onClick={() => navigate(`/clientes/${cliente.id}`)}
                                        >
                                            Visualizar
                                        </button>

                                        <button 
                                            className="btn-perigo" 
                                            onClick={() => handleDelete(cliente.id)}
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {clientes.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                                    Nenhum cliente cadastrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ClienteList;