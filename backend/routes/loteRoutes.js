const express = require("express");
const router = express.Router();
const Lote = require("../models/lote");
const auth = require("../middleware/auth");
const Historico = require("../models/Historico");

router.get("/", auth, async (req, res) => {
  const lotes = await Lote.find().sort({ createdAt: -1 });
  res.json(lotes);
});

router.post("/", auth, async (req, res) => {
  try {
    const lote = await Lote.create(req.body);
    await Historico.create({
      utilizador: req.user.nome,
      acao: "CRIACAO_LOTE",
      descricao: `Lote criado: ${lote.codigo} - ${lote.nome}`
    });
    res.json(lote);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

router.patch("/:id", auth, async (req, res) => {
  try {
    const lote = await Lote.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(lote);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

module.exports = router;
