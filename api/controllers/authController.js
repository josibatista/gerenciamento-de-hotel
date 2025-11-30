const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../config/db_sequelize');
const secretKey = 'secret_key';

module.exports = {
    async login(req, res) {
        try {
            // Recebe cpf, senha e o booleano 'admin' do Front-End
            const { cpf, senha, admin } = req.body;
            
            let user = null;
            let role = '';

            // Lógica para decidir qual tabela buscar
            if (admin === true) {
                user = await db.Administrador.findOne({ where: { cpf: cpf } });
                role = 'admin';
            } else {
                user = await db.Cliente.findOne({ where: { cpf: cpf } });
                role = 'cliente';
            }

            // Verifica se usuário existe
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            // Verifica a senha
            const senhaValida = await bcrypt.compare(senha, user.senha);

            if (!senhaValida) {
                return res.status(401).json({ error: 'Senha incorreta' });
            }
            const token = generateToken(user, role);
            
            // Retorna o token e dados básicos para o front salvar
            res.status(200).json({ 
                token,
                id: user.id,
                nome: user.nome,
                role: role
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao fazer login' });
        }
    }
};

function generateToken(user, role) {
    const payload = {
        id: user.id,
        nome: user.nome,
        role: role // guarda se é 'admin' ou 'cliente' dentro do token
    };

    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    return token;
}