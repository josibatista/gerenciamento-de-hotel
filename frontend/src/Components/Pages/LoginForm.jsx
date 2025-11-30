import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css'; 

const LoginForm = () => {
    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');
    const [admin, setAdmin] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleCreateAccount = () => {
        navigate('/clientes');
    };

    const handleCpfChange = (e) => {
        let v = e.target.value;
        v = v.replace(/\D/g, ""); 
        if (v.length > 11) v = v.slice(0, 11);
        v = v.replace(/(\d{3})(\d)/, "$1.$2");
        v = v.replace(/(\d{3})(\d)/, "$1.$2");
        v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        setCpf(v);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const cpfLimpo = cpf.replace(/\D/g, ''); 
        
        if (cpfLimpo.length !== 11) {
            setError('Por favor, digite um CPF válido (11 números).');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cpf, senha, admin }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Falha ao realizar login');
            }

            localStorage.setItem('token', data.token);
            if(admin) localStorage.setItem('role', 'admin');
            
            navigate('/'); 

        } catch (err) {
            setError(err.message || 'Erro ao conectar com o servidor.');
        }
    };

    return (
        <div className="conteudo-pagina login-container">
            
            <div className="card">
                <h2 className="login-header">Acessar Sistema</h2>

                {error && (
                    <div className="alert-erro">{error}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="cpfInput">CPF:</label>
                        <input 
                            id="cpfInput"
                            type="text" 
                            value={cpf}
                            onChange={handleCpfChange}
                            placeholder="000.000.000-00"
                            maxLength="14"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="senhaInput">Senha:</label>
                        <input
                            id="senhaInput"
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)} // Corrigido aqui (estava faltando no exemplo anterior se copiou direto)
                            required
                            placeholder="Digite sua senha"
                        />
                    </div>

                    {/* AQUI ESTAVA O PROBLEMA: A ordem dos elementos e a classe */}
                    <div className="form-group checkbox">
                        <input
                            type="checkbox"
                            id="adminCheck"
                            checked={admin}
                            onChange={(e) => setAdmin(e.target.checked)}
                        />
                        <label htmlFor="adminCheck">
                            Sou administrador
                        </label>
                    </div>

                    <div className="form-actions">
                        <button type="submit">
                            Entrar
                        </button>
                        
                        <button 
                            type="button" 
                            className="btn-secundario" 
                            onClick={handleCreateAccount}
                        >
                            Criar Conta
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;