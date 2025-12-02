const jwt = require('jsonwebtoken');
const secretKey = 'secret_key';

function autenticarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401); // Não autorizado
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Proibido
        }
        req.user = user; 
        next();
    });
}

module.exports = autenticarToken;