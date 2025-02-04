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

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Comparar as senhas (no caso de login)
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema, 'users');
