const Medicao = require("../models/Medicao");
const Plano = require("../models/planocultivo");
const Lote = require("../models/lote");
const Alerta = require("../models/Alerta");
const Historico = require("../models/Historico");

// Verifica se o sistema está em modo automático
function isModoAutomatico() {
  return global.modoSistema === "Automatico";
}

exports.registarMedicao = async (req, res) => {
  try {
    const { lote, temperatura, humidade, luminosidade } = req.body;

    const loteDB = await Lote.findById(lote);
    if (!loteDB) {
      return res.status(404).json({ erro: "Lote não encontrado" });
    }

    // Criar medição
    const medicao = await Medicao.create({
      lote: loteDB._id,
      temperatura,
      humidade,
      luminosidade
    });

    // Procurar plano regular associado ao lote
    const plano = await Plano.findOne({ lote: loteDB._id, tipo: "regular" });

    const alertasGerados = [];
    const acaoAutomatica = [];

    if (plano && plano.limitesAmbientais) {
      const limits = plano.limitesAmbientais;

      // Temperatura
      if (limits.temperatura != null) {
        const diff = Math.abs(temperatura - limits.temperatura);
        if (diff > 10) {
          const a = await Alerta.create({
            lote: loteDB._id,
            loteCodigo: loteDB.codigo || loteDB.nome,
            nivel: "Crítico",
            mensagem: `Temperatura crítica: ${temperatura}°C (ideal: ${limits.temperatura}°C)`,
            criadoPor: req.user.nome,
            medicaoId: medicao._id
          });
          alertasGerados.push(a);
          if (isModoAutomatico()) {
            acaoAutomatica.push("Ventilação ajustada automaticamente");
          }
        } else if (diff > 5) {
          const a = await Alerta.create({
            lote: loteDB._id,
            loteCodigo: loteDB.codigo || loteDB.nome,
            nivel: "Aviso",
            mensagem: `Temperatura fora do ideal: ${temperatura}°C (ideal: ${limits.temperatura}°C)`,
            criadoPor: req.user.nome,
            medicaoId: medicao._id
          });
          alertasGerados.push(a);
        }
      }

      // Humidade
      if (limits.humidade != null) {
        const diff = Math.abs(humidade - limits.humidade);
        if (diff > 20) {
          const a = await Alerta.create({
            lote: loteDB._id,
            loteCodigo: loteDB.codigo || loteDB.nome,
            nivel: "Crítico",
            mensagem: `Humidade crítica: ${humidade}% (ideal: ${limits.humidade}%)`,
            criadoPor: req.user.nome,
            medicaoId: medicao._id
          });
          alertasGerados.push(a);
          if (isModoAutomatico()) {
            acaoAutomatica.push("Rega ativada automaticamente");
          }
        } else if (diff > 10) {
          const a = await Alerta.create({
            lote: loteDB._id,
            loteCodigo: loteDB.codigo || loteDB.nome,
            nivel: "Aviso",
            mensagem: `Humidade fora do ideal: ${humidade}% (ideal: ${limits.humidade}%)`,
            criadoPor: req.user.nome,
            medicaoId: medicao._id
          });
          alertasGerados.push(a);
          if (isModoAutomatico()) {
            acaoAutomatica.push("Rega sugerida");
          }
        }
      }

      // Luminosidade
      if (limits.luminosidade != null) {
        const diff = Math.abs(luminosidade - limits.luminosidade);
        if (diff > 200) {
          const a = await Alerta.create({
            lote: loteDB._id,
            loteCodigo: loteDB.codigo || loteDB.nome,
            nivel: "Crítico",
            mensagem: `Luminosidade crítica: ${luminosidade} lux (ideal: ${limits.luminosidade} lux)`,
            criadoPor: req.user.nome,
            medicaoId: medicao._id
          });
          alertasGerados.push(a);
        } else if (diff > 100) {
          const a = await Alerta.create({
            lote: loteDB._id,
            loteCodigo: loteDB.codigo || loteDB.nome,
            nivel: "Aviso",
            mensagem: `Luminosidade fora do ideal: ${luminosidade} lux (ideal: ${limits.luminosidade} lux)`,
            criadoPor: req.user.nome,
            medicaoId: medicao._id
          });
          alertasGerados.push(a);
        }
      }
    }

    await Historico.create({
      utilizador: req.user.nome,
      acao: "REGISTO_MEDICAO",
      descricao: `Lote ${loteDB.codigo || loteDB.nome} | T:${temperatura}°C H:${humidade}% L:${luminosidade}lux | Alertas gerados: ${alertasGerados.length}`
    });

    // Ações automáticas: regista no histórico
    for (const acao of acaoAutomatica) {
      await Historico.create({
        utilizador: "SISTEMA",
        acao: "ACAO_AUTOMATICA",
        descricao: `[Modo Automático] ${acao} - Lote ${loteDB.codigo || loteDB.nome}`
      });
    }

    res.status(201).json({
      mensagem: "Medição registada com sucesso",
      medicao,
      alertasGerados: alertasGerados.length,
      acaoAutomatica: acaoAutomatica.length > 0 ? acaoAutomatica : null,
      modo: global.modoSistema || "Manual"
    });

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.listarMedicoes = async (req, res) => {
  try {
    const medicoes = await Medicao.find()
      .populate("lote", "codigo nome")
      .sort({ dataMedicao: -1 });

    res.json(medicoes);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};
