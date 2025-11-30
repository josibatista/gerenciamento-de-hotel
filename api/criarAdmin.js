const bcrypt = require('bcrypt');
const db = require('./models'); 

const listaAdmins = [
    { cpf: '111.111.111-11', senha: '1234', nome: 'Admin Chefe' },
    { cpf: '222.222.222-22', senha: '1234', nome: 'Recepcionista Manhã' },
    { cpf: '333.333.333-33', senha: '1234', nome: 'Recepcionista Noite' }
];

async function criarEquipe() {
    try {
        await db.sequelize.sync(); 

        for (const usuario of listaAdmins) {
            
            const adminExiste = await db.administrador.findOne({ 
                where: { cpf: usuario.cpf } 
            });

            if (adminExiste) {
                console.log(`[${usuario.nome}] já existe no sistema.`);
            } else {
                const senhaHash = await bcrypt.hash(usuario.senha, 10);
                
                await db.administrador.create({
                    nome: usuario.nome,
                    cpf: usuario.cpf,
                    senha: senhaHash
                });
                console.log(`[${usuario.nome}] criado com sucesso!`);
            }
        }

    } catch (error) {
        console.error('❌ Erro:', error);
    } finally {
        await db.sequelize.close();
        process.exit();
    }
}

criarEquipe();