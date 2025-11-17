const express = require('express');
const routes = require('./routers/route');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors'); 
const secretKey = 'secret_key'; // Chave secreta para assinar o token
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', routes); // Prefixo para as rotas da API

app.use(
    express.urlencoded({
        extended: true
    })
)

app.listen(8080, function(){
    console.log("Servidor no http://localhost:8080")
});