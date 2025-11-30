import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css'; 

const ClienteForm = () => {
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');
    const [mensagem, setMensagem] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem('');
        //const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:8080/api/clientes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nome, telefone, email, cpf, senha })
            });
            const data = await response.json(); 

            if (!response.ok) {
                throw new Error(data.error || 'Erro desconhecido ao criar cliente');
            }
            const id = data.id;
            console.log('Cliente criado:', data);
            setMensagem('Cliente cadastrado com sucesso!');
            // Limpar os campos após o cliente ser cadastrado
            setNome('');
            setTelefone('');
            setEmail('');
            setCpf('');
            setSenha('');

            setTimeout(() => {
                navigate(`/clientes/${data.id}`);
            }, 2000);

        } catch (error) {
            console.error('Erro:', error);
            setMensagem(error.message); 
        }
    };

    return (
        <div className="conteudo-pagina login-container">
            
            <div className="card">
                <h2 className="login-header">Cadastrar Cliente</h2>

                {mensagem && (
                    <div className={mensagem.includes('sucesso') ? 'alert-sucesso' : 'alert-erro'}>
                        {mensagem}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nome</label>
                        <input 
                            type="text" 
                            value={nome} 
                            onChange={e => setNome(e.target.value)} 
                            required 
                            placeholder="Nome completo"
                        />
                    </div>

                    <div className="form-group">
                        <label>Telefone</label>
                        <input 
                            type="text" 
                            placeholder="(99) 99999-9999" 
                            value={telefone} 
                            onChange={e => setTelefone(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            placeholder="usuario@email.com" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>CPF</label>
                        <input 
                            type="text" 
                            placeholder="999.999.999-99" 
                            value={cpf} 
                            onChange={e => setCpf(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Senha</label>
                        <input 
                            type="password" 
                            value={senha} 
                            onChange={e => setSenha(e.target.value)} 
                            required 
                            placeholder="Crie uma senha segura"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit">Cadastrar</button>
                        
                        <button 
                            type="button" 
                            className="btn-secundario" 
                            onClick={() => navigate('/')}
                        >
                            Voltar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClienteForm;