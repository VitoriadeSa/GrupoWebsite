const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const Historico = require("../models/Historico");

// Inicializar modo global (default: Manual)
if (!global.modoSistema) global.modoSistema = "Manual";

// GET /api/modo - consultar modo atual
router.get("/", auth, (req, res) => {
  res.json({ modo: global.modoSistema });
});

// POST /api/modo - alterar modo (apenas Responsável ou Administrador)
router.post("/", auth, role(["Responsável", "Administrador"]), async (req, res) => {
  const { modo } = req.body;
  if (!["Manual", "Automatico"].includes(modo)) {
    return res.status(400).json({ erro: "Modo inválido. Use 'Manual' ou 'Automatico'." });
  }

  const modoAnterior = global.modoSistema;
  global.modoSistema = modo;

  await Historico.create({
    utilizador: req.user.nome,
    acao: "ALTERACAO_MODO",
    descricao: `Modo alterado de ${modoAnterior} para ${modo}`
  });

  res.json({ mensagem: `Modo alterado para ${modo}`, modo: global.modoSistema });
});

module.exports = router;
