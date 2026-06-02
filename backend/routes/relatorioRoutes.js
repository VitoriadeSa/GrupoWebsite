const express = require("express");
const router = express.Router();

const Planta = require("../models/planta");

router.get("/csv", async (req,res)=>{

    try{

        const plantas = await Planta.find();

        let csv =
        "lote,erva,temperatura,humidade\n";

        plantas.forEach(p=>{

            csv +=
            `${p.lote},${p.erva},${p.temperatura},${p.humidade}\n`;

        });

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=relatorio.csv"
        );

        res.setHeader(
            "Content-Type",
            "text/csv"
        );

        res.send(csv);

    }catch(err){

        res.status(500).json({
            erro:err.message
        });

    }

});

module.exports = router;