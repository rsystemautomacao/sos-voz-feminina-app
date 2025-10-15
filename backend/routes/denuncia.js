import express from 'express';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import AdminLog from '../models/AdminLog.js';
import { authenticateToken } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configuração do multer para salvar em memória (base64)
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp3|wav|m4a/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido'));
    }
  }
});

// Função para criar logs de auditoria
const createLog = async (adminEmail, action, details, req, denunciaId = null) => {
  try {
    await AdminLog.create({
      adminEmail,
      action,
      details,
      denunciaId,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    });
  } catch (error) {
    console.error('Erro ao criar log:', error);
  }
};

// Schema para Denúncia
const DenunciaSchema = new mongoose.Schema({
  idPublico: { type: String, required: true, unique: true },
  tipoViolencia: { type: String, required: true },
  dataOcorrido: { type: String, required: true },
  localizacao: {
    cidade: String,
    estado: String,
    bairro: String
  },
  relato: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pendente', 'analisando', 'resolvido', 'arquivado'],
    default: 'pendente'
  },
  prioridade: {
    type: String,
    enum: ['baixa', 'media', 'alta', 'urgente'],
    default: 'media'
  },
  evidencias: [{
    id: String,
    nome: String,
    tipo: { type: String, enum: ['image', 'audio'] },
    dados: String, // base64 ou URL
    tamanho: Number
  }],
  observacoes: String,
  dataCriacao: { type: Date, default: Date.now },
  dataAtualizacao: { type: Date, default: Date.now }
});

const Denuncia = mongoose.model('Denuncia', DenunciaSchema);

// Função para gerar ID público
const generatePublicId = () => {
  const hoje = new Date();
  const dia = hoje.getDate().toString().padStart(2, '0');
  const mes = (hoje.getMonth() + 1).toString().padStart(2, '0');
  const ano = hoje.getFullYear().toString().slice(-2);
  
  // Buscar último número sequencial
  return Denuncia.countDocuments().then(count => {
    const nextNumber = (count + 1000).toString();
    return `${dia}${mes}${ano}${nextNumber}`;
  });
};

// Função para calcular prioridade
const calcularPrioridade = (tipoViolencia) => {
  const prioridades = {
    'fisica': 'urgente',
    'sexual': 'urgente',
    'psicologica': 'alta',
    'economica': 'media',
    'moral': 'media',
    'patrimonial': 'baixa',
    'outros': 'baixa'
  };
  return prioridades[tipoViolencia] || 'media';
};

// GET /api/denuncias - Listar todas as denúncias
router.get('/', async (req, res) => {
  try {
    const denuncias = await Denuncia.find().sort({ dataCriacao: -1 });
    res.json({ denuncias });
  } catch (error) {
    console.error('Erro ao buscar denúncias:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/denuncias/stats/estatisticas - Estatísticas
router.get('/stats/estatisticas', async (req, res) => {
  try {
    const agora = new Date();
    const vinteQuatroHorasAtras = new Date(agora.getTime() - 24 * 60 * 60 * 1000);

    const [total, porStatus, porTipo, porPrioridade, recentes] = await Promise.all([
      Denuncia.countDocuments(),
      Denuncia.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Denuncia.aggregate([
        { $group: { _id: '$tipoViolencia', count: { $sum: 1 } } }
      ]),
      Denuncia.aggregate([
        { $group: { _id: '$prioridade', count: { $sum: 1 } } }
      ]),
      Denuncia.countDocuments({ dataCriacao: { $gte: vinteQuatroHorasAtras } })
    ]);

    const estatisticas = {
      total,
      porStatus: {
        pendente: 0,
        analisando: 0,
        resolvido: 0,
        arquivado: 0
      },
      porTipo: {},
      porPrioridade: {
        baixa: 0,
        media: 0,
        alta: 0,
        urgente: 0
      },
      recentes
    };

    // Processar resultados
    porStatus.forEach(item => {
      estatisticas.porStatus[item._id] = item.count;
    });

    porTipo.forEach(item => {
      estatisticas.porTipo[item._id] = item.count;
    });

    porPrioridade.forEach(item => {
      estatisticas.porPrioridade[item._id] = item.count;
    });

    res.json({ estatisticas });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/denuncias/public/:idPublico - Buscar denúncia por ID público
router.get('/public/:idPublico', async (req, res) => {
  try {
    const denuncia = await Denuncia.findOne({ idPublico: req.params.idPublico });
    if (!denuncia) {
      return res.status(404).json({ error: 'Denúncia não encontrada' });
    }
    res.json({ denuncia });
  } catch (error) {
    console.error('Erro ao buscar denúncia por ID público:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/denuncias/:id - Buscar denúncia por ID
router.get('/:id', async (req, res) => {
  try {
    const denuncia = await Denuncia.findById(req.params.id);
    if (!denuncia) {
      return res.status(404).json({ error: 'Denúncia não encontrada' });
    }
    res.json({ denuncia });
  } catch (error) {
    console.error('Erro ao buscar denúncia:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/denuncias/id/:id - Buscar denúncia por ID (alternativa)
router.get('/id/:id', async (req, res) => {
  try {
    const denuncia = await Denuncia.findById(req.params.id);
    if (!denuncia) {
      return res.status(404).json({ error: 'Denúncia não encontrada' });
    }
    res.json({ denuncia });
  } catch (error) {
    console.error('Erro ao buscar denúncia:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/denuncias/:id/status - Atualizar status
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status, observacoes } = req.body;
    const adminEmail = req.user.email;
    
    // Buscar denúncia atual para comparar status
    const denunciaAtual = await Denuncia.findById(req.params.id);
    if (!denunciaAtual) {
      return res.status(404).json({ error: 'Denúncia não encontrada' });
    }
    
    const statusAnterior = denunciaAtual.status;
    
    const denuncia = await Denuncia.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        observacoes: observacoes || undefined,
        dataAtualizacao: new Date()
      },
      { new: true }
    );

    // Criar log de auditoria
    await createLog(
      adminEmail, 
      'UPDATE_STATUS', 
      `Status alterado de "${statusAnterior}" para "${status}"${observacoes ? ` - Observações: ${observacoes}` : ''}`, 
      req, 
      denuncia.idPublico
    );

    res.json({ denuncia });
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/denuncias/:id/observacoes - Salvar apenas observações
router.put('/:id/observacoes', authenticateToken, async (req, res) => {
  try {
    const { observacoes } = req.body;
    const adminEmail = req.user.email;

    const denuncia = await Denuncia.findById(req.params.id);
    if (!denuncia) {
      return res.status(404).json({ error: 'Denúncia não encontrada' });
    }

    // Atualizar apenas as observações
    const denunciaAtualizada = await Denuncia.findByIdAndUpdate(
      req.params.id,
      { 
        observacoes: observacoes || '',
        dataAtualizacao: new Date()
      },
      { new: true }
    );

    // Criar log de auditoria
    await createLog(
      adminEmail, 
      'ADD_OBSERVATION', 
      `Observações adicionadas: ${observacoes || 'Observações removidas'}`, 
      req, 
      denuncia.idPublico
    );

    res.json({ denuncia: denunciaAtualizada });
  } catch (error) {
    console.error('Erro ao salvar observações:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/denuncias/:id/prioridade - Atualizar prioridade
router.put('/:id/prioridade', authenticateToken, async (req, res) => {
  try {
    const { prioridade } = req.body;
    const adminEmail = req.user.email;
    
    // Buscar denúncia atual para comparar prioridade
    const denunciaAtual = await Denuncia.findById(req.params.id);
    if (!denunciaAtual) {
      return res.status(404).json({ error: 'Denúncia não encontrada' });
    }
    
    const prioridadeAnterior = denunciaAtual.prioridade;
    
    const denuncia = await Denuncia.findByIdAndUpdate(
      req.params.id,
      { 
        prioridade,
        dataAtualizacao: new Date()
      },
      { new: true }
    );

    // Criar log de auditoria
    await createLog(
      adminEmail, 
      'UPDATE_PRIORITY', 
      `Prioridade alterada de "${prioridadeAnterior}" para "${prioridade}"`, 
      req, 
      denuncia.idPublico
    );

    res.json({ denuncia });
  } catch (error) {
    console.error('Erro ao atualizar prioridade:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/denuncias - Criar nova denúncia
router.post('/', upload.array('evidencias', 5), async (req, res) => {
  try {
    console.log('=== INÍCIO DA CRIAÇÃO DE DENÚNCIA ===');
    console.log('Body recebido:', req.body);
    console.log('Files recebidos:', req.files);
    console.log('Headers:', req.headers);
    console.log('User-Agent:', req.get('User-Agent'));
    
    const { relato, tipoViolencia, dataOcorrido } = req.body;
    
    console.log('Dados extraídos:', { relato, tipoViolencia, dataOcorrido });
    console.log('Tipo de dataOcorrido:', typeof dataOcorrido);
    console.log('Valor de dataOcorrido:', dataOcorrido);
    
    // Validar data obrigatória
    if (!dataOcorrido || dataOcorrido.trim() === '') {
      console.log('❌ ERRO: Campo dataOcorrido está vazio');
      return res.status(400).json({ 
        error: 'Campo dataOcorrido é obrigatório',
        details: 'Por favor, informe a data em que ocorreu a situação.'
      });
    }
    
    // Validar formato da data (aceita DD/MM/YYYY ou YYYY-MM-DD)
    const dateRegex = /^(\d{2}\/\d{2}\/\d{4}|\d{4}-\d{2}-\d{2})$/;
    if (!dateRegex.test(dataOcorrido)) {
      console.log('❌ ERRO: Formato de data inválido:', dataOcorrido);
      return res.status(400).json({
        error: 'Formato de data inválido',
        details: 'Use o formato DD/MM/YYYY (ex: 25/09/2025) ou YYYY-MM-DD (ex: 2025-09-25).'
      });
    }
    
    // Converter formato americano para brasileiro se necessário
    let dataFormatada = dataOcorrido;
    if (dataOcorrido.includes('-')) {
      // Formato americano (YYYY-MM-DD) -> brasileiro (DD/MM/YYYY)
      const [year, month, day] = dataOcorrido.split('-');
      dataFormatada = `${day}/${month}/${year}`;
      console.log('🔄 Data convertida de americano para brasileiro:', dataOcorrido, '->', dataFormatada);
    }
    
    console.log('✅ Data validada com sucesso:', dataOcorrido);
    
    // Processar localização - pode vir como JSON string, objeto ou campos separados
    let localizacao = {};
    if (req.body.localizacao) {
      if (typeof req.body.localizacao === 'string') {
        // Se veio como JSON string
        try {
          localizacao = JSON.parse(req.body.localizacao);
          console.log('Localização (JSON string):', localizacao);
        } catch (e) {
          // Se não é JSON válido, usar objeto vazio
          localizacao = {};
          console.log('Erro ao parsear JSON da localização:', e.message);
        }
      } else if (typeof req.body.localizacao === 'object') {
        // Se já é um objeto
        localizacao = req.body.localizacao;
        console.log('Localização (objeto):', localizacao);
      }
    } else {
      // Se veio como campos separados (localizacao[cidade], etc.)
      localizacao = {
        cidade: req.body['localizacao[cidade]'] || '',
        estado: req.body['localizacao[estado]'] || '',
        bairro: req.body['localizacao[bairro]'] || ''
      };
      console.log('Localização (campos separados):', localizacao);
    }
    
    // Gerar ID público
    console.log('Gerando ID público...');
    const idPublico = await generatePublicId();
    console.log('ID público gerado:', idPublico);
    
    // Processar evidências
    const evidencias = [];
    if (req.files && req.files.length > 0) {
      console.log('Processando evidências...');
      for (const file of req.files) {
        // Converter arquivo para base64
        const base64Data = file.buffer.toString('base64');
        const mimeType = file.mimetype;
        const dataUrl = `data:${mimeType};base64,${base64Data}`;
        
        const evidencia = {
          id: Date.now().toString() + Math.random().toString(36).substr(2),
          nome: file.originalname,
          tipo: file.mimetype.startsWith('image/') ? 'image' : 'audio',
          dados: dataUrl, // Base64 data URL
          tamanho: file.size
        };
        evidencias.push(evidencia);
        console.log('Evidência processada (base64):', { ...evidencia, dados: 'data:...' });
      }
    }

    console.log('Criando objeto Denuncia...');
    const denuncia = new Denuncia({
      idPublico,
      tipoViolencia,
      dataOcorrido: dataFormatada, // Usar data formatada (brasileiro)
      localizacao,
      relato,
      prioridade: calcularPrioridade(tipoViolencia),
      evidencias
    });

    console.log('Salvando denúncia no banco...');
    await denuncia.save();
    console.log('Denúncia salva com sucesso!');

    res.status(201).json({ denuncia });
  } catch (error) {
    console.error('=== ERRO AO CRIAR DENÚNCIA ===');
    console.error('Erro completo:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/denuncias/filter - Filtrar denúncias
router.get('/filter', async (req, res) => {
  try {
    const { status, tipoViolencia, prioridade, dataInicio, dataFim, busca } = req.query;
    
    let filter = {};
    
    if (status) filter.status = status;
    if (tipoViolencia) filter.tipoViolencia = tipoViolencia;
    if (prioridade) filter.prioridade = prioridade;
    
    if (dataInicio || dataFim) {
      filter.dataCriacao = {};
      if (dataInicio) filter.dataCriacao.$gte = new Date(dataInicio);
      if (dataFim) filter.dataCriacao.$lte = new Date(dataFim);
    }
    
    if (busca) {
      filter.$or = [
        { relato: { $regex: busca, $options: 'i' } },
        { tipoViolencia: { $regex: busca, $options: 'i' } },
        { 'localizacao.cidade': { $regex: busca, $options: 'i' } },
        { 'localizacao.estado': { $regex: busca, $options: 'i' } },
        { idPublico: { $regex: busca, $options: 'i' } }
      ];
    }

    const denuncias = await Denuncia.find(filter).sort({ dataCriacao: -1 });
    res.json({ denuncias });
  } catch (error) {
    console.error('Erro ao filtrar denúncias:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/denuncias/:id - Excluir denúncia
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const adminEmail = req.user.email;
    
    // Buscar denúncia antes de excluir para log
    const denuncia = await Denuncia.findById(req.params.id);
    if (!denuncia) {
      return res.status(404).json({ error: 'Denúncia não encontrada' });
    }
    
    // Excluir denúncia
    await Denuncia.findByIdAndDelete(req.params.id);
    
    // Criar log de auditoria
    await createLog(
      adminEmail, 
      'DELETE_DENUNCIA', 
      `Denúncia ${denuncia.idPublico} excluída - Tipo: ${denuncia.tipoViolencia}, Status: ${denuncia.status}`, 
      req, 
      denuncia.idPublico
    );

    res.json({ message: 'Denúncia excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir denúncia:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/denuncias/export - Exportar denúncias
router.get('/export', authenticateToken, async (req, res) => {
  try {
    const adminEmail = req.user.email;
    const { formato = 'json' } = req.query;
    const denuncias = await Denuncia.find().sort({ dataCriacao: -1 });
    
    // Criar log de auditoria
    await createLog(
      adminEmail, 
      'EXPORT_DATA', 
      `Exportação de ${denuncias.length} denúncias em formato ${formato.toUpperCase()}`, 
      req
    );

    if (formato === 'json') {
      res.json({ data: JSON.stringify(denuncias, null, 2) });
    } else if (formato === 'csv') {
      const headers = ['ID Público', 'Tipo', 'Data Ocorrido', 'Cidade', 'Estado', 'Status', 'Prioridade', 'Data Criação'];
      const rows = denuncias.map(d => [
        d.idPublico,
        d.tipoViolencia,
        d.dataOcorrido,
        d.localizacao.cidade || '',
        d.localizacao.estado || '',
        d.status,
        d.prioridade || '',
        d.dataCriacao
      ]);
      
      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      res.json({ data: csv });
    } else {
      res.status(400).json({ error: 'Formato não suportado' });
    }
  } catch (error) {
    console.error('Erro ao exportar denúncias:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
