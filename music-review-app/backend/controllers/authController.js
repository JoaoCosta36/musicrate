const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Importe o modelo de usuário

// Função para login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Procurar usuário pelo email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Email não encontrado.' });
    }

    // Comparando a senha fornecida com a senha armazenada (usando bcrypt)
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: `Senha incorreta para o email: ${email}` });
    }

    // Gerar o token JWT se as credenciais estiverem corretas
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET, // Certifique-se de ter configurado a variável JWT_SECRET no .env
      { expiresIn: '1h' } // O token vai expirar após 1 hora
    );

    // Retornar o token ao frontend
    res.json({ token });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro ao tentar fazer login.' });
  }
};

module.exports = { login };
