const Alerta = require("../models/Alerta");
const Historico = require("../models/Historico");

// LISTAR ALERTAS
exports.listarAlertas = async (req, res) => {
  const alertas = await Alerta.find().sort({ createdAt: -1 });
  res.json(alertas);
};

// RESOLVER (só admin)
exports.resolverAlerta = async (req, res) => {
  const alerta = await Alerta.findById(req.params.id);

  if (!alerta) {
    return res.status(404).json({ erro: "Alerta não encontrado" });
  }

  alerta.estado = "Resolvido";
  await alerta.save();

  await Historico.create({
    utilizador: req.user.nome,
    acao: "ALERTA_RESOLVIDO",
    descricao: `Alerta ${alerta._id} resolvido`
  });

  res.json({ mensagem: "Alerta resolvido" });
};

// IGNORAR (obrigar justificação)
exports.ignorarAlerta = async (req, res) => {
  const { justificacao } = req.body;

  if (!justificacao) {
    return res.status(400).json({ erro: "Justificação obrigatória" });
  }

  const alerta = await Alerta.findById(req.params.id);

  if (!alerta) {
    return res.status(404).json({ erro: "Alerta não encontrado" });
  }

  alerta.estado = "Ignorado";
  alerta.justificacao = justificacao;
  await alerta.save();

  await Historico.create({
    utilizador: req.user.nome,
    acao: "ALERTA_IGNORADO",
    descricao: `Alerta ${alerta._id} ignorado`
  });

  res.json({ mensagem: "Alerta ignorado" });
};