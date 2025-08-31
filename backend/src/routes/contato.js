import express from 'express';
import { logger } from '../utils/logger.js';

const router = express.Router();

// GET /api/contatos - Listar contatos de emergência
router.get('/', (req, res) => {
  try {
    const contatos = {
      emergencia: [
        {
          id: 1,
          nome: "Disque 180",
          descricao: "Central de Atendimento à Mulher - 24h",
          telefone: "180",
          tipo: "emergencia",
          categoria: "Central Nacional"
        },
        {
          id: 2,
          nome: "Polícia Militar",
          descricao: "Emergências e ocorrências policiais",
          telefone: "190",
          tipo: "emergencia",
          categoria: "Segurança"
        },
        {
          id: 3,
          nome: "Bombeiros",
          descricao: "Emergências médicas e resgates",
          telefone: "193",
          tipo: "emergencia",
          categoria: "Emergência Médica"
        }
      ],
      apoio: [
        {
          id: 4,
          nome: "Centro de Valorização da Vida (CVV)",
          descricao: "Apoio emocional e prevenção do suicídio",
          telefone: "188",
          website: "cvv.org.br",
          tipo: "psicologico",
          categoria: "Apoio Psicológico"
        },
        {
          id: 5,
          nome: "Defensoria Pública",
          descricao: "Assistência jurídica gratuita",
          telefone: "129",
          tipo: "juridico",
          categoria: "Apoio Jurídico"
        }
      ]
    };

    res.json(contatos);
  } catch (error) {
    logger.error('Erro ao buscar contatos:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

export default router;
