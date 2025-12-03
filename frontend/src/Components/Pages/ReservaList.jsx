import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ReservaList() {
    const navigate = useNavigate();
    const [reservas, setReservas] = useState([]);
    const [role, setRole] = useState(null);
    const [userId, setUserId] = useState(null);

    const formatarData = (isoString) => {
        if (!isoString) return "—";
        const [ano, mes, dia] = isoString.split("T")[0].split("-");
        return `${dia}/${mes}/${ano}`;
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode(token);

        setRole(decoded.role);
        setUserId(decoded.id);

        fetch("http://localhost:8080/api/reservas", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(resp => {
                if (!resp.ok) throw new Error("Erro ao carregar reservas");
                return resp.json();
            })
            .then(data => {
                const ordenadas = [...data].sort((a, b) => {
                    const d1 = new Date(a.checkin);
                    const d2 = new Date(b.checkin);
                    return d1 - d2;
                });
                setReservas(ordenadas);
            })
            .catch(err => console.error(err));
    }, []);

    const handleDelete = (id) => {
        if (!window.confirm("Deseja excluir esta reserva?")) return;

        const token = localStorage.getItem("token");

        fetch(`http://localhost:8080/api/reservas/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then((resp) => {
                if (!resp.ok) throw new Error("Falha ao excluir reserva");
                setReservas(reservas.filter((r) => r.id !== id));
            })
            .catch((err) => console.error(err));
    };

    const isAdmin = role === "admin";
    const showAcoesHeader = isAdmin || reservas.some(r => r.clienteId === userId);

    return (
        <div className="conteudo-pagina">
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
            }}>
                <h2>Listar Reservas</h2>

                <button onClick={() => navigate("/reservas")}>
                    + Nova Reserva
                </button>
            </div>

            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <table>
                    <thead>
                        <tr>
                            <th>Quarto</th>
                            <th>Cliente</th>
                            <th>Check-in</th>
                            <th>Check-out</th>
                            {showAcoesHeader && <th style={{ textAlign: 'right' }}>Ações</th>} 
                        </tr>
                    </thead>

                    <tbody>
                        {reservas.map((r) => {
                            const canModify = isAdmin || (r.clienteId === userId);
                            
                            return (
                                <tr 
                                    key={r.id}
                                    onClick={() => navigate(`/reservas/${r.id}`)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <td>{r.quarto?.codigo ?? "—"}</td>
                                    <td>{r.cliente?.nome ?? "—"}</td>

                                    <td>{formatarData(r.checkin)}</td>
                                    <td>{formatarData(r.checkout)}</td>

                                    {canModify && (
                                        <td>
                                            <div style={{ display: "flex", gap: "10px", justifyContent: 'flex-end' }}>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/reservas/${r.id}`);
                                                    }}
                                                >
                                                    Visualizar
                                                </button>

                                                <button
                                                    className="btn-perigo"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); 
                                                        handleDelete(r.id);
                                                    }}
                                                >
                                                    Excluir
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                    
                                    {isAdmin && !canModify && <td></td>}

                                </tr>
                            );
                        })}

                        {reservas.length === 0 && (
                            <tr>
                                <td 
                                    colSpan={isAdmin ? 5 : 4} 
                                    style={{ textAlign: "center", padding: "20px" }}
                                >
                                    Nenhuma reserva encontrada.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ReservaList;