const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Historico = require('../models/Historico');

const JWT_SECRET = process.env.JWT_SECRET || 'greenherb_secret_123';

// REGISTO — POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { nome, email, password, perfil } = req.body;

    // Verifica se já existe utilizador com esse email
    const existente = await User.findOne({ email });
    if (existente) {
      return res.status(400).json({ erro: 'Email já está registado.' });
    }

    const novoUtilizador = new User({ nome, email, password, perfil });
    await novoUtilizador.save();

    // 👇 HISTÓRICO AQUI (APÓS SUCESSO)
    await Historico.create({
      utilizador: nome, // aqui NÃO tens req.user ainda
      acao: "CRIAR_UTILIZADOR",
      descricao: `Criado utilizador ${nome} (${perfil})`
    });

    res.status(201).json({
      sucesso: true,
      mensagem: 'Conta criada com sucesso!'
    });

  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar conta.', detalhe: error.message });
  }
};

// LOGIN — POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Verifica se o utilizador existe
    const utilizador = await User.findOne({ email });
    if (!utilizador) {
      return res.status(401).json({ erro: 'Email ou password incorretos.' });
    }

    // 2. Compara a password enviada com o hash guardado na BD
    const passwordCorreta = await bcrypt.compare(password, utilizador.password);
    if (!passwordCorreta) {
      return res.status(401).json({ erro: 'Email ou password incorretos.' });
    }

    // 3. Gera o token JWT com os dados essenciais do utilizador
    const token = jwt.sign(
      { id: utilizador._id, nome: utilizador.nome, perfil: utilizador.perfil },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.status(200).json({
      sucesso: true,
      mensagem: 'Login efetuado com sucesso!',
      token,
      utilizador: {
        nome: utilizador.nome,
        email: utilizador.email,
        perfil: utilizador.perfil
      }
    });

  } catch (error) {
    res.status(500).json({ erro: 'Erro ao fazer login.', detalhe: error.message });
  }
};

// ESQUECI A PASSWORD — POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // Por segurança, a resposta é sempre igual (não revela se o email existe)
    console.log(`[SIMULADO] Link de recuperação enviado para: ${email}`);
    res.status(200).json({
      mensagem: 'Se esse email existir na base de dados, receberás um link em breve.'
    });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao processar o pedido.', detalhe: error.message });
  }
};
