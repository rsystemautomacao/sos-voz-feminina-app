import mongoose from 'mongoose';

const denunciaSchema = new mongoose.Schema({
  // Informações básicas da denúncia
  relato: {
    type: String,
    required: [true, 'Relato é obrigatório'],
    maxlength: [2000, 'Relato não pode ter mais de 2000 caracteres'],
    trim: true
  },
  
  // Tipo de violência
  tipoViolencia: {
    type: String,
    enum: [
      'fisica',
      'psicologica', 
      'sexual',
      'economica',
      'moral',
      'patrimonial',
      'outros'
    ],
    required: [true, 'Tipo de violência é obrigatório']
  },
  
  // Localização (opcional para anonimato)
  localizacao: {
    cidade: {
      type: String,
      trim: true,
      maxlength: 100
    },
    estado: {
      type: String,
      trim: true,
      maxlength: 2
    },
    bairro: {
      type: String,
      trim: true,
      maxlength: 100
    }
  },
  
  // Data aproximada do ocorrido
  dataOcorrido: {
    type: Date,
    required: [true, 'Data aproximada do ocorrido é obrigatória']
  },
  
  // Evidências (opcional)
  evidencias: [{
    tipo: {
      type: String,
      enum: ['foto', 'audio', 'documento'],
      required: true
    },
    nomeArquivo: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    tamanho: {
      type: Number,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    }
  }],
  
  // Status da denúncia
  status: {
    type: String,
    enum: ['pendente', 'em_analise', 'encaminhada', 'concluida', 'arquivada'],
    default: 'pendente'
  },
  
  // Prioridade baseada no tipo de violência
  prioridade: {
    type: String,
    enum: ['baixa', 'media', 'alta', 'critica'],
    default: 'media'
  },
  
  // Observações internas (apenas para administradores)
  observacoesInternas: {
    type: String,
    maxlength: 1000,
    select: false // Não retorna por padrão
  },
  
  // Ações tomadas
  acoes: [{
    tipo: {
      type: String,
      enum: ['contato_emergencia', 'encaminhamento_psicologico', 'encaminhamento_juridico', 'orientacao', 'outros'],
      required: true
    },
    descricao: {
      type: String,
      required: true,
      maxlength: 500
    },
    data: {
      type: Date,
      default: Date.now
    },
    responsavel: {
      type: String,
      required: true
    }
  }],
  
  // Informações de segurança
  ipAddress: {
    type: String,
    select: false // Não retorna por padrão
  },
  
  userAgent: {
    type: String,
    select: false // Não retorna por padrão
  },
  
  // Hash único para identificação anônima
  hashIdentificacao: {
    type: String,
    unique: true,
    required: true
  }
}, {
  timestamps: true,
  toJSON: { 
    transform: function(doc, ret) {
      // Remove campos sensíveis
      delete ret.ipAddress;
      delete ret.userAgent;
      delete ret.observacoesInternas;
      return ret;
    }
  }
});

// Índices para performance
denunciaSchema.index({ status: 1, createdAt: -1 });
denunciaSchema.index({ tipoViolencia: 1, status: 1 });
denunciaSchema.index({ hashIdentificacao: 1 });
denunciaSchema.index({ 'localizacao.cidade': 1, 'localizacao.estado': 1 });

// Middleware para gerar hash de identificação
denunciaSchema.pre('save', function(next) {
  if (!this.hashIdentificacao) {
    const crypto = require('crypto');
    this.hashIdentificacao = crypto.randomBytes(16).toString('hex');
  }
  next();
});

// Método para calcular prioridade baseada no tipo de violência
denunciaSchema.methods.calcularPrioridade = function() {
  const prioridades = {
    'fisica': 'alta',
    'sexual': 'critica',
    'psicologica': 'media',
    'economica': 'baixa',
    'moral': 'media',
    'patrimonial': 'baixa',
    'outros': 'media'
  };
  
  this.prioridade = prioridades[this.tipoViolencia] || 'media';
  return this.prioridade;
};

// Método estático para estatísticas
denunciaSchema.statics.getEstatisticas = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        porStatus: {
          $push: {
            status: '$status',
            count: 1
          }
        },
        porTipo: {
          $push: {
            tipo: '$tipoViolencia',
            count: 1
          }
        }
      }
    }
  ]);
  
  return stats[0] || { total: 0, porStatus: [], porTipo: [] };
};

const Denuncia = mongoose.model('Denuncia', denunciaSchema);

export default Denuncia;
