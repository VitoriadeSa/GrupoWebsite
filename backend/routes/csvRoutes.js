const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

const Planta = require("../models/planta");
const Historico = require("../models/Historico");

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), async (req, res) => {

    if (!req.file) {
        return res.status(400).json({ erro: "Ficheiro não enviado" });
    }

    const content = fs.readFileSync(req.file.path, "utf8");

    const linhas = content.split("\n").filter(l => l.trim());

    const plantas = linhas.slice(1).map(l => {
        const [lote, erva, temperatura, humidade] = l.split(",");

        return {
            lote,
            erva,
            temperatura,
            humidade
        };
    });

    await Planta.insertMany(plantas);

    await Historico.create({

        utilizador:
        req.user?.nome || "Sistema",

        acao:"IMPORTAR_CSV",

        descricao:
        `${plantas.length} registos`

    });


    res.json({
        mensagem: "CSV importado para plantas",
        total: plantas.length
    });
});

module.exports = router;