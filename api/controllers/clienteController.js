const db = require('../config/db_sequelize');

module.exports = {
    async postCliente(req, res) {
        try {
            const cliente = await db.Cliente.create(req.body);
            res.status(201).json(cliente);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao criar cliente!' });
        }
    },
    async getClientes(req, res) {
        try {
            const clientes = await db.Cliente.findAll();
            res.status(200).json(clientes);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao listar clientes!' });
        }
    },
    async getByCliente(req, res) {
        try {
            const cliente = await db.Cliente.findByPk(req.params.id);
            if (cliente) {
                res.status(200).json(cliente);
            } else {
                res.status(404).json({ error: 'Cliente não encontrado' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao obter cliente!' });
        }
    },
    async putCliente(req, res) {
        try {
            const [updated] = await db.Cliente.update(req.body, {
                where: { id: req.params.id }
            });
            if (updated) {
                const updatedcliente = await db.Cliente.findByPk(req.params.id);
                res.status(200).json(updatedcliente);
            } else {
                res.status(404).json({ error: 'Cliente não encontrado!' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao atualizar cliente!' });
        }
    },
    async deleteCliente(req, res) {
        try {
            const deleted = await db.Cliente.destroy({
                where: { id: req.params.id }
            });
            if (deleted) {
                res.status(204).json();
            } else {
                res.status(404).json({ error: 'Cliente não encontrado!' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao deletar cliente!' });
        }
    }
}