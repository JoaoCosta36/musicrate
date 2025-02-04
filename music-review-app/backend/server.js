const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();  // Carregar variáveis de ambiente

const app = express();  // O app precisa ser inicializado antes de ser usado

// Middleware de logging global (caso queira registrar todas as requisições)
app.use((req, res, next) => {
  console.log(`Requisição recebida: ${req.method} ${req.url}`);
  console.log('Corpo da requisição:', req.body);  // Mostra o corpo da requisição
  next();  // Passa para o próximo middleware ou rota
});

// Middlewares
app.use(cors({
  origin: 'http://localhost:3000',  // A URL do seu frontend (ajuste conforme necessário)
  methods: ['GET', 'POST'],        // Métodos permitidos
}));  // Configuração do CORS para permitir o acesso do frontend

app.use(express.json());  // Middleware para lidar com dados JSON

// Conectar ao MongoDB
const mongoURI = process.env.MONGO_URI;  // A variável de ambiente para a URI do MongoDB

if (!mongoURI) {
  console.log('Erro: A variável MONGO_URI não foi definida!');
  process.exit(1);  // Encerra o servidor se a variável não for encontrada
}

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB conectado com sucesso!'))
  .catch(err => console.log('Erro ao conectar ao MongoDB: ', err));

// Definir as rotas da aplicação
app.use('/api/auth', require('./routes/auth'));  // Certifique-se de que o caminho para 'auth' está correto
app.use('/api/artists', require('./routes/artist'));
app.use('/api/songs', require('./routes/song'));

// Iniciar o servidor
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
