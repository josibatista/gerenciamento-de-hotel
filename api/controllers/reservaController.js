const db = require('../config/db_sequelize');
const { Cliente, Quarto, Reserva } = db;
const { Op } = db.Sequelize;

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

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

            const checkinDate = dayjs.tz(checkin, "America/Sao_Paulo");
            const checkoutDate = dayjs.tz(checkout, "America/Sao_Paulo");

            if (!checkinDate.isValid() || !checkoutDate.isValid()) {
                return res.status(400).json({ error: "Datas inválidas" });
            }

            if (!checkoutDate.isAfter(checkinDate)) {
                return res.status(400).json({
                    error: "A data de check-out deve ser depois do check-in."
                });
            }

            // Verificar conflito de reserva
            const conflito = await Reserva.findOne({
                where: {
                    quartoId,
                    checkin: { [Op.lt]: checkoutDate.format("YYYY-MM-DD") },
                    checkout: { [Op.gt]: checkinDate.format("YYYY-MM-DD") }
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

    async getReservasPorQuarto(req, res) {
        try {
            const { id } = req.params;

            const reservas = await Reserva.findAll({
                where: { quartoId: id },
                include: [
                    { model: Cliente, as: "cliente" },
                    { model: Quarto, as: "quarto" }
                ]
            });

            res.json(reservas);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro ao buscar reservas do quarto" });
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

            if (usuario.role !== "admin" && reserva.clienteId !== Number(usuario.id)) {
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

            if (usuario.role !== "admin" && reserva.clienteId !== Number(usuario.id)) {
                return res.status(403).json({ error: "Não autorizado a deletar esta reserva" });
            }

            await Reserva.destroy({ where: { id: req.params.id } });
            res.status(204).send();

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Erro ao deletar reserva" });
        }
    }
};
