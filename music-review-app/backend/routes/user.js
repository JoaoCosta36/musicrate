const express = require('express');
const User = require('../models/users'); // Certifique-se de que o modelo está correto
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Registrar usuário
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Validar campos
  if (!username || !email || !password) {
    return res.status(400).json({ msg: 'Todos os campos são obrigatórios' });
  }

  try {
    // Verificar se o e-mail já está em uso
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'Email já está em uso' });
    }

    // Criptografar a senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Criar o novo usuário com senha criptografada
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    
    // Retornar mensagem de sucesso
    res.status(201).json({ msg: 'Usuário registrado com sucesso' });
  } catch (error) {
    console.error(error); // Para ajudar na depuração
    res.status(500).json({ msg: 'Erro ao registrar usuário' });
  }
});

// Login de usuário
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validar campos
  if (!email || !password) {
    return res.status(400).json({ msg: 'Email e senha são obrigatórios' });
  }

  try {
    // Buscar usuário pelo e-mail
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'Usuário não encontrado' });
    
    // Verificar a senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Senha incorreta' });
    
    // Gerar token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1h' });

    // Retornar token e informações do usuário
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    console.error(error); // Para ajudar na depuração
    res.status(500).json({ msg: 'Erro ao fazer login' });
  }
});

module.exports = router;
