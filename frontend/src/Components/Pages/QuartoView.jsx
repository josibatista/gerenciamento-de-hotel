import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";

function QuartoView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quarto, setQuarto] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState('');
    const [currentQuarto, setCurrentQuarto] = useState({
        codigo: '',
        tipo: '',
        valorDiaria: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch(`http://localhost:8080/api/quartos/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(resp => resp.json())
        .then(data => {
            setQuarto(data);
            setCurrentQuarto(data); 
        })
        .catch(err => console.error(err));
    }, [id]);

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setCurrentQuarto((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        setMensagem('');
        setTipoMensagem('');

        const valor = parseFloat(currentQuarto.valorDiaria);
        if (isNaN(valor)) {
            setMensagem('Valor da diária inválido. Digite um número.');
            setTipoMensagem('erro');
            return; 
        }

        try {
            const todosResp = await fetch("http://localhost:8080/api/quartos", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const todos = await todosResp.json();
            const codigoIgual = todos.some(q => 
                q.codigo === currentQuarto.codigo && q.id !== Number(id)
            );

            if (codigoIgual) {
                setMensagem("Código já existe! Escolha outro código.");
                setTipoMensagem('erro');
                return;
            }

            const resp = await fetch(`http://localhost:8080/api/quartos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(currentQuarto)
            });
            
            const data = await resp.json();
            if(!resp.ok) throw new Error('Erro ao atualizar');

            setQuarto(data);
            setIsEditMode(false);
            setMensagem("Editado com sucesso!");
            setTipoMensagem('sucesso');

        } catch (err) {
            console.error(err);
            setMensagem("Erro ao salvar alterações.");
            setTipoMensagem('erro');
        }
    };

    const handleDelete = () => {
        if(!window.confirm("Deseja excluir permanentemente?")) return;

        const token = localStorage.getItem('token');
        
        fetch(`http://localhost:8080/api/quartos/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then((resp) => {
            if (!resp.ok) throw new Error('Falha ao excluir quarto');
            navigate("/quartos/lista"); 
        })
        .catch((err) => console.error(err));
    };

    if (!quarto) return <div className="conteudo-pagina"><p>Carregando...</p></div>;

    return (
        <div className="conteudo-pagina">
            <div className="card">
                <h2 style={{color: 'var(--cor-primaria)', marginBottom: '1.5rem'}}>
                    {isEditMode ? 'Editar Quarto' : 'Detalhes do Quarto'}
                </h2>

                {mensagem && (
                    <div className={tipoMensagem === 'sucesso' ? 'alert-sucesso' : 'alert-erro'}>
                        {mensagem}
                    </div>
                )}

                <div className="form-group">
                    <label>Código:</label>
                    {isEditMode ? (
                        <input
                            type="text"
                            name="codigo"
                            value={currentQuarto.codigo}
                            onChange={handleEditChange}
                            required
                        />
                    ) : (
                        <p style={{fontSize: '1.1rem', margin: '5px 0 0 0'}}>{quarto.codigo}</p>
                    )}
                </div>

                <div className="form-group">
                    <label>Tipo:</label>
                    {isEditMode ? (
                        <select
                            name="tipo"
                            value={currentQuarto.tipo}
                            onChange={handleEditChange}
                        >
                            <option value="solteiro">Solteiro</option>
                            <option value="duplo">Duplo</option>
                            <option value="casal">Casal</option>
                            <option value="suite">Suíte</option>
                            <option value="luxo">Luxo</option>
                        </select>
                    ) : (
                        <p style={{fontSize: '1.1rem', margin: '5px 0 0 0'}}>{quarto.tipo}</p>
                    )}
                </div>
                
                <div className="form-group">
                    <label>Valor da diária:</label>
                    {isEditMode ? (
                        <input
                            type="number"
                            name="valorDiaria"
                            value={currentQuarto.valorDiaria}
                            onChange={handleEditChange}
                        />
                    ) : (
                        <p style={{fontSize: '1.1rem', margin: '5px 0 0 0'}}>R$ {quarto.valorDiaria}</p>
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
                            <button className="btn-secundario" onClick={() => navigate('/quartos/lista')}>Voltar</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default QuartoView;