const mongoose = require("mongoose");

const plantaSchema = new mongoose.Schema({
    lote: String,
    erva: String,
    temperatura: String,
    humidade: String
});

// 🔥 EVITA REDECLARAÇÃO DO MODELO
module.exports =
    mongoose.models.Planta ||
    mongoose.model("Planta", plantaSchema);