const express = require("express");
const router  = express.Router();
const Utilizador = require("../models/utilizador");
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const Historico = require("../models/Historico");

console.log("📌 UTILIZADORES ROUTES CARREGADAS");

// LISTAR — só admins (via middleware)
router.get("/", auth, role(["Administrador"]), async (req, res) => {
    try {
        const users = await Utilizador.find({}, "-password");
        res.json(users);
    } catch(err) {
        res.status(500).json({ erro: err.message });
    }
});

// ATUALIZAR PERFIL
router.put("/:id", auth, role(["Administrador"]), async (req, res) => {
    try {
        const updated = await Utilizador.findByIdAndUpdate(
            req.params.id,
            { perfil: req.body.perfil },
            { new: true, projection: "-password" }
        );

        if (!updated) {
            return res.status(404).json({ erro: "Não encontrado" });
        }

        // 📌 HISTÓRICO
        await Historico.create({
            utilizador: req.user.nome,
            acao: "EDITAR_UTILIZADOR",
            descricao: `Alterado perfil de ${updated.nome} para ${updated.perfil}`
        });

        res.json({ mensagem: "Atualizado", updated });

    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// ELIMINAR
router.delete("/:id", auth, role(["Administrador"]), async (req, res) => {
    try {
        const deleted = await Utilizador.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ erro: "Não encontrado" });
        }

        // 📌 HISTÓRICO
        await Historico.create({
            utilizador: req.user.nome,
            acao: "ELIMINAR_UTILIZADOR",
            descricao: `Eliminado utilizador ${deleted.nome}`
        });

        res.json({ mensagem: "Eliminado com sucesso" });

    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

module.exports = router;
