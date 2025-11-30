import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";

function QuartoView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quarto, setQuarto] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [mensagem, setMensagem] = useState('');
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

        const valor = parseFloat(currentQuarto.valorDiaria);
        if (isNaN(valor)) {
            setMensagem('Valor da diária inválido. Digite um número.');
            return; 
        }

        const todosResp = await fetch("http://localhost:8080/api/quartos", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const todos = await todosResp.json();
         const codigoIgual = todos.some(q => 
            q.codigo === currentQuarto.codigo && q.id !== Number(id)
        );

        if (codigoIgual) {
            setMensagem("Código já existe! Escolha outro código.");
            return;
        }

        fetch(`http://localhost:8080/api/quartos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(currentQuarto)
        })
        .then(resp => resp.json())
        .then(data => {
            setQuarto(data);
            setIsEditMode(false);
            setMensagem("Editado com sucesso!");
        })
        .catch(err => console.error(err));
    };

    const handleDelete = () => {
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

    if (!quarto) return <p>Não foi possível encontrar o quarto</p>;

    return (
        <div>
            <h2>Detalhes do Quarto</h2>

            {mensagem && <p>{mensagem}</p>}

            <div>
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
                    <p>{quarto.codigo}</p>
                )}
            </div>

            <div>
                <label>Tipo:</label>
                {isEditMode ? (
                    <select
                        name="tipo"
                        value={currentQuarto.tipo}
                        onChange={handleEditChange}
                    >
                        <option value="">Selecione...</option>
                        <option value="solteiro">Solteiro</option>
                        <option value="duplo">Duplo</option>
                        <option value="casal">Casal</option>
                        <option value="suite">Suíte</option>
                        <option value="luxo">Luxo</option>
                    </select>
                ) : (
                    <p>{quarto.tipo}</p>
                )}
            </div>
            
            <div>
                <label>Valor da diária:</label>
                {isEditMode ? (
                    <input
                        type="number"
                        name="valorDiaria"
                        value={currentQuarto.valorDiaria}
                        onChange={handleEditChange}
                    />
                ) : (
                    <p>R$ {quarto.valorDiaria}</p>
                )}
            </div>

            {isEditMode ? (
                <>
                    <button onClick={handleSave}>Salvar</button>
                    <button onClick={() => setIsEditMode(false)}>Cancelar</button>
                </>
            ) : (
                <>
                    <button onClick={() => setIsEditMode(true)}>Editar</button>
                    <button onClick={handleDelete}>Excluir</button>
                </>
            )}
        </div>
    );
}

export default QuartoView;
