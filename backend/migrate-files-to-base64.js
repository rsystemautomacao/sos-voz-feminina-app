import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

async function migrateFilesToBase64() {
  try {
    console.log('🔌 Conectando ao MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');

    console.log('🔍 Buscando denúncias com evidências em formato URL...');
    const denuncias = await Denuncia.find({
      'evidencias.dados': { $regex: '^/uploads/' }
    });

    console.log(`📊 Encontradas ${denuncias.length} denúncias para migrar`);

    let totalMigrated = 0;
    let totalErrors = 0;

    for (const denuncia of denuncias) {
      console.log(`\n🔄 Processando denúncia ${denuncia.idPublico}...`);
      
      let hasChanges = false;
      
      for (const evidencia of denuncia.evidencias) {
        if (evidencia.dados && evidencia.dados.startsWith('/uploads/')) {
          console.log(`  📁 Processando arquivo: ${evidencia.dados}`);
          
          try {
            const filePath = path.join(__dirname, 'uploads', path.basename(evidencia.dados));
            
            if (fs.existsSync(filePath)) {
              // Ler arquivo e converter para base64
              const fileBuffer = fs.readFileSync(filePath);
              const base64Data = fileBuffer.toString('base64');
              
              // Determinar MIME type baseado na extensão
              const ext = path.extname(evidencia.dados).toLowerCase();
              let mimeType = 'application/octet-stream';
              
              if (['.jpg', '.jpeg'].includes(ext)) mimeType = 'image/jpeg';
              else if (ext === '.png') mimeType = 'image/png';
              else if (ext === '.gif') mimeType = 'image/gif';
              else if (ext === '.wav') mimeType = 'audio/wav';
              else if (ext === '.mp3') mimeType = 'audio/mpeg';
              else if (ext === '.m4a') mimeType = 'audio/mp4';
              
              const dataUrl = `data:${mimeType};base64,${base64Data}`;
              
              // Atualizar evidência
              evidencia.dados = dataUrl;
              hasChanges = true;
              totalMigrated++;
              
              console.log(`    ✅ Migrado: ${evidencia.nome} (${evidencia.tamanho} bytes)`);
            } else {
              console.log(`    ❌ Arquivo não encontrado: ${filePath}`);
              totalErrors++;
            }
          } catch (error) {
            console.log(`    ❌ Erro ao processar arquivo: ${error.message}`);
            totalErrors++;
          }
        }
      }
      
      if (hasChanges) {
        denuncia.dataAtualizacao = new Date();
        await denuncia.save();
        console.log(`  ✅ Denúncia ${denuncia.idPublico} atualizada no banco`);
      }
    }

    console.log(`\n🎉 Migração concluída!`);
    console.log(`✅ Arquivos migrados: ${totalMigrated}`);
    console.log(`❌ Erros: ${totalErrors}`);
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado do MongoDB');
  }
}

// Executar migração
migrateFilesToBase64();
