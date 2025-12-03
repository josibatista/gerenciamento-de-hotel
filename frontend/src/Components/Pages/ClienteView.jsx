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
    const applyMaskCPF = (v) => {
        v = v.replace(/\D/g, ""); 
        if (v.length > 11) v = v.slice(0, 11);
        v = v.replace(/(\d{3})(\d)/, "$1.$2");
        v = v.replace(/(\d{3})(\d)/, "$1.$2");
        v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        return v;
    };
    const applyMaskPhone = (v) => {
        v = v.replace(/\D/g, "");
        if (v.length > 11) v = v.slice(0, 11);
        v = v.replace(/^(\d{2})(\d)/g, "($1) $2"); 
        v = v.replace(/(\d)(\d{4})$/, "$1-$2");
        return v;
    };

    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch(`http://localhost:8080/api/clientes/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(resp => resp.json())
        .then(data => {
            if(data.error) {
                setMensagem(data.error);
                return;
            }
            setCliente(data);
            setCurrentCliente({
                ...data,
                cpf: applyMaskCPF(data.cpf || ''),
                telefone: applyMaskPhone(data.telefone || ''),
                senha: '' 
            }); 
        })
        .catch(err => console.error(err));
    }, [id]);

    const handleEditChange = (e) => {
        let { name, value } = e.target;
        if (name === 'cpf') value = applyMaskCPF(value);
        if (name === 'telefone') value = applyMaskPhone(value);

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

        const clienteParaSalvar = {
            ...currentCliente,
            cpf: currentCliente.cpf.replace(/\D/g, ''),
            telefone: currentCliente.telefone.replace(/\D/g, '')
        };

        fetch(`http://localhost:8080/api/clientes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(clienteParaSalvar)
        })
        .then(async (resp) => {
            const data = await resp.json();
            if (!resp.ok) {
                throw new Error(data.error || 'Erro ao atualizar cliente');
            }
            return data;
        })
        .then(data => {
            setCliente(data); 
            setIsEditMode(false); 
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
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                
                <h2 style={{color: 'var(--cor-primaria)', marginBottom: '1.5rem', textAlign: 'center'}}>
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
                            maxLength="15"
                        />
                    ) : (
                        <p style={{fontSize: '1.1rem', margin: '5px 0 0 0'}}>
                            {applyMaskPhone(cliente.telefone || '')}
                        </p>
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
                            maxLength="14"
                        />
                    ) : (
                        <p style={{fontSize: '1.1rem', margin: '5px 0 0 0'}}>
                            {applyMaskCPF(cliente.cpf || '')}
                        </p>
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