module.exports = (sequelize, Sequelize) => {
    const Reserva = sequelize.define('reserva', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true, 
            allowNull: false, 
            primaryKey: true
        },
        checkin: {
            type: Sequelize.DATEONLY,  
            allowNull: false,
        },
        checkout: {
            type: Sequelize.DATEONLY,
            allowNull: false,
        },
        totalDiarias: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        valorTotal: {
            type: Sequelize.FLOAT,
            allowNull: false,
        },
        quartoId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'quartos',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        clienteId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'clientes',
                key: 'id'
            },
            onDelete: 'CASCADE'
        }
    }, {
        tableName: 'reserva'
    });
    return Reserva;
}