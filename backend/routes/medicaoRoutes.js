const express = require("express");
const router = express.Router();

const medicaoController = require("../controllers/medicaoController");
const auth = require("../middleware/auth");

router.post("/", auth, medicaoController.registarMedicao);
router.get("/", auth, medicaoController.listarMedicoes);

module.exports = router;