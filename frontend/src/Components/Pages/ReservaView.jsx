import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ReservaView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reserva, setReserva] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [quartos, setQuartos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [form, setForm] = useState({
        checkin: "",
        checkout: "",
        clienteId: "",
        quartoId: "",
        totalDiarias: 0,
        valorTotal: 0,
    });

    const token = localStorage.getItem("token");
    const user = token ? jwtDecode(token) : null;
    
    const isAdmin = user?.role === "admin";
    const currentUserId = user ? Number(user.id) : null; 
    

    useEffect(() => {
        if (!token) {
            navigate("/login"); 
            return;
        }

        // 1. Carrega reserva (com includes de cliente e quarto, graças à correção no BE)
        fetch(`http://localhost:8080/api/reservas/${id}`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(r => {
                // Se o backend corrigido retornar 403/404, o frontend redireciona
                if (r.status === 403 || r.status === 404) {
                    alert("Acesso negado ou reserva não encontrada.");
                    navigate("/reservas/lista"); 
                    throw new Error("Acesso negado/Reserva não encontrada");
                }
                return r.json();
            })
            .then(data => {
                const isOwner = Number(data.clienteId) === currentUserId;
                
                // Redundância de segurança no frontend
                if (!isAdmin && !isOwner) {
                    alert("Você só pode acessar suas próprias reservas.");
                    navigate("/reservas/lista"); 
                    return;
                }

                setReserva(data);
                setForm({
                    checkin: data.checkin.split('T')[0],
                    checkout: data.checkout.split('T')[0],
                    clienteId: data.clienteId,
                    quartoId: data.quartoId,
                    totalDiarias: data.totalDiarias,
                    valorTotal: data.valorTotal
                });
            })
            .catch(err => console.error(err));
        // ... (carregamento de quartos e clientes inalterado)

        fetch("http://localhost:8080/api/quartos", {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(setQuartos)
            .catch(err => console.error(err));

        if (isAdmin) {
            fetch("http://localhost:8080/api/clientes", {
                headers: { "Authorization": `Bearer ${token}` }
            })
                .then(r => r.json())
                .then(setClientes)
                .catch(err => console.error(err));
        }
    }, [id, token, navigate]); 

    // ... (useEffect de cálculo, handleChange, handleSave, handleDelete inalterados)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        
        let payload = form;

        if (!isAdmin) {
            payload = { ...form, clienteId: reserva.clienteId }; 
        }

        try {
            const resp = await fetch(`http://localhost:8080/api/reservas/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (resp.status === 403) {
                alert("Você não tem permissão para editar esta reserva.");
                return;
            }

            if (!resp.ok) throw new Error("Erro ao editar reserva");

            alert("Reserva atualizada com sucesso!");
            navigate("/reservas/lista");

        } catch (err) {
            console.error(err);
            alert("Erro ao salvar.");
        }
    };

    const handleDelete = () => {
        if (!window.confirm("Deseja excluir esta reserva?")) return;

        fetch(`http://localhost:8080/api/reservas/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then((resp) => {
            if (resp.status === 403) {
                alert("Você não tem permissão para excluir esta reserva.");
                return;
            }
            if (!resp.ok) throw new Error("Erro ao excluir");
            
            navigate("/reservas/lista");
        })
        .catch((err) => {
            console.error(err);
            alert("Erro ao excluir reserva.");
        });
    };
    
    // 🛠️ GARANTIDO: Coerção de tipo correta para isOwner
    const isOwner = Number(reserva?.clienteId) === currentUserId; 
    const canModify = isAdmin || isOwner; 


    if (!reserva) return <p>Carregando...</p>;


    return (
        <div className="conteudo-pagina">
            <div className="card">
                <h2>{isEditMode ? "Editar Reserva" : "Detalhes da Reserva"}</h2>

                <div className="form-group">
                    <label>Check-in:</label>
                    {isEditMode ? (
                        <input type="date" name="checkin" value={form.checkin} onChange={handleChange} />
                    ) : (
                        <p>{new Date(reserva.checkin).toLocaleDateString()}</p>
                    )}
                </div>

                <div className="form-group">
                    <label>Check-out:</label>
                    {isEditMode ? (
                        <input type="date" name="checkout" value={form.checkout} onChange={handleChange} />
                    ) : (
                        <p>{new Date(reserva.checkout).toLocaleDateString()}</p>
                    )}
                </div>

                <div className="form-group">
                    <label>Cliente:</label>
                    {(isAdmin && isEditMode) ? (
                        <select name="clienteId" value={form.clienteId} onChange={handleChange}>
                            {clientes.map(c => (
                                <option key={c.id} value={c.id}>{c.nome}</option>
                            ))}
                        </select>
                    ) : (
                        <p>{reserva.cliente?.nome}</p> 
                    )}
                </div>

                <div className="form-group">
                    <label>Quarto:</label>
                    {isEditMode ? (
                        <select name="quartoId" value={form.quartoId} onChange={handleChange}>
                            <option value="">Selecione um Quarto</option>
                            {quartos.map(q => (
                                <option key={q.id} value={q.id}>{q.codigo} (R$ {q.valorDiaria})</option>
                            ))}
                        </select>
                    ) : (
                        <p>{reserva.quarto?.codigo}</p> 
                    )}
                </div>

                <div className="form-group">
                    <label>Total de diárias:</label>
                    <p>{form.totalDiarias}</p>
                </div>

                <div className="form-group">
                    <label>Valor total:</label>
                    <p>R$ {form.valorTotal}</p>
                </div>

                <div className="form-actions">
                    {isEditMode ? (
                        <>
                            <button onClick={handleSave}>Salvar</button>
                            <button className="btn-secundario" onClick={() => setIsEditMode(false)}>Cancelar</button>
                        </>
                    ) : (
                        <>
                            {canModify && (
                                <>
                                    <button onClick={() => setIsEditMode(true)}>Editar</button>
                                    <button className="btn-perigo" onClick={handleDelete}>Excluir</button>
                                </>
                            )}
                            <button className="btn-secundario" onClick={() => navigate("/reservas/lista")}>Voltar</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReservaView;