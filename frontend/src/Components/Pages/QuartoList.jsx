import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function QuartoList() {
    const [quartos, setQuartos] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentQuarto, setCurrentQuarto] = useState({
        id: '',
        codigo: '',
        tipo: '',
        valorDiaria: ''
    });

    // Carregar lista de quartos
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
        .catch((err) => console.log(err));
    }, []);

    const handleDelete = (id) => {
        const token = localStorage.getItem('token');

        fetch(`http://localhost:8080/api/quartos/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then((resp) => {
            if (!resp.ok) {
                throw new Error('Falha ao excluir quarto');
            }
            setQuartos(quartos.filter((quarto) => quarto.id !== id));
        })
        .catch((err) => console.error(err));
    };

    const handleEditClick = (quarto) => {
        setCurrentQuarto(quarto);
        setIsEditMode(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setCurrentQuarto((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        fetch(`http://localhost:8080/api/quartos/${currentQuarto.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(currentQuarto)
        })
        .then((resp) => {
            if (!resp.ok) {
                throw new Error('Falha ao editar quarto');
            }
            return resp.json();
        })
        .then((data) => {
            setQuartos(quartos.map((quarto) => 
                quarto.id === data.id ? data : quarto
            ));
            setIsEditMode(false);
        })
        .catch((err) => console.error(err));
    };

    return (
        <>
            <h1>Listar Quartos</h1>

            <table>
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Tipo</th>
                        <th>Valor Diária</th>
                        <th>Ações</th>
                    </tr>
                </thead>

                <tbody>
                    {quartos.map((quarto) => (
                        <tr key={quarto.id}>
                            <td>{quarto.codigo}</td>
                            <td>{quarto.tipo}</td>
                            <td>{quarto.valorDiaria}</td>
                            <td>
                                <button onClick={() => handleEditClick(quarto)}>Editar</button>
                                <button onClick={() => handleDelete(quarto.id)}>Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Link to="/quartos">
                <button>Criar</button>
            </Link>

            {isEditMode && (
                <div className="modal">
                    <form onSubmit={handleEditSubmit}>
                        
                        <div>
                            <label>Código</label>
                            <input
                                type="text"
                                name="codigo"
                                value={currentQuarto.codigo}
                                onChange={handleEditChange}
                                required
                            />
                        </div>

                        <div>
                            <label>Tipo</label>
                            <select 
                                name="tipo"
                                value={currentQuarto.tipo}
                                onChange={handleEditChange}
                                required
                            >
                                <option value="">Selecione...</option>
                                <option value="solteiro">Solteiro</option>
                                <option value="duplo">Duplo</option>
                                <option value="casal">Casal</option>
                                <option value="suite">Suíte</option>
                                <option value="luxo">Luxo</option>
                            </select>
                        </div>

                        <div>
                            <label>Valor da Diária</label>
                            <input
                                type="text"
                                name="valorDiaria"
                                value={currentQuarto.valorDiaria}
                                onChange={handleEditChange}
                                required
                            />
                        </div>

                        <button type="submit">Salvar</button>
                        <button type="button" onClick={() => setIsEditMode(false)}>Cancelar</button>
                    </form>
                </div>
            )}
        </>
    );
}

export default QuartoList;
