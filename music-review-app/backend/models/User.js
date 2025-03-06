const mongoose = require('mongoose');

// Definição do schema do usuário
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'O nome é obrigatório.'], // Mensagem clara para validação
    trim: true, // Remover espaços em branco no início/fim
  },
  email: {
    type: String,
    required: [true, 'O email é obrigatório.'], // Mensagem clara para validação
    unique: true, // Garantir unicidade do email
    lowercase: true, // Sempre armazenar o email em letras minúsculas
    trim: true, // Remover espaços em branco no início/fim
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Regex para validação do formato do email
      'Por favor, insira um email válido.', // Mensagem para email inválido
    ],
  },
  password: {
    type: String,
    required: [true, 'A senha é obrigatória.'], // Mensagem clara para validação
    minlength: [6, 'A senha deve ter pelo menos 6 caracteres.'], // Requisito mínimo para a senha
  },
}, {
  timestamps: true, // Adiciona campos `createdAt` e `updatedAt` automaticamente
});

// Remover o middleware de criptografia de senha

// Remover o método de comparação de senha (sem criptografia)
UserSchema.methods.comparePassword = async function (password) {
  try {
    return password === this.password; // Comparar diretamente as senhas
  } catch (error) {
    throw new Error('Erro ao comparar a senha.'); // Lança um erro em caso de falha
  }
};

// Exporta o modelo do usuário
module.exports = mongoose.model('User', UserSchema, 'users');
