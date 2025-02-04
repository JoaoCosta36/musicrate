const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Para criptografar as senhas

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Garantir que o email seja único
    lowercase: true, // Tornar o email sempre em minúsculas para evitar duplicação de registros com o mesmo email em maiúsculas e minúsculas
    trim: true, // Remover espaços em branco antes e depois do email
  },
  password: {
    type: String,
    required: true,
  },
});

// Criptografar a senha antes de salvar o usuário
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error); // Passar o erro para o próximo middleware de erro
  }
});

// Comparar as senhas (no caso de login)
UserSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error('Erro ao comparar as senhas');
  }
};

module.exports = mongoose.model('User', UserSchema, 'users');
