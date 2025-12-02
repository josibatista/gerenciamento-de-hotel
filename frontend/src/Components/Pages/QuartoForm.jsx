import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";


const QuartoForm = () => {
    const [codigo, setCodigo] = useState('');
    const [tipo, setTipo] = useState('');
    const [valorDiaria, setValorDiaria] = useState('');
    const [quartos, setQuartos] = useState([]);
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState(''); 
    const navigate = useNavigate();

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
        .catch((err) => console.error(err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setMensagem('');
        setTipoMensagem('');

        const valor = parseFloat(valorDiaria);
        if (isNaN(valor)) {
            setMensagem('Valor da diária inválido. Digite um número.');
            setTipoMensagem('erro');
            return; 
        }

        const codigoExistente = quartos.some(q => q.codigo === codigo);
        if (codigoExistente) {
            setMensagem('Código já existe. Escolha outro código.');
            setTipoMensagem('erro');
            return;
        }

        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:8080/api/quartos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ codigo, tipo, valorDiaria: parseFloat(valorDiaria) })
            });

            if (!response.ok) {
                throw new Error('Erro ao criar quarto');
            }

            const data = await response.json();
            console.log('Quarto cadastrado:', data);
            setMensagem('Quarto cadastrado com sucesso!');
            setTipoMensagem('sucesso');

            setCodigo('');
            setTipo('');
            setValorDiaria('');
            setQuartos([...quartos, data]);

            setTimeout(() => {
                navigate('/quartos/lista');
            }, 2000);

        } catch(error) {
            console.error('Erro ao cadastrar quarto:', error);
            setMensagem('Erro ao cadastrar quarto');
            setTipoMensagem('erro');
        }
    };

    return (
        <div className="conteudo-pagina login-container"> 
            <div className="card">
                <h2 className="login-header">Cadastrar Quarto</h2>
                
                {mensagem && (
                    <div className={tipoMensagem === 'sucesso' ? 'alert-sucesso' : 'alert-erro'}>
                        {mensagem}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Código (Número do Quarto)</label>
                        <input 
                            type="text" 
                            value={codigo} 
                            onChange={e => setCodigo(e.target.value)} 
                            required 
                            placeholder="Ex: 101"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Tipo</label>
                        <select value={tipo} onChange={e => setTipo(e.target.value)} required>
                            <option value="">Selecione uma categoria</option>
                            <option value="solteiro">Solteiro</option>
                            <option value="duplo">Duplo</option>
                            <option value="casal">Casal</option>
                            <option value="suite">Suíte</option>
                            <option value="luxo">Luxo</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Valor Diária (R$)</label>
                        <input 
                            type="number" 
                            value={valorDiaria} 
                            onChange={e => setValorDiaria(e.target.value)} 
                            required 
                            placeholder="Ex: 150.00"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit">Cadastrar</button>
                        <button 
                            type="button" 
                            className="btn-secundario" 
                            onClick={() => navigate('/quartos/lista')}
                        >
                            Voltar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default QuartoForm;