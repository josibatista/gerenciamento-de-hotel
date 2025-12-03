import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
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

const ReservaForm = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const user = token ? jwtDecode(token) : null;
    const isAdmin = user?.role === "admin";

    const [checkin, setCheckin] = useState('');
    const [checkout, setCheckout] = useState('');
    const [clienteId, setClienteId] = useState(isAdmin ? '' : user?.id);
    const [quartoId, setQuartoId] = useState('');
    const [clientes, setClientes] = useState([]);
    const [quartos, setQuartos] = useState([]);
    const [reservasQuarto, setReservasQuarto] = useState([]);
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState('');
    const [totalDiarias, setTotalDiarias] = useState(0);
    const [valorTotal, setValorTotal] = useState(0);

    // Carregar clientes e quartos
    useEffect(() => {
        if (isAdmin) {
            fetch("http://localhost:8080/api/clientes", {
                headers: { "Authorization": `Bearer ${token}` }
            }).then(r => r.json()).then(setClientes);
        }

        fetch("http://localhost:8080/api/quartos", {
            headers: { "Authorization": `Bearer ${token}` }
        }).then(r => r.json()).then(setQuartos);
    }, []);

    // Carregar reservas do quarto selecionado
    useEffect(() => {
        if (!quartoId) {
            setReservasQuarto([]);
            return;
        }

        const carregarReservasDoQuarto = async () => {
            const res = await fetch(`http://localhost:8080/api/quartos/${quartoId}/reservas`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            setReservasQuarto(data); 
        };

        carregarReservasDoQuarto();
    }, [quartoId]);

    // Dias ocupados agrupados
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

    const conflita = (checkin, checkout) => {
        const dt1 = new Date(checkin);
        const dt2 = new Date(checkout);
        for (let d = new Date(dt1); d < dt2; d.setDate(d.getDate() + 1)) {
            const chave = d.toISOString().split("T")[0];
            for (let intervalo of intervalosOcupados) {
                if (chave >= intervalo.inicio && chave <= intervalo.fim) return true;
            }
        }
        return false;
    };

    const todayDate = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today.toISOString().split("T")[0];
    }, []);

    const minCheckoutDate = useMemo(() => {
        if (!checkin) return '';
        const d = new Date(checkin);
        d.setDate(d.getDate() + 1);
        return d.toISOString().split("T")[0];
    }, [checkin]);

    // Atualizar total de diárias e valor total
    useEffect(() => {
        if (!checkin || !checkout || !quartoId) {
            setTotalDiarias(0);
            setValorTotal(0);
            return;
        }
        const dt1 = new Date(checkin);
        const dt2 = new Date(checkout);
        const diffTime = dt2.getTime() - dt1.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const quarto = quartos.find(q => q.id === Number(quartoId));
        const valorDiaria = quarto ? quarto.valorDiaria : 0;

        setTotalDiarias(diffDays > 0 ? diffDays : 0);
        setValorTotal(diffDays > 0 ? diffDays * valorDiaria : 0);
    }, [checkin, checkout, quartoId, quartos]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!checkin || !checkout || !quartoId || (!isAdmin && !user?.id)) {
            setMensagem("Preencha todos os campos.");
            setTipoMensagem("erro");
            return;
        }

        if (conflita(checkin, checkout)) {
            setMensagem("O quarto já está reservado nesse período.");
            setTipoMensagem("erro");
            return;
        }

        const body = {
            checkin,
            checkout,
            clienteId: isAdmin ? clienteId : user.id,
            quartoId,
            totalDiarias,
            valorTotal
        };

        try {
            const response = await fetch("http://localhost:8080/api/reservas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const msg = await response.json();
                throw new Error(msg.error || "Erro ao criar reserva");
            }

            setMensagem("Reserva cadastrada com sucesso!");
            setTipoMensagem("sucesso");
            setTimeout(() => navigate("/reservas/lista"), 1500);

        } catch (err) {
            console.error(err);
            setMensagem(err.message || "Erro ao cadastrar reserva");
            setTipoMensagem("erro");
        }
    };

    const formatarDataBR = (dataISO) => {
        const [ano, mes, dia] = dataISO.split("-");
        return `${dia}/${mes}/${ano}`;
    };

    return (
        <div className="conteudo-pagina login-container">
            <div className="card">
                <h2>Cadastrar Reserva</h2>

                {mensagem && (
                    <div className={tipoMensagem === "sucesso" ? "alert-sucesso" : "alert-erro"}>
                        {mensagem}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {isAdmin && (
                        <div className="form-group">
                            <label>Cliente</label>
                            <select value={clienteId} onChange={e => setClienteId(e.target.value)} required>
                                <option value="">Selecione o cliente</option>
                                {clientes.map(c => (
                                    <option key={c.id} value={c.id}>
                                        {c.nome} (ID {c.id})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Quarto</label>
                        <select value={quartoId} onChange={e => setQuartoId(e.target.value)} required>
                            <option value="">Selecione o quarto</option>
                            {quartos.map(q => (
                                <option key={q.id} value={q.id}>
                                    {q.codigo} — R$ {q.valorDiaria}/dia
                                </option>
                            ))}
                        </select>
                    </div>

                    {intervalosOcupados.length > 0 && (
                        <div className="alert-erro" style={{ marginBottom: "10px" }}>
                            <strong>Datas ocupadas deste quarto:</strong>
                            <ul style={{ marginTop: "8px" }}>
                                {intervalosOcupados.map((i, idx) => (
                                    <li key={idx}>
                                        — {formatarDataBR(i.inicio)} até {formatarDataBR(i.fim)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Check-in</label>
                        <input
                            type="date"
                            value={checkin}
                            min={todayDate}
                            onChange={(e) => setCheckin(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Check-out</label>
                        <input
                            type="date"
                            value={checkout}
                            min={minCheckoutDate}
                            onChange={(e) => setCheckout(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Total de Diárias</label>
                        <input type="number" value={totalDiarias} readOnly />
                    </div>

                    <div className="form-group">
                        <label>Valor Total (R$)</label>
                        <input type="number" value={valorTotal} readOnly />
                    </div>

                    <div className="form-actions">
                        <button type="submit">Cadastrar</button>
                        <button className="btn-secundario" type="button" onClick={() => navigate('/reservas/lista')}>
                            Voltar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReservaForm;
