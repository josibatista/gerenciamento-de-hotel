import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

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
    const [totalDiarias, setTotalDiarias] = useState(0);  
    const [valorTotal, setValorTotal] = useState(0);  
    const [mensagem, setMensagem] = useState('');  
    const [tipoMensagem, setTipoMensagem] = useState('');  

    useEffect(() => {  
        if (isAdmin) {  
            fetch("http://localhost:8080/api/clientes", {  
                headers: { "Authorization": `Bearer ${token}` }  
            })  
            .then(r => r.json())  
            .then(data => setClientes(data))  
            .catch(err => console.error(err));  
        }  

        fetch("http://localhost:8080/api/quartos", {  
            headers: { "Authorization": `Bearer ${token}` }  
        })  
        .then(r => r.json())  
        .then(data => setQuartos(data))  
        .catch(err => console.error(err));  
    }, []);  

    useEffect(() => {  
        if (checkin && checkout) {  
            // Apenas para cálculo de diárias, local Date é suficiente  
            const dt1 = new Date(checkin);  
            const dt2 = new Date(checkout);  

            const diffTime = dt2.getTime() - dt1.getTime();  
            const diffDays = diffTime / (1000 * 60 * 60 * 24);  

            if (diffDays > 0) {  
                setTotalDiarias(diffDays);  
                const quarto = quartos.find(q => q.id === parseInt(quartoId));  
                if (quarto) setValorTotal(diffDays * quarto.valorDiaria);  
            } else {  
                setTotalDiarias(0);  
                setValorTotal(0);  
            }  
        }  
    }, [checkin, checkout, quartoId, quartos]);  

    const handleSubmit = async (e) => {  
        e.preventDefault();  

        // Envia datas como strings YYYY-MM-DD, sem criar Date()  
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

            if (!response.ok) throw new Error("Erro ao criar reserva");  

            setMensagem("Reserva cadastrada com sucesso!");  
            setTipoMensagem("sucesso");  
            setTimeout(() => navigate("/reservas/lista"), 2000);  

        } catch (error) {  
            console.error(error);  
            setMensagem("Erro ao cadastrar reserva");  
            setTipoMensagem("erro");  
        }  
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

                    <div className="form-group">  
                        <label>Check-in</label>  
                        <input type="date" value={checkin} onChange={e => setCheckin(e.target.value)} required />  
                    </div>  

                    <div className="form-group">  
                        <label>Check-out</label>  
                        <input type="date" value={checkout} onChange={e => setCheckout(e.target.value)} required />  
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
