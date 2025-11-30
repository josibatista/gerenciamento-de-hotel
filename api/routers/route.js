const express = require('express');
const clienteController = require('../controllers/clienteController');
const quartoController = require('../controllers/quartoController');
const reservaController = require('../controllers/reservaController');

const router = express.Router();

const db = require('../config/db_sequelize');
/*db.sequelize.sync({force: true}).then(() => {
    console.log('{ force: true }');
});*/
//db.Usuario.create({login:'admin', senha:'1234', tipo:2});


//router.post('/login', authController.login);

router.get('/clientes', clienteController.getClientes);
router.post('/clientes', clienteController.postCliente);
router.get('/clientes/:id', clienteController.getByCliente);
router.put('/clientes/:id', clienteController.putCliente);
router.delete('/clientes/:id', clienteController.deleteCliente);



module.exports = router;