const { Op } = require('sequelize');
const db = require('../config/db_sequelize');

module.exports = {
    
    //MÉTODO: FILTRAR DISPONIBILIDADE ---
    async getQuartosDisponiveis(req, res) {
        try {
            const { data } = req.query;

            if (!data) {
                return res.status(400).json({ error: 'Data é obrigatória.' });
            }

            // Encontra reservas que ocupam essa data
            const reservasOcupadas = await db.Reserva.findAll({
                where: {
                    checkin: { [Op.lte]: data },
                    checkout: { [Op.gt]: data }
                },
                attributes: ['quartoId']
            });
            const idsOcupados = reservasOcupadas.map(r => r.quartoId);

            // Busca quartos cujo ID NÃO está na lista de ocupados
            const quartosLivres = await db.Quarto.findAll({
                where: {
                    id: { [Op.notIn]: idsOcupados }
                }
            });

            res.status(200).json(quartosLivres);

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao buscar quartos disponíveis' });
        }
    },

    async postQuarto(req, res) {
        try {
            const quarto = await db.Quarto.create(req.body);
            res.status(201).json(quarto);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao criar quarto' });
        }
    },

    async getQuartos(req, res) {
        try {
            const quartos = await db.Quarto.findAll();
            res.status(200).json(quartos);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao listar quartos' });
        }
    },

    async getQuartoById(req, res) {
        try {
            const quarto = await db.Quarto.findByPk(req.params.id);
            if (quarto) {
                res.status(200).json(quarto);
            } else {
                res.status(404).json({ error: 'Quarto não encontrado' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao obter quarto' });
        }
    },

    async putQuarto(req, res) {
        try {
            const [updated] = await db.Quarto.update(req.body, {
                where: { id: req.params.id }
            });
            if (updated) {
                const updatedQuarto = await db.Quarto.findByPk(req.params.id);
                res.status(200).json(updatedQuarto);
            } else {
                res.status(404).json({ error: 'Quarto não encontrado' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao atualizar quarto' });
        }
    },

    async deleteQuarto(req, res) {
        try {
            const deleted = await db.Quarto.destroy({
                where: { id: req.params.id }
            });
            if (deleted) {
                res.status(204).json();
            } else {
                res.status(404).json({ error: 'Quarto não encontrado' });
            } 
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao deletar quarto' });
        }
    }
};