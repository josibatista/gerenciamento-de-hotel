module.exports = (sequelize, Sequelize) => {
    const Quarto = sequelize.define('quarto', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true, 
            allowNull: false,
            primaryKey: true
        },
        codigo: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        tipo: {
            type: Sequelize.STRING,
            allowNull: false
        },
        valorDiaria: {
            type: Sequelize.FLOAT,
            allowNull: false
        }
    });
    return Quarto;
}