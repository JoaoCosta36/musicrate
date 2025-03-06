const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config(); // Carregar variáveis de ambiente

const router = express.Router();

// Verificar se o JWT_SECRET está definido
if (!process.env.JWT_SECRET) {
  console.error("Erro: A chave JWT_SECRET não está definida no arquivo .env");
  process.exit(1); // Encerra o servidor se não estiver configurado
}

// Função auxiliar para responder com erros uniformizados
const handleErrorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({ msg: message });
};

// Rota para registrar um novo usuário
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Validações de entrada
  if (!name || !email || !password) {
    return handleErrorResponse(res, 400, 'Por favor, preencha todos os campos.');
  }

  // Validar o formato do email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return handleErrorResponse(res, 400, 'Email inválido.');
  }

  try {
    // Verificar se o email já está registrado
    const userExists = await User.findOne({ email });
    if (userExists) {
      return handleErrorResponse(res, 400, 'Email já registrado.');
    }

    // Criar o novo usuário sem criptografar a senha
    const newUser = new User({ name, email, password });
    await newUser.save();

    // Gerar um token JWT
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Retornar sucesso
    res.status(201).json({ msg: 'Usuário registrado com sucesso.', token });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error.message);
    return handleErrorResponse(res, 500, 'Erro no servidor. Tente novamente.');
  }
});

// Rota para login do usuário
router.post('/login', async (req, res) => {
  let { email, password } = req.body;

  // Validações de entrada
  if (!email || !password) {
    return handleErrorResponse(res, 400, 'Por favor, preencha todos os campos.');
  }

  // Remover espaços extras do email
  email = email.trim();

  // Validar o formato do email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return handleErrorResponse(res, 400, 'Email inválido.');
  }

  try {
    // Verificar se o usuário existe
    const user = await User.findOne({ email });

    if (!user) {
      console.warn(`Utilizador não encontrado com o email: ${email}`);
      return handleErrorResponse(res, 400, 'Utilizador não encontrado.');
    }

    // Comparar a senha fornecida com a armazenada
    if (user.password !== password) {
      console.warn(`Senha incorreta para o email: ${email}`);
      return handleErrorResponse(res, 400, 'Email ou senha incorretos.');
    }

    // Gerar um token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Retornar o token e informações do usuário
    res.json({
      msg: 'Login bem-sucedido!',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Erro no login do usuário:', error.message);
    return handleErrorResponse(res, 500, 'Erro no servidor. Tente novamente.');
  }
});

module.exports = router;
