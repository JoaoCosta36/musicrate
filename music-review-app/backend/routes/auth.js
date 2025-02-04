const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config(); // Carregar variáveis de ambiente

const router = express.Router();

// Verifique se o JWT_SECRET está no arquivo .env
if (!process.env.JWT_SECRET) {
  console.log("Erro: A chave JWT_SECRET não está definida no arquivo .env");
  process.exit(1); // Encerra o servidor se não estiver configurado
}

// Rota para registrar um novo usuário
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Verificar se todos os campos foram preenchidos
  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Por favor, preencha todos os campos.' });
  }

  try {
    // Verificar se o email já existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: 'Email já registrado.' });
    }

    // Criptografar a senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Criar o novo usuário
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // Gerar um token JWT para o usuário após o registro
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Retorna o token e a mensagem de sucesso
    res.status(201).json({ msg: 'Usuário registrado com sucesso.', token });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ msg: 'Erro no servidor. Tente novamente.' });
  }
});

// Rota para login do usuário
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Verificar se os campos foram preenchidos
  if (!email || !password) {
    return res.status(400).json({ msg: 'Por favor, preencha todos os campos.' });
  }

  try {
    // Verificar se o usuário existe
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`Usuário não encontrado com o email: ${email}`); // Log para depuração
      return res.status(400).json({ msg: 'Email ou senha incorretos.' });
    }

    // Verificar se a senha está correta
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Senha incorreta para o email: ${email}`); // Log para depuração
      return res.status(400).json({ msg: 'Email ou senha incorretos.' });
    }

    // Gerar um token JWT para o usuário após o login bem-sucedido
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Retorna o token e os dados do usuário
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Erro no login do usuário:', error);
    res.status(500).json({ msg: 'Erro no servidor. Tente novamente.' });
  }
});

module.exports = router;
