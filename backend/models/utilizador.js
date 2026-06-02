const mongoose = require("mongoose");

const utilizadorSchema = new mongoose.Schema({
  nome: String,
  email: String,
  password: String,
  perfil: String
}, {
  collection: "users"   // 🔥 ISTO É O QUE ESTÁ A FALTAR
});

module.exports = mongoose.model("Utilizador", utilizadorSchema);