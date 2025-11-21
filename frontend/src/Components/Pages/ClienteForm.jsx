import React, { useState } from 'react';

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
        //const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:8080/api/clientes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ nome, telefone, email, cpf, senha })
            });

            if (!response.ok) {
                throw new Error('Erro ao criar cliente!');
            }

            const data = await response.json();
            console.log('Cliente criado:', data);
            setMensagem('Cliente cadastrado com sucesso!');
            // Limpar os campos após o cliente ser cadastrado
            setNome('');
            setTelefone('');
            setEmail('');
            setCpf('');
            setSenha('');
        } catch (error) {
            console.error('Erro ao criar cliente:', error);
            setMensagem('Erro ao cadastrar cliente!');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nome</label>
                    <input type="text" value={nome} onChange={e => setNome(e.target.value)} required />
                </div>
                <div>
                    <label>Telefone</label>
                    <input type="text" value={telefone} onChange={e => setTelefone(e.target.value)} required />
                </div>
                <div>
                    <label>Email</label>
                    <input type="text" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>CPF</label>
                    <input type="text" value={cpf} onChange={e => setCpf(e.target.value)} required />
                </div>
                <div>
                    <label>Senha</label>
                    <input type="password" value={senha} onChange={e => setSenha(e.target.value)} required />
                </div>
                <button type="submit">Criar cliente</button>
            </form>
            {mensagem && <p>{mensagem}</p>}
        </div>
    );
};

export default ClienteForm;
