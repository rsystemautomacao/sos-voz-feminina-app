import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import AdminUser from './models/AdminUser.js';

// Carregar variáveis de ambiente
dotenv.config();

const setupDatabase = async () => {
  try {
    console.log('🔧 Configurando banco de dados...');
    
    // Verificar se a URI do MongoDB está configurada
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('<db_username>')) {
      console.error('❌ Erro: MONGODB_URI não configurada corretamente');
      console.log('📝 Instruções:');
      console.log('1. Copie o arquivo mongodb-config.env para .env');
      console.log('2. Edite o arquivo .env e substitua <db_username> e <db_password> pelas suas credenciais reais');
      console.log('3. Execute novamente este script');
      process.exit(1);
    }

    // Conectar ao MongoDB
    console.log('🔌 Conectando ao MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Conectado ao MongoDB Atlas com sucesso!');

    // Verificar se já existe um super admin
    const existingSuperAdmin = await AdminUser.findOne({ role: 'super_admin' });
    
    if (existingSuperAdmin) {
      console.log('ℹ️  Super admin já existe:', existingSuperAdmin.email);
      console.log('✅ Banco de dados configurado e pronto para uso!');
      process.exit(0);
    }

    // Criar super admin
    console.log('👤 Criando super admin...');
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || 'admin@sosvozfeminina.com';
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || 'admin123456';

    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
    const hashedPassword = await bcrypt.hash(superAdminPassword, salt);

    const superAdmin = new AdminUser({
      email: superAdminEmail,
      password: hashedPassword,
      role: 'super_admin',
      isActive: true
    });

    await superAdmin.save();

    console.log('✅ Super admin criado com sucesso!');
    console.log('📧 Email:', superAdminEmail);
    console.log('🔑 Senha:', superAdminPassword);
    console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!');
    console.log('✅ Banco de dados configurado e pronto para uso!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao configurar banco de dados:', error);
    
    if (error.name === 'MongoServerSelectionError') {
      console.log('💡 Dicas para resolver:');
      console.log('1. Verifique se suas credenciais do MongoDB Atlas estão corretas');
      console.log('2. Verifique se o IP do seu computador está na whitelist do MongoDB Atlas');
      console.log('3. Verifique se o cluster está ativo');
    }
    
    process.exit(1);
  }
};

setupDatabase();
