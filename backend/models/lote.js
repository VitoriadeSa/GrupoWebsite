const mongoose = require("mongoose");

const loteSchema = new mongoose.Schema({
  codigo: { type: String, required: true, unique: true },
  nome: String,
  area: Number,
  estado: {
    type: String,
    enum: ["ativo", "concluído", "comprometido"],
    default: "ativo"
  },
  dataInicio: { type: Date, default: Date.now },
  dataFim: Date,
  perdas: Number,
  produtividade: Number
}, { timestamps: true });

module.exports =
  mongoose.models.Lote ||
  mongoose.model("Lote", loteSchema);
