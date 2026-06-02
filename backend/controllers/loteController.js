const Lote = require("../models/Lote");

exports.listarLotes = async (req, res) => {
  try {
    const lotes = await Lote.find().sort({ lote: 1 });
    res.json(lotes);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};