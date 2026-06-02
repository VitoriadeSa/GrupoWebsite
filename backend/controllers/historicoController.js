const Historico = require('../models/Historico');

exports.listar = async (req, res) => {
  try {
    const dados = await Historico.find().sort({ createdAt: -1 });
    res.json(dados);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};