const express = require('express');
const authController = require('../controllers/authController');
const clienteController = require('../controllers/clienteController');
const quartoController = require('../controllers/quartoController');
const reservaController = require('../controllers/reservaController');

const router = express.Router();

const autenticarToken = require('../middleware/autenticarToken');
const checkAdmin = require('../middleware/checkAdmin');

// const db = require('../config/db_sequelize');
// db.sequelize.sync({force: true}).then(() => {
//     console.log('{ force: true }');
// });

//ROTAS PÚBLICAS 
router.post('/login', authController.login);

router.post('/clientes', clienteController.postCliente); 

router.get('/quartos', quartoController.getQuartos); 
router.get('/quartos/:id', quartoController.getQuartoById);


//ROTAS AUTENTICADAS
router.get('/clientes/:id', autenticarToken, clienteController.getClienteById);
router.put('/clientes/:id', autenticarToken, clienteController.putCliente);

router.post('/reservas', autenticarToken, reservaController.postReserva);
router.get('/reservas', autenticarToken, reservaController.getReservas); 
router.get('/reservas/:id', autenticarToken, reservaController.getReservaById);

router.put('/reservas/:id', autenticarToken, reservaController.putReserva);
router.delete('/reservas/:id', autenticarToken, reservaController.deleteReserva);


//ROTAS EXCLUSIVAS ADMIN
router.get('/clientes', autenticarToken, checkAdmin, clienteController.getClientes);
router.delete('/clientes/:id', autenticarToken, checkAdmin, clienteController.deleteCliente);

router.post('/quartos', autenticarToken, checkAdmin, quartoController.postQuarto);
router.put('/quartos/:id', autenticarToken, checkAdmin, quartoController.putQuarto);
router.delete('/quartos/:id', autenticarToken, checkAdmin, quartoController.deleteQuarto);


module.exports = router;