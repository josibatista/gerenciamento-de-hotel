import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";


const QuartoForm = () => {
    const [codigo, setCodigo] = useState('');
    const [tipo, setTipo] = useState('');
    const [valorDiaria, setValorDiaria] = useState('');
    const [quartos, setQuartos] = useState([]);
    const [mensagem, setMensagem] = useState('');
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

        const valor = parseFloat(valorDiaria);
        if (isNaN(valor)) {
            setMensagem('Valor da diária inválido. Digite um número.');
            return; 
        }

        const codigoExistente = quartos.some(q => q.codigo === codigo);
        if (codigoExistente) {
            setMensagem('Código já existe. Escolha outro código.');
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
            console.log('Quarto criado:', data);
            setMensagem('Quarto cadastrado com sucesso!');

            setCodigo('');
            setTipo('');
            setValorDiaria('');

            setQuartos([...quartos, data]);

            setTimeout(() => {
                navigate('/quartos/lista');
            }, 2000);

        } catch(error) {
            console.error('Erro ao criar quarto:', error);
            setMensagem('Erro ao cadastrar quarto');
        }
    };

    return (
        <div> 
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Código</label>
                    <input type="text" value={codigo} onChange={e => setCodigo(e.target.value)} required />
                </div>
                <div>
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
                <div>
                    <label>Valor Diária</label>
                    <input type="text" value={valorDiaria} onChange={e => setValorDiaria(e.target.value)} required />
                </div>
                <button type="submit">Cadastrar Quarto</button>
            </form>
            {mensagem && <p>{mensagem}</p>}
        </div>
    );
};

export default QuartoForm;