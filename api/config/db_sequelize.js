const Sequelize = require('sequelize');
const sequelize = new Sequelize('gerencia_hotel', 'postgres', '1234', {
    host: 'localhost',
    dialect: 'postgres'
  });

var db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Administrador = require('../models/administrador.js')(sequelize, Sequelize);
db.Cliente = require('../models/cliente.js')(sequelize, Sequelize);
db.Quarto = require('../models/quarto.js')(sequelize, Sequelize);
db.Reserva = require('../models/reserva.js')(sequelize, Sequelize);

//Cliente <-> Reserva (1:N) 
db.Cliente.hasMany(db.Reserva, {
    foreignKey: 'clienteId',
    onDelete: 'NO ACTION'
});
db.Reserva.belongsTo(db.Cliente, {
    foreignKey: 'clienteId'
});


// Quarto <-> Reserva (1:N)
db.Quarto.hasMany(db.Reserva, {
    foreignKey: 'quartoId',
    onDelete: 'NO ACTION' 
});
db.Reserva.belongsTo(db.Quarto, {
    foreignKey: 'quartoId' 
});

module.exports = db;