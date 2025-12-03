import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ClienteList() {
    const [clientes, setClientes] = useState([]);
    const navigate = useNavigate();
    const formatarTelefone = (v) => {
        if (!v) return '';
        v = v.replace(/\D/g, "");
        v = v.replace(/^(\d{2})(\d)/g, "($1) $2"); 
        v = v.replace(/(\d)(\d{4})$/, "$1-$2");
        return v;
    };

    const formatarCPF = (v) => {
        if (!v) return '';
        v = v.replace(/\D/g, "");
        return v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    };

    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch('http://localhost:8080/api/clientes', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
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
        if(!window.confirm("Tem certeza?")) return;
        
        const token = localStorage.getItem('token');

        fetch(`http://localhost:8080/api/clientes/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
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
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                <h2>Listar Clientes</h2>
                <button onClick={() => navigate('/clientes')}>+ Novo Cliente</button>
            </div>
            
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
                                <td>{formatarTelefone(cliente.telefone)}</td>
                                <td>{formatarCPF(cliente.cpf)}</td>
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