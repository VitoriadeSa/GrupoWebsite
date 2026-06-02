const PlanoCultivo = require('../models/planocultivo');
const Historico = require("../models/Historico");
const Alerta = require('../models/Alerta');

// criar um novo plano de cultivo
exports.criarPlano = async (req, res) => {
  try {
    const dadosPlano = req.body;

    // validação base
    if (!dadosPlano.ervaAromatica || !dadosPlano.tipo) {
      return res.status(400).json({ erro: 'ervaAromatica e tipo são obrigatórios.' });
    }

    // validação plano pontual
    if (dadosPlano.tipo === 'pontual') {
      const perfilUtilizador = req.user.perfil;
      if (perfilUtilizador !== 'Responsável' && perfilUtilizador !== 'Administrador') {
        return res.status(403).json({
          erro: 'Apenas um Responsável ou Administrador pode criar um plano pontual.'
        });
      }
    }

    // construção do plano
    let novoPlanoDados = {
      lote: dadosPlano.lote,
      ervaAromatica: dadosPlano.ervaAromatica,
      tipo: dadosPlano.tipo
    };

    if (dadosPlano.tipo === 'regular') {
      if (!dadosPlano.planoRega || !dadosPlano.fertilizacao || !dadosPlano.duracaoPrevistaDias) {
        return res.status(400).json({
          erro: 'Plano regular exige planoRega, fertilizacao e duracaoPrevistaDias.'
        });
      }

      novoPlanoDados.limitesAmbientais = {
        temperatura: Number(dadosPlano.temperatura),
        humidade: Number(dadosPlano.humidade),
        luminosidade: Number(dadosPlano.luminosidade)
      };

      novoPlanoDados.planoRega = dadosPlano.planoRega;
      novoPlanoDados.fertilizacao = dadosPlano.fertilizacao;
      novoPlanoDados.duracaoPrevistaDias = Number(dadosPlano.duracaoPrevistaDias);
    }

    else if (dadosPlano.tipo === 'emergencia') {
      if (!dadosPlano.tipoIntervencao || !dadosPlano.dosagemIntensidade || !dadosPlano.intervaloMinIntervencoesMinutos) {
        return res.status(400).json({
          erro: 'Plano de emergência exige tipoIntervencao, dosagemIntensidade e intervaloMinIntervencoesMinutos.'
        });
      }

      novoPlanoDados.problema = dadosPlano.problema;
      novoPlanoDados.tipoIntervencao = dadosPlano.tipoIntervencao;
      novoPlanoDados.dosagemIntensidade = dadosPlano.dosagemIntensidade;
      novoPlanoDados.intervaloMinIntervencoesMinutos = Number(dadosPlano.intervaloMinIntervencoesMinutos);
    }

    else if (dadosPlano.tipo === 'pontual') {
      if (!dadosPlano.descricao || !dadosPlano.motivo) {
        return res.status(400).json({
          erro: 'Plano pontual exige descricao e motivo.'
        });
      }

      novoPlanoDados.descricao = dadosPlano.descricao;
      novoPlanoDados.motivo = dadosPlano.motivo;
      novoPlanoDados.autorizacaoResponsavel = false;
    }

    // criar plano (UMA ÚNICA VEZ)
    const plano = await PlanoCultivo.create(novoPlanoDados);

    // histórico só para regular (como querias)
    if (dadosPlano.tipo === 'regular') {
      await Historico.create({
        utilizador: req.user.nome,
        acao: "CRIAR_PLANO",
        descricao: `${dadosPlano.tipo} - ${dadosPlano.ervaAromatica}`
      });
    }

    return res.status(201).json({
      sucesso: true,
      mensagem: 'Plano de cultivo registado com sucesso!',
      plano
    });

  } catch (error) {
    return res.status(400).json({
      sucesso: false,
      erro: 'Erro ao guardar o plano de cultivo.',
      detalhe: error.message
    });
  }
};

// listar todos os planos
exports.listarPlanos = async (req, res) => {
  try {
    const planos = await PlanoCultivo.find().populate("lote", "codigo nome estado").sort({ createdAt: -1 });
    res.status(200).json(planos);
  } catch (error) {
    res.status(500).json({ sucesso: false, erro: 'Erro ao obter a lista de planos.' });
  }
};

// obter um plano específico
exports.obterPlanoPorId = async (req, res) => {
  try {
    const plano = await PlanoCultivo.findById(req.params.id);
    if (!plano) {
      return res.status(404).json({ erro: 'Plano não encontrado.' });
    }
    res.status(200).json(plano);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao obter o plano.', detalhe: error.message });
  }
};

// editar um plano existente
exports.editarPlano = async (req, res) => {
  try {
    const planoAtualizado = await PlanoCultivo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!planoAtualizado) {
      return res.status(404).json({ erro: 'Plano não encontrado.' });
    }

    await Historico.create({
      utilizador: req.user.nome,
      acao: "EDITAR_PLANO",
      descricao: planoAtualizado.ervaAromatica
    });

    res.status(200).json({
      sucesso: true,
      plano: planoAtualizado
    });

  } catch (error) {
    res.status(400).json({
      erro: 'Erro ao editar o plano.',
      detalhe: error.message
    });
  }
};

// apagar um plano
exports.apagarPlano = async (req, res) => {
  try {
    const plano = await PlanoCultivo.findByIdAndDelete(req.params.id);

    if (!plano) {
      return res.status(404).json({ erro: 'Plano não encontrado.' });
    }

    await Historico.create({
      utilizador: req.user.nome,
      acao: "APAGAR_PLANO",
      descricao: plano.ervaAromatica
    });

    res.status(200).json({
      sucesso: true,
      mensagem: 'Plano apagado com sucesso.'
    });

  } catch (error) {
    res.status(500).json({
      erro: 'Erro ao apagar o plano.',
      detalhe: error.message
    });
  }
};

// autorizar um plano pontual
exports.autorizarPlanoPontual = async (req, res) => {
  try {
    const plano = await PlanoCultivo.findById(req.params.id);

    if (!plano) {
      return res.status(404).json({ erro: 'Plano não encontrado.' });
    }

    if (plano.tipo !== 'pontual') {
      return res.status(400).json({
        erro: 'Apenas planos do tipo pontual podem ser autorizados.'
      });
    }

    plano.autorizacaoResponsavel = true;
    await plano.save();

    await Historico.create({
      utilizador: req.user.nome,
      acao: "AUTORIZAR_PLANO",
      descricao: plano.ervaAromatica
    });

    res.status(200).json({
      sucesso: true,
      mensagem: `Plano pontual autorizado por ${req.user.nome} (${req.user.perfil}).`,
      plano
    });

  } catch (error) {
    res.status(500).json({
      erro: 'Erro ao autorizar o plano.',
      detalhe: error.message
    });
  }
};
