const express = require('express');
const authController = require('../controllers/authController');
const clienteController = require('../controllers/clienteController');
const quartoController = require('../controllers/quartoController');
const reservaController = require('../controllers/reservaController');

const router = express.Router();

const authenticateToken = require('../middleware/authenticateToken');
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
router.get('/clientes/:id', authenticateToken, clienteController.getClienteById);
router.put('/clientes/:id', authenticateToken, clienteController.putCliente);

// router.post('/reservas', authenticateToken, reservaController.postReserva);
// router.get('/reservas', authenticateToken, reservaController.getReservas); 
// router.get('/reservas/:id', authenticateToken, reservaController.getReservaById);


//ROTAS EXCLUSIVAS ADMIN
router.get('/clientes', authenticateToken, checkAdmin, clienteController.getClientes);
router.delete('/clientes/:id', authenticateToken, checkAdmin, clienteController.deleteCliente);

router.post('/quartos', authenticateToken, checkAdmin, quartoController.postQuarto);
router.put('/quartos/:id', authenticateToken, checkAdmin, quartoController.putQuarto);
router.delete('/quartos/:id', authenticateToken, checkAdmin, quartoController.deleteQuarto);

// router.put('/reservas/:id', authenticateToken, checkAdmin, reservaController.putReserva);
// router.delete('/reservas/:id', authenticateToken, checkAdmin, reservaController.deleteReserva);

module.exports = router;