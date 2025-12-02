const db = require('../config/db_sequelize');
const { Cliente, Quarto, Reserva } = db;
const { Op } = db.Sequelize;

module.exports = {
    async postReserva(req, res) {
        try {
            const usuario = req.user; 
            let { checkin, checkout, clienteId, quartoId, totalDiarias, valorTotal } = req.body;

            if (usuario.role !== "admin") {
                clienteId = Number(usuario.id); 
            }

            const cliente = await Cliente.findByPk(clienteId);
            if (!cliente) {
                return res.status(400).json({ error: "Cliente não encontrado" });
            }

            const quarto = await Quarto.findByPk(quartoId);
            if (!quarto) {
                return res.status(400).json({ error: "Quarto não encontrado" });
            }

            const checkinDate = checkin;    
            const checkoutDate = checkout;

            const conflito = await Reserva.findOne({
                where: {
                    quartoId,
                    checkin: { [Op.lt]: checkoutDate }, 
                    checkout: { [Op.gt]: checkinDate } 
                }
            });


            if (conflito) {
                return res.status(409).json({
                    error: "Este quarto já está reservado neste período."
                });
            }

            const reserva = await Reserva.create({
                checkin,
                checkout,
                totalDiarias,
                valorTotal,
                quartoId,
                clienteId
            });

            res.status(201).json(reserva);

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Erro ao criar uma reserva" });
        }
    },

    async getReservas(req, res) {
        try {
            const usuario = req.user;

            const filtro = {};

            if (usuario.role !== "admin") {
                filtro.where = { clienteId: Number(usuario.id) };
            }

            const reservas = await Reserva.findAll({
                ...filtro,
                include: [
                    { model: Quarto, as: "quarto" },
                    { model: Cliente, as: "cliente" }
                ]
            });

            res.status(200).json(reservas);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Erro ao listar reservas" });
        }
    },

    async getReservaById(req, res) {
        try {
            const reserva = await Reserva.findByPk(req.params.id, {
                include: [
                    { model: Quarto, as: "quarto" },
                    { model: Cliente, as: "cliente" }
                ]
            });
            
            if (!reserva) {
                return res.status(404).json({ error: "Reserva não encontrada" });
            }
            
            const usuario = req.user;
            const clienteIdDoUsuario = Number(usuario.id);
            
            if (usuario.role !== "admin" && reserva.clienteId !== clienteIdDoUsuario) {
                 return res.status(403).json({ error: "Você não tem permissão para visualizar esta reserva" });
            }

            res.status(200).json(reserva);

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Erro ao obter reserva" });
        }
    },

    async putReserva(req, res) {
        try {
            const [updated] = await Reserva.update(req.body, {
                where: { id: req.params.id }
            });

            if (!updated) {
                return res.status(404).json({ error: "Reserva não encontrada" });
            }

            const updatedReserva = await Reserva.findByPk(req.params.id);
            res.status(200).json(updatedReserva);

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Erro ao atualizar reserva" });
        }
    },

    async deleteReserva(req, res) {
        try {
            const usuario = req.user;
            const reserva = await Reserva.findByPk(req.params.id);

            if (!reserva) {
                return res.status(404).json({ error: "Reserva não encontrada" });
            }
            
            // Removido o Number() e alterado para comparação não estrita (!=)
            // para testar se o problema é o tipo de dado.
            
            // 🚨 ATENÇÃO: É MELHOR USAR SEMPRE NÚMERO, MAS ISSO É UM TESTE!
            if (usuario.role !== "admin" && reserva.clienteId != usuario.id) { 
                return res.status(403).json({ error: "Não autorizado a deletar esta reserva" });
            }
            
            // ... (resto do código de exclusão)
            await Reserva.destroy({
                where: { id: req.params.id }
            });
            
            res.status(204).send();
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Erro ao deletar reserva" });
        }
    }
};