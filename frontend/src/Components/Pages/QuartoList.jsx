import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function QuartoList() {
    const navigate = useNavigate();
    const [quartos, setQuartos] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false); 
    const [mensagem, setMensagem] = useState('');
    const [dataFiltro, setDataFiltro] = useState('');
    const [currentQuarto, setCurrentQuarto] = useState({
        codigo: '',
        tipo: '',
        valorDiaria: ''
    });

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        if (role === 'admin') {
            setIsAdmin(true);
        }
        buscarQuartos();
    }, []);

    const buscarQuartos = () => {
        const token = localStorage.getItem('token');
        setMensagem('');
        
        let url = 'http://localhost:8080/api/quartos';
        if (dataFiltro) {
            url = `http://localhost:8080/api/quartos/disponiveis?data=${dataFiltro}`;
        }

        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        })
        .then((resp) => {
            if (!resp.ok) {
                if (resp.status === 403) setMensagem("Acesso negado.");
                throw new Error('Falha ao buscar quartos');
            }
            return resp.json();
        })
        .then((data) => {
            // Garante que 'data' seja um array antes de salvar
            if (Array.isArray(data)) {
                setQuartos(data);
                if (dataFiltro && data.length === 0) {
                    setMensagem("Nenhum quarto disponível para esta data.");
                }
            } else {
                setQuartos([]);
            }
        })
        .catch((err) => {
            console.error(err);
            setMensagem("Erro ao carregar lista.");
            setQuartos([]);
        });
    };

    const handleDelete = (id) => {
        if (!isAdmin) return;
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
            if (!resp.ok) throw new Error('Erro ao excluir');
            setQuartos(quartos.filter((q) => q.id !== id));
        })
        .catch(err => alert(err.message));
    };

    return (
        <div className="conteudo-pagina">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                <h2>Listar Quartos</h2>
                {isAdmin && <button onClick={() => navigate('/quartos')}>+ Novo Quarto</button>} 
            </div>

            {mensagem && <div className="alert-erro">{mensagem}</div>}

            <div className="card" style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa' }}>
                <div className="form-group" style={{ marginBottom: 0, justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <label style={{ margin: 0, whiteSpace: 'nowrap' }}>Verificar disponibilidade:</label>
                    <input 
                        type="date" 
                        value={dataFiltro}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setDataFiltro(e.target.value)}
                        style={{ maxWidth: '200px' }}
                    />
                    <button onClick={buscarQuartos} style={{ padding: '8px 15px' }}>
                        Filtrar
                    </button>
                    {dataFiltro && (
                        <button 
                            className="btn-secundario" 
                            onClick={() => { 
                                setDataFiltro(''); 
                                setTimeout(() => window.location.reload(), 100); 
                            }} 
                            style={{ padding: '8px 12px' }}
                        >
                            Limpar
                        </button>
                    )}
                </div>
            </div>

            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <table>
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Tipo</th>
                            <th>Valor Diária</th>
                            {dataFiltro && <th>Status</th>}
                            {isAdmin && <th style={{ width: '200px' }}>Ações</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {quartos.map((quarto) => (
                            <tr key={quarto.id}>
                                <td>{quarto.codigo}</td>
                                <td>{quarto.tipo}</td>
                                <td>R$ {quarto.valorDiaria}</td>
                                {dataFiltro && (
                                    <td>
                                        <span style={{ color: 'green', fontWeight: 'bold' }}>Disponível</span>
                                    </td>
                                )}
                                {isAdmin && (
                                    <td>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button onClick={() => navigate(`/quartos/${quarto.id}`)}>Visualizar</button>
                                            <button className="btn-perigo" onClick={() => handleDelete(quarto.id)}>Excluir</button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {quartos.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>
                                    {dataFiltro 
                                        ? "Nenhum quarto disponível nesta data." 
                                        : "Nenhum quarto cadastrado."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default QuartoList;