const express = require("express");
const router = express.Router();
const Alerta = require("../models/Alerta");
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const Historico = require("../models/Historico");

// LISTAR
router.get("/", auth, async (req, res) => {
  const alertas = await Alerta.find().sort({ createdAt: -1 });
  res.json(alertas);
});

// RESOLVER (ADMIN)
router.patch("/:id/resolver", auth, role(["Administrador"]), async (req, res) => {
  const alerta = await Alerta.findByIdAndUpdate(
    req.params.id,
    { estado: "Resolvido" },
    { new: true }
  );

  await Historico.create({
    utilizador: req.user.nome,
    acao: "ALERTA_RESOLVIDO",
    descricao: alerta.mensagem
  });

  res.json(alerta);
});

// IGNORAR (ADMIN + JUSTIFICAÇÃO)
router.patch("/:id/ignorar", auth, role(["Administrador"]), async (req, res) => {
  const { justificacao } = req.body;

  if (!justificacao) {
    return res.status(400).json({ erro: "Justificação obrigatória" });
  }

  const alerta = await Alerta.findByIdAndUpdate(
    req.params.id,
    { estado: "Ignorado", justificacao },
    { new: true }
  );

  await Historico.create({
    utilizador: req.user.nome,
    acao: "ALERTA_IGNORADO",
    descricao: `${alerta.mensagem} | ${justificacao}`
  });

  res.json(alerta);
});

module.exports = router;