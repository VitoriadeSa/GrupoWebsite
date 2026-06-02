const mongoose = require('mongoose');

const HistoricoSchema = new mongoose.Schema({
  utilizador: String,
  acao: String,
  descricao: String
}, { timestamps: true });

module.exports = mongoose.model('Historico', HistoricoSchema);