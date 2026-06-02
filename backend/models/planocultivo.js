const mongoose = require('mongoose');

const PlanoCultivoSchema = new mongoose.Schema({
  lote: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lote",
    required: false
  },

  ervaAromatica: String,
  tipo: String,

  planoRega: String,
  fertilizacao: String,
  duracaoPrevistaDias: Number,

  limitesAmbientais: {
    temperatura: Number,
    humidade: Number,
    luminosidade: Number
  },

  problema: String,
  tipoIntervencao: String,
  dosagemIntensidade: String,
  intervaloMinIntervencoesMinutos: Number,

  descricao: String,
  motivo: String,

  autorizacaoResponsavel: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });
module.exports =
  mongoose.models.PlanoCultivo ||
  mongoose.model('PlanoCultivo', PlanoCultivoSchema);
