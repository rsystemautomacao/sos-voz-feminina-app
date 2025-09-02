import express from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Rota para receber contatos
router.post('/', [
  body('nome').notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('Email inválido'),
  body('mensagem').notEmpty().withMessage('Mensagem é obrigatória')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array()
      });
    }

    // Aqui você implementaria a lógica para salvar o contato no banco
    // Por enquanto, vamos apenas retornar sucesso
    const contato = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString()
    };

    res.status(201).json({
      message: 'Mensagem enviada com sucesso',
      contato
    });

  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

export default router;
