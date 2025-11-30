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
            navigate("/clientes/lista"); 
        })
        .catch((err) => {
            console.error(err);
            setMensagem("Erro ao excluir: " + err.message);
        });
    };

    if (!cliente && !mensagem) return <div className="conteudo-pagina"><p>Carregando...</p></div>;
    if (!cliente && mensagem) return <div className="conteudo-pagina"><p className="alert-erro">{mensagem}</p></div>;

    return (
        <div className="conteudo-pagina">
            <div className="card">
                <h2 style={{color: 'var(--cor-primaria)', marginBottom: '1.5rem'}}>
                    {isEditMode ? 'Editar Perfil' : 'Detalhes do Perfil'}
                </h2>

                {mensagem && (
                    <div className={mensagem.includes('sucesso') ? 'alert-sucesso' : 'alert-erro'}>
                        {mensagem}
                    </div>
                )}

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
                        <p style={{fontSize: '1.1rem', margin: '5px 0 0 0'}}>{cliente.nome}</p>
                    )}
                </div>

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
                        <p style={{fontSize: '1.1rem', margin: '5px 0 0 0'}}>{cliente.telefone}</p>
                    )}
                </div>

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
                        <p style={{fontSize: '1.1rem', margin: '5px 0 0 0'}}>{cliente.email}</p>
                    )}
                </div>

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
                        <p style={{fontSize: '1.1rem', margin: '5px 0 0 0'}}>{cliente.cpf}</p>
                    )}
                </div>

                <div className="form-group">
                    <label>Senha:</label>
                    {isEditMode ? (
                        <input
                            type="password"
                            name="senha"
                            value={currentCliente.senha}
                            onChange={handleEditChange}
                            placeholder="Nova senha (opcional)"
                        />
                    ) : (
                        <p style={{fontSize: '1.1rem', margin: '5px 0 0 0'}}>******</p>
                    )}
                </div>

                <div className="form-actions" style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                    {isEditMode ? (
                        <>
                            <button onClick={handleSave}>Salvar</button>
                            <button className="btn-secundario" onClick={() => setIsEditMode(false)}>Cancelar</button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setIsEditMode(true)}>Editar</button>
                            <button className="btn-perigo" onClick={handleDelete}>Excluir</button>
                            <button className="btn-secundario" onClick={() => navigate('/clientes/lista')}>Voltar</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ClienteView;