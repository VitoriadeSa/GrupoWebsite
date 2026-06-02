const express = require('express');
const router = express.Router();
const Historico = require('../models/Historico');
const auth = require('../middleware/auth');

router.get('/historico', auth, async (req, res) => {
  try {
    const dados = await Historico.find();

    let csv = "data,utilizador,acao,descricao\n";

    dados.forEach(h => {
      csv += `${h.createdAt},${h.utilizador},${h.acao},${h.descricao}\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.attachment('historico.csv');
    res.send(csv);

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;