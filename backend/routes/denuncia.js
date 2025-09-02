import express from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Rota para receber denúncias
router.post('/', [
  body('nome').notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('Email inválido'),
  body('telefone').notEmpty().withMessage('Telefone é obrigatório'),
  body('endereco').notEmpty().withMessage('Endereço é obrigatório'),
  body('descricao').notEmpty().withMessage('Descrição é obrigatória'),
  body('tipoViolencia').notEmpty().withMessage('Tipo de violência é obrigatório'),
  body('urgencia').isIn(['baixa', 'media', 'alta']).withMessage('Urgência inválida')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array()
      });
    }

    // Aqui você implementaria a lógica para salvar a denúncia no banco
    // Por enquanto, vamos apenas retornar sucesso
    const denuncia = {
      id: Date.now().toString(),
      ...req.body,
      status: 'pendente',
      createdAt: new Date().toISOString()
    };

    res.status(201).json({
      message: 'Denúncia registrada com sucesso',
      denuncia
    });

  } catch (error) {
    console.error('Erro ao registrar denúncia:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

export default router;
