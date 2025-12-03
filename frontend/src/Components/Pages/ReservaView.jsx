import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const fixDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const local = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    return local.toISOString().split("T")[0];
};

const agruparIntervalos = (datas) => {
    if (!datas.length) return [];
    const ordenadas = [...datas].sort();
    let grupos = [];
    let inicio = ordenadas[0];
    let fim = ordenadas[0];

    for (let i = 1; i < ordenadas.length; i++) {
        const atual = new Date(ordenadas[i]);
        const anterior = new Date(fim);
        anterior.setDate(anterior.getDate() + 1);

        if (atual.toISOString().split("T")[0] === anterior.toISOString().split("T")[0]) {
            fim = ordenadas[i];
        } else {
            grupos.push({ inicio, fim });
            inicio = ordenadas[i];
            fim = ordenadas[i];
        }
    }

    grupos.push({ inicio, fim });
    return grupos;
};

const ReservaView = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [reserva, setReserva] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [quartos, setQuartos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [reservasQuarto, setReservasQuarto] = useState([]);
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState('');

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

        fetch(`http://localhost:8080/api/reservas/${id}`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => {
                const isOwner = Number(data.clienteId) === currentUserId;
                if (!isAdmin && !isOwner) {
                    setMensagem("Você não pode acessar esta reserva.");
                    setTipoMensagem("erro");
                    setTimeout(() => navigate("/reservas/lista"), 1500);
                    return;
                }

                setReserva(data);

                setForm({
                    checkin: fixDate(data.checkin),
                    checkout: fixDate(data.checkout),
                    clienteId: data.clienteId,
                    quartoId: data.quartoId,
                    totalDiarias: data.totalDiarias,
                    valorTotal: data.valorTotal,
                });

                carregarReservasDoQuarto(data.quartoId);
            });

        fetch("http://localhost:8080/api/quartos", {
            headers: { "Authorization": `Bearer ${token}` }
        }).then(r => r.json()).then(setQuartos);

        if (isAdmin) {
            fetch("http://localhost:8080/api/clientes", {
                headers: { "Authorization": `Bearer ${token}` }
            }).then(r => r.json()).then(setClientes);
        }

    }, [id, token]);

    useEffect(() => {
        if (!form.checkin || !form.checkout || !form.quartoId) return;

        const inicio = new Date(form.checkin);
        const fim = new Date(form.checkout);
        const diffTime = fim - inicio;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const quartoSelecionado = quartos.find(q => q.id === Number(form.quartoId));
        const valorDiaria = quartoSelecionado ? quartoSelecionado.valorDiaria : 0;

        setForm(prev => ({
            ...prev,
            totalDiarias: diffDays > 0 ? diffDays : 0,
            valorTotal: diffDays > 0 ? diffDays * valorDiaria : 0
        }));
    }, [form.checkin, form.checkout, form.quartoId, quartos]);

    const carregarReservasDoQuarto = async (quartoId) => {
        const r = await fetch(`http://localhost:8080/api/quartos/${quartoId}/reservas`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await r.json();
        setReservasQuarto(data.filter(res => res.id !== Number(id)));
    };

    const intervalosOcupados = useMemo(() => {
        const dias = new Set();
        reservasQuarto.forEach(r => {
            const inicio = new Date(fixDate(r.checkin));
            const fim = new Date(fixDate(r.checkout));
            let atual = new Date(inicio);
            while (atual <= fim) {
                dias.add(atual.toISOString().split("T")[0]);
                atual.setDate(atual.getDate() + 1);
            }
        });
        return agruparIntervalos(Array.from(dias));
    }, [reservasQuarto]);

    const todayDate = useMemo(() => {
        const today = new Date();
        today.setHours(0,0,0,0);
        return today.toISOString().split("T")[0];
    }, []);

    const minCheckoutDate = useMemo(() => {
        if (!form.checkin) return "";
        const d = new Date(form.checkin);
        d.setDate(d.getDate() + 1);
        return d.toISOString().split("T")[0];
    }, [form.checkin]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "checkin" && form.checkout && new Date(value) >= new Date(form.checkout)) {
            setMensagem("O check-in deve ser antes do check-out.");
            setTipoMensagem("erro");
            return;
        }

        if (name === "checkout" && form.checkin && new Date(value) <= new Date(form.checkin)) {
            setMensagem("O check-out deve ser depois do check-in.");
            setTipoMensagem("erro");
            return;
        }

        setMensagem("");
        setForm(prev => ({ ...prev, [name]: value }));

        if (name === "quartoId") carregarReservasDoQuarto(value);
    };

    const formatarDataBR = (dataISO) => {
        const [ano, mes, dia] = dataISO.split("-");
        return `${dia}/${mes}/${ano}`;
    };

    if (!reserva) return <p>Carregando...</p>;

    const isOwner = Number(reserva.clienteId) === currentUserId;
    const canModify = isAdmin || isOwner;

    return (
        <div className="conteudo-pagina">
            <div className="card">
                <h2>{isEditMode ? "Editar Reserva" : "Detalhes da Reserva"}</h2>

                {mensagem && (
                    <div className={tipoMensagem === "sucesso" ? "alert-sucesso" : "alert-erro"}>
                        {mensagem}
                    </div>
                )}

                {isEditMode && intervalosOcupados.length > 0 && (
                    <div className="datas-ocupadas">
                        <h4>Datas ocupadas deste quarto:</h4>
                        <ul>
                            {intervalosOcupados.map((i, idx) => (
                                <li key={idx}>
                                    — {formatarDataBR(i.inicio)} até {formatarDataBR(i.fim)}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="form-group">
                    <label>Check-in:</label>
                    {isEditMode ? (
                        <input type="date" name="checkin" min={todayDate} value={form.checkin} onChange={handleChange} />
                    ) : (
                        <p>{formatarDataBR(form.checkin)}</p>
                    )}
                </div>

                <div className="form-group">
                    <label>Check-out:</label>
                    {isEditMode ? (
                        <input type="date" name="checkout" min={minCheckoutDate} value={form.checkout} onChange={handleChange} />
                    ) : (
                        <p>{formatarDataBR(form.checkout)}</p>
                    )}
                </div>

                <div className="form-group">
                    <label>Cliente:</label>
                    {isAdmin && isEditMode ? (
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
                            <option value="">Selecione um quarto</option>
                            {quartos.map(q => (
                                <option key={q.id} value={q.id}>
                                    {q.codigo} — R$ {q.valorDiaria}
                                </option>
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
                            <button onClick={() => {}}>Salvar</button>
                            <button className="btn-secundario" onClick={() => { setIsEditMode(false); setMensagem(""); }}>Cancelar</button>
                        </>
                    ) : (
                        <>
                            {canModify && (
                                <>
                                    <button onClick={() => setIsEditMode(true)}>Editar</button>
                                    <button className="btn-perigo" onClick={() => {}}>Excluir</button>
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
