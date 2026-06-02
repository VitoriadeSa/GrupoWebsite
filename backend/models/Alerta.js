const mongoose = require("mongoose");

const AlertaSchema = new mongoose.Schema({
  lote: { type: mongoose.Schema.Types.ObjectId, ref: "Lote" },
  loteCodigo: String,
  nivel: {
    type: String,
    enum: ["Informativo", "Aviso", "Crítico"],
    default: "Aviso"
  },
  mensagem: String,
  estado: {
    type: String,
    enum: ["Pendente", "Resolvido", "Ignorado"],
    default: "Pendente"
  },
  justificacao: String,
  criadoPor: String,
  medicaoId: { type: mongoose.Schema.Types.ObjectId, ref: "Medicao" }
}, { timestamps: true });

module.exports = mongoose.model("Alerta", AlertaSchema);
