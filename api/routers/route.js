const express = require('express');
const authController = require('../controllers/authController');
const clienteController = require('../controllers/clienteController');
const quartoController = require('../controllers/quartoController');
const reservaController = require('../controllers/reservaController');

const router = express.Router();

// const db = require('../config/db_sequelize');
// db.sequelize.sync({force: true}).then(() => {
//     console.log('{ force: true }');
// });

router.post('/login', authController.login);

router.get('/clientes', clienteController.getClientes);
router.post('/clientes', clienteController.postCliente);
router.get('/clientes/:id', clienteController.getClienteById);
router.put('/clientes/:id', clienteController.putCliente);
router.delete('/clientes/:id', clienteController.deleteCliente);

router.get('/quartos', quartoController.getQuartos);
router.post('/quartos', quartoController.postQuarto);
router.get('/quartos/:id', quartoController.getQuartoById);
router.put('/quartos/:id', quartoController.putQuarto);
router.delete('/quartos/:id', quartoController.deleteQuarto);

module.exports = router;