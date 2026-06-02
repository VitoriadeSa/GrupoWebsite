const express = require("express");
const Planta  = require("../models/Planta");
const auth    = require("../middleware/auth");
const role    = require("../middleware/role");

const router = express.Router();

// Criar planta (qualquer autenticado)
router.post("/", auth, async (req, res) => {
    try {
        const planta = await Planta.create(req.body);
        res.status(201).json({ mensagem: "Planta criada", planta });
    } catch(err) {
        res.status(400).json({ erro: err.message });
    }
});

// Listar plantas
router.get("/", auth, async (req, res) => {
    try {
        const plantas = await Planta.find();
        res.json(plantas);
    } catch(err) {
        res.status(500).json({ erro: err.message });
    }
});

// Editar planta (Responsável ou Admin)
router.put("/:id", auth, role(["Responsável", "Administrador"]), async (req, res) => {
    try {
        const p = await Planta.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!p) return res.status(404).json({ erro: "Planta não encontrada" });
        res.json({ mensagem: "Planta atualizada", planta: p });
    } catch(err) {
        res.status(400).json({ erro: err.message });
    }
});

// Apagar planta (Admin)
router.delete("/:id", auth, role(["Administrador"]), async (req, res) => {
    try {
        const p = await Planta.findByIdAndDelete(req.params.id);
        if (!p) return res.status(404).json({ erro: "Planta não encontrada" });
        res.json({ mensagem: "Planta eliminada" });
    } catch(err) {
        res.status(500).json({ erro: err.message });
    }
});

module.exports = router;
