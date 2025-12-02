module.exports = (sequelize, Sequelize) => {
    const Administrador = sequelize.define('administrador', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        nome: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'Administrador' 
        },
        cpf: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true 
        },
        senha: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });

    return Administrador;
}