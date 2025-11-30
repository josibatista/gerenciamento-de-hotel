import React, { useState, useEffect } from 'react';

function ClienteList() {

    const [clientes, setClientes] = useState([]);
    const [editandoCliente, setEditandoCliente] = useState(null);
    const [nomeClienteEditado, setNomeClienteEditado] = useState('');
    const [telefoneClienteEditado, setTelefoneClienteEditado] = useState('');
    const [emailClienteEditado, setEmailClienteEditado] = useState('');
    const [cpfClienteEditado, setCpfClienteEditado] = useState('');
    const [senhaClienteEditada, setSenhaClienteEditada] = useState('');    

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

    const handleEdit = (id, nome, telefone, email, cpf, senha) => {
        setEditandoCliente(id);
        setNomeClienteEditado(nome);
        setTelefoneClienteEditado(telefone);
        setEmailClienteEditado(email);
        setCpfClienteEditado(cpf);
        setSenhaClienteEditada(senha);
    };

    const cancelarEdicao = () => {
        setEditandoCliente(null);
        setNomeClienteEditado('');
        setTelefoneClienteEditado('');
        setEmailClienteEditado('');
        setCpfClienteEditado('');
        setSenhaClienteEditada('');
    };

    const salvarEdicao = (id) => {
//        const token = localStorage.getItem('token');

        fetch(`http://localhost:8080/api/clientes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
//                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({  nome: nomeClienteEditado, 
                                    telefone: telefoneClienteEditado, 
                                    email: emailClienteEditado, 
                                    cpf: cpfClienteEditado, 
                                    senha: senhaClienteEditada })
        })
        .then((resp) => {
            if (!resp.ok) {
                throw new Error('Falha ao editar usuário');
            }
            const listaAtualizada = clientes.map((cliente) => {
                if (cliente.id === id) {
                    return { 
                        ...cliente, // Mantém ID e outros dados que não mudaram
                        nome: nomeClienteEditado,
                        telefone: telefoneClienteEditado,
                        email: emailClienteEditado,
                        cpf: cpfClienteEditado,
                        senha: senhaClienteEditada
                    };
                }
                return cliente;
            });
            setClientes(listaAtualizada);
            setEditandoCliente(null);
        })
        .catch((err) => console.error(err));
    };

    return (
        <>
            <h1>Listar Clientes</h1>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Telefone</th>
                        <th>Email</th>
                        <th>CPF</th>
                        <th>Senha</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map((cliente) => (
                        <tr key={cliente.id}>
                            <td>
                                {editandoCliente === cliente.id ? (
                                    <input
                                        type="text"
                                        value={nomeClienteEditado}
                                        onChange={(e) => setNomeClienteEditado(e.target.value)}
                                    />
                                ) : (
                                    cliente.nome
                                )}
                            </td>
                            <td>
                                {editandoCliente === cliente.id ? (
                                    <input
                                        type="text"
                                        value={telefoneClienteEditado}
                                        onChange={(e) => setTelefoneClienteEditado(e.target.value)}
                                    />
                                ) : (
                                    cliente.telefone
                                )}
                            </td>
                            <td>
                                {editandoCliente === cliente.id ? (
                                    <input
                                        type="text"
                                        value={emailClienteEditado}
                                        onChange={(e) => setEmailClienteEditado(e.target.value)}
                                    />
                                ) : (
                                    cliente.email
                                )}
                            </td>
                            <td>
                                {editandoCliente === cliente.id ? (
                                    <input
                                        type="text"
                                        value={cpfClienteEditado}
                                        onChange={(e) => setCpfClienteEditado(e.target.value)}
                                    />
                                ) : (
                                    cliente.cpf
                                )}
                            </td>
                            <td>
                                {editandoCliente === cliente.id ? (
                                    <input
                                        type="password"
                                        value={senhaClienteEditada}
                                        onChange={(e) => setSenhaClienteEditada(e.target.value)}
                                    />
                                ) : (
                                    cliente.senha
                                )}
                            </td>
                            <td>
                                {editandoCliente === cliente.id ? (
                                    <>
                                        <button onClick={() => salvarEdicao(cliente.id)}>Salvar</button>
                                        <button onClick={cancelarEdicao}>Cancelar</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleEdit(cliente.id, cliente.nome, cliente.telefone, cliente.email, cliente.cpf, cliente.senha)}>Editar</button>
                                        <button onClick={() => handleDelete(cliente.id)}>Excluir</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default ClienteList;
