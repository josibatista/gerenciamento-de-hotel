const bcrypt = require('bcrypt');
const db = require('./config/db_sequelize'); 
const sequelize = db.sequelize;
const Administrador = db.Administrador; 

const listaAdmins = [
    { nome: 'Admin Chefe',          cpf: '11111111111', senha: '1234' },
    { nome: 'Recepcionista Manhã',  cpf: '22222222222', senha: '1234' },
    { nome: 'Recepcionista Noite',  cpf: '33333333333', senha: '1234' }
];

async function criarEquipe() {
    try {        
        await sequelize.authenticate();
        await Administrador.sync(); 

        for (const usuario of listaAdmins) {
            
            const adminExiste = await Administrador.findOne({ 
                where: { cpf: usuario.cpf } 
            });

            if (adminExiste) {
                console.log(`[${usuario.nome}] já existe. Pulando...`);
            } else {
                const senhaHash = await bcrypt.hash(usuario.senha, 10);
                
                await Administrador.create({
                    nome: usuario.nome,
                    cpf: usuario.cpf,
                    senha: senhaHash
                });
                console.log(`[${usuario.nome}] criado com sucesso!`);
            }
        }

    } catch (error) {
        console.error('Erro:', error);
    } finally {
        await sequelize.close();
        console.log('Conexão encerrada.');
        process.exit();
    }
}

criarEquipe();