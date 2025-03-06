const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();  // Carregar variáveis de ambiente

const app = express();  // Inicializando o app

// Middlewares
app.use(cors());  // Permite requisições de diferentes origens
app.use(bodyParser.json());  // Para poder receber dados em formato JSON

// Middleware de logging global (para registrar todas as requisições)
app.use((req, res, next) => {
  console.log(`Requisição recebida: ${req.method} ${req.url}`);
  console.log('Corpo da requisição:', req.body);  // Exibe o corpo da requisição
  next();  // Passa para o próximo middleware ou rota
});

// Conectar ao MongoDB
const mongoURI = process.env.MONGO_URI;  // Recuperando a variável de ambiente

if (!mongoURI) {
  console.log('Erro: A variável MONGO_URI não foi definida!');
  process.exit(1);  // Encerra o servidor se a variável não for encontrada
}

mongoose.connect(mongoURI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.log('Erro ao conectar ao MongoDB: ', err));

// Rotas
// Certifique-se de que as rotas estejam corretamente configuradas e os arquivos existem
app.use('/api/auth', require('./routes/auth'));
app.use('/api/artists', require('./routes/artist'));
app.use('/api/songs', require('./routes/song'));

// Iniciar o servidor
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
