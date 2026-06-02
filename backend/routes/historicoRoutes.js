const express = require('express');
const router = express.Router();
const Historico = require('../models/Historico');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const dados = await Historico.find().sort({ createdAt: -1 });
    res.json(dados);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;