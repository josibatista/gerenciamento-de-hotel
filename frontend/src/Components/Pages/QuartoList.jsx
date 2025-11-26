import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';



function QuartoList() {
    const navigate = useNavigate();
    const [quartos, setQuartos] = useState([]);
    const [mensagem, setMensagem] = useState('');
    const [currentQuarto, setCurrentQuarto] = useState({
        codigo: '',
        tipo: '',
        valorDiaria: ''
    });

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

    const handleViewClick = (quarto) => {
        navigate(`/quartos/${quarto.id}`);
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
                                <button onClick={() => handleViewClick(quarto)}>Visualizar</button>
                                <button onClick={() => handleDelete(quarto.id)}>Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Link to="/quartos">
                <button>Criar</button>
            </Link>
            {mensagem && <p>{mensagem}</p>}
        </>
    );
}

export default QuartoList;
