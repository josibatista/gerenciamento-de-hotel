import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";

function ClienteView() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [cliente, setCliente] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [mensagem, setMensagem] = useState('');
    
    const [currentCliente, setCurrentCliente] = useState({
        nome: '',
        telefone: '',
        email: '',
        cpf: '',
        senha: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch(`http://localhost:8080/api/clientes/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(resp => resp.json())
        .then(data => {
            // Se der erro ou não achar
            if(data.error) {
                setMensagem(data.error);
                return;
            }
            setCliente(data);
            setCurrentCliente(data); 
        })
        .catch(err => console.error(err));
    }, [id]);

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setCurrentCliente((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        setMensagem('');

        if (!currentCliente.nome || !currentCliente.cpf) {
            setMensagem('Nome e CPF são obrigatórios.');
            return;
        }

        fetch(`http://localhost:8080/api/clientes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(currentCliente)
        })
        .then(async (resp) => {
            const data = await resp.json();
            if (!resp.ok) {
                throw new Error(data.error || 'Erro ao atualizar cliente');
            }
            return data;
        })
        .then(data => {
            setCliente(data); // Atualiza a visualização estática
            setIsEditMode(false); // Sai do modo edição
            setMensagem("Editado com sucesso!");
        })
        .catch(err => {
            console.error(err);
            setMensagem(err.message);
        });
    };

    const handleDelete = () => {
        if(!window.confirm("Tem certeza que deseja excluir este cliente?")) return;

        const token = localStorage.getItem('token');

        fetch(`http://localhost:8080/api/clientes/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then((resp) => {
            if (!resp.ok) throw new Error('Falha ao excluir cliente');
            // Redireciona para a lista de clientes
            navigate("/clientes"); 
        })
        .catch((err) => {
            console.error(err);
            setMensagem("Erro ao excluir: " + err.message);
        });
    };

    if (!cliente && !mensagem) return <p>Carregando...</p>;
    if (!cliente && mensagem) return <p className="error">{mensagem}</p>;

    return (
        <div className="container">
            <h2>Detalhes do Cliente</h2>

            {mensagem && <p style={{color: 'blue', fontWeight: 'bold'}}>{mensagem}</p>}

            {/* Campo: NOME */}
            <div className="form-group">
                <label>Nome Completo:</label>
                {isEditMode ? (
                    <input
                        type="text"
                        name="nome"
                        value={currentCliente.nome}
                        onChange={handleEditChange}
                        required
                    />
                ) : (
                    <p>{cliente.nome}</p>
                )}
            </div>

            {/* Campo: TELEFONE */}
            <div className="form-group">
                <label>Telefone:</label>
                {isEditMode ? (
                    <input
                        type="text"
                        name="telefone"
                        value={currentCliente.telefone}
                        onChange={handleEditChange}
                    />
                ) : (
                    <p>{cliente.telefone}</p>
                )}
            </div>

            {/* Campo: EMAIL */}
            <div className="form-group">
                <label>Email:</label>
                {isEditMode ? (
                    <input
                        type="email"
                        name="email"
                        value={currentCliente.email}
                        onChange={handleEditChange}
                    />
                ) : (
                    <p>{cliente.email}</p>
                )}
            </div>

            {/* Campo: CPF */}
            <div className="form-group">
                <label>CPF:</label>
                {isEditMode ? (
                    <input
                        type="text"
                        name="cpf"
                        value={currentCliente.cpf}
                        onChange={handleEditChange}
                    />
                ) : (
                    <p>{cliente.cpf}</p>
                )}
            </div>

            {/* Campo: SENHA */}
            <div className="form-group">
                <label>Senha:</label>
                {isEditMode ? (
                    <input
                        type="password"
                        name="senha"
                        value={currentCliente.senha}
                        onChange={handleEditChange}
                    />
                ) : (
                    // TESTAR E ARRUMAR ESSA PARTE - Exibe mascarado ou o valor real (depende da sua preferência)
                    <p>******</p> 
                )}
            </div>

            {/* BOTOES DE AÇÃO */}
            <div style={{marginTop: '20px'}}>
                {isEditMode ? (
                    <>
                        <button onClick={handleSave} style={{marginRight: '10px'}}>Salvar</button>
                        <button className="btn-secundario" onClick={() => setIsEditMode(false)}>Cancelar</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => setIsEditMode(true)} style={{marginRight: '10px'}}>Editar</button>
                        <button className="btn-perigo" onClick={handleDelete}>Excluir</button>
                    </>
                )}
            </div>
        </div>
    );
}

export default ClienteView;