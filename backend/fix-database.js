const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

async function fixDatabase() {
  try {
    console.log('Conectando ao MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('denuncias');

    console.log('Removendo índice problemático...');
    try {
      await collection.dropIndex('hashIdentificacao_1');
      console.log('✅ Índice hashIdentificacao_1 removido');
    } catch (error) {
      console.log('ℹ️ Índice hashIdentificacao_1 não existe ou já foi removido');
    }

    console.log('Limpando documentos com hashIdentificacao null...');
    const result = await collection.deleteMany({ hashIdentificacao: null });
    console.log(`✅ ${result.deletedCount} documentos removidos`);

    console.log('✅ Banco de dados corrigido!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

fixDatabase();
