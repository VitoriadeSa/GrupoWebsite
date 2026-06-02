const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  perfil: {
    type: String,
    enum: ["Técnico", "Responsável", "Administrador"],
    default: "Técnico"
  }
}, { timestamps: true });

// pre-save hook: faz hash da password ANTES de guardar na BD
// só faz hash se a password foi alterada (evita hash duplo)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model("User", userSchema);
