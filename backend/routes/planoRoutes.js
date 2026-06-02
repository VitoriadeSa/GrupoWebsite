const express = require('express');
const router = express.Router();
const planoController = require('../controllers/planoController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// criar plano
// técnico, responsável e admin podem criar
// plano pontual exige responsável ou administrador (validado no controller)
router.post('/', auth, role(['Técnico', 'Responsável', 'Administrador']),planoController.criarPlano);

// listar todos os planos (qualquer utilizador autenticado)
router.get('/', auth,role(['Técnico', 'Responsável', 'Administrador']), planoController.listarPlanos);

// consultar um plano específico
router.get('/:id', auth, role(['Técnico', 'Responsável', 'Administrador']), planoController.obterPlanoPorId);

// editar plano (responsável ou administrador)
router.put('/:id', auth, role(['Responsável', 'Administrador']), planoController.editarPlano);

// apagar plano (administrador)
router.delete('/:id', auth, role(['Administrador']), planoController.apagarPlano);

// autorizar plano pontual (responsável ou administrador)
router.patch('/:id/autorizar', auth, role(['Responsável', 'Administrador']), planoController.autorizarPlanoPontual);

module.exports = router;
