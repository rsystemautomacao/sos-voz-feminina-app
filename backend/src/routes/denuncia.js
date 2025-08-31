import express from 'express';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import Denuncia from '../models/Denuncia.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Configuração do Multer para upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || [
    'image/jpeg',
    'image/png', 
    'image/gif',
    'audio/mpeg',
    'audio/wav'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não permitido'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
    files: 5 // Máximo 5 arquivos por denúncia
  }
});

// Validação para criação de denúncia
const validateDenuncia = [
  body('relato')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Relato deve ter entre 10 e 2000 caracteres'),
  
  body('tipoViolencia')
    .isIn(['fisica', 'psicologica', 'sexual', 'economica', 'moral', 'patrimonial', 'outros'])
    .withMessage('Tipo de violência inválido'),
  
  body('dataOcorrido')
    .isISO8601()
    .withMessage('Data do ocorrido deve ser uma data válida'),
  
  body('localizacao.cidade')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Cidade deve ter no máximo 100 caracteres'),
  
  body('localizacao.estado')
    .optional()
    .trim()
    .isLength({ min: 2, max: 2 })
    .withMessage('Estado deve ter exatamente 2 caracteres'),
  
  body('localizacao.bairro')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Bairro deve ter no máximo 100 caracteres')
];

// POST /api/denuncias - Criar nova denúncia
router.post('/', upload.array('evidencias', 5), validateDenuncia, async (req, res) => {
  try {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array()
      });
    }

    // Processar arquivos enviados
    const evidencias = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        evidencias.push({
          tipo: file.mimetype.startsWith('image/') ? 'foto' : 
                file.mimetype.startsWith('audio/') ? 'audio' : 'documento',
          nomeArquivo: file.originalname,
          url: `/uploads/${file.filename}`,
          tamanho: file.size,
          mimeType: file.mimetype
        });
      });
    }

    // Criar denúncia
    const denunciaData = {
      relato: req.body.relato,
      tipoViolencia: req.body.tipoViolencia,
      dataOcorrido: new Date(req.body.dataOcorrido),
      localizacao: req.body.localizacao || {},
      evidencias,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    };

    const denuncia = new Denuncia(denunciaData);
    
    // Calcular prioridade automaticamente
    denuncia.calcularPrioridade();
    
    await denuncia.save();

    logger.info(`Nova denúncia criada: ${denuncia.hashIdentificacao}`);

    res.status(201).json({
      message: 'Denúncia registrada com sucesso',
      hashIdentificacao: denuncia.hashIdentificacao,
      status: denuncia.status,
      prioridade: denuncia.prioridade
    });

  } catch (error) {
    logger.error('Erro ao criar denúncia:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível registrar a denúncia. Tente novamente.'
    });
  }
});

// GET /api/denuncias/:hash - Consultar denúncia por hash (para acompanhamento)
router.get('/:hash', async (req, res) => {
  try {
    const { hash } = req.params;
    
    const denuncia = await Denuncia.findOne({ 
      hashIdentificacao: hash 
    }).select('-ipAddress -userAgent -observacoesInternas');

    if (!denuncia) {
      return res.status(404).json({
        error: 'Denúncia não encontrada'
      });
    }

    res.json({
      hashIdentificacao: denuncia.hashIdentificacao,
      status: denuncia.status,
      prioridade: denuncia.prioridade,
      acoes: denuncia.acoes,
      createdAt: denuncia.createdAt,
      updatedAt: denuncia.updatedAt
    });

  } catch (error) {
    logger.error('Erro ao consultar denúncia:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// PUT /api/denuncias/:hash - Atualizar denúncia (apenas relato)
router.put('/:hash', [
  body('relato')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Relato deve ter entre 10 e 2000 caracteres')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array()
      });
    }

    const { hash } = req.params;
    const { relato } = req.body;

    const denuncia = await Denuncia.findOne({ hashIdentificacao: hash });

    if (!denuncia) {
      return res.status(404).json({
        error: 'Denúncia não encontrada'
      });
    }

    // Permitir apenas atualização do relato
    if (relato) {
      denuncia.relato = relato;
      await denuncia.save();
    }

    res.json({
      message: 'Denúncia atualizada com sucesso',
      hashIdentificacao: denuncia.hashIdentificacao,
      status: denuncia.status
    });

  } catch (error) {
    logger.error('Erro ao atualizar denúncia:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// GET /api/denuncias/stats/estatisticas - Estatísticas públicas
router.get('/stats/estatisticas', async (req, res) => {
  try {
    const stats = await Denuncia.getEstatisticas();
    
    res.json({
      total: stats.total,
      porStatus: stats.porStatus,
      porTipo: stats.porTipo
    });

  } catch (error) {
    logger.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Middleware de tratamento de erros do Multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'Arquivo muito grande',
        message: 'O arquivo excede o tamanho máximo permitido'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Muitos arquivos',
        message: 'Número máximo de arquivos excedido'
      });
    }
  }
  
  if (error.message === 'Tipo de arquivo não permitido') {
    return res.status(400).json({
      error: 'Tipo de arquivo não permitido',
      message: 'Apenas imagens e áudios são aceitos'
    });
  }
  
  next(error);
});

export default router;
