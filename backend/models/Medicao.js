const mongoose = require("mongoose");

const MedicaoSchema = new mongoose.Schema({

  lote: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lote",
    required: true
  },

  temperatura: Number,
  humidade: Number,
  luminosidade: Number,

  dataMedicao: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Medicao", MedicaoSchema);